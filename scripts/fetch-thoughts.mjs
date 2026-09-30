// Downloads the public content repo (sevitz/thoughts-about, main) into
// .content/thoughts-about/ and copies post images to public/thoughts-about/<slug>/.
// Set THOUGHTS_CONTENT_DIR to a local directory containing posts/ to use it instead.
// A failed download is fatal when CI is set, otherwise it warns and reuses any existing copy.
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const TARBALL = "https://codeload.github.com/sevitz/thoughts-about/tar.gz/refs/heads/main";
const dest = ".content/thoughts-about";
const publicDir = "public/thoughts-about";

async function download() {
  const res = await fetch(TARBALL);
  if (!res.ok) throw new Error(`GET ${TARBALL} returned ${res.status}`);
  const tmp = mkdtempSync(join(tmpdir(), "thoughts-"));
  const file = join(tmp, "repo.tar.gz");
  writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  rmSync(dest, { recursive: true, force: true });
  mkdirSync(dest, { recursive: true });
  const tar = spawnSync("tar", ["-xzf", file, "-C", dest, "--strip-components=1"], { stdio: "inherit" });
  rmSync(tmp, { recursive: true, force: true });
  if (tar.status !== 0) throw new Error("tar extraction failed");
}

function useLocal(dir) {
  if (!existsSync(dir)) throw new Error(`THOUGHTS_CONTENT_DIR ${dir} does not exist`);
  rmSync(dest, { recursive: true, force: true });
  mkdirSync(dest, { recursive: true });
  if (existsSync(join(dir, "posts"))) cpSync(join(dir, "posts"), join(dest, "posts"), { recursive: true });
}

function copyAssets() {
  rmSync(publicDir, { recursive: true, force: true });
  const posts = join(dest, "posts");
  for (const slug of readdirSync(posts, { withFileTypes: true })) {
    if (!slug.isDirectory()) continue;
    for (const file of readdirSync(join(posts, slug.name), { withFileTypes: true })) {
      if (!file.isFile() || file.name.endsWith(".md")) continue;
      mkdirSync(join(publicDir, slug.name), { recursive: true });
      cpSync(join(posts, slug.name, file.name), join(publicDir, slug.name, file.name));
    }
  }
}

try {
  if (process.env.THOUGHTS_CONTENT_DIR) useLocal(process.env.THOUGHTS_CONTENT_DIR);
  else await download();
} catch (err) {
  if (process.env.CI) {
    console.error(`fetch-thoughts: ${err.message}`);
    process.exit(1);
  }
  console.warn(`fetch-thoughts: ${err.message}; continuing with any existing ${dest}`);
}

mkdirSync(join(dest, "posts"), { recursive: true });
copyAssets();
console.log(`fetch-thoughts: ready (${readdirSync(join(dest, "posts")).length} post folders)`);
