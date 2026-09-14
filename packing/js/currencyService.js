// Currency Mapping and Live Exchange Rate Service

export const COUNTRY_CURRENCY_MAP = {
  'JP': { code: 'JPY', symbol: '¥', name: 'เยนญี่ปุ่น' },
  'KR': { code: 'KRW', symbol: '₩', name: 'วอนเกาหลีใต้' },
  'GB': { code: 'GBP', symbol: '£', name: 'ปอนด์สเตอร์ลิง' },
  'FR': { code: 'EUR', symbol: '€', name: 'ยูโร' },
  'DE': { code: 'EUR', symbol: '€', name: 'ยูโร' },
  'IT': { code: 'EUR', symbol: '€', name: 'ยูโร' },
  'ES': { code: 'EUR', symbol: '€', name: 'ยูโร' },
  'CH': { code: 'CHF', symbol: 'CHF', name: 'ฟรังก์สวิส' },
  'IS': { code: 'ISK', symbol: 'kr', name: 'โครนาไอซ์แลนด์' },
  'SG': { code: 'SGD', symbol: 'S$', name: 'ดอลลาร์สิงคโปร์' },
  'US': { code: 'USD', symbol: '$', name: 'ดอลลาร์สหรัฐ' },
  'AU': { code: 'AUD', symbol: 'A$', name: 'ดอลลาร์ออสเตรเลีย' },
  'CN': { code: 'CNY', symbol: '¥', name: 'หยวนจีน' },
  'TW': { code: 'TWD', symbol: 'NT$', name: 'ดอลลาร์ไต้หวัน' },
  'HK': { code: 'HKD', symbol: 'HK$', name: 'ดอลลาร์ฮ่องกง' },
  'VN': { code: 'VND', symbol: '₫', name: 'ดงเวียดนาม' },
  'MY': { code: 'MYR', symbol: 'RM', name: 'ริงกิตมาเลเซีย' },
  'TH': { code: 'THB', symbol: '฿', name: 'บาทไทย' }
};

export class CurrencyService {
  static ratesCache = null;
  static lastFetchTime = 0;

  /**
   * Find currency details by country code or country name
   * @param {string} countryCode 
   * @param {string} countryName 
   * @returns {Object}
   */
  static getCurrencyForCountry(countryCode, countryName = '') {
    if (countryCode && COUNTRY_CURRENCY_MAP[countryCode.toUpperCase()]) {
      return COUNTRY_CURRENCY_MAP[countryCode.toUpperCase()];
    }

    const lowerName = countryName.toLowerCase();
    if (lowerName.includes('japan') || lowerName.includes('ญี่ปุ่น')) return COUNTRY_CURRENCY_MAP['JP'];
    if (lowerName.includes('korea') || lowerName.includes('เกาหลี')) return COUNTRY_CURRENCY_MAP['KR'];
    if (lowerName.includes('united kingdom') || lowerName.includes('uk') || lowerName.includes('อังกฤษ')) return COUNTRY_CURRENCY_MAP['GB'];
    if (lowerName.includes('france') || lowerName.includes('ฝรั่งเศส')) return COUNTRY_CURRENCY_MAP['FR'];
    if (lowerName.includes('singapore') || lowerName.includes('สิงคโปร์')) return COUNTRY_CURRENCY_MAP['SG'];
    if (lowerName.includes('iceland') || lowerName.includes('ไอซ์แลนด์')) return COUNTRY_CURRENCY_MAP['IS'];
    if (lowerName.includes('united states') || lowerName.includes('usa') || lowerName.includes('อเมริกา')) return COUNTRY_CURRENCY_MAP['US'];
    if (lowerName.includes('thailand') || lowerName.includes('ไทย')) return COUNTRY_CURRENCY_MAP['TH'];
    if (lowerName.includes('taiwan') || lowerName.includes('ไต้หวัน')) return COUNTRY_CURRENCY_MAP['TW'];
    if (lowerName.includes('hong kong') || lowerName.includes('ฮ่องกง')) return COUNTRY_CURRENCY_MAP['HK'];
    if (lowerName.includes('vietnam') || lowerName.includes('เวียดนาม')) return COUNTRY_CURRENCY_MAP['VN'];

    return { code: 'USD', symbol: '$', name: 'ดอลลาร์สหรัฐ' };
  }

  /**
   * Fetch live exchange rates relative to THB
   * @returns {Promise<Object>}
   */
  static async fetchRates() {
    const now = Date.now();
    // Cache for 30 minutes
    if (this.ratesCache && (now - this.lastFetchTime < 1800000)) {
      return this.ratesCache;
    }

    try {
      const res = await fetch('https://open.er-api.com/v6/latest/THB');
      if (!res.ok) throw new Error('Currency API error');
      const data = await res.json();
      if (data && data.rates) {
        this.ratesCache = data.rates;
        this.lastFetchTime = now;
        return data.rates;
      }
    } catch (e) {
      console.warn('Failed to fetch live currency rates, using fallback:', e);
    }

    // Fallback typical interbank rates
    return {
      THB: 1,
      JPY: 4.73,
      KRW: 41.2,
      USD: 0.030,
      EUR: 0.026,
      GBP: 0.022,
      SGD: 0.038,
      CNY: 0.20,
      TWD: 0.96,
      HKD: 0.24,
      ISK: 3.67,
      VND: 789.0,
      MYR: 0.12
    };
  }

  /**
   * Get formatted rate string between THB and target currency
   * @param {string} targetCurrency 
   * @returns {Promise<Object>}
   */
  static async getRateInfo(targetCurrency = 'JPY') {
    const rates = await this.fetchRates();
    const rateToTarget = rates[targetCurrency] || 1; // 1 THB = X Target
    const oneTargetInTHB = rateToTarget > 0 ? (1 / rateToTarget) : 1;

    return {
      currencyCode: targetCurrency,
      rateToTarget, // 1 THB = rateToTarget Target
      oneTargetInTHB, // 1 Target = oneTargetInTHB THB
      formatted: `1 THB ≈ ${rateToTarget.toFixed(2)} ${targetCurrency} (1 ${targetCurrency} ≈ ${oneTargetInTHB.toFixed(2)} บาท)`
    };
  }
}
