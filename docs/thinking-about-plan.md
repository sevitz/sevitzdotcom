# Plan: "Thinking about ..."

A small public stream of thoughts, written with Claude, stored as markdown on GitHub, shown on sevitz.com and cross posted to LinkedIn, Bluesky and Threads.

Status: proposal. Nothing here is built yet.

## 1. Principles

1. **GitHub is the source of truth.** Every post is a markdown file in a public repo. Edits happen there and nowhere else. Git history is the edit log.
2. **sevitz.com is the canonical URL.** Search engines, LinkedIn and the social posts all point at `sevitz.com/thinking-about/<slug>`. The GitHub repo is where the words live; sevitz.com is where people read them. (This is the "POSSE" pattern: Publish on your Own Site, Syndicate Elsewhere.)
3. **Syndication is one way.** Social platforms get copies or teasers. Nothing flows back into the markdown except the URLs of those copies.
4. **sevitz.com shows every public reference.** Each post page lists its GitHub source, history and every place it was cross posted.
5. **Manual where APIs are hostile, automated where they are friendly.** Bluesky is easy to automate, Threads is workable, LinkedIn personal posting is painful. Start manual for LinkedIn.

## 2. Repositories

### 2.1 New public repo: `sevitz/thinking-about`

Standalone and public. It does not need anything from sevitzdotcom and could be read on GitHub alone.

```
thinking-about/
  README.md                 # what this is, links to sevitz.com, auto generated index of posts
  LICENSE                   # content licence (see Q3)
  CLAUDE.md                 # voice, structure and frontmatter rules for Claude
  STYLE.md                  # human readable style guide (same content, friendlier)
  posts/
    technical-debt-is-a-loan/
      index.md
      diagram.png           # images live next to the post
  templates/
    post.md                 # blank post with frontmatter
  schema/
    frontmatter.schema.json # used by CI to validate posts
  .github/
    workflows/
      validate.yml          # PRs: frontmatter + links + slug checks
      publish.yml           # main: trigger sevitz.com rebuild, then syndicate
    ISSUE_TEMPLATE/
      record-linkedin.yml   # optional: paste a LinkedIn URL to have it written back
```

One folder per post (rather than one file) so images sit with the text and the folder name is the slug.

### 2.2 Existing repo: `sevitz/sevitzdotcom`

Gains a `/thinking-about/` section that reads posts from the content repo at build time. No post content is committed here.

## 3. Post format

```markdown
---
title: "Thinking about technical debt as a loan"
slug: technical-debt-is-a-loan        # must match folder name, never changes once published
summary: "Debt is fine. Not knowing the interest rate is the problem."
date: 2026-10-06                       # first publish date
updated: 2026-10-12                    # optional, set when meaningfully edited
status: published                      # draft | published | archived
tags: [engineering, leadership]
syndicate: [linkedin, bluesky, threads]
social:                                # optional hand written copy per platform
  linkedin: |
    ...
  bluesky: "..."
  threads: "..."
syndication:                           # filled in after cross posting, never by hand for automated ones
  linkedin: https://www.linkedin.com/posts/...
  bluesky: https://bsky.app/profile/sevitz.com/post/...
  threads: https://www.threads.net/@.../post/...
---

Body in plain GitHub flavoured markdown.
```

### Slug rules

1. Short, lowercase, hyphen separated, taken from the "about ..." part of the title. "Thinking about technical debt as a loan" becomes `technical-debt-is-a-loan`.
2. No dates in the URL. Posts are thoughts, not news.
3. Immutable once `status: published`. CI fails if a published slug is renamed. If a rename is ever unavoidable, add an `aliases:` list and the site emits redirects.

### URL

Recommended: `sevitz.com/thinking-about/<slug>`. Hyphens are what search engines treat as word breaks, and it matches the working title. `/think_about/` can be a permanent redirect so either works. See Q1.

## 4. sevitz.com integration

### 4.1 Getting the content into the build

Recommended approach: **fetch at build time, rebuild on push.**

1. A `prebuild` npm script downloads the latest tarball of `sevitz/thinking-about` (public, so no token needed) into `.content/thinking-about/`, which is gitignored.
2. An Astro 5 content collection uses the built in `glob()` loader over `.content/thinking-about/posts/*/index.md`, with a Zod schema that mirrors `frontmatter.schema.json`.
3. Only `status: published` posts are rendered.
4. The content repo's `publish.yml` calls a **Cloudflare Pages deploy hook** (stored as a repo secret) on every push to `main`, so a merged post is live in a minute or two without touching sevitzdotcom.

Why not a git submodule: it works on Cloudflare Pages, but every new post would also need a commit in sevitzdotcom to bump the pointer. The fetch approach keeps publishing a one repo action.

Optional hardening later: pin to a tag or commit SHA for reproducible builds.

### 4.2 New pages and files in sevitzdotcom

| Path | Purpose |
|---|---|
| `src/content.config.ts` | Collection definition and schema |
| `scripts/fetch-thoughts.mjs` | Prebuild download of the content repo |
| `src/pages/thinking-about/index.astro` | List of posts, newest first, with summary and tags |
| `src/pages/thinking-about/[slug].astro` | Single post page |
| `src/pages/thinking-about/rss.xml.ts` | RSS feed via `@astrojs/rss` |
| `src/layouts/PostLayout.astro` | Readable prose layout (the current one page Bootstrap theme is not built for long text) |
| `src/data/site.ts` | New nav item "Thinking" |
| `public/_redirects` | `/think_about/*  /thinking-about/:splat  301` |

Also add `@astrojs/sitemap` so posts are discoverable.

### 4.3 What a post page shows

1. Title, date, updated date, reading time, tags.
2. Body.
3. A "This post elsewhere" footer:
   * Source on GitHub (link to `index.md`)
   * Edit history on GitHub (link to the file's commit history)
   * LinkedIn, Bluesky, Threads links, whichever exist in `syndication`
4. `<link rel="canonical">` to itself, Open Graph and Twitter card tags so shares render properly.
5. Optional later: auto generated Open Graph image per post (title on a branded background) using `satori` at build time.

## 5. Publishing workflow

### 5.1 Writing with Claude

1. Create a **Claude Project** called "Thinking about" with `CLAUDE.md` and `STYLE.md` from the repo as project knowledge. That keeps voice and format consistent across chats.
2. Workflow in a chat:
   1. Brain dump the idea.
   2. Iterate on argument and structure.
   3. Ask Claude for the final output: the full `index.md` with frontmatter, plus the three social variants (LinkedIn native post, Bluesky under 300 characters, Threads under 500 characters).
3. Getting it into GitHub, pick one:
   * **Claude chat with the GitHub connector** opens a PR on `thinking-about` directly. Best option.
   * Paste into the GitHub web editor ("Add file" then "Create new file" at `posts/<slug>/index.md`) and open a PR.
   * Claude Code on the web, pointed at the repo.

Important: the repo is public, so **anything pushed, including branches and PRs, is public**. Keep genuine drafts in Claude chat until they are ready. The `draft` status is for "ready to review but not yet live", not for private notes.

### 5.2 Validation (on PR)

`validate.yml` checks:

1. Frontmatter matches the schema.
2. Slug matches folder name and is unique.
3. Published slugs have not changed.
4. Social copy fits each platform's length limit.
5. Links resolve (lychee or similar).

### 5.3 Going live (merge to main)

`publish.yml`:

1. Calls the Cloudflare Pages deploy hook.
2. Waits until `sevitz.com/thinking-about/<slug>` returns 200 (so social posts never link to a 404).
3. Runs syndication for any post with `status: published`, a platform listed in `syndicate`, and no URL yet in `syndication` for that platform. That condition makes it safe to rerun: nothing gets double posted.
4. Commits the new syndication URLs back into the post's frontmatter with a `[skip ci]` message, which triggers one more site rebuild so the links appear on sevitz.com.
5. Regenerates the README index.

## 6. Syndication per platform

| Platform | v1 | Automation route | Notes |
|---|---|---|---|
| **Bluesky** | Automated | AT Protocol API with an app password as a repo secret | Simple and stable. Post the teaser plus link card. Bonus: set the Bluesky handle to `sevitz.com` via a DNS TXT record so identity ties back to the site. |
| **Threads** | Automated (or phase 2) | Threads API via a Meta developer app | Needs a Meta app, a long lived token (60 days) and a scheduled workflow to refresh it. More setup, then hands off. |
| **LinkedIn** | Manual, assisted | Share API (`w_member_social`) is possible later | Personal posting tokens expire after 60 days with no refresh for most apps, so automation means re-authorising every two months. For v1: the Action prints the ready to paste LinkedIn copy in the job summary, you post it, then record the URL (issue form or a `workflow_dispatch` input) and the Action writes it back. |

### LinkedIn format

LinkedIn reaches fewer people when a post leads with an external link. Recommended shape:

1. Native post with the full thought or a strong condensed version (hook in the first two lines, under about 1,300 characters).
2. Closing line: "Longer version and all my other thinking at sevitz.com/thinking-about/<slug>".
3. Optionally also drop the link as the first comment.

### Backfeed (optional, later)

Show likes and replies from Bluesky and Threads on sevitz.com via their public APIs or via webmentions (Bridgy). Not needed for v1.

## 7. Phased delivery

| Phase | Scope | Where |
|---|---|---|
| 0 | Decide the open questions below | You |
| 1 | Create `thinking-about` repo, templates, `CLAUDE.md`, `STYLE.md`, schema, validate workflow, first post | New repo |
| 2 | Content collection, index, post page, RSS, sitemap, redirects, nav link, deploy hook | sevitzdotcom |
| 3 | `publish.yml` with deploy hook trigger, live check and README index | New repo |
| 4 | Bluesky automation, LinkedIn assisted flow, write back of URLs | New repo |
| 5 | Threads automation, OG images, backfeed | Both |

Phases 1 and 2 give a working "write, merge, live on sevitz.com" loop. Everything after is syndication.

## 8. Secrets and setup checklist

Stored as GitHub Actions secrets on `thinking-about` only, never in files:

* `CF_PAGES_DEPLOY_HOOK_URL`
* `BLUESKY_HANDLE`, `BLUESKY_APP_PASSWORD`
* `THREADS_USER_ID`, `THREADS_ACCESS_TOKEN` (phase 5)
* `LINKEDIN_ACCESS_TOKEN` (only if LinkedIn is ever automated)

Also: branch protection on `main` requiring `validate.yml` to pass.

## 9. Open questions

| # | Question | Recommendation |
|---|---|---|
| Q1 | URL path: `/thinking-about/` or `/think_about/` | `/thinking-about/` with `/think_about/` redirecting |
| Q2 | Repo name | `thinking-about` |
| Q3 | Content licence | CC BY 4.0 for text; code snippets MIT |
| Q4 | Automate Threads in v1 or later | Later, Bluesky first |
| Q5 | Show GitHub edit history on posts | Yes, it is the point of GitHub as source of truth |
| Q6 | Comments or reactions on sevitz.com | No for v1, backfeed later if wanted |
