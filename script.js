const quotes = [
  {
    text: "삶이 있는 한 희망은 있다.",
    original: "Dum spiro, spero.",
    originalLang: "la",
    figureNameKo: "키케로",
    achievementKo: "로마의 정치가·사상가, 스토아적 윤리와 법철학에 큰 영향",
    birthYear: -106,
    deathYear: -43,
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
    imageAlt: "산맥 위로 비치는 햇빛",
  },
  {
    text: "산다는 것, 그것은 천천히 태어나는 것이다.",
    original: "To live is to slowly be born.",
    originalLang: "en",
    figureNameKo: "장 폴 샤르트르",
    achievementKo: "실존주의 철학자·작가, ‘실존은 본질에 앞선다’로 잘 알려짐",
    birthYear: 1905,
    deathYear: 1980,
    image:
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
    imageAlt: "안개 낀 숲과 부드러운 빛",
  },
  {
    text: "행동은 모든 성공의 가장 기초적인 열쇠다.",
    original: "Action is the foundational key to all success.",
    originalLang: "en",
    figureNameKo: "파블로 피카소",
    achievementKo: "스페인 출신 조형 화가, 입체파 등 현대미술의 흐름을 개척",
    birthYear: 1881,
    deathYear: 1973,
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80",
    imageAlt: "팔레트와 붓이 있는 창작 공간",
  },
  {
    text: "오늘 할 수 있는 일을 내일로 미루지 마라.",
    original: "Never leave that till tomorrow which you can do today.",
    originalLang: "en",
    figureNameKo: "벤저민 프랭클린",
    achievementKo: "미국의 건국 지도자·과학자·저술가, 계몽사상을 대표",
    birthYear: 1706,
    deathYear: 1790,
    image:
      "https://images.unsplash.com/photo-1501139083538-0139583c060f?auto=format&fit=crop&w=800&q=80",
    imageAlt: "별이 가득한 밤하늘과 시간의 흐름",
  },
  {
    text: "실패는 성공으로 가는 길 위의 작은 정류장일 뿐이다.",
    original: "Failure is a bend in the road, not the end of the road.",
    originalLang: "en",
    figureNameKo: "헨리 포드",
    achievementKo: "미국의 자동차 산업가, 대량생산 라인으로 대중화를 이끔",
    birthYear: 1863,
    deathYear: 1947,
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
    imageAlt: "숲 속으로 이어지는 길",
  },
  {
    text: "당신이 할 수 있다고 믿든 할 수 없다고 믿든, 믿는 대로 될 것이다.",
    original: "Whether you think you can, or you think you can't — you're right.",
    originalLang: "en",
    figureNameKo: "헨리 포드",
    achievementKo: "미국의 자동차 산업가, 대량생산 라인으로 대중화를 이끔",
    birthYear: 1863,
    deathYear: 1947,
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    imageAlt: "높은 산봉우리와 구름",
  },
  {
    text: "위대한 일은 작은 일들을 꾸준히 쌓아 올릴 때 이루어진다.",
    original: "Great things are not done by impulse, but by a series of small things brought together.",
    originalLang: "en",
    figureNameKo: "빈센트 반 고흐",
    achievementKo: "네덜란드의 후기 인상주의 화가, 강렬한 색채와 붓터치로 회화사에 남음",
    birthYear: 1853,
    deathYear: 1890,
    image:
      "https://images.unsplash.com/photo-1579783902614-a37fb20d6b9a?auto=format&fit=crop&w=800&q=80",
    imageAlt: "수채화풍 추상 색면",
  },
];

const heroPool = quotes.map((q) => ({ image: q.image, imageAlt: q.imageAlt }));

const primaryTypeClasses = ["type-ko-a", "type-ko-b", "type-ko-c"];

let toastTimer;
let toastHideTimer;
let lastLocalQuoteIndex = -1;

function randomPastelBackground() {
  const hue = Math.floor(Math.random() * 360);
  const sat = 18 + Math.floor(Math.random() * 14);
  const light = 94 + Math.floor(Math.random() * 4);
  return `hsl(${hue} ${sat}% ${light}%)`;
}

function formatYear(y) {
  if (y === null || y === undefined || Number.isNaN(y)) {
    return "?";
  }
  if (y < 0) {
    return `기원전 ${Math.abs(y)}년`;
  }
  return `${y}년`;
}

function formatLifeRange(birthYear, deathYear) {
  if (
    (birthYear === null || birthYear === undefined) &&
    (deathYear === null || deathYear === undefined)
  ) {
    return "생몰년 미상";
  }
  if (birthYear === null || birthYear === undefined) {
    return `? ~ ${formatYear(deathYear)}`;
  }
  if (deathYear === null || deathYear === undefined) {
    return `${formatYear(birthYear)} ~ ?`;
  }
  return `${formatYear(birthYear)} ~ ${formatYear(deathYear)}`;
}

function formatFigureLine(figureNameKo, achievementKo, birthYear, deathYear) {
  const name = figureNameKo?.trim() || "이름 미상";
  const ach = achievementKo?.trim() || "주요 업적 정보 없음";
  const years = formatLifeRange(birthYear, deathYear);
  return `${name} / ${ach} / ${years}`;
}

function pickRandomQuote() {
  if (quotes.length === 0) {
    return null;
  }
  if (quotes.length === 1) {
    lastLocalQuoteIndex = 0;
    return quotes[0];
  }
  let index = Math.floor(Math.random() * quotes.length);
  let guard = 0;
  while (index === lastLocalQuoteIndex && guard < 32) {
    index = Math.floor(Math.random() * quotes.length);
    guard += 1;
  }
  lastLocalQuoteIndex = index;
  return quotes[index];
}

function pickRandomHero() {
  return heroPool[Math.floor(Math.random() * heroPool.length)];
}

function setPrimaryFontClass(el, className) {
  primaryTypeClasses.forEach((c) => el.classList.remove(c));
  el.classList.add(className);
}

function renderCard(payload) {
  const quoteEl = document.getElementById("quote-text");
  const originalEl = document.getElementById("quote-original");
  const originalBlock = document.getElementById("original-block");
  const figureMeta = document.getElementById("figure-meta");
  const imgEl = document.getElementById("quote-image");

  if (!quoteEl || !originalEl || !figureMeta) {
    return;
  }

  const fontClass = primaryTypeClasses[Math.floor(Math.random() * primaryTypeClasses.length)];
  quoteEl.className = "surface__text surface__text--primary";
  setPrimaryFontClass(quoteEl, fontClass);

  quoteEl.textContent = payload.text || "";
  const originalText = payload.original || "";
  originalEl.textContent = originalText;
  if (originalBlock) {
    originalBlock.classList.toggle("is-empty", !originalText.trim());
  }

  if (payload.originalLang) {
    originalEl.lang = payload.originalLang;
  } else if (/[가-힣]/.test(originalText)) {
    originalEl.lang = "ko";
  } else {
    originalEl.lang = "en";
  }

  figureMeta.textContent = formatFigureLine(
    payload.figureNameKo,
    payload.achievementKo,
    payload.birthYear,
    payload.deathYear,
  );

  if (imgEl && payload.image) {
    imgEl.src = payload.image;
    imgEl.alt = payload.imageAlt || "";
  }

  document.body.style.backgroundColor = randomPastelBackground();
}

function generateLocalQuote() {
  const selected = pickRandomQuote();
  if (selected) {
    renderCard(selected);
  }
}

function toIntOrNull(value) {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && /^-?\d+$/.test(value.trim())) {
    return parseInt(value, 10);
  }
  return null;
}

function normalizeWisdom(w) {
  if (!w || typeof w !== "object") {
    return null;
  }
  const hero = pickRandomHero();
  return {
    text: String(w.text ?? "").trim(),
    original: String(w.original ?? "").trim(),
    originalLang: w.originalLang ? String(w.originalLang).trim() : undefined,
    figureNameKo: String(w.figureNameKo ?? "").trim(),
    achievementKo: String(w.achievementKo ?? "").trim(),
    birthYear: toIntOrNull(w.birthYear),
    deathYear: toIntOrNull(w.deathYear),
    image: hero.image,
    imageAlt: hero.imageAlt,
  };
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) {
    return;
  }
  clearTimeout(toastTimer);
  clearTimeout(toastHideTimer);
  toast.textContent = message;
  toast.hidden = false;
  requestAnimationFrame(() => {
    toast.classList.add("is-visible");
  });
  toastTimer = setTimeout(() => {
    toast.classList.remove("is-visible");
    toastHideTimer = setTimeout(() => {
      toast.hidden = true;
    }, 320);
  }, 2600);
}

async function copyPageUrl() {
  const url = window.location.href;
  try {
    await navigator.clipboard.writeText(url);
    showToast("Link copied.");
    return;
  } catch {
    /* fallback */
  }

  try {
    const ta = document.createElement("textarea");
    ta.value = url;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    showToast(ok ? "Link copied." : "Could not copy.");
  } catch {
    showToast("Could not copy.");
  }
}

function setLoading(isLoading) {
  const generateBtn = document.getElementById("generate-btn");
  const shareBtn = document.getElementById("share-btn");
  if (generateBtn) {
    generateBtn.disabled = isLoading;
    generateBtn.textContent = isLoading ? "…" : "new wisdom";
  }
  if (shareBtn) {
    shareBtn.disabled = isLoading;
  }
}

function showApiErrorAndFallback(message) {
  showToast(message);
  generateLocalQuote();
}

async function fetchWisdomFromApi() {
  setLoading(true);
  try {
    const res = await fetch("/api/wisdom", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      if (res.status === 404) {
        showApiErrorAndFallback(
          "API를 찾을 수 없어요. `quote-generator`에서 `node server.mjs` 실행 후 표시된 주소(예: http://localhost:8787)로 열어주세요.",
        );
        return;
      }
      if (res.status === 503) {
        showApiErrorAndFallback(
          "서버에 OPENAI_API_KEY가 없어요. quote-generator/.env 파일을 저장한 뒤 서버를 다시 켜 주세요.",
        );
        return;
      }
      const detail =
        typeof data.error === "string" ? data.error.trim() : `HTTP ${res.status}`;
      showApiErrorAndFallback(
        detail.length > 100
          ? `AI 호출에 실패했어요. 저장된 명언으로 대체합니다. (${detail.slice(0, 97)}…)`
          : `AI 호출에 실패했어요. 저장된 명언으로 대체합니다. (${detail})`,
      );
      return;
    }
    const wisdom = normalizeWisdom(data.wisdom);
    if (!wisdom || !wisdom.text) {
      showApiErrorAndFallback("응답 형식이 올바르지 않아요. 저장된 명언으로 대체합니다.");
      return;
    }
    renderCard(wisdom);
  } catch {
    showApiErrorAndFallback(
      "네트워크 오류예요. Node 서버로 띄운 주소에서 페이지를 열었는지 확인해 주세요.",
    );
  } finally {
    setLoading(false);
  }
}

function init() {
  const generateBtn = document.getElementById("generate-btn");
  const shareBtn = document.getElementById("share-btn");

  if (generateBtn) {
    generateBtn.addEventListener("click", fetchWisdomFromApi);
  }
  if (shareBtn) {
    shareBtn.addEventListener("click", copyPageUrl);
  }

  generateLocalQuote();
}

document.addEventListener("DOMContentLoaded", init);
