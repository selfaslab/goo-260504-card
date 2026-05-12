
# 명언 생성기

한국어로 된 명언과 인물 소개를 카드 형태로 보여 주는 작은 웹 앱입니다. 
로컬에 저장된 명언**으로도 동작하고, OpenAI API를 쓰면 매번 새로운 명언을 생성할 수 있습니다.

<img width="699" height="903" alt="card1" src="https://github.com/user-attachments/assets/bb583e00-441d-459f-819f-cc222f1684db" />


## 할 수 있는 것

- **new wisdom**: 서버에 `OPENAI_API_KEY`가 있으면 AI가 명언·원문·인물 정보를 한국어 UI에 맞춰 생성합니다. 키가 없으면 앱에 포함된 샘플 명언을 무작위로 보여 줍니다.
- **copy**: 화면의 명언 텍스트를 클립보드에 복사합니다.
- 반응형 레이아웃과 카드형 디자인으로 모바일·데스크톱에서 볼 수 있습니다.

## 필요 환경

- [Node.js](https://nodejs.org/) (내장 `fetch` 사용, LTS 권장)

외부 npm 패키지는 없고, `node server.mjs`만으로 서버가 뜹니다.

## 실행 방법

1. 저장소를 받은 뒤 프로젝트 폴더로 이동합니다.
2. (선택) 프로젝트 루트에 `.env` 파일을 만들고 API 키를 넣습니다.

   ```env
   OPENAI_API_KEY=sk-...
   ```

   선택 변수: `OPENAI_MODEL`(기본 `gpt-4o-mini`), `PORT`(기본 `8787`).

3. 터미널에서 다음을 실행합니다.

   ```bash
   npm start
   ```

4. 브라우저에서 **http://localhost:8787/** 을 엽니다.

**Windows PowerShell**에서는 `cd 폴더 && npm start` 대신 `cd 폴더; npm start`처럼 `;`로 이어 쓰는 것이 안전합니다.

## 저장소

- [https://github.com/selfaslab/goo-260504-card](https://github.com/selfaslab/goo-260504-card)

API 키는 절대 Git에 올리지 마세요. `.env`는 `.gitignore`에 포함되어 있습니다.
