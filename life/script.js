const WEEKS_PER_YEAR = 52;
const STORAGE_KEY = "life-in-weeks";

const introEl = document.getElementById("intro");
const resultEl = document.getElementById("result");
const formEl = document.getElementById("lifeForm");
const birthdateInput = document.getElementById("birthdate");
const lifespanInput = document.getElementById("lifespan");
const editBtn = document.getElementById("editBtn");

const yearLabelsEl = document.getElementById("yearLabels");
const weekGridEl = document.getElementById("weekGrid");
const statLivedEl = document.getElementById("statLived");
const statPercentEl = document.getElementById("statPercent");
const statLeftEl = document.getElementById("statLeft");
const footnoteEl = document.getElementById("footnote");
const fortuneDayEl = document.getElementById("fortuneDay");
const fortuneZodiacEl = document.getElementById("fortuneZodiac");
const fortuneAnimalEl = document.getElementById("fortuneAnimal");
const fortuneQuoteEl = document.getElementById("fortuneQuote");

// ---------- ข้อมูลดูดวง (เอาไว้สนุกๆ) ----------
const THAI_DAYS = [
  { name: "อาทิตย์", color: "สีแดง", planet: "พระอาทิตย์" },
  { name: "จันทร์", color: "สีเหลือง", planet: "พระจันทร์" },
  { name: "อังคาร", color: "สีชมพู", planet: "พระอังคาร" },
  { name: "พุธ", color: "สีเขียว", planet: "พระพุธ" },
  { name: "พฤหัสบดี", color: "สีส้ม", planet: "พระพฤหัสบดี" },
  { name: "ศุกร์", color: "สีฟ้า", planet: "พระศุกร์" },
  { name: "เสาร์", color: "สีม่วง", planet: "พระเสาร์" },
];

const ZODIAC_SIGNS = [
  { name: "มังกร", until: [1, 19] },
  { name: "กุมภ์", until: [2, 18] },
  { name: "มีน", until: [3, 20] },
  { name: "เมษ", until: [4, 19] },
  { name: "พฤษภ", until: [5, 20] },
  { name: "เมถุน", until: [6, 20] },
  { name: "กรกฎ", until: [7, 22] },
  { name: "สิงห์", until: [8, 22] },
  { name: "กันย์", until: [9, 22] },
  { name: "ตุลย์", until: [10, 22] },
  { name: "พิจิก", until: [11, 21] },
  { name: "ธนู", until: [12, 21] },
  { name: "มังกร", until: [12, 31] },
];

const CHINESE_ZODIAC = [
  "ชวด (หนู)", "ฉลู (วัว)", "ขาล (เสือ)", "เถาะ (กระต่าย)",
  "มะโรง (งูใหญ่/มังกร)", "มะเส็ง (งูเล็ก)", "มะเมีย (ม้า)", "มะแม (แพะ)",
  "วอก (ลิง)", "ระกา (ไก่)", "จอ (หมา)", "กุน (หมู)",
];

const FORTUNE_QUOTES = [
  "วันนี้เหมาะกับการเริ่มทำสิ่งที่ผัดวันประกันพรุ่งมานาน (ใช่ อันนั้นแหละ)",
  "ระวังของหายเล็กน้อย โดยเฉพาะแบตมือถือกับสมาธิ",
  "จะมีคนทักมาทัก แต่คุณอาจจะยังไม่เห็นข้อความ",
  "โชคด้านการเงินกลางๆ — กาแฟแก้วนี้ยังซื้อไหวอยู่",
  "เหมาะกับการนอนเพิ่มอีกสักงีบ เพื่อสุขภาพจิตที่ดีขึ้น 20%",
  "มีโอกาสเจอไอเดียดีๆ ระหว่างอาบน้ำ อย่าลืมจดไว้",
  "ดวงความรักวันนี้: รักตัวเองไปก่อนก็พอ",
  "การงานราบรื่น ถ้าไม่เลื่อนประชุมไปมาเกิน 3 รอบ",
  "วันนี้เหมาะกับการลบแอปที่ไม่ได้ใช้แล้วสักแอปสองแอป",
  "มีลุ้นเรื่องอาหารอร่อยโดยไม่ได้ตั้งใจ",
  "เลขนำโชค: จำนวนสัปดาห์ที่คุณผ่านมาแล้วนั่นแหละ",
  "วันนี้จักรวาลไม่ได้วางแผนอะไรเป็นพิเศษให้คุณ ทำตามใจตัวเองไปเลย",
];

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function getFortune(birthdate) {
  const dayOfWeek = THAI_DAYS[birthdate.getDay()];
  const month = birthdate.getMonth() + 1;
  const date = birthdate.getDate();
  const zodiac = ZODIAC_SIGNS.find(
    (z) => month < z.until[0] || (month === z.until[0] && date <= z.until[1]),
  ) || ZODIAC_SIGNS[ZODIAC_SIGNS.length - 1];
  const animalIndex = (((birthdate.getFullYear() - 4) % 12) + 12) % 12;
  const animal = CHINESE_ZODIAC[animalIndex];
  const quote =
    FORTUNE_QUOTES[hashString(birthdate.toISOString().slice(0, 10)) % FORTUNE_QUOTES.length];
  return { dayOfWeek, zodiac: zodiac.name, animal, quote };
}

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function save(birthdate, lifespan) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ birthdate, lifespan }));
  } catch {
    // localStorage อาจใช้ไม่ได้ (private mode ฯลฯ) — ไม่เป็นไร แค่ไม่จำค่าไว้
  }
}

function weeksBetween(a, b) {
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  return Math.floor((b.getTime() - a.getTime()) / msPerWeek);
}

function render(birthdateStr, lifespanYears) {
  const birthdate = new Date(birthdateStr + "T00:00:00");
  const now = new Date();
  const weeksLived = Math.max(0, weeksBetween(birthdate, now));
  const totalWeeks = lifespanYears * WEEKS_PER_YEAR;
  const percent = Math.min(100, (weeksLived / totalWeeks) * 100);
  const weeksLeft = Math.max(0, totalWeeks - weeksLived);

  statLivedEl.textContent = weeksLived.toLocaleString("th-TH");
  statPercentEl.textContent = `${percent.toFixed(1)}%`;
  statLeftEl.textContent = weeksLeft.toLocaleString("th-TH");

  const fortune = getFortune(birthdate);
  fortuneDayEl.textContent = `วัน${fortune.dayOfWeek.name} (${fortune.dayOfWeek.color})`;
  fortuneZodiacEl.textContent = `ราศี${fortune.zodiac}`;
  fortuneAnimalEl.textContent = `ปี${fortune.animal}`;
  fortuneQuoteEl.textContent = `"${fortune.quote}"`;

  // เว้นระยะ cell ตามความกว้างจอ ให้กริดพอดีไม่ล้น
  const cellPx = window.innerWidth < 480 ? 5 : window.innerWidth < 700 ? 6 : 7;
  document.documentElement.style.setProperty("--cell", `${cellPx}px`);

  yearLabelsEl.innerHTML = "";
  weekGridEl.innerHTML = "";

  const frag = document.createDocumentFragment();
  for (let y = 0; y < lifespanYears; y++) {
    const label = document.createElement("span");
    label.textContent = y % 5 === 0 ? String(y) : "";
    frag.appendChild(label);
  }
  yearLabelsEl.appendChild(frag);

  const gridFrag = document.createDocumentFragment();
  for (let i = 0; i < totalWeeks; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    if (i < weeksLived) cell.className += " lived";
    else if (i === weeksLived) cell.className += " now";
    gridFrag.appendChild(cell);
  }
  weekGridEl.appendChild(gridFrag);

  const years = Math.floor(weeksLived / WEEKS_PER_YEAR);
  const remWeeks = weeksLived % WEEKS_PER_YEAR;
  const yearsLeft = Math.floor(weeksLeft / WEEKS_PER_YEAR);

  if (weeksLived >= totalWeeks) {
    footnoteEl.textContent =
      "คุณผ่านมาไกลกว่าที่ตั้งเป้าไว้แล้วครับ — ลองปรับตัวเลขอายุที่คาดไว้ให้มากขึ้นดูได้นะ";
  } else {
    footnoteEl.textContent = `ผ่านมาแล้วประมาณ ${years} ปี ${remWeeks} สัปดาห์ · เหลืออีกประมาณ ${yearsLeft} ปี ถ้าทุกอย่างเป็นไปตามที่วางแผนไว้ — ใช้มันให้คุ้มครับ 💛`;
  }
}

function showResult(birthdateStr, lifespanYears) {
  render(birthdateStr, lifespanYears);
  introEl.hidden = true;
  resultEl.hidden = false;
  window.scrollTo({ top: 0 });
}

formEl.addEventListener("submit", (e) => {
  e.preventDefault();
  const birthdateStr = birthdateInput.value;
  const lifespanYears = parseInt(lifespanInput.value, 10);
  if (!birthdateStr || !lifespanYears) return;
  save(birthdateStr, lifespanYears);
  showResult(birthdateStr, lifespanYears);
});

editBtn.addEventListener("click", () => {
  resultEl.hidden = true;
  introEl.hidden = false;
});

window.addEventListener("resize", () => {
  if (!resultEl.hidden) {
    render(birthdateInput.value, parseInt(lifespanInput.value, 10));
  }
});

// เติมค่าที่เคยกรอกไว้ (เก็บในเบราว์เซอร์ตัวเองเท่านั้น)
const saved = loadSaved();
if (saved && saved.birthdate) {
  birthdateInput.value = saved.birthdate;
  lifespanInput.value = saved.lifespan;
}
