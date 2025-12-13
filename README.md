# mst

![MST](https://img.shields.io/badge/MST-Moseoh_Setup_Tool-black?style=for-the-badge&logo=npm)

**Moseoh Setup Tool** - 개인 개발 환경 셋업 자동화 CLI 도구

## 설치

```bash
npm install -g @moseoh/mst
```

## 사용법

```bash
mst
```

터미널에서 `mst` 명령어를 실행하면 다음 작업들이 자동으로 수행됩니다:

1. **Justfile 배치** - `assets/Justfile` → `~/Justfile`
2. **Claude Skills 배치** - `assets/my-skill.json` → `~/.claude/skills/my-skill.json`

## 개발

### 로컬 테스트 (npm link)

```bash
# 1. 의존성 설치
npm install

# 2. TypeScript 빌드
npm run build

# 3. 글로벌 심볼릭 링크 생성
npm link

# 4. 이제 어디서든 mst 명령어 사용 가능
mst

# 5. 링크 해제 (테스트 완료 후)
npm unlink -g @moseoh/mst
```

### 개발 모드 (watch)

```bash
npm run dev
```

### 프로젝트 구조

```
mst/
├── assets/                 # 배포할 원본 파일들
│   ├── Justfile            # ~/로 복사됨
│   └── my-skill.json       # ~/.claude/skills/로 복사됨
├── src/
│   └── cli.ts              # 메인 CLI 로직
├── dist/                   # 빌드 결과물 (git 제외)
├── package.json
├── tsconfig.json
└── README.md
```

## npm 배포

```bash
# 로그인
npm login

# 배포 (자동으로 빌드 후 배포)
npm publish --access public
```

## 라이선스

MIT
