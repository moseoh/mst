---
description: "git 커밋 생성 `/commit [영어] [@files...]`"
---

## Context

- Current git status: !`git status`
- Current git diff (staged and unstaged changes): !`git diff HEAD`
- Current branch: !`git branch --show-current`
- Recent commits: !`git log --oneline -10`

## Arguments

- **$1** (Language): Default is Korean. If `english` or `영어` is provided, write commit message in English.
- **$2+** (Files): Default is all changes. If `@path/to/file` or `@folder/` is provided, only stage and commit those files.

## Commit Message Format

- Default: single line (`type(scope): description`)
- Add bullet points in body only for essential details
- **NEVER** include AI-generated attribution in commit messages (e.g., "Generated with Claude Code", "Co-Authored-By: Claude", "by ChatGPT", "AI generated")

## Your task

Based on the above changes, create a single git commit.

You have the capability to call multiple tools in a single response. Stage and create the commit using a single message. Do not use any other tools or do anything else.

After committing, show the user:

```
커밋 완료!:
<full commit message including title and body>
```
