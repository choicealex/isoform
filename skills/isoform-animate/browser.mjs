/**
 * A browser for the scripts that take pictures (look.mjs, inspect.mjs): `await browser(who)`.
 *
 * playwright-core is installed once into a cache folder of yours
 * (~/Library/Caches/isoform-look, %LOCALAPPDATA%\isoform-look or ~/.cache/isoform-look;
 * ISOFORM_LOOK_CACHE moves it), never into the skill or the working directory.
 * Returns a launched Chrome or Chromium, or null with the reason printed.
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { homedir } from "node:os";
import { join } from "node:path";

export async function browser(who) {
  const cache = process.env.ISOFORM_LOOK_CACHE ?? (process.platform === "darwin" ? join(homedir(), "Library/Caches/isoform-look")
    : process.platform === "win32" ? join(process.env.LOCALAPPDATA ?? homedir(), "isoform-look") : join(homedir(), ".cache/isoform-look"));
  const req = createRequire(join(cache, "noop.js"));
  const tag = who.padEnd(9);
  let pw;
  try { pw = req("playwright-core"); } catch {
    mkdirSync(cache, { recursive: true });
    if (!existsSync(join(cache, "package.json"))) writeFileSync(join(cache, "package.json"), "{\"private\":true}\n");
    console.log(`${tag} installing playwright-core into ${cache} (once)`);
    const r = spawnSync("npm", ["install", "--silent", "--no-audit", "--no-fund", "playwright-core@1"], { cwd: cache, stdio: "inherit", shell: process.platform === "win32" });
    if (r.status !== 0) { console.log(`${tag} could not install playwright-core`); return null; }
    pw = req("playwright-core");
  }
  for (const opts of [{ channel: "chrome" }, {}]) { try { return await pw.chromium.launch(opts); } catch {} }
  console.log(`${tag} no Chrome or Chromium: run  npx playwright install chromium`);
  return null;
}
