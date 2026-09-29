# Plan: "Thoughts about ..."

A small public stream of thoughts. Noodled in a private Obsidian vault, shaped with Claude Code, published as markdown on GitHub, shown on sevitz.com and cross posted to LinkedIn, Bluesky and Threads.

Status: proposal. Nothing here is built yet.

## 1. Principles

1. **GitHub is the source of truth for published posts.** Every post is a markdown file in the public repo `sevitz/thoughts-about`. Edits to published posts happen there and nowhere else. Git history is the edit log.
2. **A private Obsidian vault in iCloud is the scratchpad.** Noodles and drafts live there until they are ready. Once published, a post is only ever edited in the public repo.
3. **sevitz.com is the canonical URL.** Search engines, LinkedIn and the social posts all point at `sevitz.com/thoughts-about/<slug>`. The GitHub repo is where the words live; sevitz.com is where people read them. (This is the "POSSE" pattern: Publish on your Own Site, Syndicate Elsewhere.)
4. **Syndication is one way.** Social platforms get copies or teasers. Nothing flows back into the markdown except the URLs of those copies.
5. **sevitz.com shows every public reference.** Each post page lists its GitHub source, history and every place it was cross posted.
6. **Manual first, then automate one platform at a time.** v1 cross posting is done by hand with the copy prepared for you. Automation is added per platform, in order, once the previous one is solid.
7. **Never X.** Nothing is ever posted there.

## 2. Repositories

### 2.1 New public repo: `sevitz/thoughts-about`

Standalone and public. It does not need anything from sevitzdotcom and could be read on GitHub alone.

```
thoughts-about/
  README.md                 # what this is, links to sevitz.com, auto generated index of posts
  LICENSE                   # CC BY 4.0 for text, MIT for code snippets
  CLAUDE.md                 # voice, structure and frontmatter rules for Claude
  STYLE.md                  # human readable style guide (same content, friendlier)
  posts/
    technical-debt-is-a-loan/
      index.md
      cover.png             # images live next to the post
  templates/
    post.md                 # blank post with frontmatter
  schema/
    frontmatter.schema.json # used by CI to validate posts
  .github/
    workflows/
      validate.yml          # PRs: frontmatter, links, slug and length checks
      publish.yml           # main: rebuild sevitz.com, confirm live, prepare social copy
    ISSUE_TEMPLATE/
      record-syndication.yml # paste the LinkedIn / Bluesky / Threads URLs to have them written back
```

One folder per post (rather than one file) so images sit with the text and the folder name is the slug.

### 2.2 Existing repo: `sevitz/sevitzdotcom`

Gains a `/thoughts-about/` section that reads posts from the content repo at build time. No post content is committed here.

## 3. Post format

```markdown
---
title: "Thoughts about technical debt as a loan"
slug: technical-debt-is-a-loan        # must match folder name, never changes once published
summary: "Debt is fine. Not knowing the interest rate is the problem."
date: 2026-10-06                       # first publish date
updated: 2026-10-12                    # optional, set when meaningfully edited
status: published                      # draft | published | archived
tags: [engineering, leadership]
image:                                 # cover and social image, optional (a generated one is used otherwise)
  src: cover.png
  alt: "A ledger with a very large interest column"
syndicate: [linkedin, bluesky, threads]
social:
  linkedin: |
    Native LinkedIn post, ends with the sevitz.com link.
  thread:                              # same thread for Bluesky and Threads, each entry <= 300 characters
    - "Opener: what the post is about, plus the link. (Image attached.)"
    - "Condensed point 1"
    - "Condensed point 2"
    - "Condensed point 3"
    - "Closing: read the full thing, plus the link. (Image attached.)"
syndication:                           # filled in after cross posting
  linkedin: https://www.linkedin.com/posts/...
  bluesky: https://bsky.app/profile/sevitz.com/post/...
  threads: https://www.threads.net/@.../post/...
---

Body in plain GitHub flavoured markdown.
```

### Slug rules

1. Short, lowercase, hyphen separated, taken from the "about ..." part of the title. "Thoughts about technical debt as a loan" becomes `technical-debt-is-a-loan`.
2. No dates in the URL. Posts are thoughts, not news.
3. Immutable once `status: published`. CI fails if a published slug is renamed.

### URL

`sevitz.com/thoughts-about/<slug>`. Hyphens throughout, matching the repo name.

## 4. sevitz.com integration

### 4.1 Getting the content into the build

**Fetch at build time, rebuild on push.**

1. A `prebuild` npm script downloads the latest tarball of `sevitz/thoughts-about` (public, so no token needed) into `.content/thoughts-about/`, which is gitignored.
2. An Astro 5 content collection uses the built in `glob()` loader over `.content/thoughts-about/posts/*/index.md`, with a Zod schema that mirrors `frontmatter.schema.json`.
3. Only `status: published` posts are rendered.
4. The content repo's `publish.yml` calls a **Cloudflare Pages deploy hook** (stored as a repo secret) on every push to `main`, so a merged post is live in a minute or two without touching sevitzdotcom.

Why not a git submodule: it works on Cloudflare Pages, but every new post would also need a commit in sevitzdotcom to bump the pointer. The fetch approach keeps publishing a one repo action.

Optional hardening later: pin to a tag or commit SHA for reproducible builds.

### 4.2 New pages and files in sevitzdotcom

| Path | Purpose |
|---|---|
| `src/content.config.ts` | Collection definition and schema |
| `scripts/fetch-thoughts.mjs` | Prebuild download of the content repo |
| `src/pages/thoughts-about/index.astro` | List of posts, newest first, with summary and tags |
| `src/pages/thoughts-about/[slug].astro` | Single post page |
| `src/pages/thoughts-about/rss.xml.ts` | RSS feed via `@astrojs/rss` |
| `src/layouts/PostLayout.astro` | Readable prose layout (the current one page Bootstrap theme is not built for long text) |
| `src/data/site.ts` | New nav item "Thoughts" |

Also add `@astrojs/sitemap` so posts are discoverable.

### 4.3 What a post page shows

1. Title, date, updated date, reading time, tags.
2. Body.
3. A "This post elsewhere" footer:
   * Source on GitHub (link to `index.md`)
   * Edit history on GitHub (link to the file's commit history)
   * LinkedIn, Bluesky, Threads links, whichever exist in `syndication`
4. `<link rel="canonical">` to itself, plus Open Graph tags so shares render properly.
5. A social image per post: `image` from frontmatter if set, otherwise one generated at build time (title on a branded background, using `satori`). The same image is attached to the first and last posts of each social thread.

No comments or reactions on sevitz.com.

## 5. Publishing workflow

### 5.1 Drafting in an Obsidian vault

Drafts are plain markdown in a private Obsidian vault named `Thoughts About`, so Claude can edit them in place.

```
Thoughts About/              # Obsidian vault in iCloud
  CLAUDE.md                  # voice, structure and frontmatter rules (same as the public repo)
  STYLE.md
  Noodles/                   # loose ideas, fragments, links
  Drafts/
    <slug>/index.md          # already in the final post format, frontmatter included
  Ready/
    <slug>/index.md          # finished, waiting to be published
```

The vault lives in iCloud so it opens in Obsidian on the Mac, iPhone and iPad (see 10.1 for the exact location). There is no git repo for drafts.

Nothing in the vault is public.

### 5.2 Shaping and publishing with Claude Code

Claude Code works on the vault directly, from either:

* the Terminal extension inside Obsidian on the Mac
* the same session from phone or iPad via Remote Control

Flow:

1. Noodle in `Noodles/`. When an idea has legs, ask Claude to start `Drafts/<slug>/index.md` from the template.
2. Iterate with Claude editing the file in place.
3. When done, Claude fills in `social.linkedin` and `social.thread`, and the draft moves to `Ready/`.
4. Publishing: Claude Code copies `Ready/<slug>/` into `posts/<slug>/` in the public `sevitz/thoughts-about` repo and opens a PR. After merge, the draft is deleted from `Ready/`. From then on, edits happen in `sevitz/thoughts-about` only, never back in the vault.

Note: branches and PRs in the public repo are public, so only publish from `Ready/`.

### 5.3 Why not Google Docs

Claude can read and create Google Docs but cannot modify them in place. Every revision means either merging changes by hand or creating a new document and losing edit history. Markdown files in the vault avoid both, and need no conversion at publish time.

### 5.4 Validation (on PR)

`validate.yml` checks:

1. Frontmatter matches the schema.
2. Slug matches folder name and is unique.
3. Published slugs have not changed.
4. Every `social.thread` entry is 300 characters or fewer, the thread has 5 to 7 entries (opener, 3 to 5 body, closer), and the first and last entries contain the post URL.
5. Links resolve (lychee or similar).

### 5.5 Going live (merge to main)

`publish.yml`:

1. Calls the Cloudflare Pages deploy hook.
2. Waits until `sevitz.com/thoughts-about/<slug>` returns 200, so nothing links to a 404.
3. Writes the ready to paste LinkedIn post and thread into the job summary, with the social image attached as a build artifact.
4. Regenerates the README index.

Then, by hand: post to LinkedIn, Bluesky and Threads, and file the "Record syndication" issue with the URLs. A workflow writes them into the post's frontmatter and closes the issue, which triggers one more rebuild so the links appear on sevitz.com.

## 6. Syndication

### 6.1 Platforms and automation order

| Order | Platform | v1 | Automation route when its turn comes |
|---|---|---|---|
| 1 | **Bluesky** | Manual | AT Protocol API with an app password as a repo secret. Simple and stable. Bonus: set the Bluesky handle to `sevitz.com` via a DNS TXT record. |
| 2 | **Threads** | Manual | Threads API via a Meta developer app. Needs a long lived token (60 days) and a scheduled workflow to refresh it. |
| 3 | **LinkedIn** | Manual | Share API (`w_member_social`). Tokens expire after 60 days with no refresh for most apps, so this may stay manual. |
| Never | **X** | No | No. |

Each automation step only starts once the previous one has run reliably for a while. Automated posting only fires for a platform listed in `syndicate` with no URL yet in `syndication`, so reruns never double post.

### 6.2 Thread format (Bluesky and Threads)

The same thread goes to both, so every post is sized for Bluesky's 300 character limit.

1. **Post 1, opener:** image, link to the sevitz.com post, and a short description of the article.
2. **Posts 2 to n, body:** 3 to 5 posts carrying a condensed version of the article, each one standing on its own.
3. **Post n+1, closer:** image again and a link back to sevitz.com.

### 6.3 LinkedIn format

LinkedIn reaches fewer people when a post leads with an external link, so:

1. Native post with the full thought or a strong condensed version (hook in the first two lines, under about 1,300 characters).
2. Closing line: "Longer version and all my other thoughts at sevitz.com/thoughts-about/<slug>".
3. Optionally also drop the link as the first comment.

## 7. Phased delivery

| Phase | Scope | Where |
|---|---|---|
| 1 | Create `thoughts-about` repo, templates, `CLAUDE.md`, `STYLE.md`, schema, validate workflow, first post. Set up the `Thoughts About` vault folders and `CLAUDE.md`. | New repo, vault |
| 2 | Content collection, index, post page, RSS, sitemap, nav link, social images, deploy hook | sevitzdotcom |
| 3 | `publish.yml`: deploy hook trigger, live check, social copy in job summary, README index | New repo |
| 4 | "Record syndication" issue form and URL write back | New repo |
| 5 | Automate Bluesky | New repo |
| 6 | Automate Threads | New repo |
| 7 | Automate LinkedIn, if ever | New repo |

Phases 1 to 4 are the complete manual v1.

## 8. Secrets and setup checklist

Stored as GitHub Actions secrets on `thoughts-about` only, never in files:

| Secret | Needed from |
|---|---|
| `CF_PAGES_DEPLOY_HOOK_URL` | Phase 3 |
| `BLUESKY_HANDLE`, `BLUESKY_APP_PASSWORD` | Phase 5 |
| `THREADS_USER_ID`, `THREADS_ACCESS_TOKEN` | Phase 6 |
| `LINKEDIN_ACCESS_TOKEN` | Phase 7 |

Also: branch protection on `main` requiring `validate.yml` to pass.

## 9. Decisions

| Topic | Decision |
|---|---|
| Name | "Thoughts about ..." |
| URL | `sevitz.com/thoughts-about/<slug>` |
| Repo | `sevitz/thoughts-about`, public |
| Licence | CC BY 4.0 for text, MIT for code snippets |
| Drafting | Private Obsidian vault `Thoughts About` in iCloud; Claude Code edits in place. Published posts are edited only on GitHub. No private drafts repo. Not Google Docs (see 5.3). |
| Cross posting | Manual v1, then automate Bluesky, Threads, LinkedIn in that order |
| Thread format | Opener with image and link, 3 to 5 body posts, closer with image and link |
| GitHub source and history links on posts | Yes |
| Comments on sevitz.com | No |
| X | Never |

## 10. Local setup and cleanup

### 10.1 Vault location

The vault lives at `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/Thoughts About`, the iCloud Drive Obsidian folder, so it opens in Obsidian on the Mac, iPhone and iPad.

### 10.2 Clean up old vaults

Two earlier vaults exist and should be removed from Obsidian's vault list and from disk once the new one is set up (check they hold nothing worth keeping first):

* `Thoughts-About` at `/Users/sevitz/Library/Mobile Documents/com~apple~CloudDocs` (iCloud Drive root)
* `Sev's Thoughts About` at `/Users/sevitz/Documents/Sev Thoughts About`
