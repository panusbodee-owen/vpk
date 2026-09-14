import { WMO_WEATHER_CODES } from './config.js';

export class WeatherService {
  /**
   * Search for cities using Open-Meteo Geocoding API
   * @param {string} query 
   * @returns {Promise<Array>}
   */
  static async searchCity(query) {
    if (!query || query.trim().length < 2) return [];

    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=6&language=en&format=json`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Geocoding error: ${response.statusText}`);
      }
      const data = await response.json();
      if (!data.results || data.results.length === 0) {
        return [];
      }

      return data.results.map(item => ({
        id: `${item.latitude},${item.longitude}`,
        name: item.name,
        country: item.country || '',
        admin1: item.admin1 || '',
        countryCode: item.country_code ? item.country_code.toUpperCase() : '',
        latitude: item.latitude,
        longitude: item.longitude,
        timezone: item.timezone || 'auto'
      }));
    } catch (error) {
      console.error('Failed to search city:', error);
      throw error;
    }
  }

  /**
   * Fetch weather forecast for specified coordinates and duration or date range
   * @param {number} latitude 
   * @param {number} longitude 
   * @param {number} days 
   * @param {string|null} startDate YYYY-MM-DD
   * @param {string|null} endDate YYYY-MM-DD
   * @returns {Promise<Object>}
   */
  static async getWeatherForecast(latitude, longitude, days = 4, startDate = null, endDate = null) {
    const validDays = Math.min(Math.max(days, 1), 16);
    let url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,windspeed_10m_max&timezone=auto`;

    // If specific dates are provided, check if they are within standard forecast range
    if (startDate && endDate) {
      const start = new Date(startDate);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const maxFutureDate = new Date();
      maxFutureDate.setDate(now.getDate() + 15);

      if (start <= maxFutureDate) {
        url += `&start_date=${startDate}&end_date=${endDate}`;
      } else {
        // Beyond 16 days, query available forecast window
        url += `&forecast_days=${validDays}`;
      }
    } else {
      url += `&forecast_days=${validDays}`;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.statusText}`);
      }
      const data = await response.json();

      if (!data.daily || !data.daily.time) {
        throw new Error('Invalid weather data received');
      }

      const daily = data.daily;
      const count = daily.time.length;

      let overallMinTemp = Infinity;
      let overallMaxTemp = -Infinity;
      let totalTempSum = 0;
      let rainDaysCount = 0;
      let maxRainProb = 0;
      let totalPrecipitation = 0;
      let hasSnow = false;

      const dailyList = [];

      for (let i = 0; i < count; i++) {
        const dateStr = daily.time[i];
        const dateObj = new Date(dateStr);
        const minTemp = Math.round(daily.temperature_2m_min[i]);
        const maxTemp = Math.round(daily.temperature_2m_max[i]);
        const rainProb = daily.precipitation_probability_max ? (daily.precipitation_probability_max[i] || 0) : 0;
        const precipSum = daily.precipitation_sum ? (daily.precipitation_sum[i] || 0) : 0;
        const code = daily.weathercode[i];
        const weatherInfo = WMO_WEATHER_CODES[code] || { label: 'อากาศทั่วไป', icon: '🌤️', condition: 'unknown' };

        overallMinTemp = Math.min(overallMinTemp, minTemp);
        overallMaxTemp = Math.max(overallMaxTemp, maxTemp);
        totalTempSum += (minTemp + maxTemp) / 2;

        if (rainProb >= 30 || precipSum >= 1.0) {
          rainDaysCount++;
        }

        if (rainProb > maxRainProb) {
          maxRainProb = rainProb;
        }

        totalPrecipitation += precipSum;

        if ([71, 73, 75, 77, 85, 86].includes(code) || (minTemp <= 0 && precipSum > 0)) {
          hasSnow = true;
        }

        dailyList.push({
          date: dateStr,
          dayName: dateObj.toLocaleDateString('th-TH', { weekday: 'short' }),
          formattedDate: dateObj.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' }),
          minTemp,
          maxTemp,
          rainProb,
          precipSum: Math.round(precipSum * 10) / 10,
          code,
          label: weatherInfo.label,
          icon: weatherInfo.icon,
          condition: weatherInfo.condition
        });
      }

      const avgTemp = Math.round(totalTempSum / (count || 1));
      const isFreezing = overallMinTemp <= 4;
      const isCold = overallMinTemp < 15;
      const isHot = overallMaxTemp >= 28;
      const willRain = rainDaysCount > 0 || maxRainProb >= 35;

      return {
        latitude,
        longitude,
        days: count,
        startDate: startDate || (dailyList.length > 0 ? dailyList[0].date : null),
        endDate: endDate || (dailyList.length > 0 ? dailyList[dailyList.length - 1].date : null),
        summary: {
          minTemp: overallMinTemp === Infinity ? 25 : overallMinTemp,
          maxTemp: overallMaxTemp === -Infinity ? 32 : overallMaxTemp,
          avgTemp,
          rainDaysCount,
          maxRainProb,
          totalPrecipitation: Math.round(totalPrecipitation * 10) / 10,
          hasSnow,
          isFreezing,
          isCold,
          isHot,
          willRain
        },
        dailyForecast: dailyList
      };
    } catch (error) {
      console.error('Failed to fetch weather forecast:', error);
      throw error;
    }
  }
}
