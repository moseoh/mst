---
description: JD 기반 이력서/자기소개서 작성 워크플로우 시작
argument-hint: <회사명>
allowed-tools: ["Read", "Write", "Glob", "Task", "AskUserQuestion"]
---

# 이력서 작성 워크플로우 시작

사용자가 제공한 회사명으로 이력서/자기소개서 작성 워크플로우를 시작합니다.

## 워크플로우

이 워크플로우는 5단계로 구성됩니다:

1. **Phase 1**: JD 마크다운 정리 (jd-formatter agent)
2. **Phase 2**: JD 분석 (jd-analyzer agent)
3. **Phase 3**: 경력-JD 매칭 분석 (career-analyzer agent)
4. **Phase 4**: 자기소개서 작성 (cover-letter-writer agent)
5. **Phase 5**: 이력서 작성 (resume-writer agent)

## 실행 단계

### 1. 회사 디렉토리 확인

`company/{회사명}/` 디렉토리가 존재하는지 확인합니다.

- 디렉토리가 없으면 생성합니다
- `JD.md` 파일이 있는지 확인합니다

### 2. JD 파일 확인

`company/{회사명}/JD.md` 파일이 존재하는지 확인합니다.

- 파일이 없으면 사용자에게 JD를 붙여넣기할 파일을 생성하라고 안내합니다
- 파일이 있으면 Phase 1을 시작합니다

### 3. Phase 1 실행

jd-formatter agent를 사용하여 JD를 마크다운 형식으로 정리합니다.

완료 후 사용자에게 결과를 보여주고 다음 단계 진행 여부를 확인합니다.

### 4. 이후 Phase 순차 진행

각 Phase 완료 후:

- 결과물 파일 경로를 사용자에게 보여줍니다
- 다음 Phase 진행 여부를 확인합니다
- 사용자가 수정을 요청하면 해당 Phase를 다시 실행합니다

## 사용 예시

```
/resume-builder:start 화이트큐브
```

위 명령은 `company/화이트큐브/` 디렉토리에서 워크플로우를 시작합니다.

## 참조 리소스

- `career/` - 경력 정보
- `profile/` - 개인 정보, 가치관, 블로그 활동
- `skills/writing-guidelines/` - 작성 가이드라인

## 최종 결과물

워크플로우 완료 시 생성되는 파일:

- `company/{회사명}/JD.md` - 정리된 JD
- `company/{회사명}/JD-analysis.md` - JD 분석
- `company/{회사명}/career-analysis.md` - 경력 분석
- `company/{회사명}/cover-letter.md` - 자기소개서
- `company/{회사명}/resume.md` - 이력서
