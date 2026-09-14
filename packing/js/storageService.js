import { APP_CONFIG, CATEGORIES } from './config.js';

export class StorageService {
  /**
   * Save current trip state to LocalStorage
   * @param {Object} tripData 
   */
  static saveCurrentTrip(tripData) {
    try {
      const payload = {
        ...tripData,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem(APP_CONFIG.STORAGE_KEYS.CURRENT_TRIP, JSON.stringify(payload));
      return true;
    } catch (e) {
      console.error('Failed to save current trip to LocalStorage:', e);
      return false;
    }
  }

  /**
   * Load current trip from LocalStorage
   * @returns {Object|null}
   */
  static loadCurrentTrip() {
    try {
      const raw = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.CURRENT_TRIP);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      console.error('Failed to parse current trip from LocalStorage:', e);
      return null;
    }
  }

  /**
   * Clear current trip state
   */
  static clearCurrentTrip() {
    try {
      localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.CURRENT_TRIP);
    } catch (e) {
      console.error('Failed to clear current trip:', e);
    }
  }

  /**
   * Save a trip to history bookmarks
   * @param {Object} tripData 
   * @returns {string} ID of saved trip
   */
  static saveTripToHistory(tripData) {
    try {
      const savedTrips = this.getSavedTrips();
      const tripId = `trip_${Date.now()}`;
      const dateRangeStr = (tripData.startDate && tripData.endDate) 
        ? ` (${tripData.startDate} ถึง ${tripData.endDate})`
        : ` (${tripData.days} วัน)`;

      const newEntry = {
        id: tripId,
        title: `${tripData.destination.name}${dateRangeStr}`,
        destination: tripData.destination,
        days: tripData.days,
        startDate: tripData.startDate,
        endDate: tripData.endDate,
        weather: tripData.weather,
        items: tripData.items,
        baggage: tripData.baggage || null,
        budget: tripData.budget || null,
        savedAt: new Date().toISOString()
      };

      // Keep up to 20 trips
      savedTrips.unshift(newEntry);
      const trimmed = savedTrips.slice(0, 20);
      localStorage.setItem(APP_CONFIG.STORAGE_KEYS.SAVED_TRIPS, JSON.stringify(trimmed));
      return tripId;
    } catch (e) {
      console.error('Failed to save trip to history:', e);
      return null;
    }
  }

  /**
   * Get all saved trips from history
   * @returns {Array}
   */
  static getSavedTrips() {
    try {
      const raw = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.SAVED_TRIPS);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch (e) {
      console.error('Failed to get saved trips:', e);
      return [];
    }
  }

  /**
   * Delete a trip from history
   * @param {string} tripId 
   */
  static deleteSavedTrip(tripId) {
    try {
      const savedTrips = this.getSavedTrips();
      const filtered = savedTrips.filter(t => t.id !== tripId);
      localStorage.setItem(APP_CONFIG.STORAGE_KEYS.SAVED_TRIPS, JSON.stringify(filtered));
      return true;
    } catch (e) {
      console.error('Failed to delete saved trip:', e);
      return false;
    }
  }

  /**
   * Generate clean formatted text/markdown for copying or exporting
   * @param {Object} tripData 
   * @returns {string}
   */
  static generateTextExport(tripData) {
    if (!tripData || !tripData.items) return '';

    const { destination, days, startDate, endDate, weather, items, baggage, budget } = tripData;
    const destName = destination ? `${destination.name}, ${destination.country}` : 'ทริปเดินทาง';
    const minT = weather?.summary?.minTemp ?? '-';
    const maxT = weather?.summary?.maxTemp ?? '-';
    const dateText = (startDate && endDate) ? `${startDate} ถึง ${endDate} (รวม ${days} วัน)` : `${days} วัน`;
    
    let text = `✈️ Smart Packing List: ${destName}\n`;
    text += `📅 ช่วงวันเดินทาง: ${dateText}\n`;
    text += `🌡️ อุณหภูมิ: ${minT}°C ถึง ${maxT}°C | โอกาสฝนสูงสุด: ${weather?.summary?.maxRainProb ?? 0}%\n`;
    
    if (baggage && baggage.totalKg !== undefined) {
      text += `⚖️ น้ำหนักกระเป๋า: ${baggage.totalKg} kg (โควตา ${baggage.limitKg} kg | เหลือช้อปปิ้ง ${baggage.remainingKg} kg)\n`;
    }

    if (budget && budget.totalTHB !== undefined) {
      const foreignStr = budget.currencyCode ? ` (≈ ${budget.totalForeign?.toLocaleString()} ${budget.currencyCode})` : '';
      text += `💰 งบประมาณรวม: ${budget.totalTHB?.toLocaleString()} บาท${foreignStr} | เฉลี่ยวันละ ${budget.dailyAverageTHB?.toLocaleString()} บาท\n`;
    }

    text += `----------------------------------------\n\n`;

    // Group items by category
    const grouped = {};
    Object.values(CATEGORIES).forEach(cat => {
      grouped[cat.id] = {
        name: cat.name,
        items: []
      };
    });

    items.forEach(item => {
      const catId = item.category || 'custom';
      if (!grouped[catId]) {
        grouped[catId] = { name: 'อื่นๆ', items: [] };
      }
      grouped[catId].items.push(item);
    });

    Object.values(grouped).forEach(group => {
      if (group.items.length > 0) {
        text += `📁 ${group.name}\n`;
        group.items.forEach(item => {
          const checkMark = item.checked ? '[x]' : '[ ]';
          const weightStr = item.weightGrams ? ` [~${item.weightGrams * (item.quantity || 1)}g]` : '';
          text += `  ${checkMark} ${item.name} (${item.quantity} ${item.unit || 'ชิ้น'})${weightStr}${item.reason ? ` - ${item.reason}` : ''}\n`;
        });
        text += `\n`;
      }
    });

    const packedCount = items.filter(i => i.checked).length;
    const percent = Math.round((packedCount / items.length) * 100) || 0;
    text += `📊 สถานะ: จัดแล้ว ${packedCount}/${items.length} รายการ (${percent}%)\n`;
    text += `สร้างโดย Smart Packing List (Weather, Luggage Scale & Budget Planner)\n`;

    return text;
  }
}
