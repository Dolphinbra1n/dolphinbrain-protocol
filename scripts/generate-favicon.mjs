/**
 * generate-favicon.mjs — one-off tool (not part of `npm run build`) that
 * derives public/favicon.svg from the real pixel data of a brand asset.
 *
 * Method: decode the source PNG (RGBA), downsample with sharp to a small
 * grid, threshold each cell to on/off by luminance, then trace the on
 * cells into a minimal set of SVG rects by merging contiguous runs per
 * row (a simplified marching-squares-style contour). This is a real trace
 * of the source pixel grid, not a hand-drawn dolphin shape.
 *
 * Run manually with: node scripts/generate-favicon.mjs
 */
import sharp from "sharp";
import { writeFileSync } from "node:fs";

const SRC = "brand/LOGO DOLPHINBRAIN PNG...png"; // has real alpha channel
const GRID = 32; // 32x32 viewBox, one SVG unit per cell
const OUT = "public/favicon.svg";

async function main() {
  const { data, info } = await sharp(SRC)
    .resize(GRID, GRID, { fit: "cover" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const ch = info.channels;
  const on = [];
  for (let y = 0; y < GRID; y++) {
    const row = [];
    for (let x = 0; x < GRID; x++) {
      const i = (y * GRID + x) * ch;
      const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      // subject pixels: visible (alpha>32) and bright enough to be the
      // light-grey dolphin body/eye highlight rather than the near-black field
      row.push(a > 32 && luma > 60 ? 1 : 0);
    }
    on.push(row);
  }

  // merge contiguous horizontal runs per row into rects
  const rects = [];
  for (let y = 0; y < GRID; y++) {
    let x = 0;
    while (x < GRID) {
      if (on[y][x]) {
        let x2 = x;
        while (x2 < GRID && on[y][x2]) x2++;
        rects.push(`<rect x="${x}" y="${y}" width="${x2 - x}" height="1"/>`);
        x = x2;
      } else {
        x++;
      }
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${GRID} ${GRID}">
<!-- traced from brand/LOGO DOLPHINBRAIN PNG...png pixel grid via scripts/generate-favicon.mjs -->
<rect x="0" y="0" width="${GRID}" height="${GRID}" fill="#0a0a09"/>
<g fill="#f9f9f6">
${rects.join("\n")}
</g>
</svg>
`;

  writeFileSync(OUT, svg, "utf8");
  console.log(`wrote ${OUT} with ${rects.length} rects from a ${GRID}x${GRID} trace`);
}

main();
