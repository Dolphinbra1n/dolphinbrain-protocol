/**
 * prepare-assets.mjs — one-off tool (not part of `npm run build`) that
 * derives the working image assets from the raw brand/reference files.
 *
 * The alpha-channel brand PNG was verified (see tokens.css comment /
 * this script) to have all fully-transparent pixels sitting at flat
 * (0,0,0,0) rather than stray-colored fringe pixels, but we still flatten
 * onto --color-bg (#0a0a09) before any resize as a premultiply-safety
 * measure so downsampling can never blend in a mismatched halo color.
 *
 * Run manually with: node scripts/prepare-assets.mjs
 */
import sharp from "sharp";
import { mkdirSync } from "node:fs";

mkdirSync("public", { recursive: true });

const BG = "#0a0a09";

async function main() {
  // Hero cutout: keep real alpha (used over the page's own dark background,
  // so no flatten needed here — this is the one asset actually rendered
  // with transparency in the page).
  await sharp("brand/LOGO DOLPHINBRAIN PNG...png")
    .resize(1000, 1000, { fit: "inside" })
    .png({ compressionLevel: 9 })
    .toFile("public/dolphin-mark.png");

  // Small mark for the nav / footer, flattened+premultiply-safe since it
  // is composited at a tiny size where alpha fringing is most visible.
  await sharp("brand/LOGO DOLPHINBRAIN PNG...png")
    .resize(240, 240, { fit: "inside" })
    .flatten({ background: BG })
    .png({ compressionLevel: 9 })
    .toFile("public/dolphin-mark-small.png");

  // OG / share image from the banner asset.
  await sharp("reference/SAMPUL  DOLPHINBRAIN JPG.jpg.jpeg")
    .resize(1200, 630, { fit: "cover" })
    .flatten({ background: BG })
    .jpeg({ quality: 88 })
    .toFile("public/og-image.jpg");

  console.log("assets prepared");
}

main();
