---
description: 특정 Phase의 결과물을 원본 프롬프트와 비교 검증
argument-hint: <phase번호> @{결과물파일}
allowed-tools: ["Task"]
---

# Phase 검증

`output-validator` agent를 호출하여 결과물을 원본 프롬프트와 비교 검증합니다.

## 사용법

```
/resume-builder:validate-phase 2 @company/화이트큐브/JD-analysis.md
/resume-builder:validate-phase 5 @company/화이트큐브/resume.md
```

## 실행

Task 도구를 사용하여 `output-validator` agent를 호출합니다.

사용자가 입력한 phase 번호와 결과물 파일 경로를 agent에게 전달하여 검증을 수행합니다.
