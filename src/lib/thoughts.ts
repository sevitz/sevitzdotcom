import { getCollection, type CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"thoughts">;

const repo = "https://github.com/sevitz/thoughts-about";

/** The only place the published filter lives: pages, feed and home all use it. */
export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection("thoughts", ({ data }) => data.status === "published");
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export const postPath = (post: Post) => `/thoughts-about/${post.data.slug}/`;
/** Directory name under posts/ (may be dated, e.g. 2026-10-01-foo); differs from the slug. */
export const postFolder = (post: Post) => post.filePath?.split("/").slice(-2, -1)[0] ?? post.data.slug;
export const sourceUrl = (folder: string) => `${repo}/blob/main/posts/${folder}/index.md`;

export const formatDate = (d: Date) =>
  d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

const faviconUrl = (host: string) => `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=64`;

/** Open Tabs posts: put the linked site's favicon in front of each `## [Title](url)` heading. */
export function withFavicons(html: string): string {
  return html.replace(/<h2([^>]*)>(<a href="(https?:\/\/[^"]+)")/g, (m, attrs, rest, href) => {
    let host: string;
    try {
      host = new URL(href.replaceAll("&amp;", "&")).hostname;
    } catch {
      return m;
    }
    return `<h2${attrs}><img class="favicon" src="${faviconUrl(host).replace("&", "&amp;")}" alt="" width="20" height="20" loading="lazy">${rest}`;
  });
}
