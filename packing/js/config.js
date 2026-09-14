// System Configuration and Constants
export const APP_CONFIG = {
  STORAGE_KEYS: {
    CURRENT_TRIP: 'smart_packing_current_trip',
    SAVED_TRIPS: 'smart_packing_saved_trips',
    SETTINGS: 'smart_packing_settings',
    THEME_MODE: 'smart_packing_theme_mode',
    THEME_ACCENT: 'smart_packing_theme_accent'
  },
  MAX_DAYS: 16,
  MIN_DAYS: 1,
  DEFAULT_DAYS: 4,
  POPULAR_CITIES: [
    { name: 'Tokyo', country: 'Japan', query: 'Tokyo' },
    { name: 'Seoul', country: 'South Korea', query: 'Seoul' },
    { name: 'London', country: 'UK', query: 'London' },
    { name: 'Paris', country: 'France', query: 'Paris' },
    { name: 'Chiang Mai', country: 'Thailand', query: 'Chiang Mai' },
    { name: 'Singapore', country: 'Singapore', query: 'Singapore' },
    { name: 'Reykjavik', country: 'Iceland', query: 'Reykjavik' },
    { name: 'Bangkok', country: 'Thailand', query: 'Bangkok' },
    { name: 'Sapporo', country: 'Japan', query: 'Sapporo' }
  ],
  BAGGAGE_PRESETS: [
    { id: 'carry_on_7', name: 'ถือขึ้นเครื่อง (Carry-on 7 kg)', limitKg: 7, emptyBagKg: 2.2, icon: 'fa-suitcase' },
    { id: 'checked_15', name: 'โหลดใต้เครื่อง 15 kg', limitKg: 15, emptyBagKg: 3.5, icon: 'fa-boxes-packing' },
    { id: 'checked_20', name: 'โหลดใต้เครื่อง 20 kg (มาตรฐาน)', limitKg: 20, emptyBagKg: 3.8, icon: 'fa-suitcase-rolling' },
    { id: 'checked_23', name: 'โหลดใต้เครื่อง 23 kg (ไฟลต์อินเตอร์)', limitKg: 23, emptyBagKg: 4.0, icon: 'fa-plane' },
    { id: 'checked_30', name: 'โหลดใต้เครื่อง 30 kg (ฟูลเซอร์วิส)', limitKg: 30, emptyBagKg: 4.5, icon: 'fa-weight-hanging' }
  ],
  AFFILIATE: {
    ENABLED: true,
    // บัญชี Shopee Affiliate ของคุณ Panusbodee (PAbodee)
    ACCOUNT: {
      NAME: 'PAbodee',
      USERNAME: 'panusbodeepisutsuwimol',
      MY_COLLECTION_URL: 'https://mycollection.shop/panusbodeepisutsuwimol'
    },
    // ลิงก์ตรง Shopee Affiliate ของคุณ Panusbodee
    DIRECT_LINKS: {
      SCALE: 'https://s.shopee.co.th/1LfUtpaDm8',       // เครื่องชั่งน้ำหนักกระเป๋า
      ADAPTER: 'https://s.shopee.co.th/W6NuWtbFJ',     // อะแดปเตอร์สากล
      ESIM: 'https://s.shopee.co.th/7psydzJ9JD',        // eSIM ท่องเที่ยว
      SUITCASE: 'https://s.shopee.co.th/4fvws9ePKr'     // กระเป๋าเดินทาง
    },
    // ลิงก์ตรงแบบเจาะจงสำหรับไอเทมในเช็กลิสต์
    ITEM_EXACT_LINKS: {
      'ชั่งน้ำหนัก': 'https://s.shopee.co.th/1LfUtpaDm8',
      'ตาชั่ง': 'https://s.shopee.co.th/1LfUtpaDm8',
      'หัวแปลงปลั๊ก': 'https://s.shopee.co.th/W6NuWtbFJ',
      'อะแดปเตอร์': 'https://s.shopee.co.th/W6NuWtbFJ',
      'Adapter': 'https://s.shopee.co.th/W6NuWtbFJ',
      'ปลั๊ก': 'https://s.shopee.co.th/W6NuWtbFJ',
      'eSIM': 'https://s.shopee.co.th/7psydzJ9JD',
      'ซิม': 'https://s.shopee.co.th/7psydzJ9JD',
      'กระเป๋าเดินทาง': 'https://s.shopee.co.th/4fvws9ePKr'
    },
    PLATFORMS: {
      SHOPEE: {
        name: 'Shopee',
        badge: 'ช้อป Shopee',
        icon: 'fa-bag-shopping',
        searchUrl: (kw) => `https://shopee.co.th/search?keyword=${encodeURIComponent(kw)}`
      },
      LAZADA: {
        name: 'Lazada',
        badge: 'ช้อป Lazada',
        icon: 'fa-store',
        searchUrl: (kw) => `https://www.lazada.co.th/catalog/?q=${encodeURIComponent(kw)}`
      },
      KLOOK: {
        name: 'Klook',
        badge: 'จอง Klook',
        icon: 'fa-ticket',
        searchUrl: (dest) => `https://www.klook.com/th/search/result/?query=${encodeURIComponent(dest || 'eSIM ท่องเที่ยว')}`
      }
    },
    // คำค้นหาสินค้าสำหรับลิงก์ Affiliate อัตโนมัติในเช็กลิสต์
    ITEM_KEYWORDS: {
      'ขนเป็ด': 'เสื้อกันหนาวขนเป็ด Ultra Light Down',
      'โค้ท': 'เสื้อโค้ทกันหนาว',
      'Heattech': 'เสื้อ Heattech ลองจอนกันหนาว',
      'ลองจอน': 'กางเกงลองจอนกันหนาว',
      'แผ่นแปะความร้อน': 'แผ่นแปะความร้อนกันหนาว Hot Pack',
      'ร่ม': 'ร่มพับกันแดดกันฝน น้ำหนักเบา',
      'เสื้อกันฝน': 'เสื้อกันฝนพกพา',
      'หัวแปลงปลั๊ก': 'Universal Travel Adapter ปลั๊กแปลงสากล',
      'พาวเวอร์แบงก์': 'พาวเวอร์แบงค์ 10000-20000 mAh ขึ้นเครื่องบิน',
      'รองเท้าบูท': 'รองเท้าบูทกันหนาวลุยหิมะ',
      'ถุงมือ': 'ถุงมือกันหนาว ทัชสกรีน',
      'ผ้าพันคอ': 'ผ้าพันคอกันหนาว',
      'กระเป๋าจัดระเบียบ': 'กระเป๋าจัดระเบียบเสื้อผ้า Packing Cubes',
      'ชั่งน้ำหนัก': 'เครื่องชั่งน้ําหนักกระเป๋าเดินทางแบบพกพา ดิจิทัล',
      'ขวดแบ่ง': 'ชุดขวดซิลิโคนแบ่งของเหลว 100ml ขึ้นเครื่องบิน'
    }
  }
};

export const CATEGORIES = {
  DOCUMENTS: {
    id: 'documents',
    name: 'เอกสาร & การเงิน',
    icon: 'fa-passport',
    color: 'amber'
  },
  CLOTHING: {
    id: 'clothing',
    name: 'เสื้อผ้า & เครื่องแต่งกาย',
    icon: 'fa-shirt',
    color: 'indigo'
  },
  WEATHER_GEAR: {
    id: 'weather_gear',
    name: 'อุปกรณ์รับมือสภาพอากาศ',
    icon: 'fa-cloud-sun-rain',
    color: 'sky'
  },
  ELECTRONICS: {
    id: 'electronics',
    name: 'อุปกรณ์อิเล็กทรอนิกส์',
    icon: 'fa-laptop',
    color: 'purple'
  },
  TOILETRIES: {
    id: 'toiletries',
    name: 'ของใช้ส่วนตัว & สุขภาพ',
    icon: 'fa-pump-soap',
    color: 'emerald'
  },
  CUSTOM: {
    id: 'custom',
    name: 'รายการเพิ่มเติมที่คุณระบุ',
    icon: 'fa-list-check',
    color: 'rose'
  }
};

// Default weight estimates for items (in grams)
export const ITEM_WEIGHT_ESTIMATES = {
  'เสื้อยืด': 180,
  'เสื้อผ้า': 180,
  'เสื้อลำลอง': 200,
  'กางเกงยีนส์': 600,
  'กางเกงขายาว': 450,
  'กางเกงขาสั้น': 220,
  'ชุดชั้นใน': 50,
  'ถุงเท้า': 40,
  'ชุดนอน': 300,
  'รองเท้าผ้าใบ': 700,
  'เสื้อแจ็คเก็ตขนเป็ด': 1100,
  'ดาวน์โค้ท': 1200,
  'Heattech': 140,
  'ลองจอน': 180,
  'กางเกงกันลม': 400,
  'รองเท้าบูท': 1100,
  'เสื้อสเวตเตอร์': 450,
  'เสื้อกันหนาว': 500,
  'ร่ม': 220,
  'เสื้อกันฝน': 180,
  'ถุงมือ': 80,
  'ผ้าพันคอ': 150,
  'หมวกไหมพรม': 90,
  'แผ่นแปะความร้อน': 45,
  'แว่นตากันแดด': 40,
  'หมวก': 100,
  'พัดลมพกพา': 180,
  'สเปรย์': 120,
  'สมาร์ทโฟน': 200,
  'พาวเวอร์แบงก์': 280,
  'หัวแปลงปลั๊ก': 120,
  'หูฟัง': 150,
  'แปรงสีฟัน': 80,
  'ครีม': 100,
  'ลิปบาล์ม': 30,
  'ยา': 150,
  'พาสปอร์ต': 50,
  'default': 150
};

// WMO Weather interpretation codes (WW)
export const WMO_WEATHER_CODES = {
  0: { label: 'ท้องฟ้าแจ่มใส', icon: '☀️', condition: 'clear' },
  1: { label: 'โปร่งเป็นส่วนใหญ่', icon: '🌤️', condition: 'mainly_clear' },
  2: { label: 'มีเมฆบางส่วน', icon: '⛅', condition: 'partly_cloudy' },
  3: { label: 'มีเมฆมาก', icon: '☁️', condition: 'overcast' },
  45: { label: 'มีหมอกหนา', icon: '🌫️', condition: 'fog' },
  48: { label: 'มีหมอกน้ำค้างแข็ง', icon: '🌫️', condition: 'fog' },
  51: { label: 'ฝนปรอยเบาบาง', icon: '🌦️', condition: 'drizzle' },
  53: { label: 'ฝนปรอยปานกลาง', icon: '🌦️', condition: 'drizzle' },
  55: { label: 'ฝนปรอยหนาแน่น', icon: '🌧️', condition: 'drizzle' },
  61: { label: 'ฝนตกเล็กน้อย', icon: '🌧️', condition: 'rain' },
  63: { label: 'ฝนตกปานกลาง', icon: '🌧️', condition: 'rain' },
  65: { label: 'ฝนตกหนัก', icon: '🌧️', condition: 'heavy_rain' },
  71: { label: 'หิมะตกเล็กน้อย', icon: '🌨️', condition: 'snow' },
  73: { label: 'หิมะตกปานกลาง', icon: '🌨️', condition: 'snow' },
  75: { label: 'หิมะตกหนัก', icon: '❄️', condition: 'heavy_snow' },
  77: { label: 'เกล็ดหิมะโปรยปราย', icon: '❄️', condition: 'snow' },
  80: { label: 'ฝนตกเป็นช่วงๆ', icon: '🌦️', condition: 'rain' },
  81: { label: 'ฝนตกชุกปานกลาง', icon: '🌧️', condition: 'rain' },
  82: { label: 'ฝนตกชุกรุนแรง', icon: '⛈️', condition: 'heavy_rain' },
  85: { label: 'พายุหิมะเบาบาง', icon: '🌨️', condition: 'snow' },
  86: { label: 'พายุหิมะหนัก', icon: '❄️', condition: 'heavy_snow' },
  95: { label: 'พายุฝนฟ้าคะนอง', icon: '⛈️', condition: 'thunderstorm' },
  96: { label: 'พายุฝนฟ้าคะนองมีลูกเห็บตกเล็กน้อย', icon: '⛈️', condition: 'thunderstorm' },
  99: { label: 'พายุฝนฟ้าคะนองมีลูกเห็บตกหนัก', icon: '⛈️', condition: 'thunderstorm' }
};
