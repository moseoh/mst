---
description: "커밋된 변경사항 푸시 후 PR 생성"
---

## Context

- Current git status: !`git status`
- Current branch: !`git branch --show-current`
- Commits to be pushed: !`git log @{u}..HEAD --oneline 2>/dev/null || git log -5 --oneline`

## PR Format

**Title**: `<type>(<scope>): <description>` (max 72 chars, lowercase start, no period)

**Body**:

```
## Summary
<purpose and changes>

## Changes (optional)
<implementation details>

## Related Issues (optional)
Closes #123
```

- **NEVER** include AI-generated attribution (e.g., "Generated with Claude Code", "Co-Authored-By: Claude")
- Do not include empty sections

## Your task

Based on the committed changes above, create a pull request.

1. Create a new branch if on main
2. Push the branch to origin
3. Create a pull request using `gh pr create`

Do NOT create new commits. Only push existing commits.

You have the capability to call multiple tools in a single response. You MUST do all of the above in a single message. Do not use any other tools or do anything else.

After creating PR, show the user:

```
PR 생성 완료!:
- 제목: <title>
- 브랜치: <branch> → main
- URL: <pr url>
```
