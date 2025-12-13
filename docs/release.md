# Release

버전 업데이트 및 태그 생성 → GitHub Actions가 자동 배포

```bash
npm version patch  # patch | minor | major
git push --follow-tags
```

| 버전          | 언제                  | 예시                  |
| ------------- | --------------------- | --------------------- |
| patch (1.0.1) | 버그 수정, 내부 변경  | 오타 수정, 버그 픽스  |
| minor (1.1.0) | 기능 추가 (하위 호환) | 새 task 추가, 새 옵션 |
| major (2.0.0) | 호환 깨지는 변경      | 명령어 변경, 삭제     |

`npm version`은 package.json 버전 업데이트 + git tag 생성 + commit을 한번에 수행
