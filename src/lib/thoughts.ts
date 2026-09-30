import { getCollection, type CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"thoughts">;

const repo = "https://github.com/sevitz/thoughts-about";

/** The only place the published filter lives: pages, feed and home all use it. */
export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection("thoughts", ({ data }) => data.status === "published");
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export const postPath = (post: Post) => `/thoughts-about/${post.data.slug}/`;
export const sourceUrl = (slug: string) => `${repo}/blob/main/posts/${slug}/index.md`;
export const historyUrl = (slug: string) => `${repo}/commits/main/posts/${slug}/index.md`;

export const formatDate = (d: Date) =>
  d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
