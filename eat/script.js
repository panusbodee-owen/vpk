(function () {
  "use strict";

  var CATEGORIES = [
    { id: "food", label: "อาหาร", emoji: "🍜" },
    { id: "drink", label: "เครื่องดื่ม", emoji: "🧋" },
    { id: "dessert", label: "ของหวาน", emoji: "🍰" },
  ];

  // ---------- ข้อมูลร้าน — แก้ไข/เพิ่มร้านได้ตรงนี้ ----------
  // lat/lng เป็นพิกัดโดยประมาณของย่านที่ร้านตั้งอยู่ ใช้สำหรับคำนวณระยะทางกับ "ใกล้ฉัน" เท่านั้น
  var RESTAURANTS = [
    // อาหาร
    { id: "jayfai", name: "เจ๊ไฝ (Jay Fai)", category: "food", area: "เสาชิงช้า", lat: 13.7524, lng: 100.5019, description: "ไข่เจียวปูและผัดขี้เมาทะเลระดับมิชลินสตาร์ ต้นตำรับสตรีทฟู้ดชื่อดังของกรุงเทพฯ", tags: ["มิชลิน", "สตรีทฟู้ด", "ไข่เจียวปู"] },
    { id: "thipsamai", name: "ทิพย์สมัย ผัดไทยประตูผี", category: "food", area: "ประตูผี", lat: 13.7539, lng: 100.5057, description: "ผัดไทยห่อไข่สูตรดั้งเดิมที่เปิดมากว่า 80 ปี เมนูต้องสั่งเมื่อมาเยือนย่านเมืองเก่า", tags: ["ผัดไทย", "ร้านเก่าแก่"] },
    { id: "kruaapsorn", name: "ครัวอัปษร (Krua Apsorn)", category: "food", area: "บวรนิเวศ", lat: 13.7599, lng: 100.4986, description: "อาหารไทยรสมือแม่ เมนูเด็ดคือปูผัดผงกะหรี่และยำผักกระเฉดกุ้งสด", tags: ["อาหารไทย", "ปูผัดผงกะหรี่"] },
    { id: "somtamnua", name: "ส้มตำนัว สยามสแควร์", category: "food", area: "สยามสแควร์", lat: 13.7460, lng: 100.5340, description: "ส้มตำและอาหารอีสานรสจัดจ้าน คิวยาวตลอดวันแต่คุ้มค่าการรอ", tags: ["อีสาน", "ส้มตำ"] },
    { id: "wattanapanich", name: "วัฒนาพานิช เนื้อตุ๋น", category: "food", area: "เอกมัย", lat: 13.7204, lng: 100.5853, description: "ก๋วยเตี๋ยวเนื้อตุ๋นน้ำซุปข้นที่เคี่ยวต่อเนื่องมากว่า 50 ปี", tags: ["ก๋วยเตี๋ยวเนื้อ", "ร้านเก่าแก่"] },
    { id: "sukiteenoi", name: "สุกี้ตี๋น้อย", category: "food", area: "หลายสาขา", lat: 13.7650, lng: 100.5750, description: "สุกี้บุฟเฟต์ราคาคุ้มค่า เปิดดึก มีทั้งน้ำจิ้มสูตรพิเศษและวัตถุดิบให้เลือกจุใจ", tags: ["สุกี้", "บุฟเฟต์"] },
    { id: "boatnoodle", name: "ก๋วยเตี๋ยวเรือประตูน้ำ", category: "food", area: "ประตูน้ำ", lat: 13.7500, lng: 100.5400, description: "ก๋วยเตี๋ยวเรือรสจัดชามเล็กราคาย่อมเยา สั่งได้หลายชามไม่มีเบื่อ", tags: ["ก๋วยเตี๋ยวเรือ", "สตรีทฟู้ด"] },
    { id: "baankhunmae", name: "บ้านคุณแม่ สยามสแควร์", category: "food", area: "สยามสแควร์", lat: 13.7455, lng: 100.5330, description: "อาหารไทยจานเดียวและกับข้าวรสชาติเป็นกันเอง เหมาะสำหรับมื้อกลางวัน", tags: ["อาหารไทย", "จานเดียว"] },
    { id: "mkrestaurant", name: "MK สุกี้", category: "food", area: "หลายสาขา", lat: 13.7460, lng: 100.5350, description: "สุกี้แบรนด์คนไทยที่คุ้นเคย บริการเร็ว เมนูครบ เหมาะกับมื้อครอบครัว", tags: ["สุกี้", "แบรนด์คนไทย"] },
    { id: "nahm", name: "Nahm", category: "food", area: "สาทร", lat: 13.7220, lng: 100.5290, description: "อาหารไทยร่วมสมัยแนวไฟน์ไดนิ่ง ตีความสูตรโบราณให้ทันสมัย ติดมิชลิน", tags: ["ไฟน์ไดนิ่ง", "มิชลิน"] },
    // เครื่องดื่ม
    { id: "rocketcoffeebar", name: "Rocket Coffeebar", category: "drink", area: "ทองหล่อ", lat: 13.7300, lng: 100.5800, description: "ร้านกาแฟสเปเชียลตี้บรรยากาศดี เมล็ดกาแฟคุณภาพ เหมาะนั่งทำงานหรือนัดเพื่อน", tags: ["กาแฟ", "สเปเชียลตี้"] },
    { id: "casalapin", name: "Casa Lapin", category: "drink", area: "หลายสาขา", lat: 13.7280, lng: 100.5790, description: "คาเฟ่สไตล์มินิมอลชื่อดัง เมนูกาแฟและเลมอนซอร์เบ็ตเป็นซิกเนเจอร์", tags: ["คาเฟ่", "กาแฟ"] },
    { id: "factorycoffee", name: "Factory Coffee", category: "drink", area: "เอกมัย", lat: 13.7190, lng: 100.5850, description: "โรงคั่วกาแฟและร้านกาแฟที่คอกาแฟตัวจริงต้องแวะ รสชาติกลมกล่อมคัดสรรพิเศษ", tags: ["กาแฟ", "โรงคั่ว"] },
    { id: "ceresia", name: "Ceresia Coffee Roasters", category: "drink", area: "สุขุมวิท", lat: 13.7300, lng: 100.5600, description: "ร้านกาแฟคั่วเอง บรรยากาศอบอุ่น เหมาะกับการนั่งจิบกาแฟช้าๆ", tags: ["กาแฟ", "โรงคั่ว"] },
    { id: "rootscoffee", name: "Roots Coffee Roaster", category: "drink", area: "ทองหล่อ", lat: 13.7320, lng: 100.5810, description: "หนึ่งในร้านกาแฟที่บุกเบิกวงการกาแฟสเปเชียลตี้ในกรุงเทพฯ", tags: ["กาแฟ", "สเปเชียลตี้"] },
    { id: "chatramue", name: "ชาตรามือ (Cha Tra Mue)", category: "drink", area: "หลายสาขา", lat: 13.7400, lng: 100.5080, description: "ชาไทยแบรนด์ต้นตำรับ รสเข้มข้นหอมมัน เมนูคลาสสิกที่ทุกคนรู้จัก", tags: ["ชาไทย", "แบรนด์ไทย"] },
    { id: "ichinihontea", name: "Ichi Nihon Tea", category: "drink", area: "หลายสาขา", lat: 13.7450, lng: 100.5350, description: "ชาเขียวมัทฉะและชาญี่ปุ่นแท้ต้นตำรับ เมนูยอดฮิตคือลาเต้มัทฉะ", tags: ["ชาเขียว", "มัทฉะ"] },
    { id: "bluecup", name: "Bluecup Coffee", category: "drink", area: "หลายสาขา", lat: 13.7500, lng: 100.5300, description: "ร้านกาแฟสายเขียวรักษ์โลก เมนูเครื่องดื่มหลากหลายราคาจับต้องได้", tags: ["กาแฟ", "ราคาคุ้มค่า"] },
    { id: "koithe", name: "KOI Thé", category: "drink", area: "หลายสาขา", lat: 13.7460, lng: 100.5340, description: "ชานมไข่มุกและชาผลไม้สไตล์ไต้หวัน เมนูฮิตคือชานมไข่มุกทองคำ", tags: ["ชานมไข่มุก", "ไต้หวัน"] },
    { id: "mistercoconut", name: "Mister Coconut", category: "drink", area: "หลายสาขา", lat: 13.7460, lng: 100.5340, description: "น้ำมะพร้าวสดและเครื่องดื่มจากมะพร้าวคลายร้อนสไตล์ไทย", tags: ["น้ำมะพร้าว", "เครื่องดื่มสดชื่น"] },
    // ของหวาน
    { id: "afteryou", name: "After You Dessert Café", category: "dessert", area: "หลายสาขา", lat: 13.7440, lng: 100.5460, description: "ต้นตำรับชิบูย่าโทสต์และฮันนี่โทสต์สุดฟิน เมนูขนมหวานยอดนิยมของคนกรุงเทพฯ", tags: ["ฮันนี่โทสต์", "คาเฟ่ขนมหวาน"] },
    { id: "montnomsod", name: "มนต์นมสด (Mont Nom Sod)", category: "dessert", area: "บางลำพู", lat: 13.7590, lng: 100.4970, description: "ขนมปังปิ้งนมสดต้นตำรับที่เปิดมานาน เมนูซิกเนเจอร์คือขนมปังปิ้งหน้าสังขยา", tags: ["ขนมปังปิ้ง", "ร้านเก่าแก่"] },
    { id: "korpanich", name: "ข้าวเหนียวมูนกรอบเนียน ก่อพานิช", category: "dessert", area: "บางรัก", lat: 13.7230, lng: 100.5240, description: "ข้าวเหนียวมะม่วงและข้าวเหนียวมูนต้นตำรับที่คนต่อคิวซื้อกลับบ้านทุกวัน", tags: ["ข้าวเหนียวมะม่วง", "ร้านเก่าแก่"] },
    { id: "iberry", name: "iberry Garden", category: "dessert", area: "ประเวศ", lat: 13.7150, lng: 100.6500, description: "คาเฟ่ไอศกรีมโฮมเมดท่ามกลางสวนสีเขียว บรรยากาศร่มรื่นเหมาะพักผ่อน", tags: ["ไอศกรีม", "คาเฟ่สวน"] },
    { id: "kadkokoa", name: "Kad Kokoa", category: "dessert", area: "เอกมัย", lat: 13.7195, lng: 100.5845, description: "ร้านช็อกโกแลตและขนมหวานโฮมเมด เมนูเด็ดคือฮ็อตช็อกโกแลตข้นเข้ม", tags: ["ช็อกโกแลต", "คาเฟ่"] },
    { id: "cheevitcheeva", name: "Cheevit Cheeva", category: "dessert", area: "เอกมัย", lat: 13.7185, lng: 100.5840, description: "คาเฟ่ขนมหวานสไตล์มินิมอล เมนูซิกเนเจอร์คือเค้กและขนมโฮมเมดหน้าตาน่ารัก", tags: ["เค้ก", "คาเฟ่มินิมอล"] },
    { id: "erawantearoom", name: "Erawan Tea Room", category: "dessert", area: "ราชประสงค์", lat: 13.7440, lng: 100.5400, description: "ข้าวเหนียวมะม่วงและขนมไทยประยุกต์ในบรรยากาศหรูใจกลางเมือง", tags: ["ข้าวเหนียวมะม่วง", "ขนมไทย"] },
    { id: "bualoynana", name: "บัวลอยเยาวราช", category: "dessert", area: "เยาวราช", lat: 13.7400, lng: 100.5090, description: "บัวลอยไข่หวานร้อนๆ สูตรดั้งเดิมย่านไชน่าทาวน์ ของหวานเรียกความทรงจำวัยเด็ก", tags: ["บัวลอย", "ไชน่าทาวน์"] },
    { id: "douhua", name: "เต้าฮวยเจ้าเก่า เยาวราช", category: "dessert", area: "เยาวราช", lat: 13.7395, lng: 100.5085, description: "เต้าฮวยนุ่มละมุนราดน้ำขิงหอมกรุ่น ของหวานต้นตำรับย่านเยาวราช", tags: ["เต้าฮวย", "ไชน่าทาวน์"] },
  ];

  /**
   * ลิงก์ Google Maps ไปยังร้านนี้โดยตรง — คลิกแล้วเจอร้านจริงเสมอ (ไม่ต้องล็อกอิน)
   * ส่วนใหญ่ร้านดังจะมีปุ่ม "สั่งอาหาร" ต่อไปยัง LINE MAN/Grab/ShopeeFood ให้ในหน้า Maps เลย ถ้าร้านนั้นเปิดให้บริการ
   */
  function getMapsLink(name, area) {
    var q = encodeURIComponent(name + " " + area + " กรุงเทพ");
    return "https://www.google.com/maps/search/?api=1&query=" + q;
  }

  /**
   * ลิงก์เปิดแอป/เว็บของแต่ละแพลตฟอร์ม — เป็นหน้าแรกจริงของแต่ละเจ้า (ไม่ใช่ผลค้นหาปลอม)
   * เพราะ LINE MAN / Grab / ShopeeFood ไม่มี URL ค้นหาสาธารณะที่พาไปหน้าร้านตรงๆ ได้
   * ผู้ใช้เปิดแล้วพิมพ์ชื่อร้านค้นหาต่อในแอปได้เลย
   */
  function getAppLinks() {
    return [
      { id: "lineman", label: "LINE MAN", color: "#00B900", url: "https://food.lineman.line.me/" },
      { id: "grab", label: "Grab", color: "#00B14F", url: "https://food.grab.com/th/en/" },
      { id: "shopeefood", label: "ShopeeFood", color: "#EE4D2D", url: "https://shopeefood.co.th/" },
    ];
  }

  function catMeta(id) {
    for (var i = 0; i < CATEGORIES.length; i++) {
      if (CATEGORIES[i].id === id) return CATEGORIES[i];
    }
    return null;
  }

  /** ระยะทางแบบเส้นตรง (กม.) ระหว่างสองพิกัด — สูตร Haversine */
  function distanceKm(lat1, lng1, lat2, lng2) {
    var R = 6371;
    var dLat = ((lat2 - lat1) * Math.PI) / 180;
    var dLng = ((lng2 - lng1) * Math.PI) / 180;
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  var state = {
    filter: "all",
    result: null,
    spinning: false,
    timer: null,
    nearMe: false, // true = จำกัดการสุ่มให้เฉพาะร้านใกล้ตัว
    userLoc: null, // { lat, lng }
    locating: false,
  };

  var els = {
    filters: document.getElementById("filterButtons"),
    nearMeBtn: document.getElementById("nearMeBtn"),
    locationStatus: document.getElementById("locationStatus"),
    spinBtn: document.getElementById("spinBtn"),
    spinLabel: document.getElementById("spinLabel"),
    empty: document.getElementById("emptyState"),
    card: document.getElementById("resultCard"),
    catBadge: document.getElementById("catBadge"),
    name: document.getElementById("resultName"),
    area: document.getElementById("resultArea"),
    distance: document.getElementById("resultDistance"),
    desc: document.getElementById("resultDesc"),
    tags: document.getElementById("resultTags"),
    mapsLink: document.getElementById("mapsLink"),
    appLinks: document.getElementById("appLinks"),
  };

  function categoryPool() {
    if (state.filter === "all") return RESTAURANTS;
    return RESTAURANTS.filter(function (r) { return r.category === state.filter; });
  }

  /**
   * รายชื่อร้านให้สุ่ม — ถ้าเปิด "ใกล้ฉัน" จะจำกัดเฉพาะร้านที่อยู่ในรัศมีที่ใกล้ที่สุด
   * (ขยายรัศมีทีละขั้นถ้าเจอน้อยเกินไป เพื่อให้ยังสุ่มได้เสมอ)
   */
  function pool() {
    var base = categoryPool();
    if (!state.nearMe || !state.userLoc) return base;

    var withDist = base.map(function (r) {
      return { r: r, km: distanceKm(state.userLoc.lat, state.userLoc.lng, r.lat, r.lng) };
    });
    withDist.sort(function (a, b) { return a.km - b.km; });

    var radii = [5, 10, 20];
    var chosen = withDist;
    for (var i = 0; i < radii.length; i++) {
      var within = withDist.filter(function (x) { return x.km <= radii[i]; });
      if (within.length >= 3) {
        chosen = within;
        break;
      }
    }
    return chosen.map(function (x) { return x.r; });
  }

  function pickRandom(excludeId) {
    var options = pool();
    if (excludeId && options.length > 1) {
      options = options.filter(function (r) { return r.id !== excludeId; });
    }
    return options[Math.floor(Math.random() * options.length)];
  }

  function render(isSpinning) {
    if (!state.result) {
      els.empty.hidden = false;
      els.card.hidden = true;
      return;
    }
    els.empty.hidden = true;
    els.card.hidden = false;
    els.card.style.opacity = isSpinning ? "0.6" : "1";

    var meta = catMeta(state.result.category);
    els.catBadge.textContent = meta ? meta.emoji + " " + meta.label : "";
    els.name.textContent = state.result.name;
    els.area.textContent = state.result.area;
    els.desc.textContent = state.result.description;

    if (state.nearMe && state.userLoc) {
      var km = distanceKm(state.userLoc.lat, state.userLoc.lng, state.result.lat, state.result.lng);
      els.distance.hidden = false;
      els.distance.textContent = "· ห่างจากคุณประมาณ " + km.toFixed(1) + " กม.";
    } else {
      els.distance.hidden = true;
    }

    els.tags.innerHTML = "";
    state.result.tags.forEach(function (tag) {
      var span = document.createElement("span");
      span.className = "tag";
      span.textContent = "#" + tag;
      els.tags.appendChild(span);
    });

    els.mapsLink.href = getMapsLink(state.result.name, state.result.area);

    els.appLinks.innerHTML = "";
    getAppLinks().forEach(function (link) {
      var a = document.createElement("a");
      a.href = link.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.className = "app-btn";
      a.style.backgroundColor = link.color;
      a.textContent = link.label;
      els.appLinks.appendChild(a);
    });
  }

  function setFilterUI() {
    var buttons = els.filters.querySelectorAll("button");
    buttons.forEach(function (btn) {
      btn.classList.toggle("active", btn.dataset.filter === state.filter);
    });
  }

  function setLocationStatus(text) {
    els.locationStatus.textContent = text || "";
    els.locationStatus.hidden = !text;
  }

  function setNearMeUI() {
    els.nearMeBtn.classList.toggle("active", state.nearMe);
    els.nearMeBtn.classList.toggle("is-locating", state.locating);
  }

  function requestLocation() {
    if (!("geolocation" in navigator)) {
      setLocationStatus("เบราว์เซอร์นี้ไม่รองรับการหาตำแหน่ง ลองเลือกทั้งหมดแทนนะ");
      state.nearMe = false;
      setNearMeUI();
      return;
    }
    state.locating = true;
    setNearMeUI();
    setLocationStatus("กำลังหาตำแหน่งของคุณ...");

    navigator.geolocation.getCurrentPosition(
      function (pos) {
        state.userLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        state.nearMe = true;
        state.locating = false;
        setNearMeUI();
        setLocationStatus("");
        render(false);
      },
      function (err) {
        state.locating = false;
        state.nearMe = false;
        setNearMeUI();
        var msg = "หาตำแหน่งไม่สำเร็จ ลองเลือกทั้งหมดแทนนะ";
        if (err && err.code === err.PERMISSION_DENIED) {
          msg = "ไม่ได้รับอนุญาตให้เข้าถึงตำแหน่ง — เปิดสิทธิ์ตำแหน่งของเบราว์เซอร์แล้วลองใหม่";
        }
        setLocationStatus(msg);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 }
    );
  }

  els.filters.addEventListener("click", function (e) {
    var btn = e.target.closest("button[data-filter]");
    if (!btn || state.spinning) return;
    state.filter = btn.dataset.filter;
    setFilterUI();
  });

  els.nearMeBtn.addEventListener("click", function () {
    if (state.spinning || state.locating) return;
    if (state.nearMe) {
      // ปิดโหมดใกล้ฉัน กลับไปสุ่มจากทั้งหมด
      state.nearMe = false;
      setNearMeUI();
      setLocationStatus("");
      render(false);
      return;
    }
    if (state.userLoc) {
      state.nearMe = true;
      setNearMeUI();
      render(false);
      return;
    }
    requestLocation();
  });

  els.spinBtn.addEventListener("click", function () {
    if (state.spinning || pool().length === 0) return;
    state.spinning = true;
    els.spinBtn.disabled = true;
    els.spinBtn.classList.add("spinning");
    els.spinLabel.textContent = "กำลังสุ่ม...";

    var ticks = 0;
    var totalTicks = 14;
    var prevId = state.result ? state.result.id : null;

    state.timer = setInterval(function () {
      ticks += 1;
      state.result = pickRandom();
      render(true);
      if (ticks >= totalTicks) {
        clearInterval(state.timer);
        state.result = pickRandom(prevId);
        render(false);
        state.spinning = false;
        els.spinBtn.disabled = false;
        els.spinBtn.classList.remove("spinning");
        els.spinLabel.textContent = "สุ่มใหม่";
      }
    }, 80);
  });

  setFilterUI();
  setNearMeUI();
  render(false);
})();
