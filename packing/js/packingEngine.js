import { CATEGORIES, ITEM_WEIGHT_ESTIMATES } from './config.js';

export class PackingEngine {
  /**
   * Helper to estimate single unit weight in grams based on item name
   * @param {string} name 
   * @returns {number} Weight in grams
   */
  static estimateWeightGrams(name) {
    if (!name) return ITEM_WEIGHT_ESTIMATES.default;
    for (const [keyword, weight] of Object.entries(ITEM_WEIGHT_ESTIMATES)) {
      if (keyword !== 'default' && name.includes(keyword)) {
        return weight;
      }
    }
    return ITEM_WEIGHT_ESTIMATES.default;
  }

  /**
   * Generate smart packing list based on weather forecast and trip duration
   * @param {Object} weather 
   * @param {number} days 
   * @param {Object} destination 
   * @returns {Array} List of packing items
   */
  static generateList(weather, days = 4, destination = {}) {
    const items = [];
    const summary = weather.summary || {};
    const minTemp = summary.minTemp ?? 25;
    const maxTemp = summary.maxTemp ?? 32;
    const isFreezing = summary.isFreezing || minTemp <= 4;
    const isCold = summary.isCold || minTemp < 15;
    const isHot = summary.isHot || maxTemp >= 28;
    const willRain = summary.willRain || (summary.maxRainProb >= 30);
    const hasSnow = summary.hasSnow;

    let itemIdCounter = 1;
    const makeItem = (name, quantity, unit, categoryId, reason, isEssential = false, explicitWeightGrams = null) => {
      const unitWeight = explicitWeightGrams || this.estimateWeightGrams(name);
      return {
        id: `item_${Date.now()}_${itemIdCounter++}`,
        name,
        quantity,
        unit,
        category: categoryId,
        checked: false,
        reason,
        isEssential,
        custom: false,
        weightGrams: unitWeight
      };
    };

    // 1. เอกสาร & การเงิน (Universal Essentials)
    const isDomestic = destination.country && (destination.country.toLowerCase() === 'thailand' || destination.country.toLowerCase() === 'ไทย');
    
    items.push(makeItem(
      isDomestic ? 'บัตรประชาชนตัวจริง' : 'หนังสือเดินทาง (Passport) มีอายุเหลือ > 6 เดือน',
      1,
      'เล่ม/ใบ',
      CATEGORIES.DOCUMENTS.id,
      'เอกสารแสดงตนในการเดินทาง',
      true,
      50
    ));

    items.push(makeItem(
      'ตั๋วเครื่องบิน / Boarding Pass & ใบจองที่พัก',
      1,
      'ชุด',
      CATEGORIES.DOCUMENTS.id,
      'พิมพ์สำเนาหรือบันทึก Offline ในมือถือ',
      true,
      30
    ));

    items.push(makeItem(
      isDomestic ? 'เงินสด & บัตรเดบิต/เครดิต' : 'เงินสดสกุลท้องถิ่น & บัตร Travel Card / บัตรเครดิต',
      1,
      'ชุด',
      CATEGORIES.DOCUMENTS.id,
      'ค่าใช้จ่ายตลอดทริป',
      true,
      60
    ));

    if (!isDomestic) {
      items.push(makeItem(
        'กรมธรรม์ประกันภัยการเดินทาง (Travel Insurance)',
        1,
        'ฉบับ',
        CATEGORIES.DOCUMENTS.id,
        'คุ้มครองอุบัติเหตุและเจ็บป่วยต่างแดน',
        true,
        30
      ));
    }

    // 2. เสื้อผ้า & เครื่องแต่งกาย (Clothing & Apparel)
    const topsCount = Math.min(days, 7);
    items.push(makeItem(
      isHot ? 'เสื้อยืด / เสื้อผ้าเนื้อโปร่งระบายอากาศ' : 'เสื้อลำลอง / เสื้อแขนยาว',
      topsCount,
      'ตัว',
      CATEGORIES.CLOTHING.id,
      days > 7 ? `คำนวณ ${topsCount} ตัว (แนะนำซักระหว่างทริป)` : `เตรียมสำหรับ ${days} วัน`,
      false,
      180
    ));

    const bottomsCount = Math.max(1, Math.min(Math.ceil(days / 2), 4));
    items.push(makeItem(
      isHot ? 'กางเกงขาสั้น / กางเกงขายาวผ้าสบาย' : 'กางเกงขายาว / ยีนส์',
      bottomsCount,
      'ตัว',
      CATEGORIES.CLOTHING.id,
      `ใส่สลับสำหรับ ${days} วัน`,
      false,
      450
    ));

    items.push(makeItem(
      'ชุดชั้นใน',
      days + 1,
      'ชุด',
      CATEGORIES.CLOTHING.id,
      `คำนวณ ${days} วัน + สำรอง 1 วัน`,
      false,
      50
    ));

    items.push(makeItem(
      hasSnow || isFreezing ? 'ถุงเท้าหนาพิเศษ / ถุงเท้าขนสัตว์' : 'ถุงเท้า',
      days + 1,
      'คู่',
      CATEGORIES.CLOTHING.id,
      isCold ? 'เน้นเก็บความอบอุ่นที่เท้า' : `คำนวณ ${days} วัน + สำรอง 1 วัน`,
      false,
      50
    ));

    const sleepwearCount = Math.max(1, Math.min(Math.ceil(days / 3), 3));
    items.push(makeItem(
      'ชุดนอน',
      sleepwearCount,
      'ชุด',
      CATEGORIES.CLOTHING.id,
      `เปลี่ยนทุก 2-3 คืน`,
      false,
      300
    ));

    items.push(makeItem(
      'รองเท้าผ้าใบใส่เดินสบาย',
      1,
      'คู่',
      CATEGORIES.CLOTHING.id,
      'สำหรับการเดินท่องเที่ยวระยะไกล',
      false,
      700
    ));

    // เสื้อผ้าตามสภาพอากาศหนาว/หิมะ
    if (isFreezing || hasSnow) {
      items.push(makeItem(
        'เสื้อแจ็คเก็ตขนเป็ด / ดาวน์โค้ทกันหนาวติดลบ',
        1,
        'ตัว',
        CATEGORIES.CLOTHING.id,
        `อุณหภูมิต่ำสุด ${minTemp}°C (อากาศหนาวจัด)`,
        false,
        1200
      ));
      items.push(makeItem(
        'ชุดชั้นในเก็บความร้อน (Heattech Ultra Warm / ลองจอน)',
        Math.min(days, 4),
        'ชุด',
        CATEGORIES.CLOTHING.id,
        `รักษาอุณหภูมิร่างกายในสภาพอากาศ ${minTemp}°C`,
        false,
        150
      ));
      items.push(makeItem(
        'กางเกงกันลม / กางเกงบุฟรีซด้านใน',
        Math.min(bottomsCount, 3),
        'ตัว',
        CATEGORIES.CLOTHING.id,
        'กันลมหนาวและเกล็ดหิมะ',
        false,
        450
      ));
      items.push(makeItem(
        'รองเท้าบูทกันลื่นลุยหิมะ (Snow Boots / Waterproof)',
        1,
        'คู่',
        CATEGORIES.CLOTHING.id,
        'พื้นรองเท้ายึดเกาะดี ป้องกันการลื่นล้มบนน้ำแข็ง',
        false,
        1100
      ));
    } else if (isCold) {
      items.push(makeItem(
        'เสื้อกันหนาว / เสื้อสเวตเตอร์ / แจ็คเก็ตคลุม',
        Math.min(Math.ceil(days / 3), 3),
        'ตัว',
        CATEGORIES.CLOTHING.id,
        `อุณหภูมิต่ำสุด ${minTemp}°C (อากาศค่อนข้างเย็น)`,
        false,
        500
      ));
      items.push(makeItem(
        'เสื้อยืดแขนยาว / Heattech บาง',
        Math.min(days, 3),
        'ตัว',
        CATEGORIES.CLOTHING.id,
        'สำหรับสวมใส่เป็นเสื้อชั้นใน',
        false,
        160
      ));
    }

    // 3. อุปกรณ์รับมือสภาพอากาศ (Weather Gear)
    if (willRain) {
      items.push(makeItem(
        'ร่มพับพกพาน้ำหนักเบา',
        1,
        'คัน',
        CATEGORIES.WEATHER_GEAR.id,
        `พยากรณ์มีโอกาสฝนตกสูงสุด ${summary.maxRainProb}%`,
        true,
        220
      ));
      items.push(makeItem(
        'เสื้อกันฝนพกพา (Raincoat)',
        1,
        'ตัว',
        CATEGORIES.WEATHER_GEAR.id,
        'คล่องตัวเวลาฝนตกขณะเดินทาง',
        false,
        180
      ));
      items.push(makeItem(
        'ซองหรือถุงซิปล็อคกันน้ำใส่อุปกรณ์อิเล็กทรอนิกส์',
        2,
        'ใบ',
        CATEGORIES.WEATHER_GEAR.id,
        'ปกป้องพาสปอร์ตและมือถือยามฝนตก',
        false,
        40
      ));
    }

    if (isFreezing || hasSnow || isCold) {
      items.push(makeItem(
        'ถุงมือกันหนาว (Touchscreen รองรับการกดมือถือ)',
        1,
        'คู่',
        CATEGORIES.WEATHER_GEAR.id,
        `ป้องกันมือชาจากความเย็น ${minTemp}°C`,
        false,
        90
      ));
      items.push(makeItem(
        'ผ้าพันคอ & หมวกไหมพรม (Beanie)',
        1,
        'ชุด',
        CATEGORIES.WEATHER_GEAR.id,
        'รักษาความอบอุ่นช่วงคอและศีรษะ',
        false,
        220
      ));
      if (isFreezing || hasSnow) {
        items.push(makeItem(
          'แผ่นแปะความร้อนกันหนาว (Hot Pack / Kairo)',
          Math.min(days * 2, 10),
          'แผ่น',
          CATEGORIES.WEATHER_GEAR.id,
          'ใส่ในกระเป๋าเสื้อโค้ทช่วยให้อุ่นขึ้น',
          false,
          45
        ));
      }
    }

    if (isHot) {
      items.push(makeItem(
        'แว่นตากันแดด UV400',
        1,
        'อัน',
        CATEGORIES.WEATHER_GEAR.id,
        `อุณหภูมิสูงสุด ${maxTemp}°C แดดแรง`,
        false,
        40
      ));
      items.push(makeItem(
        'หมวกปีกกว้าง / หมวกแก๊ป',
        1,
        'ใบ',
        CATEGORIES.WEATHER_GEAR.id,
        'ป้องกันแสงแดดระหว่างวัน',
        false,
        100
      ));
      items.push(makeItem(
        'พัดลมพกพา หรือ สเปรย์เย็นคลายร้อน',
        1,
        'เครื่อง',
        CATEGORIES.WEATHER_GEAR.id,
        'ช่วยคลายร้อนระหว่างเดินกลางแจ้ง',
        false,
        180
      ));
      items.push(makeItem(
        'สเปรย์หรือโลชั่นกันยุง',
        1,
        'ขวด',
        CATEGORIES.WEATHER_GEAR.id,
        'ป้องกันยุงในสภาพอากาศร้อนชื้น',
        false,
        120
      ));
    }

    // 4. อุปกรณ์อิเล็กทรอนิกส์ (Electronics)
    items.push(makeItem(
      'สมาร์ทโฟน + สายชาร์จ',
      1,
      'ชุด',
      CATEGORIES.ELECTRONICS.id,
      'อุปกรณ์หลักในการสื่อสารและการนำทาง',
      true,
      250
    ));

    items.push(makeItem(
      'พาวเวอร์แบงก์ (Power Bank ไม่เกิน 20,000 mAh)',
      1,
      'ก้อน',
      CATEGORIES.ELECTRONICS.id,
      'สำรองแบตเตอรี่ตลอดวัน (ต้องถือขึ้นเครื่อง)',
      true,
      280
    ));

    if (!isDomestic) {
      items.push(makeItem(
        'หัวแปลงปลั๊กสากล (Universal Travel Adapter)',
        1,
        'ตัว',
        CATEGORIES.ELECTRONICS.id,
        'สำหรับเต้ารับไฟฟ้าต่างประเทศ',
        true,
        140
      ));
      items.push(makeItem(
        'eSIM / Travel SIM สำหรับใช้งานอินเทอร์เน็ต',
        1,
        'ซิม/แพ็กเกจ',
        CATEGORIES.ELECTRONICS.id,
        'เช็กแผนที่และติดต่อสื่อสาร',
        true,
        20
      ));
    }

    items.push(makeItem(
      'หูฟัง (Earphones / Noise Cancelling)',
      1,
      'ชุด',
      CATEGORIES.ELECTRONICS.id,
      'ฟังเพลงบนเครื่องบินและการเดินทาง',
      false,
      150
    ));

    // 5. ของใช้ส่วนตัว & สุขภาพ (Toiletries & Health)
    items.push(makeItem(
      'แปรงสีฟัน & ยาสีฟันขนาดพกพา',
      1,
      'ชุด',
      CATEGORIES.TOILETRIES.id,
      'สุขอนามัยส่วนตัว (ขนาดต่ำกว่า 100ml)',
      true,
      80
    ));

    items.push(makeItem(
      'ครีมกันแดดสำหรับผิวหน้าและผิวกาย (SPF50+)',
      1,
      'หลอด',
      CATEGORIES.TOILETRIES.id,
      'ปกป้องผิวจากรังสียูวีทุกฤดูกาล',
      false,
      120
    ));

    if (isCold || isFreezing) {
      items.push(makeItem(
        'ลิปบาล์ม & มอยส์เจอร์ไรเซอร์บำรุงผิวเข้มข้น',
        1,
        'ตลับ/หลอด',
        CATEGORIES.TOILETRIES.id,
        'ป้องกันผิวแตกลอกและริมฝีปากแห้งจากลมหนาว',
        false,
        80
      ));
    }

    items.push(makeItem(
      'ยาประจำตัว (ถ้ามี)',
      1,
      'ชุด',
      CATEGORIES.TOILETRIES.id,
      'พกพาในกระเป๋าติดตัวขึ้นเครื่อง',
      true,
      100
    ));

    items.push(makeItem(
      'ยาสามัญประจำตัว (พาราเซตามอล, ยาแก้แพ้, ยาแก้เมารถ, ยาลดกรด/ท้องเสีย)',
      1,
      'ชุด',
      CATEGORIES.TOILETRIES.id,
      'ปฐมพยาบาลเบื้องต้นยามเจ็บป่วยกะทันหัน',
      false,
      150
    ));

    items.push(makeItem(
      'พลาสเตอร์ยา & ทิชชู่เปียก / สเปรย์แอลกอฮอล์',
      1,
      'ชุด',
      CATEGORIES.TOILETRIES.id,
      'รักษาแผลรองเท้ากัดและสุขอนามัย',
      false,
      120
    ));

    return items;
  }
}
