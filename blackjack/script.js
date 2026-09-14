(function () {
  "use strict";

  // ============================================================
  //  เจ้ามือใจร้าย — แบล็คแจ็คกติกาโต๊ะจริง
  //  6 สำรับ · เจ้ามือหยุดที่ 17 ทุกกรณี (S17) · แบล็คแจ็คจ่าย 3:2
  //  ดับเบิลดาวน์ · แยกไพ่สูงสุด 4 มือ (ดับเบิลหลังแยกได้) · ประกัน · ยอมแพ้
  // ============================================================

  var SUITS = [
    { id: "spade", symbol: "♠", red: false },
    { id: "heart", symbol: "♥", red: true },
    { id: "diamond", symbol: "♦", red: true },
    { id: "club", symbol: "♣", red: false },
  ];
  var RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

  var DECKS = 6;
  var RESHUFFLE_RATIO = 0.25; // เหลือไพ่น้อยกว่า 25% ของกองแล้วสับใหม่
  var MAX_HANDS = 4; // แยกไพ่ได้สูงสุด 4 มือ
  var DEALER_STANDS_AT = 17;
  var STARTING_BANKROLL = 1000;
  var BROKE_BONUS = 500;
  var MIN_CHIP = 25; // ชิปที่เล็กที่สุดบนโต๊ะ — ถ้าเงินเหลือน้อยกว่านี้ถือว่าเล่นต่อไม่ไหวแล้ว
  var STORE_KEY = "vpk-blackjack-v1";

  var SPEEDS = {
    slow: { label: "ช้า", deal: 420, dealer: 780 },
    normal: { label: "ปกติ", deal: 230, dealer: 520 },
    fast: { label: "เร็ว", deal: 90, dealer: 240 },
  };
  var SPEED_ORDER = ["slow", "normal", "fast"];

  var BADGES = [
    { id: "first_bj", emoji: "🃏", label: "แบล็คแจ็คแรก" },
    { id: "streak5", emoji: "🔥", label: "ชนะติดกัน 5 ตา" },
    { id: "split_win", emoji: "✌️", label: "แยกไพ่แล้วชนะทุกมือ" },
    { id: "five_card", emoji: "🖐️", label: "5 ใบไม่แตก" },
    { id: "double_win", emoji: "💥", label: "ดับเบิลแล้วชนะ" },
    { id: "insurance_win", emoji: "🛡️", label: "ประกันคุ้ม" },
    { id: "high_roller", emoji: "🤑", label: "เดิมพันตาเดียว ฿1,000" },
    { id: "rich", emoji: "💰", label: "เงินแตะ ฿5,000" },
    { id: "comeback", emoji: "💪", label: "หมดตัวแล้วไต่กลับถึง ฿1,000" },
    { id: "veteran", emoji: "🎖️", label: "เล่นครบ 50 ตา" },
  ];

  // ---------- ค่าและแต้มของไพ่ ----------
  function rankValue(rank) {
    if (rank === "A") return 11;
    if (rank === "K" || rank === "Q" || rank === "J" || rank === "10") return 10;
    return Number(rank);
  }

  /** แต้มรวมของมือ — A นับ 11 ก่อนแล้วลดเป็น 1 เมื่อเกิน 21 (soft = ยังมี A ที่นับ 11 อยู่) */
  function handValue(cards) {
    var total = 0;
    var aces = 0;
    cards.forEach(function (card) {
      total += rankValue(card.rank);
      if (card.rank === "A") aces += 1;
    });
    while (total > 21 && aces > 0) { total -= 10; aces -= 1; }
    return { total: total, soft: aces > 0 };
  }

  /** แบล็คแจ็คจริง = 21 จากสองใบแรกที่ไม่ได้มาจากการแยกไพ่ */
  function isBlackjack(hand) {
    return !hand.fromSplit && hand.cards.length === 2 && handValue(hand.cards).total === 21;
  }

  function newShoe() {
    var shoe = [];
    for (var d = 0; d < DECKS; d++) {
      SUITS.forEach(function (suit) {
        RANKS.forEach(function (rank) { shoe.push({ rank: rank, suit: suit }); });
      });
    }
    for (var i = shoe.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = shoe[i];
      shoe[i] = shoe[j];
      shoe[j] = tmp;
    }
    return shoe;
  }

  // ---------- นับไพ่ระบบ Hi-Lo ----------
  // 2-6 = +1 (ไพ่เล็กหมดไป ดีกับผู้เล่น) · 7-9 = 0 · 10/J/Q/K/A = -1
  function hiLoValue(card) {
    var v = rankValue(card.rank);
    if (v >= 2 && v <= 6) return 1;
    if (v >= 10) return -1;
    return 0;
  }

  // ---------- บันทึกลงเครื่อง ----------
  function defaultStats() {
    return { rounds: 0, wins: 0, losses: 0, pushes: 0, streak: 0, bestStreak: 0, peak: STARTING_BANKROLL, blackjacks: 0, biggestWin: 0 };
  }

  function loadSaved() {
    var fallback = {
      bankroll: STARTING_BANKROLL,
      deposited: STARTING_BANKROLL,
      lastBet: 0,
      tookBonus: false,
      stats: defaultStats(),
      badges: {},
      history: [],
      settings: { sound: true, coach: false, count: false, speed: "normal" },
    };
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return fallback;
      var saved = JSON.parse(raw);
      if (!saved || typeof saved !== "object") return fallback;
      var stats = defaultStats();
      if (saved.stats && typeof saved.stats === "object") {
        Object.keys(stats).forEach(function (k) {
          if (typeof saved.stats[k] === "number" && isFinite(saved.stats[k])) stats[k] = saved.stats[k];
        });
      }
      var settings = fallback.settings;
      if (saved.settings && typeof saved.settings === "object") {
        settings = {
          sound: saved.settings.sound !== false,
          coach: saved.settings.coach === true,
          count: saved.settings.count === true,
          speed: SPEEDS[saved.settings.speed] ? saved.settings.speed : "normal",
        };
      }
      return {
        bankroll: typeof saved.bankroll === "number" && isFinite(saved.bankroll) && saved.bankroll >= 0 ? saved.bankroll : STARTING_BANKROLL,
        deposited: typeof saved.deposited === "number" && isFinite(saved.deposited) ? saved.deposited : STARTING_BANKROLL,
        lastBet: typeof saved.lastBet === "number" && isFinite(saved.lastBet) && saved.lastBet >= 0 ? saved.lastBet : 0,
        tookBonus: saved.tookBonus === true,
        stats: stats,
        badges: saved.badges && typeof saved.badges === "object" ? saved.badges : {},
        history: Array.isArray(saved.history) ? saved.history.slice(-10) : [],
        settings: settings,
      };
    } catch (e) {
      return fallback;
    }
  }

  function save() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({
        bankroll: state.bankroll,
        deposited: state.deposited,
        lastBet: state.lastBet,
        tookBonus: state.tookBonus,
        stats: state.stats,
        badges: state.badges,
        history: state.history,
        settings: state.settings,
      }));
    } catch (e) {}
  }

  var saved = loadSaved();

  var state = {
    phase: "betting", // betting | dealing | insurance | player | dealer | settled
    bankroll: saved.bankroll,
    deposited: saved.deposited,
    bet: 0,
    lastBet: saved.lastBet,
    tookBonus: saved.tookBonus,
    shoe: newShoe(),
    count: 0,
    hands: [],
    active: 0,
    dealer: [],
    dealerShown: 0,
    holeRevealShown: false,
    holeHidden: true,
    busy: false, // กำลังแจกไพ่ค้างอยู่ — ล็อกปุ่มไว้ก่อน
    insurance: 0,
    roundWagered: 0,
    stats: saved.stats,
    badges: saved.badges,
    history: saved.history,
    settings: saved.settings,
    timers: [],
    newBadges: {},
  };

  var els = {};
  [
    "bankroll", "betDisplay", "netDisplay", "dealerScore", "dealerCards", "shoeInfo",
    "playerSeats", "message", "bettingPanel", "chipRow", "clearBetBtn", "rebetBtn",
    "allInBtn", "dealBtn", "brokeBtn", "insurancePanel", "insuranceYesBtn", "insuranceNoBtn",
    "insuranceCost", "actionPanel", "hitBtn", "standBtn", "doubleBtn", "splitBtn",
    "surrenderBtn", "coachTip", "countInfo", "soundToggle", "coachToggle", "countToggle",
    "speedToggle", "history", "statHands", "statWinRate", "statStreak", "statPeak",
    "statBj", "statBiggest", "badges", "badgeCount", "resetBtn",
  ].forEach(function (id) { els[id] = document.getElementById(id); });

  // ---------- จังหวะเวลา ----------
  function speed() { return SPEEDS[state.settings.speed] || SPEEDS.normal; }

  function later(fn, ms) {
    var t = setTimeout(fn, ms);
    state.timers.push(t);
    return t;
  }

  function clearTimers() {
    state.timers.forEach(clearTimeout);
    state.timers = [];
  }

  // ---------- เสียง (สร้างสดด้วย Web Audio ไม่ต้องโหลดไฟล์) ----------
  var audioCtx = null;

  function beep(freq, dur, type, vol) {
    if (!state.settings.sound) return;
    try {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      if (!audioCtx) audioCtx = new Ctx();
      if (audioCtx.state === "suspended") audioCtx.resume();
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      osc.type = type || "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(vol || 0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + dur);
    } catch (e) {}
  }

  function chord(freqs, gap, dur, vol) {
    freqs.forEach(function (f, i) { later(function () { beep(f, dur, "sine", vol); }, i * gap); });
  }

  var SFX = {
    card: function () { beep(300, 0.07, "triangle", 0.05); },
    chip: function () { beep(780, 0.05, "square", 0.035); },
    win: function () { chord([523, 784], 110, 0.16, 0.06); },
    lose: function () { beep(200, 0.25, "sawtooth", 0.045); },
    push: function () { beep(420, 0.14, "sine", 0.04); },
    blackjack: function () { chord([523, 659, 784, 1047], 90, 0.18, 0.06); },
    badge: function () { chord([659, 880, 1175], 80, 0.16, 0.05); },
  };

  // ---------- ตำราเล่น (Basic Strategy: 6 สำรับ, S17, ดับเบิลหลังแยกได้) ----------
  function dealerUpValue() {
    return state.dealer.length ? rankValue(state.dealer[0].rank) : 0;
  }

  /**
   * ท่าที่ตำราแนะนำสำหรับมือนี้ โดยดูสิ่งที่ "ทำได้จริงตอนนี้" ด้วย (legal)
   * ถ้าดับเบิล/แยก/ยอมแพ้ไม่ได้ จะตกไปใช้ท่าสำรองตามตำราให้อัตโนมัติ
   */
  function strategyAction(cards, up, legal) {
    var hv = handValue(cards);

    if (legal.split && cards.length === 2 && rankValue(cards[0].rank) === rankValue(cards[1].rank)) {
      var pair = rankValue(cards[0].rank);
      if (pair === 11 || pair === 8) return "split";
      if (pair === 10) return "stand";
      if (pair === 9) return (up <= 6 || up === 8 || up === 9) ? "split" : "stand";
      if (pair === 7) return up <= 7 ? "split" : "hit";
      if (pair === 6) return up <= 6 ? "split" : "hit";
      if (pair === 4) return (up === 5 || up === 6) ? "split" : "hit";
      if (pair === 3 || pair === 2) return up <= 7 ? "split" : "hit";
      // คู่ 5 ไม่แยก — ใช้ตรรกะแต้มแข็ง 10 ด้านล่างแทน
    }

    if (legal.surrender && cards.length === 2 && !hv.soft) {
      if (hv.total === 16 && (up === 9 || up === 10 || up === 11)) return "surrender";
      if (hv.total === 15 && up === 10) return "surrender";
    }

    if (hv.soft) {
      if (hv.total >= 19) return "stand";
      if (hv.total === 18) {
        if (up >= 2 && up <= 6) return legal.double ? "double" : "stand";
        if (up === 7 || up === 8) return "stand";
        return "hit";
      }
      if (hv.total === 17) return (legal.double && up >= 3 && up <= 6) ? "double" : "hit";
      if (hv.total === 16 || hv.total === 15) return (legal.double && up >= 4 && up <= 6) ? "double" : "hit";
      if (hv.total === 14 || hv.total === 13) return (legal.double && up >= 5 && up <= 6) ? "double" : "hit";
      return "hit";
    }

    if (hv.total >= 17) return "stand";
    if (hv.total >= 13) return up <= 6 ? "stand" : "hit";
    if (hv.total === 12) return (up >= 4 && up <= 6) ? "stand" : "hit";
    if (hv.total === 11) return (legal.double && up <= 10) ? "double" : "hit";
    if (hv.total === 10) return (legal.double && up <= 9) ? "double" : "hit";
    if (hv.total === 9) return (legal.double && up >= 3 && up <= 6) ? "double" : "hit";
    return "hit";
  }

  var ACTION_LABEL = {
    hit: "ขอเพิ่ม",
    stand: "พอแล้ว",
    double: "ดับเบิล",
    split: "แยกไพ่",
    surrender: "ยอมแพ้",
  };

  // ---------- ตัวช่วยแสดงผล ----------
  function money(amount) {
    var sign = amount < 0 ? "-" : "";
    return sign + "฿" + Math.abs(Math.round(amount)).toLocaleString("en-US");
  }

  function activeHand() { return state.hands[state.active] || null; }

  function decksLeft() { return Math.max(state.shoe.length / 52, 0.25); }

  function trueCount() { return state.count / decksLeft(); }

  /** สิ่งที่มือปัจจุบันทำได้ตอนนี้ — ใช้ทั้งเปิด/ปิดปุ่มและป้อนให้ตำราคิดท่าสำรอง */
  function legalMoves(hand) {
    if (!hand || state.phase !== "player" || state.busy) return { hit: false, stand: false, double: false, split: false, surrender: false };
    var twoCards = hand.cards.length === 2;
    var pair = twoCards && rankValue(hand.cards[0].rank) === rankValue(hand.cards[1].rank);
    return {
      hit: !hand.splitAce,
      stand: true,
      double: twoCards && !hand.splitAce && state.bankroll >= hand.bet,
      split: pair && state.hands.length < MAX_HANDS && state.bankroll >= hand.bet,
      surrender: twoCards && state.hands.length === 1 && !hand.fromSplit,
    };
  }

  function cardEl(card, faceDown, isNew) {
    var el = document.createElement("div");
    el.className = "card" + (faceDown ? " is-back" : card.suit.red ? " is-red" : "") + (isNew ? " is-new" : "");
    if (faceDown) {
      el.setAttribute("aria-label", "ไพ่คว่ำ");
      return el;
    }
    var rank = document.createElement("span");
    rank.className = "card-rank";
    rank.textContent = card.rank;
    var suit = document.createElement("span");
    suit.className = "card-suit";
    suit.textContent = card.suit.symbol;
    el.appendChild(rank);
    el.appendChild(suit);
    el.setAttribute("aria-label", card.rank + " " + card.suit.symbol);
    return el;
  }

  function scoreText(cards) {
    var hv = handValue(cards);
    if (hv.total > 21) return hv.total + " แตก!";
    return hv.total + (hv.soft && hv.total !== 21 ? " (อ่อน)" : "");
  }

  function renderHud() {
    els.bankroll.textContent = money(state.bankroll);
    els.betDisplay.textContent = money(state.phase === "betting" ? state.bet : state.roundWagered);
    els.betDisplay.classList.toggle("is-bet", (state.phase === "betting" ? state.bet : state.roundWagered) > 0);

    var net = state.bankroll - state.deposited;
    els.netDisplay.textContent = (net > 0 ? "+" : "") + money(net);
    els.netDisplay.classList.toggle("is-up", net > 0);
    els.netDisplay.classList.toggle("is-down", net < 0);
  }

  function flashHud(el) {
    el.classList.remove("is-flash");
    void el.offsetWidth; // บังคับให้เบราว์เซอร์เริ่มอนิเมชันใหม่
    el.classList.add("is-flash");
  }

  function renderDealer() {
    els.dealerCards.innerHTML = "";
    state.dealer.forEach(function (card, i) {
      var faceDown = state.holeHidden && i === 1;
      // เล่นอนิเมชันเฉพาะไพ่ใบที่เพิ่งแจก กับตอนพลิกไพ่คว่ำขึ้นมา
      var isNew = i >= state.dealerShown || (i === 1 && !faceDown && !state.holeRevealShown);
      els.dealerCards.appendChild(cardEl(card, faceDown, isNew));
    });
    state.dealerShown = state.dealer.length;
    if (!state.holeHidden) state.holeRevealShown = true;

    if (!state.dealer.length) els.dealerScore.textContent = "";
    else if (state.holeHidden) els.dealerScore.textContent = handValue([state.dealer[0]]).total + " + ?";
    else els.dealerScore.textContent = scoreText(state.dealer);
  }

  function renderHands() {
    els.playerSeats.innerHTML = "";
    if (!state.hands.length) {
      var placeholder = document.createElement("div");
      placeholder.className = "hand";
      var head = document.createElement("div");
      head.className = "hand-head";
      head.textContent = "🙋 คุณ";
      var row = document.createElement("div");
      row.className = "cards-row";
      placeholder.appendChild(head);
      placeholder.appendChild(row);
      els.playerSeats.appendChild(placeholder);
      return;
    }

    state.hands.forEach(function (hand, i) {
      var wrap = document.createElement("div");
      var cls = "hand";
      if (state.phase === "player" && i === state.active) cls += " is-active";
      if (hand.result === "win" || hand.result === "blackjack") cls += " is-won";
      else if (hand.result === "lose" || hand.result === "bust" || hand.result === "surrender") cls += " is-lost";
      else if (hand.result === "push") cls += " is-push";
      wrap.className = cls;

      var head = document.createElement("div");
      head.className = "hand-head";

      var who = document.createElement("span");
      who.textContent = state.hands.length > 1 ? "🙋 มือที่ " + (i + 1) : "🙋 คุณ";
      head.appendChild(who);

      var score = document.createElement("span");
      score.className = "seat-score";
      score.textContent = hand.cards.length ? scoreText(hand.cards) : "";
      head.appendChild(score);

      var bet = document.createElement("span");
      bet.className = "hand-bet";
      bet.textContent = money(hand.bet);
      head.appendChild(bet);

      if (hand.doubled) head.appendChild(tagEl("ดับเบิล", ""));
      if (isBlackjack(hand)) head.appendChild(tagEl("แบล็คแจ็ค!", "is-won"));
      if (hand.result === "win") head.appendChild(tagEl("ชนะ " + money(hand.payout - hand.bet), "is-won"));
      else if (hand.result === "blackjack") head.appendChild(tagEl("ชนะ " + money(hand.payout - hand.bet), "is-won"));
      else if (hand.result === "push") head.appendChild(tagEl("เสมอ", "is-push"));
      else if (hand.result === "bust") head.appendChild(tagEl("แตก -" + money(hand.bet), "is-lost"));
      else if (hand.result === "lose") head.appendChild(tagEl("แพ้ -" + money(hand.bet), "is-lost"));
      else if (hand.result === "surrender") head.appendChild(tagEl("ยอมแพ้ -" + money(hand.bet - hand.payout), "is-lost"));

      var row = document.createElement("div");
      row.className = "cards-row";
      hand.cards.forEach(function (card, ci) { row.appendChild(cardEl(card, false, ci >= hand.shown)); });
      hand.shown = hand.cards.length;

      wrap.appendChild(head);
      wrap.appendChild(row);
      els.playerSeats.appendChild(wrap);
    });
  }

  function tagEl(text, extra) {
    var el = document.createElement("span");
    el.className = "hand-tag" + (extra ? " " + extra : "");
    el.textContent = text;
    return el;
  }

  function setMessage(text, tone) {
    els.message.textContent = text;
    els.message.className = "table-message" + (tone ? " is-" + tone : "");
  }

  function renderShoeInfo() {
    var pct = Math.round((state.shoe.length / (DECKS * 52)) * 100);
    els.shoeInfo.textContent = "🎴 ไพ่ในกอง " + pct + "% · " + DECKS + " สำรับ";
  }

  function renderControls() {
    var betting = state.phase === "betting";
    els.bettingPanel.hidden = !betting;
    els.insurancePanel.hidden = state.phase !== "insurance";
    els.actionPanel.hidden = state.phase !== "player";

    if (betting) {
      els.chipRow.querySelectorAll("button[data-chip]").forEach(function (btn) {
        btn.disabled = state.bankroll < state.bet + Number(btn.dataset.chip);
      });
      els.dealBtn.disabled = state.bet <= 0;
      els.rebetBtn.disabled = state.lastBet <= 0 || state.bankroll < state.lastBet;
      els.clearBetBtn.disabled = state.bet <= 0;
      els.allInBtn.disabled = state.bankroll <= 0;
      els.brokeBtn.hidden = !(state.bankroll < MIN_CHIP && state.bet <= 0);
      els.dealBtn.textContent = state.stats.rounds > 0 ? "🃏 แจกไพ่ตาใหม่" : "🃏 แจกไพ่";
    }

    var hand = activeHand();
    var legal = legalMoves(hand);
    els.hitBtn.disabled = !legal.hit;
    els.standBtn.disabled = !legal.stand;
    els.doubleBtn.disabled = !legal.double;
    els.splitBtn.disabled = !legal.split;
    els.surrenderBtn.disabled = !legal.surrender;

    if (state.phase === "insurance") {
      els.insuranceCost.textContent = "(" + money(insuranceCost(state.hands[0].bet)) + ")";
      els.insuranceYesBtn.disabled = state.bankroll < insuranceCost(state.hands[0].bet);
    }
  }

  function renderCoach() {
    var hand = activeHand();
    var show = state.settings.coach && state.phase === "player" && hand;
    els.coachTip.hidden = !show;
    [els.hitBtn, els.standBtn, els.doubleBtn, els.splitBtn, els.surrenderBtn].forEach(function (btn) {
      btn.classList.remove("is-coached");
    });
    if (!show) return;

    var legal = legalMoves(hand);
    var action = strategyAction(hand.cards, dealerUpValue(), legal);
    els.coachTip.textContent = "🎓 ตำราแนะนำ: " + (ACTION_LABEL[action] || action) +
      " (มือคุณ " + scoreText(hand.cards) + " · เจ้ามือเปิด " + state.dealer[0].rank + ")";

    var btnFor = { hit: els.hitBtn, stand: els.standBtn, double: els.doubleBtn, split: els.splitBtn, surrender: els.surrenderBtn };
    if (btnFor[action] && !btnFor[action].disabled) btnFor[action].classList.add("is-coached");
  }

  function renderCount() {
    els.countInfo.hidden = !state.settings.count;
    if (!state.settings.count) return;
    var tc = trueCount();
    var mood = tc >= 2 ? "hot" : tc <= -2 ? "cold" : "";
    var advice = tc >= 2 ? "ไพ่ใหญ่เหลือเยอะ — ได้เปรียบผู้เล่น ลองเพิ่มเดิมพัน"
      : tc <= -2 ? "ไพ่เล็กเหลือเยอะ — เสียเปรียบ ลดเดิมพันไว้ก่อน"
      : "ยังกลางๆ เดิมพันตามปกติ";
    els.countInfo.innerHTML = "";
    var line = document.createElement("span");
    line.textContent = "🧮 Hi-Lo running " + (state.count > 0 ? "+" : "") + state.count +
      " · true " + (tc > 0 ? "+" : "") + tc.toFixed(1) +
      " · เหลือ " + decksLeft().toFixed(1) + " สำรับ — ";
    var tip = document.createElement("b");
    if (mood) tip.className = mood;
    tip.textContent = advice;
    els.countInfo.appendChild(line);
    els.countInfo.appendChild(tip);
  }

  function renderHistory() {
    els.history.innerHTML = "";
    if (!state.history.length) {
      var empty = document.createElement("span");
      empty.className = "history-empty";
      empty.textContent = "ยังไม่มี — เล่นตาแรกเลย";
      els.history.appendChild(empty);
      return;
    }
    state.history.forEach(function (result) {
      var dot = document.createElement("span");
      dot.className = "history-dot is-" + result;
      dot.textContent = result === "win" ? "ช" : result === "lose" ? "พ" : "ส";
      dot.title = result === "win" ? "ชนะ" : result === "lose" ? "แพ้" : "เสมอ";
      els.history.appendChild(dot);
    });
  }

  function renderStats() {
    var s = state.stats;
    var decided = s.wins + s.losses;
    els.statHands.textContent = s.rounds.toLocaleString("en-US");
    els.statWinRate.textContent = decided > 0 ? Math.round((s.wins / decided) * 100) + "%" : "0%";
    els.statStreak.textContent = s.bestStreak;
    els.statPeak.textContent = money(s.peak);
    els.statBj.textContent = s.blackjacks;
    els.statBiggest.textContent = money(s.biggestWin);
  }

  function renderBadges() {
    els.badges.innerHTML = "";
    var unlocked = 0;
    BADGES.forEach(function (badge) {
      var has = state.badges[badge.id] === true;
      if (has) unlocked += 1;
      var el = document.createElement("div");
      el.className = "badge" + (has ? " is-unlocked" : "") + (state.newBadges[badge.id] ? " is-new" : "");
      var emoji = document.createElement("span");
      emoji.className = "badge-emoji";
      emoji.textContent = badge.emoji;
      var label = document.createElement("span");
      label.textContent = badge.label;
      el.appendChild(emoji);
      el.appendChild(label);
      el.title = has ? "ปลดล็อกแล้ว" : "ยังไม่ปลดล็อก";
      els.badges.appendChild(el);
    });
    els.badgeCount.textContent = "(" + unlocked + "/" + BADGES.length + ")";
  }

  function renderSettings() {
    els.soundToggle.textContent = "🔊 เสียง: " + (state.settings.sound ? "เปิด" : "ปิด");
    els.soundToggle.classList.toggle("is-on", state.settings.sound);
    els.coachToggle.textContent = "🎓 โค้ช: " + (state.settings.coach ? "เปิด" : "ปิด");
    els.coachToggle.classList.toggle("is-on", state.settings.coach);
    els.countToggle.textContent = "🧮 นับไพ่: " + (state.settings.count ? "เปิด" : "ปิด");
    els.countToggle.classList.toggle("is-on", state.settings.count);
    els.speedToggle.textContent = "⏱️ ความเร็ว: " + speed().label;
  }

  function render() {
    renderHud();
    renderDealer();
    renderHands();
    renderShoeInfo();
    renderControls();
    renderCoach();
    renderCount();
  }

  // ---------- กองไพ่ ----------
  function maybeShuffle() {
    if (state.shoe.length >= DECKS * 52 * RESHUFFLE_RATIO) return false;
    state.shoe = newShoe();
    state.count = 0;
    return true;
  }

  /** จั่วไพ่ 1 ใบ — countIt = false สำหรับไพ่คว่ำ (ยังไม่เข้าการนับจนกว่าจะเปิด) */
  function draw(countIt) {
    if (!state.shoe.length) { state.shoe = newShoe(); state.count = 0; }
    var card = state.shoe.pop();
    if (countIt !== false) state.count += hiLoValue(card);
    return card;
  }

  /** ค่าประกัน = ครึ่งหนึ่งของเดิมพัน ปัดเป็นบาทเต็ม (กันเศษสตางค์ทำให้ยอดเงินไม่ตรงกับที่แสดง) */
  function insuranceCost(bet) { return Math.round(bet / 2); }

  function makeHand(bet) {
    return { cards: [], bet: bet, shown: 0, done: false, doubled: false, surrendered: false, fromSplit: false, splitAce: false, result: null, payout: 0 };
  }

  function revealHole() {
    if (!state.holeHidden) return;
    state.holeHidden = false;
    if (state.dealer[1]) state.count += hiLoValue(state.dealer[1]);
  }

  function runSteps(steps, done) {
    var i = 0;
    function next() {
      if (i >= steps.length) { done(); return; }
      steps[i]();
      i += 1;
      render();
      later(next, speed().deal);
    }
    next();
  }

  // ---------- เหรียญรางวัล ----------
  function unlock(id) {
    if (state.badges[id]) return;
    state.badges[id] = true;
    state.newBadges[id] = true;
    SFX.badge();
    renderBadges();
    save();
  }

  function newBadgeLabels() {
    return BADGES.filter(function (b) { return state.newBadges[b.id]; })
      .map(function (b) { return b.emoji + " " + b.label; });
  }

  // ---------- วางเดิมพัน ----------
  function addChip(amount) {
    if (state.phase !== "betting" || state.bankroll < state.bet + amount) return;
    state.bet += amount;
    SFX.chip();
    flashHud(els.betDisplay);
    render();
  }

  function clearBet() {
    if (state.phase !== "betting") return;
    state.bet = 0;
    render();
  }

  function rebet() {
    if (state.phase !== "betting" || !state.lastBet || state.bankroll < state.lastBet) return;
    state.bet = state.lastBet;
    SFX.chip();
    flashHud(els.betDisplay);
    render();
  }

  function allIn() {
    if (state.phase !== "betting" || state.bankroll <= 0) return;
    state.bet = state.bankroll;
    SFX.chip();
    flashHud(els.betDisplay);
    render();
  }

  function brokeBonus() {
    if (state.bankroll >= MIN_CHIP) return;
    state.bankroll += BROKE_BONUS;
    state.deposited += BROKE_BONUS;
    state.tookBonus = true;
    setMessage("เจ้ามือสงสาร โยนให้ " + money(BROKE_BONUS) + " ไปตั้งตัวใหม่ 😏 (นับเป็นเงินที่เติม กำไรสุทธิจึงลดลง)", "");
    save();
    render();
  }

  // ---------- เดินเกม ----------
  function deal() {
    if (state.phase !== "betting" || state.bet <= 0 || state.bet > state.bankroll) return;
    clearTimers();

    var shuffled = maybeShuffle();
    var bet = state.bet;
    state.bankroll -= bet;
    state.lastBet = bet;
    state.roundWagered = bet;
    state.bet = 0;
    state.insurance = 0;
    state.hands = [makeHand(bet)];
    state.active = 0;
    state.dealer = [];
    state.dealerShown = 0;
    state.holeRevealShown = false;
    state.holeHidden = true;
    state.busy = false;
    state.newBadges = {};
    state.phase = "dealing";
    if (bet >= 1000) unlock("high_roller");

    setMessage(shuffled ? "🎴 ไพ่ใกล้หมดกอง สับใหม่แล้วเริ่มกองใหม่..." : "กำลังแจกไพ่...", "");
    render();

    runSteps([
      function () { state.hands[0].cards.push(draw()); SFX.card(); },
      function () { state.dealer.push(draw()); SFX.card(); },
      function () { state.hands[0].cards.push(draw()); SFX.card(); },
      function () { state.dealer.push(draw(false)); SFX.card(); }, // ไพ่คว่ำ ยังไม่เข้าการนับ
    ], afterDeal);
  }

  function afterDeal() {
    var hand = state.hands[0];
    if (state.dealer[0].rank === "A" && state.bankroll >= insuranceCost(hand.bet)) {
      state.phase = "insurance";
      setMessage("🛡️ เจ้ามือเปิดเอซ — จะซื้อประกันไว้ก่อนไหม?", "");
      render();
      return;
    }
    resolveNaturals();
  }

  function takeInsurance(yes) {
    if (state.phase !== "insurance") return;
    if (yes) {
      var cost = insuranceCost(state.hands[0].bet);
      if (state.bankroll < cost) return;
      state.bankroll -= cost;
      state.insurance = cost;
      state.roundWagered += cost;
      SFX.chip();
    }
    resolveNaturals();
  }

  /** เช็คแบล็คแจ็คสองใบแรกของทั้งคู่ก่อนเริ่มเล่นจริง */
  function resolveNaturals() {
    var playerBJ = isBlackjack(state.hands[0]);
    var dealerBJ = state.dealer.length === 2 && handValue(state.dealer).total === 21;
    if (playerBJ || dealerBJ) {
      revealHole();
      render();
      later(settle, speed().deal);
      return;
    }
    startPlayerTurn();
  }

  function startPlayerTurn() {
    state.phase = "player";
    state.active = 0;
    focusHand();
  }

  /** ไปยังมือถัดไปที่ยังเล่นได้ — ถ้าหมดแล้วส่งต่อให้เจ้ามือ */
  function focusHand() {
    while (state.active < state.hands.length) {
      var hand = state.hands[state.active];
      if (hand.done) { state.active += 1; continue; }
      // มือที่แยกจากเอซได้ไพ่ใบเดียวแล้วจบเลย และ 21 ก็ไม่ต้องเล่นต่อ
      if ((hand.splitAce && hand.cards.length >= 2) || handValue(hand.cards).total >= 21) {
        hand.done = true;
        state.active += 1;
        continue;
      }
      break;
    }

    if (state.active >= state.hands.length) { dealerTurn(); return; }

    state.phase = "player";
    var current = state.hands[state.active];
    setMessage(
      (state.hands.length > 1 ? "ตาของมือที่ " + (state.active + 1) + " — " : "มือคุณ ") +
        scoreText(current.cards) + " · เจ้ามือเปิด " + state.dealer[0].rank,
      ""
    );
    render();
  }

  function hit() {
    if (state.phase !== "player") return;
    var hand = activeHand();
    if (!legalMoves(hand).hit) return;
    hand.cards.push(draw());
    SFX.card();

    var total = handValue(hand.cards).total;
    if (hand.cards.length >= 5 && total <= 21) unlock("five_card");

    if (total >= 21) {
      hand.done = true;
      state.busy = true;
      render();
      later(function () { state.busy = false; focusHand(); }, speed().deal);
      return;
    }
    render();
  }

  function stand() {
    if (state.phase !== "player") return;
    var hand = activeHand();
    if (!hand) return;
    hand.done = true;
    focusHand();
  }

  function double() {
    if (state.phase !== "player") return;
    var hand = activeHand();
    if (!legalMoves(hand).double) return;
    state.bankroll -= hand.bet;
    state.roundWagered += hand.bet;
    hand.bet *= 2;
    hand.doubled = true;
    SFX.chip();
    hand.cards.push(draw());
    SFX.card();
    hand.done = true;
    state.busy = true;
    render();
    later(function () { state.busy = false; focusHand(); }, speed().deal);
  }

  function split() {
    if (state.phase !== "player") return;
    var hand = activeHand();
    if (!legalMoves(hand).split) return;

    state.bankroll -= hand.bet;
    state.roundWagered += hand.bet;
    SFX.chip();

    var moved = hand.cards.pop();
    var isAce = moved.rank === "A";
    hand.fromSplit = true;
    hand.splitAce = isAce;

    var extra = makeHand(hand.bet);
    extra.cards = [moved];
    extra.fromSplit = true;
    extra.splitAce = isAce;
    state.hands.splice(state.active + 1, 0, extra);
    state.busy = true;
    render();

    // แจกไพ่ใบที่สองให้ทั้งสองมือทีละใบ
    later(function () {
      hand.cards.push(draw());
      SFX.card();
      render();
      later(function () {
        extra.cards.push(draw());
        SFX.card();
        render();
        state.busy = false;
        focusHand();
      }, speed().deal);
    }, speed().deal);
  }

  function surrender() {
    if (state.phase !== "player") return;
    var hand = activeHand();
    if (!legalMoves(hand).surrender) return;
    hand.surrendered = true;
    hand.done = true;
    state.busy = true;
    state.phase = "dealer";
    render();
    later(function () { revealHole(); render(); later(settle, speed().deal); }, speed().deal);
  }

  function dealerTurn() {
    state.phase = "dealer";
    revealHole();
    render();

    var anyLive = state.hands.some(function (h) {
      return !h.surrendered && handValue(h.cards).total <= 21;
    });
    if (!anyLive) { later(settle, speed().deal); return; }

    setMessage("เจ้ามือเปิดไพ่...", "");

    function step() {
      if (handValue(state.dealer).total < DEALER_STANDS_AT) {
        state.dealer.push(draw());
        SFX.card();
        render();
        later(step, speed().dealer);
        return;
      }
      settle();
    }
    later(step, speed().dealer);
  }

  // ---------- สรุปผลและจ่ายเงิน ----------
  function settle() {
    revealHole();

    var dealerTotal = handValue(state.dealer).total;
    var dealerBJ = state.dealer.length === 2 && dealerTotal === 21;
    var returned = 0;
    var insuranceWon = false;

    if (state.insurance > 0 && dealerBJ) {
      returned += state.insurance * 3; // คืนค่าประกัน + กำไร 2:1
      insuranceWon = true;
    }

    state.hands.forEach(function (hand) {
      var total = handValue(hand.cards).total;
      var playerBJ = isBlackjack(hand);

      if (hand.surrendered) { hand.result = "surrender"; hand.payout = Math.round(hand.bet / 2); }
      else if (total > 21) { hand.result = "bust"; hand.payout = 0; }
      else if (playerBJ && dealerBJ) { hand.result = "push"; hand.payout = hand.bet; }
      else if (playerBJ) { hand.result = "blackjack"; hand.payout = hand.bet + Math.round(hand.bet * 1.5); }
      else if (dealerBJ) { hand.result = "lose"; hand.payout = 0; }
      else if (dealerTotal > 21 || total > dealerTotal) { hand.result = "win"; hand.payout = hand.bet * 2; }
      else if (total < dealerTotal) { hand.result = "lose"; hand.payout = 0; }
      else { hand.result = "push"; hand.payout = hand.bet; }

      returned += hand.payout;
    });

    state.bankroll += returned;
    var net = returned - state.roundWagered;
    var outcome = net > 0 ? "win" : net < 0 ? "lose" : "push";

    var s = state.stats;
    s.rounds += 1;
    if (outcome === "win") {
      s.wins += 1;
      s.streak += 1;
      if (s.streak > s.bestStreak) s.bestStreak = s.streak;
    } else if (outcome === "lose") {
      s.losses += 1;
      s.streak = 0;
    } else {
      s.pushes += 1;
    }
    if (net > s.biggestWin) s.biggestWin = net;
    if (state.bankroll > s.peak) s.peak = state.bankroll;
    state.hands.forEach(function (hand) { if (isBlackjack(hand)) s.blackjacks += 1; });

    state.history.push(outcome);
    if (state.history.length > 10) state.history = state.history.slice(-10);

    // เหรียญรางวัล
    state.hands.forEach(function (hand) {
      if (hand.result === "blackjack") unlock("first_bj");
      if (hand.doubled && (hand.result === "win" || hand.result === "blackjack")) unlock("double_win");
    });
    if (s.streak >= 5) unlock("streak5");
    if (state.hands.length > 1 && state.hands.every(function (h) { return h.result === "win" || h.result === "blackjack"; })) unlock("split_win");
    if (insuranceWon) unlock("insurance_win");
    if (state.bankroll >= 5000) unlock("rich");
    if (state.tookBonus && state.bankroll >= 1000) unlock("comeback");
    if (s.rounds >= 50) unlock("veteran");

    // ข้อความสรุป
    var dealerText = dealerBJ ? "เจ้ามือแบล็คแจ็ค"
      : dealerTotal > 21 ? "💥 เจ้ามือแตก (" + dealerTotal + ")"
      : "เจ้ามือได้ " + dealerTotal;
    var resultText = outcome === "win" ? "🎉 คุณชนะ " + money(net)
      : outcome === "lose" ? "😈 เสียไป " + money(-net)
      : "🤝 เสมอ ได้เดิมพันคืน";
    var extras = "";
    if (state.hands.some(function (h) { return h.result === "blackjack"; })) extras += " · 🃏 แบล็คแจ็คจ่าย 3:2";
    if (insuranceWon) extras += " · 🛡️ ประกันคืน " + money(state.insurance * 3);
    else if (state.insurance > 0) extras += " · ประกันเสีย " + money(state.insurance);
    var badges = newBadgeLabels();
    if (badges.length) extras += " · 🏅 ปลดล็อก: " + badges.join(", ");

    setMessage(dealerText + " — " + resultText + extras, outcome);

    if (outcome === "win") {
      if (state.hands.some(function (h) { return h.result === "blackjack"; })) SFX.blackjack();
      else SFX.win();
    } else if (outcome === "lose") SFX.lose();
    else SFX.push();

    // กลับไปรับเดิมพันตาใหม่ โดยยังโชว์ไพ่ตาที่เพิ่งจบไว้บนโต๊ะ
    state.phase = "betting";
    state.bet = 0;
    state.busy = false;
    save();
    render();
    flashHud(els.bankroll);
    renderStats();
    renderBadges();
    renderHistory();
  }

  function resetAll() {
    if (!window.confirm("ล้างเงิน สถิติ และเหรียญทั้งหมด แล้วเริ่มใหม่จาก " + money(STARTING_BANKROLL) + " ใช่ไหม?")) return;
    clearTimers();
    try { localStorage.removeItem(STORE_KEY); } catch (e) {}
    state.bankroll = STARTING_BANKROLL;
    state.deposited = STARTING_BANKROLL;
    state.bet = 0;
    state.lastBet = 0;
    state.tookBonus = false;
    state.shoe = newShoe();
    state.count = 0;
    state.hands = [];
    state.dealer = [];
    state.dealerShown = 0;
    state.holeRevealShown = false;
    state.active = 0;
    state.holeHidden = true;
    state.busy = false;
    state.insurance = 0;
    state.roundWagered = 0;
    state.stats = defaultStats();
    state.badges = {};
    state.newBadges = {};
    state.history = [];
    state.phase = "betting";
    setMessage("เริ่มใหม่หมดจด — วางชิปแล้วลุยต่อเลย 🃏", "");
    save();
    render();
    renderStats();
    renderBadges();
    renderHistory();
  }

  // ---------- ปุ่มและแป้นลัด ----------
  els.chipRow.addEventListener("click", function (e) {
    var btn = e.target.closest("button[data-chip]");
    if (btn && !btn.disabled) addChip(Number(btn.dataset.chip));
  });
  els.clearBetBtn.addEventListener("click", clearBet);
  els.rebetBtn.addEventListener("click", rebet);
  els.allInBtn.addEventListener("click", allIn);
  els.dealBtn.addEventListener("click", deal);
  els.brokeBtn.addEventListener("click", brokeBonus);
  els.insuranceYesBtn.addEventListener("click", function () { takeInsurance(true); });
  els.insuranceNoBtn.addEventListener("click", function () { takeInsurance(false); });
  els.hitBtn.addEventListener("click", hit);
  els.standBtn.addEventListener("click", stand);
  els.doubleBtn.addEventListener("click", double);
  els.splitBtn.addEventListener("click", split);
  els.surrenderBtn.addEventListener("click", surrender);
  els.resetBtn.addEventListener("click", resetAll);

  els.soundToggle.addEventListener("click", function () {
    state.settings.sound = !state.settings.sound;
    renderSettings();
    save();
    SFX.chip();
  });
  els.coachToggle.addEventListener("click", function () {
    state.settings.coach = !state.settings.coach;
    renderSettings();
    renderCoach();
    save();
  });
  els.countToggle.addEventListener("click", function () {
    state.settings.count = !state.settings.count;
    renderSettings();
    renderCount();
    save();
  });
  els.speedToggle.addEventListener("click", function () {
    var i = SPEED_ORDER.indexOf(state.settings.speed);
    state.settings.speed = SPEED_ORDER[(i + 1) % SPEED_ORDER.length];
    renderSettings();
    save();
  });

  document.addEventListener("keydown", function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var tag = (e.target && e.target.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

    if (e.key === " " || e.code === "Space") {
      if (state.phase === "betting") {
        e.preventDefault();
        if (state.bet > 0) deal();
        else rebet();
      }
      return;
    }

    if (state.phase !== "player") return;
    var key = String(e.key).toLowerCase();
    if (key === "h") { e.preventDefault(); hit(); }
    else if (key === "s") { e.preventDefault(); stand(); }
    else if (key === "d") { e.preventDefault(); double(); }
    else if (key === "p") { e.preventDefault(); split(); }
    else if (key === "r") { e.preventDefault(); surrender(); }
  });

  // ---------- เริ่มต้น ----------
  setMessage("วางชิปแล้วกดแจกไพ่ได้เลย — เจ้ามือรออยู่ 😈", "");
  render();
  renderSettings();
  renderStats();
  renderBadges();
  renderHistory();
})();
