# 로컬 개발 가이드

이 문서는 `mst`를 로컬에서 개발하고 테스트하는 방법을 안내합니다.

## 사전 요구사항

- Node.js 22.0.0 이상
- npm 10.0.0 이상

## 로컬 테스트 (npm link)

`npm link`를 사용하면 패키지를 npm에 배포하지 않고도 글로벌 명령어처럼 테스트할 수 있습니다.

### 1. 의존성 설치

```bash
npm install
```

### 2. TypeScript 빌드

```bash
npm run build
```

빌드 결과물은 `dist/` 폴더에 생성됩니다.

### 3. 글로벌 심볼릭 링크 생성

```bash
npm link
```

이 명령어는 현재 프로젝트를 글로벌 `node_modules`에 심볼릭 링크로 연결합니다.

### 4. 테스트 실행

```bash
mst
```

이제 터미널 어디서든 `mst` 명령어를 사용할 수 있습니다.

### 5. 링크 해제

테스트가 끝나면 링크를 해제합니다:

```bash
npm unlink -g @moseoh/mst
```

## 개발 모드 (Watch)

코드 변경 시 자동으로 재빌드하려면:

```bash
npm run dev
```

> 단, `npm link`로 연결된 상태에서는 빌드만 다시 되고, 실행 중인 프로세스가 자동 재시작되지는 않습니다. 변경 후 `mst`를 다시 실행하세요.

## 디버깅

### VS Code에서 디버깅

`.vscode/launch.json`을 생성하고 다음 설정을 추가합니다:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug MST",
      "program": "${workspaceFolder}/dist/cli.js",
      "preLaunchTask": "npm: build",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"],
      "sourceMaps": true
    }
  ]
}
```

### 직접 실행

빌드된 파일을 직접 실행할 수도 있습니다:

```bash
node dist/cli.js
```

## 문제 해결

### `mst` 명령어를 찾을 수 없음

```bash
# 링크 상태 확인
npm ls -g @moseoh/mst

# 다시 링크
npm unlink -g @moseoh/mst
npm link
```

### 빌드 오류

```bash
# node_modules 삭제 후 재설치
rm -rf node_modules dist
npm install
npm run build
```

### 권한 오류 (macOS/Linux)

```bash
# npm 글로벌 디렉토리 권한 확인
npm config get prefix

# 필요시 권한 수정 또는 nvm 사용 권장
```
