# Release

main 브랜치가 보호되어 있으므로 PR을 통해 릴리즈 진행

```bash
# 1. release 브랜치 생성 및 버전 업데이트
git checkout -b chore/release
npm version patch --no-git-tag-version  # patch | minor | major
git add package.json package-lock.json
git commit -m "chore: bump version to $(npm pkg get version | tr -d '\"')"
git push -u origin chore/release

# 2. PR 생성 → 리뷰 → 머지

# 3. main에서 태그 생성 및 푸시
git checkout main
git pull
git tag "v$(npm pkg get version | tr -d '\"')"
git push --tags
```

GitHub Actions가 태그 푸시 감지 → 자동으로 npm publish + GitHub Release 생성

| 버전          | 언제                  | 예시                  |
| ------------- | --------------------- | --------------------- |
| patch (1.0.1) | 버그 수정, 내부 변경  | 오타 수정, 버그 픽스  |
| minor (1.1.0) | 기능 추가 (하위 호환) | 새 task 추가, 새 옵션 |
| major (2.0.0) | 호환 깨지는 변경      | 명령어 변경, 삭제     |
