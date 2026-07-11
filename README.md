# 아파트 실거래가 트래커

국토교통부 실거래가 공개시스템(공공데이터포털) API로 관심 아파트 단지의 매매·전세·월세 실거래가를 가져와 보여주는 사이트입니다. 매일 GitHub Actions가 최신 데이터를 수집해 저장소에 커밋하고, Render가 자동 재배포합니다.

## 구조

- `config/complexes.json` — 추적할 아파트 단지 목록 (단지명, 지역, 법정동코드)
- `lib/molit.ts` — 국토교통부 매매/전월세 실거래가 API 클라이언트
- `scripts/fetch-data.ts` — 데이터 수집 스크립트 (`npm run fetch-data`)
- `data/trades/*.json` — 단지별로 수집된 거래 데이터 (커밋되는 "DB")
- `app/` — Next.js 웹 화면 (단지 목록 / 상세 페이지, 표 + 차트)
- `.github/workflows/update-data.yml` — 매일 자동 수집 워크플로우

## 로컬 실행

```bash
npm install
npm run fetch-data          # 최근 3개월 데이터 수집 (기본값)
npm run fetch-data -- --full   # 2006년~현재 전체 이력 백필 (최초 1회 권장)
npm run dev                  # http://localhost:3000
```

`.env` 파일에 아래처럼 공공데이터포털 서비스 키가 있어야 합니다 (git에 커밋되지 않습니다):

```
MOLIT_API_KEY="발급받은 서비스 키"
```

## 관심 단지 추가하기

`config/complexes.json`에 항목을 추가하세요.

```json
{
  "id": "고유-슬러그",
  "name": "표시용 이름",
  "aptNameKeyword": "실거래가 자료의 아파트명과 매칭할 키워드 (공백 무시하고 포함 여부로 매칭)",
  "sido": "시/도",
  "sigungu": "시/군/구",
  "dong": "법정동",
  "lawdCd": "법정동코드 앞 5자리"
}
```

`lawdCd`는 [법정동코드 조회](https://www.code.go.kr/stat/getLawdCdListAj.do)나 검색으로 확인할 수 있습니다 (예: 서울 성북구 = 11290).

추가한 뒤 `npm run fetch-data -- --full`을 한 번 실행해 이력을 백필하세요.

## 배포 (GitHub + Render)

1. **GitHub 저장소에 push**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/<your-account>/<repo>.git
   git push -u origin main
   ```
   `.env`는 `.gitignore`에 포함되어 있어 절대 올라가지 않습니다.

2. **GitHub Secret 등록** (저장소 Settings → Secrets and variables → Actions)
   - `MOLIT_API_KEY` = 공공데이터포털 서비스 키

   이 secret은 매일 새벽 GitHub Actions가 데이터를 수집할 때만 사용되고, Render 배포본에는 API 키가 전혀 필요하지 않습니다 (이미 수집된 데이터를 보여주기만 하므로).

3. **Render에 배포**
   - Render 대시보드에서 "New +" → "Blueprint"로 이 저장소를 연결하면 `render.yaml`을 읽어 자동으로 설정됩니다.
   - 또는 수동으로 "Web Service" 생성 시 Build Command `npm ci && npm run build`, Start Command `npm start` 로 지정하세요.
   - GitHub 저장소와 연결되어 있으면 매일 GitHub Actions가 새 데이터를 커밋할 때마다 Render가 자동으로 재배포합니다.

4. **워크플로우 수동 실행**: GitHub 저장소의 Actions 탭 → "Update apartment trade data" → "Run workflow"로 언제든 즉시 수집을 실행할 수 있습니다.
