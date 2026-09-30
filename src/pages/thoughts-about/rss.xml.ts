import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPublishedPosts, postPath } from "../../lib/thoughts";

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts();
  return rss({
    title: "Thoughts about…",
    description: "Notes on technology, teams and the decisions in between",
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.summary,
      pubDate: post.data.date,
      link: postPath(post),
      categories: post.data.tags,
    })),
  });
}
