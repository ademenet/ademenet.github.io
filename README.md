# My blog

Welcome to my blog.

## Run it locally

```bash
hugo server --enableGitInfo
```

## Article Editing Feature

This blog automatically tracks article modifications using Git integration. You can do it manually by adding a `lastmod` field to the article frontmatter.

How it works?

1. Edit any article in `content/`
2. Commit with descriptive message: `git commit -m "Fix typo in introduction"`
3. Deploy - edit information appears automatically
