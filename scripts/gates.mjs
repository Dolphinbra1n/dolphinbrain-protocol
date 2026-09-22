/**
 * gates.mjs — asserts BOTH registry states (absent + populated) render
 * correctly through the real gate/link logic used by the site, plus a
 * sanity check on the built output. Exits non-zero on any failure.
 */
import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { resolve as resolveGate, isLive } from "../src/lib/gate.js";
import { xHandleFromUrl, githubHandleFromUrl } from "../src/lib/links.js";

let failures = 0;
function check(label, fn) {
  try {
    fn();
    console.log(`ok   - ${label}`);
  } catch (err) {
    failures++;
    console.error(`FAIL - ${label}`);
    console.error(`       ${err.message}`);
  }
}

// ---------------------------------------------------------------------
// Branch A: absent state (current shipped default)
// ---------------------------------------------------------------------
const absentCa = { status: "absent", value: null, asOf: "2026-09-22", source: "no contract deployed" };
const absentX = { status: "absent", url: null, asOf: "2026-09-22", source: "no account yet" };

check("absent CA record is not live", () => {
  assert.equal(isLive(absentCa), false);
  const s = resolveGate(absentCa);
  assert.equal(s.live, false);
  assert.equal(s.status, "absent");
});

check("absent X record is not live and produces no handle/href", () => {
  assert.equal(isLive(absentX), false);
  assert.equal(xHandleFromUrl(absentX.url), null);
});

// ---------------------------------------------------------------------
// Branch B: populated state (must flip purely on `status`, and a real
// 0x hex CA must NOT be rejected by any pattern-matching gate)
// ---------------------------------------------------------------------
const populatedCa = {
  status: "stated",
  value: "0x1234567890abcdef1234567890abcdef12345678",
  asOf: "2026-09-22",
  source: "test fixture",
};
const populatedX = {
  status: "stated",
  url: "https://x.com/dolphinbrain",
  asOf: "2026-09-22",
  source: "test fixture",
};
const populatedGithub = {
  status: "stated",
  url: "https://github.com/dolphinbrain/site",
  asOf: "2026-09-22",
  source: "test fixture",
};

check("populated CA record (0x-hex value) is live — gate does not reject hex strings", () => {
  assert.equal(isLive(populatedCa), true);
  const s = resolveGate(populatedCa);
  assert.equal(s.live, true);
  assert.match(populatedCa.value, /^0x[0-9a-f]+$/i);
});

check("populated X record is live and derives @handle from the URL only", () => {
  assert.equal(isLive(populatedX), true);
  assert.equal(xHandleFromUrl(populatedX.url), "@dolphinbrain");
});

check("populated GitHub record is live and derives org/repo from the URL only", () => {
  assert.equal(isLive(populatedGithub), true);
  assert.equal(githubHandleFromUrl(populatedGithub.url), "dolphinbrain/site");
});

check("gate is driven purely by status, not by string shape", () => {
  // Same hex-looking value, opposite status -> opposite result.
  const notLiveEvenThoughHex = { status: "unconfirmed", value: "0xdeadbeef", asOf: "x", source: "x" };
  assert.equal(isLive(notLiveEvenThoughHex), false);
});

// ---------------------------------------------------------------------
// Build output sanity: absent-state copy must be present in the shipped
// bundle (confirms the default registry state actually built as absent).
// ---------------------------------------------------------------------
check("dist/ exists (run `npm run build` first)", () => {
  assert.ok(existsSync("dist/index.html"), "dist/index.html missing — run npm run build");
});

check("built JS bundle contains the absent-state CA copy", () => {
  const distDir = "dist/assets";
  const files = existsSync(distDir) ? readdirSync(distDir) : [];
  const jsFile = files.find((f) => f.endsWith(".js"));
  assert.ok(jsFile, "no built JS bundle found in dist/assets");
  const contents = readFileSync(`${distDir}/${jsFile}`, "utf8");
  assert.match(contents, /not yet published/);
});

console.log("");
if (failures > 0) {
  console.error(`${failures} gate check(s) failed`);
  process.exit(1);
} else {
  console.log("all gate checks passed");
  process.exit(0);
}
