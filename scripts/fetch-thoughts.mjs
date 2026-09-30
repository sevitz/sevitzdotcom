// Downloads the public content repo (sevitz/thoughts-about, main) into
// .content/thoughts-about/ and copies post images to public/thoughts-about/<slug>/.
// Set THOUGHTS_CONTENT_DIR to a local directory containing posts/ to use it instead.
// A failed download is fatal when CI is set, otherwise it warns and reuses any existing copy.
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const TARBALL = "https://codeload.github.com/sevitz/thoughts-about/tar.gz/refs/heads/main";
const dest = ".content/thoughts-about";
const publicDir = "public/thoughts-about";

async function download() {
  const res = await fetch(TARBALL).catch((err) => {
    throw new Error(`GET ${TARBALL} failed: ${err.message}`);
  });
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

// Minimal frontmatter read: the `slug:` line inside the leading --- block.
function readSlug(indexPath) {
  if (!existsSync(indexPath)) return undefined;
  const fm = /^---\r?\n([\s\S]*?)\r?\n---/.exec(readFileSync(indexPath, "utf8"));
  const m = fm && /^slug:\s*["']?([a-z0-9]+(?:-[a-z0-9]+)*)["']?\s*$/m.exec(fm[1]);
  return m ? m[1] : undefined;
}

// Folders may be dated (2026-10-01-foo) while the URL key is the frontmatter slug (foo).
function copyAssets() {
  rmSync(publicDir, { recursive: true, force: true });
  const posts = join(dest, "posts");
  for (const folder of readdirSync(posts, { withFileTypes: true })) {
    if (!folder.isDirectory()) continue;
    let slug = readSlug(join(posts, folder.name, "index.md"));
    if (!slug) {
      const msg = `${folder.name}/index.md has no readable slug`;
      if (process.env.CI) {
        console.error(`fetch-thoughts: ${msg}`);
        process.exit(1);
      }
      console.warn(`fetch-thoughts: ${msg}; falling back to folder name`);
      slug = folder.name;
    }
    for (const file of readdirSync(join(posts, folder.name), { withFileTypes: true })) {
      if (!file.isFile() || file.name.endsWith(".md")) continue;
      mkdirSync(join(publicDir, slug), { recursive: true });
      cpSync(join(posts, folder.name, file.name), join(publicDir, slug, file.name));
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
