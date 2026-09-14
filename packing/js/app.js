import { APP_CONFIG, CATEGORIES } from './config.js';
import { WeatherService } from './weatherService.js';
import { PackingEngine } from './packingEngine.js';
import { StorageService } from './storageService.js';
import { CurrencyService } from './currencyService.js';

class SmartPackingApp {
  constructor() {
    // Calculate default dates: Today to +3 days (4 days total)
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + 3);

    this.state = {
      startDate: this.formatDateYMD(today),
      endDate: this.formatDateYMD(futureDate),
      days: 4,
      selectedCity: null,
      weather: null,
      items: [],
      filter: 'all',
      isLoading: false,
      theme: {
        mode: 'light',
        accent: 'ocean'
      },
      baggage: {
        presetId: 'checked_20',
        limitKg: 20,
        emptyBagKg: 3.8,
        packedOnly: false
      },
      currency: {
        code: 'JPY',
        symbol: '¥',
        rateToTarget: 4.73,
        oneTargetInTHB: 0.21
      },
      budget: {
        flights: 12000,
        hotel: 8000,
        food: 6000,
        activities: 3000,
        shopping: 5000,
        emergency: 2000,
        totalTHB: 36000,
        totalForeign: 170280,
        dailyAverageTHB: 9000
      }
    };

    this.debounceTimer = null;

    // Cache DOM Elements
    this.dom = {
      // Inputs
      inputCity: document.getElementById('input-city'),
      btnClearCity: document.getElementById('btn-clear-city'),
      autocompleteList: document.getElementById('autocomplete-list'),
      inputStartDate: document.getElementById('input-start-date'),
      inputEndDate: document.getElementById('input-end-date'),
      displayDays: document.getElementById('display-days'),
      durationChips: document.querySelectorAll('.duration-chip'),
      btnGeneratePlan: document.getElementById('btn-generate-plan'),
      btnGenerateText: document.getElementById('btn-generate-text'),
      btnGenerateIcon: document.getElementById('btn-generate-icon'),
      btnGenerateSpinner: document.getElementById('btn-generate-spinner'),
      cityChips: document.querySelectorAll('.city-chip'),

      // Theme Elements
      btnThemePalette: document.getElementById('btn-theme-palette'),
      paletteDropdown: document.getElementById('palette-dropdown'),
      themeAccentOpts: document.querySelectorAll('.theme-accent-opt'),
      btnThemeDarkToggle: document.getElementById('btn-theme-dark-toggle'),
      themeDarkIcon: document.getElementById('theme-dark-icon'),

      // Sections
      emptyState: document.getElementById('empty-state'),
      weatherSection: document.getElementById('weather-section'),
      budgetSection: document.getElementById('budget-section'),
      weightSection: document.getElementById('weight-section'),
      checklistSection: document.getElementById('checklist-section'),

      // Budget & Currency Elements
      budgetExchangeRateText: document.getElementById('budget-exchange-rate-text'),
      bookingCityDateLabel: document.getElementById('booking-city-date-label'),
      linkSearchFlights: document.getElementById('link-search-flights'),
      linkSearchHotels: document.getElementById('link-search-hotels'),
      linkSearchActivities: document.getElementById('link-search-activities'),
      btnSuggestBudget: document.getElementById('btn-suggest-budget'),
      budgetFlights: document.getElementById('budget-flights'),
      budgetHotel: document.getElementById('budget-hotel'),
      budgetFood: document.getElementById('budget-food'),
      budgetActivities: document.getElementById('budget-activities'),
      budgetShopping: document.getElementById('budget-shopping'),
      budgetEmergency: document.getElementById('budget-emergency'),
      budgetTotalThb: document.getElementById('budget-total-thb'),
      budgetTotalForeign: document.getElementById('budget-total-foreign'),
      budgetForeignCurrencyCode: document.getElementById('budget-foreign-currency-code'),
      budgetDailyAverage: document.getElementById('budget-daily-average'),
      quickConvertThb: document.getElementById('quick-convert-thb'),
      quickConvertForeign: document.getElementById('quick-convert-foreign'),
      quickConvertForeignLabel: document.getElementById('quick-convert-foreign-label'),

      // Luggage Scale Elements
      selectBaggagePreset: document.getElementById('select-baggage-preset'),
      weightCurrentKg: document.getElementById('weight-current-kg'),
      weightLimitKg: document.getElementById('weight-limit-kg'),
      weightRemainingBadge: document.getElementById('weight-remaining-badge'),
      weightRemainingText: document.getElementById('weight-remaining-text'),
      weightPercentageText: document.getElementById('weight-percentage-text'),
      weightBarFill: document.getElementById('weight-bar-fill'),
      weightEmptyBagText: document.getElementById('weight-empty-bag-text'),
      weightItemsText: document.getElementById('weight-items-text'),
      checkWeightPackedOnly: document.getElementById('check-weight-packed-only'),
      weightOverweightAlert: document.getElementById('weight-overweight-alert'),
      weightOverweightDesc: document.getElementById('weight-overweight-desc'),

      // Weather elements
      weatherCityTitle: document.getElementById('weather-city-title'),
      weatherDateRangeBadge: document.getElementById('weather-date-range-badge'),
      weatherDateRangeText: document.getElementById('weather-date-range-text'),
      weatherLastUpdated: document.getElementById('weather-last-updated'),
      weatherSummaryBadges: document.getElementById('weather-summary-badges'),
      weatherDailyGrid: document.getElementById('weather-daily-grid'),
      weatherInsightText: document.getElementById('weather-insight-text'),
      weatherForecastDaysLabel: document.getElementById('weather-forecast-days-label'),

      // Progress & Checklist
      progressPercent: document.getElementById('progress-percent'),
      progressCount: document.getElementById('progress-count'),
      progressBarFill: document.getElementById('progress-bar-fill'),
      badgeTotalItems: document.getElementById('badge-total-items'),
      categoriesContainer: document.getElementById('categories-container'),
      affiliateGearCard: document.getElementById('affiliate-gear-card'),
      affiliateGearGrid: document.getElementById('affiliate-gear-grid'),
      filterTabs: document.querySelectorAll('.filter-tab'),
      countAll: document.getElementById('count-all'),
      countUnpacked: document.getElementById('count-unpacked'),
      countPacked: document.getElementById('count-packed'),

      // Actions
      btnCheckAll: document.getElementById('btn-check-all'),
      btnUncheckAll: document.getElementById('btn-uncheck-all'),
      btnResetTrip: document.getElementById('btn-reset-trip'),
      btnSaveTripBookmark: document.getElementById('btn-save-trip-bookmark'),
      btnOpenHistory: document.getElementById('btn-open-history'),
      savedTripsCount: document.getElementById('saved-trips-count'),
      btnExportOptions: document.getElementById('btn-export-options'),

      // Modals
      modalAddItem: document.getElementById('modal-add-item'),
      formAddItem: document.getElementById('form-add-item'),
      addItemName: document.getElementById('add-item-name'),
      addItemQty: document.getElementById('add-item-qty'),
      addItemUnit: document.getElementById('add-item-unit'),
      addItemWeight: document.getElementById('add-item-weight'),
      addItemCategory: document.getElementById('add-item-category'),
      addItemReason: document.getElementById('add-item-reason'),
      btnOpenAddModal: document.getElementById('btn-add-item-modal'),
      btnCloseAddModal: document.getElementById('btn-close-add-modal'),
      btnCancelAdd: document.getElementById('btn-cancel-add'),

      modalHistory: document.getElementById('modal-history'),
      historyTripsList: document.getElementById('history-trips-list'),
      btnCloseHistoryModal: document.getElementById('btn-close-history-modal'),
      btnCloseHistoryFooter: document.getElementById('btn-close-history-footer'),

      modalExport: document.getElementById('modal-export'),
      btnCloseExportModal: document.getElementById('btn-close-export-modal'),
      btnCloseExportFooter: document.getElementById('btn-close-export-footer'),
      btnActionCopyText: document.getElementById('btn-action-copy-text'),
      btnActionPrint: document.getElementById('btn-action-print'),
      btnActionDownloadJson: document.getElementById('btn-action-download-json'),

      // Privacy Policy Modal (AdSense Compliance)
      modalPrivacy: document.getElementById('modal-privacy'),
      btnOpenPrivacy: document.getElementById('btn-open-privacy'),
      btnClosePrivacyModal: document.getElementById('btn-close-privacy-modal'),
      btnClosePrivacyFooter: document.getElementById('btn-close-privacy-footer'),

      // Print
      printTitle: document.getElementById('print-title'),
      printSubtitle: document.getElementById('print-subtitle'),

      // Toast
      toastContainer: document.getElementById('toast-container')
    };

    this.init();
  }

  formatDateYMD(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  formatDateThai(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  init() {
    this.initTheme();
    this.populateCategorySelect();
    this.populateBaggagePresets();
    this.setupDateInputs();
    this.bindEvents();
    this.updateSavedTripsBadge();

    // Check LocalStorage for saved active trip
    const savedTrip = StorageService.loadCurrentTrip();
    if (savedTrip && savedTrip.destination && savedTrip.items && savedTrip.items.length > 0) {
      this.restoreTrip(savedTrip);
      this.showToast('โหลดข้อมูลทริปล่าสุดจาก LocalStorage เรียบร้อยแล้ว', 'info');
    }
  }

  initTheme() {
    // Mode (Light / Dark)
    const savedMode = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.THEME_MODE) || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    // Accent (ocean, sunset, forest, purple)
    const savedAccent = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.THEME_ACCENT) || 'ocean';

    this.setThemeMode(savedMode);
    this.setThemeAccent(savedAccent);
  }

  setThemeMode(mode) {
    this.state.theme.mode = mode;
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
      this.dom.themeDarkIcon.className = 'fa-solid fa-sun text-sm text-amber-400';
    } else {
      document.documentElement.classList.remove('dark');
      this.dom.themeDarkIcon.className = 'fa-solid fa-moon text-sm text-slate-600';
    }
    localStorage.setItem(APP_CONFIG.STORAGE_KEYS.THEME_MODE, mode);
  }

  setThemeAccent(accent) {
    this.state.theme.accent = accent;
    document.documentElement.setAttribute('data-accent', accent);
    localStorage.setItem(APP_CONFIG.STORAGE_KEYS.THEME_ACCENT, accent);
  }

  populateCategorySelect() {
    this.dom.addItemCategory.innerHTML = '';
    Object.values(CATEGORIES).forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat.id;
      opt.textContent = cat.name;
      this.dom.addItemCategory.appendChild(opt);
    });
  }

  populateBaggagePresets() {
    this.dom.selectBaggagePreset.innerHTML = '';
    APP_CONFIG.BAGGAGE_PRESETS.forEach(preset => {
      const opt = document.createElement('option');
      opt.value = preset.id;
      opt.textContent = preset.name;
      if (preset.id === this.state.baggage.presetId) {
        opt.selected = true;
      }
      this.dom.selectBaggagePreset.appendChild(opt);
    });
  }

  setupDateInputs() {
    this.dom.inputStartDate.value = this.state.startDate;
    this.dom.inputEndDate.value = this.state.endDate;
    this.dom.inputStartDate.min = this.formatDateYMD(new Date());
    this.dom.inputEndDate.min = this.state.startDate;
    this.recalculateDays();
  }

  recalculateDays() {
    const start = new Date(this.dom.inputStartDate.value);
    const end = new Date(this.dom.inputEndDate.value);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      this.state.days = 1;
    } else {
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
      this.state.days = Math.max(1, Math.min(diffDays, 16));
    }

    this.state.startDate = this.dom.inputStartDate.value;
    this.state.endDate = this.dom.inputEndDate.value;
    this.dom.displayDays.textContent = this.state.days;

    // Highlight active chip
    this.dom.durationChips.forEach(chip => {
      if (parseInt(chip.dataset.days, 10) === this.state.days) {
        chip.className = 'duration-chip px-2.5 py-1 bg-blue-600 text-white rounded-lg font-medium transition shadow-sm';
      } else {
        chip.className = 'duration-chip px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-900/60 hover:text-blue-700 dark:hover:text-blue-300 rounded-lg text-slate-600 dark:text-slate-300 font-medium transition';
      }
    });

    this.updateBookingLinks();
  }

  bindEvents() {
    // Theme Dark / Light toggle
    this.dom.btnThemeDarkToggle.addEventListener('click', () => {
      const nextMode = this.state.theme.mode === 'dark' ? 'light' : 'dark';
      this.setThemeMode(nextMode);
      this.showToast(nextMode === 'dark' ? 'เปิดโหมดมืด (Dark Mode)' : 'เปิดโหมดสว่าง (Light Mode)', 'info');
    });

    // Theme Palette dropdown toggle
    this.dom.btnThemePalette.addEventListener('click', (e) => {
      e.stopPropagation();
      this.dom.paletteDropdown.classList.toggle('hidden');
    });

    // Close palette when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.dom.paletteDropdown.contains(e.target) && !this.dom.btnThemePalette.contains(e.target)) {
        this.dom.paletteDropdown.classList.add('hidden');
      }
    });

    // Theme Accent selection
    this.dom.themeAccentOpts.forEach(btn => {
      btn.addEventListener('click', () => {
        const accent = btn.dataset.accent;
        this.setThemeAccent(accent);
        this.dom.paletteDropdown.classList.add('hidden');
        this.showToast(`เปลี่ยนโทนสีเป็น ${btn.textContent.trim()}`, 'success');
      });
    });

    // Baggage Preset Selector
    this.dom.selectBaggagePreset.addEventListener('change', (e) => {
      const selected = APP_CONFIG.BAGGAGE_PRESETS.find(p => p.id === e.target.value);
      if (selected) {
        this.state.baggage.presetId = selected.id;
        this.state.baggage.limitKg = selected.limitKg;
        this.state.baggage.emptyBagKg = selected.emptyBagKg;
        this.updateLuggageWeight();
        this.persistCurrentTrip();
      }
    });

    // Packed Only checkbox for weight
    this.dom.checkWeightPackedOnly.addEventListener('change', (e) => {
      this.state.baggage.packedOnly = e.target.checked;
      this.updateLuggageWeight();
      this.persistCurrentTrip();
    });

    // Budget Input listeners
    const budgetInputs = [
      this.dom.budgetFlights,
      this.dom.budgetHotel,
      this.dom.budgetFood,
      this.dom.budgetActivities,
      this.dom.budgetShopping,
      this.dom.budgetEmergency
    ];
    budgetInputs.forEach(input => {
      input.addEventListener('input', () => {
        this.calculateBudget();
        this.persistCurrentTrip();
      });
    });

    // Suggest Budget Button
    this.dom.btnSuggestBudget.addEventListener('click', () => {
      this.suggestBudgetForTrip();
      this.persistCurrentTrip();
      this.showToast('คำนวณงบประมาณแนะนำเรียบร้อยแล้ว', 'info');
    });

    // Quick Currency Converter Inputs
    this.dom.quickConvertThb.addEventListener('input', (e) => {
      const thb = parseFloat(e.target.value) || 0;
      const rate = this.state.currency.rateToTarget || 1;
      this.dom.quickConvertForeign.value = Math.round(thb * rate);
    });

    this.dom.quickConvertForeign.addEventListener('input', (e) => {
      const foreign = parseFloat(e.target.value) || 0;
      const rate = this.state.currency.rateToTarget || 1;
      this.dom.quickConvertThb.value = rate > 0 ? Math.round(foreign / rate) : 0;
    });

    // Date changes
    this.dom.inputStartDate.addEventListener('change', () => {
      const start = new Date(this.dom.inputStartDate.value);
      const end = new Date(this.dom.inputEndDate.value);
      this.dom.inputEndDate.min = this.dom.inputStartDate.value;

      if (end < start) {
        const newEnd = new Date(start);
        newEnd.setDate(start.getDate() + 3);
        this.dom.inputEndDate.value = this.formatDateYMD(newEnd);
      }
      this.recalculateDays();
    });

    this.dom.inputEndDate.addEventListener('change', () => {
      const start = new Date(this.dom.inputStartDate.value);
      const end = new Date(this.dom.inputEndDate.value);

      if (end < start) {
        this.dom.inputStartDate.value = this.dom.inputEndDate.value;
      }
      this.recalculateDays();
    });

    // Duration preset chips
    this.dom.durationChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const count = parseInt(chip.dataset.days, 10);
        const start = new Date(this.dom.inputStartDate.value || new Date());
        const newEnd = new Date(start);
        newEnd.setDate(start.getDate() + (count - 1));

        this.dom.inputEndDate.value = this.formatDateYMD(newEnd);
        this.recalculateDays();
      });
    });

    // City Autocomplete input
    this.dom.inputCity.addEventListener('input', (e) => this.handleCityInput(e.target.value));
    this.dom.inputCity.addEventListener('focus', () => {
      if (this.dom.inputCity.value.trim().length >= 2) {
        this.dom.autocompleteList.classList.remove('hidden');
      }
    });

    // Close autocomplete when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.dom.inputCity.contains(e.target) && !this.dom.autocompleteList.contains(e.target)) {
        this.dom.autocompleteList.classList.add('hidden');
      }
    });

    // Clear city input
    this.dom.btnClearCity.addEventListener('click', () => {
      this.dom.inputCity.value = '';
      this.state.selectedCity = null;
      this.dom.btnClearCity.classList.add('hidden');
      this.dom.autocompleteList.classList.add('hidden');
      this.dom.inputCity.focus();
    });

    // Quick City Chips
    this.dom.cityChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const cityQuery = chip.dataset.city;
        this.dom.inputCity.value = chip.textContent.trim();
        this.selectCityByName(cityQuery);
      });
    });

    // Generate Plan Button
    this.dom.btnGeneratePlan.addEventListener('click', () => this.generatePackingPlan());

    // Filter Tabs
    this.dom.filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.state.filter = tab.dataset.filter;
        this.updateFilterTabsUI();
        this.renderChecklist();
      });
    });

    // Bulk checklist actions
    this.dom.btnCheckAll.addEventListener('click', () => this.setAllItemsChecked(true));
    this.dom.btnUncheckAll.addEventListener('click', () => this.setAllItemsChecked(false));

    // Reset button
    this.dom.btnResetTrip.addEventListener('click', () => {
      if (confirm('คุณต้องการล้างรายการปัจจุบันและเริ่มใหม่ใช่หรือไม่?')) {
        this.resetAll();
      }
    });

    // Bookmark / Save trip
    this.dom.btnSaveTripBookmark.addEventListener('click', () => this.saveTripBookmark());

    // History Modal
    this.dom.btnOpenHistory.addEventListener('click', () => this.openHistoryModal());
    this.dom.btnCloseHistoryModal.addEventListener('click', () => this.dom.modalHistory.classList.add('hidden'));
    this.dom.btnCloseHistoryFooter.addEventListener('click', () => this.dom.modalHistory.classList.add('hidden'));

    // Export Modal
    this.dom.btnExportOptions.addEventListener('click', () => this.dom.modalExport.classList.remove('hidden'));
    this.dom.btnCloseExportModal.addEventListener('click', () => this.dom.modalExport.classList.add('hidden'));
    this.dom.btnCloseExportFooter.addEventListener('click', () => this.dom.modalExport.classList.add('hidden'));

    // Privacy Policy Modal
    if (this.dom.btnOpenPrivacy) {
      this.dom.btnOpenPrivacy.addEventListener('click', () => this.dom.modalPrivacy?.classList.remove('hidden'));
    }
    if (this.dom.btnClosePrivacyModal) {
      this.dom.btnClosePrivacyModal.addEventListener('click', () => this.dom.modalPrivacy?.classList.add('hidden'));
    }
    if (this.dom.btnClosePrivacyFooter) {
      this.dom.btnClosePrivacyFooter.addEventListener('click', () => this.dom.modalPrivacy?.classList.add('hidden'));
    }

    // Export Actions
    this.dom.btnActionCopyText.addEventListener('click', () => this.copyChecklistText());
    this.dom.btnActionPrint.addEventListener('click', () => {
      this.dom.modalExport.classList.add('hidden');
      window.print();
    });
    this.dom.btnActionDownloadJson.addEventListener('click', () => this.downloadJsonBackup());

    // Add Custom Item Modal
    this.dom.btnOpenAddModal.addEventListener('click', () => {
      this.dom.modalAddItem.classList.remove('hidden');
      this.dom.addItemName.focus();
    });
    this.dom.btnCloseAddModal.addEventListener('click', () => this.dom.modalAddItem.classList.add('hidden'));
    this.dom.btnCancelAdd.addEventListener('click', () => this.dom.modalAddItem.classList.add('hidden'));
    this.dom.formAddItem.addEventListener('submit', (e) => this.handleAddCustomItem(e));
  }

  // Handle autocomplete typing
  handleCityInput(val) {
    const query = val.trim();
    if (query.length > 0) {
      this.dom.btnClearCity.classList.remove('hidden');
    } else {
      this.dom.btnClearCity.classList.add('hidden');
      this.dom.autocompleteList.classList.add('hidden');
      this.state.selectedCity = null;
      return;
    }

    clearTimeout(this.debounceTimer);
    if (query.length < 2) {
      this.dom.autocompleteList.classList.add('hidden');
      return;
    }

    this.debounceTimer = setTimeout(async () => {
      try {
        const results = await WeatherService.searchCity(query);
        this.renderAutocomplete(results);
      } catch (err) {
        console.warn('Geocoding search failed:', err);
      }
    }, 300);
  }

  renderAutocomplete(results) {
    this.dom.autocompleteList.innerHTML = '';
    if (!results || results.length === 0) {
      this.dom.autocompleteList.innerHTML = `
        <div class="p-3 text-xs text-slate-400 text-center">ไม่พบชื่อเมืองที่ค้นหา ลองพิมพ์ชื่อเป็นภาษาอังกฤษ</div>
      `;
      this.dom.autocompleteList.classList.remove('hidden');
      return;
    }

    results.forEach(city => {
      const item = document.createElement('div');
      item.className = 'px-4 py-2.5 hover:bg-blue-50 dark:hover:bg-slate-700 cursor-pointer flex items-center justify-between transition text-sm';
      item.innerHTML = `
        <div class="flex items-center space-x-2">
          <i class="fa-solid fa-location-dot text-rose-500 text-xs"></i>
          <div>
            <span class="font-medium text-slate-800 dark:text-white">${city.name}</span>
            <span class="text-xs text-slate-400 ml-1">${city.admin1 ? `${city.admin1}, ` : ''}${city.country}</span>
          </div>
        </div>
        <span class="text-[10px] font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded">${city.countryCode}</span>
      `;
      item.addEventListener('click', () => {
        this.state.selectedCity = city;
        this.dom.inputCity.value = `${city.name}, ${city.country}`;
        this.dom.autocompleteList.classList.add('hidden');
        this.updateBookingLinks();
      });
      this.dom.autocompleteList.appendChild(item);
    });

    this.dom.autocompleteList.classList.remove('hidden');
  }

  async selectCityByName(cityName) {
    try {
      this.setButtonLoading(true);
      const results = await WeatherService.searchCity(cityName);
      if (results && results.length > 0) {
        this.state.selectedCity = results[0];
        this.dom.inputCity.value = `${results[0].name}, ${results[0].country}`;
        this.updateBookingLinks();
      }
    } catch (e) {
      console.error(e);
    } finally {
      this.setButtonLoading(false);
    }
  }

  setButtonLoading(isLoading) {
    this.state.isLoading = isLoading;
    if (isLoading) {
      this.dom.btnGenerateText.textContent = 'กำลังดึงสภาพอากาศ...';
      this.dom.btnGenerateIcon.classList.add('hidden');
      this.dom.btnGenerateSpinner.classList.remove('hidden');
      this.dom.btnGeneratePlan.disabled = true;
    } else {
      this.dom.btnGenerateText.textContent = 'สร้างรายการจัดกระเป๋า';
      this.dom.btnGenerateIcon.classList.remove('hidden');
      this.dom.btnGenerateSpinner.classList.add('hidden');
      this.dom.btnGeneratePlan.disabled = false;
    }
  }

  updateBookingLinks() {
    const cityName = this.state.selectedCity?.name || this.dom.inputCity.value.trim() || 'Tokyo';
    const start = this.state.startDate;
    const end = this.state.endDate;

    this.dom.bookingCityDateLabel.textContent = `(${cityName} • ${start} ถึง ${end})`;

    // Google Flights Link
    this.dom.linkSearchFlights.href = `https://www.google.com/travel/flights?q=Flights%20to%20${encodeURIComponent(cityName)}%20from%20Bangkok%20on%20${start}%20through%20${end}`;

    // Agoda Link
    this.dom.linkSearchHotels.href = `https://www.agoda.com/search?text=${encodeURIComponent(cityName)}&checkIn=${start}&checkOut=${end}`;

    // Klook Link
    this.dom.linkSearchActivities.href = `https://www.klook.com/th/search/result/?query=${encodeURIComponent(cityName)}`;
  }

  async updateCurrencyAndRates() {
    const city = this.state.selectedCity;
    const countryCode = city?.countryCode || 'JP';
    const countryName = city?.country || 'Japan';

    const curr = CurrencyService.getCurrencyForCountry(countryCode, countryName);
    const rateInfo = await CurrencyService.getRateInfo(curr.code);

    this.state.currency = {
      code: curr.code,
      name: curr.name,
      symbol: curr.symbol,
      rateToTarget: rateInfo.rateToTarget,
      oneTargetInTHB: rateInfo.oneTargetInTHB
    };

    // Update Currency labels in DOM
    this.dom.budgetExchangeRateText.textContent = `1 THB ≈ ${rateInfo.rateToTarget.toFixed(2)} ${curr.code}`;
    this.dom.budgetForeignCurrencyCode.textContent = curr.code;
    this.dom.quickConvertForeignLabel.textContent = `${curr.name} (${curr.code})`;

    // Update Quick converter sample
    this.dom.quickConvertThb.value = '1000';
    this.dom.quickConvertForeign.value = Math.round(1000 * rateInfo.rateToTarget);
  }

  suggestBudgetForTrip() {
    const days = this.state.days || 4;
    const countryCode = this.state.selectedCity?.countryCode?.toUpperCase() || 'JP';
    const nights = Math.max(1, days - 1);

    let flight = 12000;
    let hotelPerNight = 2500;
    let foodPerDay = 1500;
    let activities = 3000;
    let shopping = 5000;

    // Adjust by country tier
    if (['JP', 'KR', 'SG', 'IS', 'GB', 'FR', 'DE', 'CH', 'US', 'AU'].includes(countryCode)) {
      flight = ['JP', 'KR'].includes(countryCode) ? 14000 : 28000;
      hotelPerNight = 3200;
      foodPerDay = 1800;
      activities = 4000;
      shopping = 8000;
    } else if (['TH', 'VN'].includes(countryCode)) {
      flight = 2500;
      hotelPerNight = 1200;
      foodPerDay = 800;
      activities = 1500;
      shopping = 3000;
    }

    this.dom.budgetFlights.value = flight;
    this.dom.budgetHotel.value = hotelPerNight * nights;
    this.dom.budgetFood.value = foodPerDay * days;
    this.dom.budgetActivities.value = activities;
    this.dom.budgetShopping.value = shopping;
    this.dom.budgetEmergency.value = 2000;

    this.calculateBudget();
  }

  calculateBudget() {
    const flights = parseFloat(this.dom.budgetFlights.value) || 0;
    const hotel = parseFloat(this.dom.budgetHotel.value) || 0;
    const food = parseFloat(this.dom.budgetFood.value) || 0;
    const activities = parseFloat(this.dom.budgetActivities.value) || 0;
    const shopping = parseFloat(this.dom.budgetShopping.value) || 0;
    const emergency = parseFloat(this.dom.budgetEmergency.value) || 0;

    const totalTHB = flights + hotel + food + activities + shopping + emergency;
    const rate = this.state.currency.rateToTarget || 1;
    const totalForeign = Math.round(totalTHB * rate);
    const days = Math.max(1, this.state.days || 1);
    const dailyAverageTHB = Math.round(totalTHB / days);
    const dailyAverageForeign = Math.round(totalForeign / days);

    this.state.budget = {
      flights,
      hotel,
      food,
      activities,
      shopping,
      emergency,
      totalTHB,
      totalForeign,
      dailyAverageTHB,
      currencyCode: this.state.currency.code
    };

    // Update DOM
    this.dom.budgetTotalThb.textContent = totalTHB.toLocaleString();
    this.dom.budgetTotalForeign.textContent = totalForeign.toLocaleString();
    this.dom.budgetDailyAverage.textContent = `${dailyAverageTHB.toLocaleString()} ฿/วัน (${dailyAverageForeign.toLocaleString()} ${this.state.currency.code})`;
  }

  async generatePackingPlan() {
    const rawCity = this.dom.inputCity.value.trim();
    if (!rawCity) {
      this.showToast('กรุณากรอกชื่อเมืองปลายทาง', 'error');
      this.dom.inputCity.focus();
      return;
    }

    try {
      this.setButtonLoading(true);
      this.recalculateDays();

      // If city hasn't been selected from dropdown, geocode it now
      if (!this.state.selectedCity || !this.state.selectedCity.latitude) {
        const searchResults = await WeatherService.searchCity(rawCity);
        if (!searchResults || searchResults.length === 0) {
          throw new Error(`ไม่พบพิกัดของเมือง "${rawCity}" กรุณาลองตรวจสอบการสะกดหรือพิมพ์ชื่อภาษาอังกฤษ`);
        }
        this.state.selectedCity = searchResults[0];
        this.dom.inputCity.value = `${searchResults[0].name}, ${searchResults[0].country}`;
      }

      this.updateBookingLinks();
      await this.updateCurrencyAndRates();

      // Fetch Weather Forecast with exact dates
      const weather = await WeatherService.getWeatherForecast(
        this.state.selectedCity.latitude,
        this.state.selectedCity.longitude,
        this.state.days,
        this.state.startDate,
        this.state.endDate
      );
      this.state.weather = weather;

      // Generate Packing items with Rule-based Engine
      const recommendedItems = PackingEngine.generateList(
        weather,
        this.state.days,
        this.state.selectedCity
      );
      this.state.items = recommendedItems;

      // Update luggage weight & budget
      this.updateLuggageWeight();
      this.suggestBudgetForTrip();

      // Save to LocalStorage
      this.persistCurrentTrip();

      // Render UI
      this.renderWeatherDashboard();
      this.renderChecklist();
      this.updateProgress();

      // Show sections
      this.dom.emptyState.classList.add('hidden');
      this.dom.weatherSection.classList.remove('hidden');
      this.dom.budgetSection.classList.remove('hidden');
      this.dom.weightSection.classList.remove('hidden');
      this.dom.checklistSection.classList.remove('hidden');

      this.showToast(`สร้างรายการสำเร็จสำหรับ ${this.state.selectedCity.name}!`, 'success');

      // Smooth scroll to weather dashboard
      this.dom.weatherSection.scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
      console.error(error);
      this.showToast(error.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลสภาพอากาศ', 'error');
    } finally {
      this.setButtonLoading(false);
    }
  }

  updateLuggageWeight() {
    const { items, baggage } = this.state;
    if (!items) return;

    // Filter items based on calculation mode
    const itemsToCount = baggage.packedOnly ? items.filter(i => i.checked) : items;
    
    // Sum total weight in grams
    let itemsGrams = 0;
    itemsToCount.forEach(item => {
      const weight = item.weightGrams || 150;
      const qty = item.quantity || 1;
      itemsGrams += weight * qty;
    });

    const itemsKg = Math.round(itemsGrams / 100) / 10;
    const emptyBagKg = baggage.emptyBagKg || 3.8;
    const limitKg = baggage.limitKg || 20.0;
    const totalWeightKg = Math.round((emptyBagKg + itemsKg) * 10) / 10;
    const remainingKg = Math.round((limitKg - totalWeightKg) * 10) / 10;
    const percentage = Math.round((totalWeightKg / limitKg) * 100);

    // Save summary into state baggage object
    this.state.baggage.totalKg = totalWeightKg;
    this.state.baggage.remainingKg = remainingKg;
    this.state.baggage.itemsKg = itemsKg;

    // Update UI DOM
    this.dom.weightCurrentKg.textContent = totalWeightKg.toFixed(1);
    this.dom.weightLimitKg.textContent = limitKg.toFixed(1);
    this.dom.weightEmptyBagText.textContent = `${emptyBagKg.toFixed(1)} kg`;
    this.dom.weightItemsText.textContent = `${itemsKg.toFixed(1)} kg`;
    this.dom.weightPercentageText.textContent = `${percentage}%`;
    this.dom.weightBarFill.style.width = `${Math.min(percentage, 100)}%`;

    // Overweight or Safe logic
    if (totalWeightKg > limitKg) {
      const overKg = Math.round((totalWeightKg - limitKg) * 10) / 10;
      this.dom.weightBarFill.className = 'h-full rounded-full transition-all duration-500 bg-gradient-to-r from-rose-500 to-rose-600';
      this.dom.weightCurrentKg.className = 'text-3xl font-black text-rose-600 dark:text-rose-400';
      this.dom.weightRemainingBadge.className = 'inline-flex items-center justify-center text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/70 px-2.5 py-1 rounded-full mt-1';
      this.dom.weightRemainingText.textContent = `น้ำหนักเกินโควตา ${overKg.toFixed(1)} kg!`;
      
      this.dom.weightOverweightDesc.textContent = `กระเป๋าของคุณหนักเกินโควตาไป ${overKg.toFixed(1)} kg แนะนำให้นำของชิ้นหนักออกหรือซื้อน้ำหนักกระเป๋าเพิ่มล่วงหน้า`;
      this.dom.weightOverweightAlert.classList.remove('hidden');
    } else {
      this.dom.weightCurrentKg.className = 'text-3xl font-black text-slate-900 dark:text-white';
      this.dom.weightOverweightAlert.classList.add('hidden');

      if (percentage >= 80) {
        this.dom.weightBarFill.className = 'h-full rounded-full transition-all duration-500 bg-gradient-to-r from-amber-400 to-amber-500';
        this.dom.weightRemainingBadge.className = 'inline-flex items-center justify-center text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/70 px-2.5 py-1 rounded-full mt-1';
        this.dom.weightRemainingText.textContent = `ใกล้เต็ม: เหลือช้อปปิ้ง ${remainingKg.toFixed(1)} kg`;
      } else {
        this.dom.weightBarFill.className = 'h-full rounded-full transition-all duration-500 bg-gradient-to-r from-blue-500 to-indigo-600';
        this.dom.weightRemainingBadge.className = 'inline-flex items-center justify-center text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-2.5 py-1 rounded-full mt-1';
        this.dom.weightRemainingText.textContent = `เหลือพื้นที่ช้อปปิ้ง ${remainingKg.toFixed(1)} kg`;
      }
    }
  }

  renderWeatherDashboard() {
    const { weather, selectedCity, days, startDate, endDate } = this.state;
    if (!weather || !selectedCity) return;

    const summary = weather.summary;
    const nights = Math.max(0, days - 1);
    const startThai = this.formatDateThai(startDate);
    const endThai = this.formatDateThai(endDate);
    const rangeText = `${startThai} - ${endThai} (รวม ${days} วัน ${nights > 0 ? `${nights} คืน` : ''})`;

    // Title
    this.dom.weatherCityTitle.innerHTML = `
      <i class="fa-solid fa-plane-arrival text-blue-400 text-xl"></i>
      <span>${selectedCity.name}, ${selectedCity.country}</span>
    `;

    this.dom.weatherDateRangeText.textContent = rangeText;
    this.dom.weatherLastUpdated.textContent = `อัปเดต: ${new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.`;
    this.dom.weatherForecastDaysLabel.textContent = `${days} วัน`;

    // Print metadata
    this.dom.printTitle.textContent = `ใบจัดกระเป๋า: ${selectedCity.name}, ${selectedCity.country}`;
    this.dom.printSubtitle.textContent = `ช่วงวัน: ${rangeText} | พยากรณ์อากาศ: ต่ำสุด ${summary.minTemp}°C / สูงสุด ${summary.maxTemp}°C | น้ำหนัก: ${this.state.baggage.totalKg || 0} kg | งบประมาณ: ${this.state.budget.totalTHB?.toLocaleString() || 0} บาท`;

    // Summary Badges
    this.dom.weatherSummaryBadges.innerHTML = `
      <div class="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold flex items-center gap-1.5">
        <i class="fa-solid fa-temperature-half text-amber-300"></i>
        <span>${summary.minTemp}°C ถึง ${summary.maxTemp}°C (เฉลี่ย ${summary.avgTemp}°C)</span>
      </div>
      ${summary.willRain ? `
        <div class="px-3 py-1.5 rounded-xl bg-blue-500/20 border border-blue-400/40 text-blue-200 text-xs font-semibold flex items-center gap-1.5">
          <i class="fa-solid fa-cloud-showers-heavy text-blue-300"></i>
          <span>มีโอกาสฝนตก (${summary.rainDaysCount} วัน / สูงสุด ${summary.maxRainProb}%)</span>
        </div>
      ` : `
        <div class="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-semibold flex items-center gap-1.5">
          <i class="fa-solid fa-sun text-amber-300"></i>
          <span>โอกาสฝนน้อย (${summary.maxRainProb}%)</span>
        </div>
      `}
      ${summary.hasSnow ? `
        <div class="px-3 py-1.5 rounded-xl bg-sky-500/20 border border-sky-400/40 text-sky-200 text-xs font-semibold flex items-center gap-1.5">
          <i class="fa-solid fa-snowflake text-sky-300"></i>
          <span>มีหิมะตก</span>
        </div>
      ` : ''}
      ${summary.isCold ? `
        <div class="px-3 py-1.5 rounded-xl bg-indigo-500/20 border border-indigo-400/40 text-indigo-200 text-xs font-semibold flex items-center gap-1.5">
          <i class="fa-solid fa-temperature-low text-indigo-300"></i>
          <span>อากาศหนาว</span>
        </div>
      ` : ''}
      ${summary.isHot ? `
        <div class="px-3 py-1.5 rounded-xl bg-orange-500/20 border border-orange-400/40 text-orange-200 text-xs font-semibold flex items-center gap-1.5">
          <i class="fa-solid fa-temperature-high text-orange-300"></i>
          <span>อากาศร้อน</span>
        </div>
      ` : ''}
    `;

    // Daily Forecast Cards
    this.dom.weatherDailyGrid.innerHTML = '';
    weather.dailyForecast.forEach(day => {
      const card = document.createElement('div');
      card.className = 'bg-white/5 border border-white/10 rounded-xl p-2.5 text-center weather-day-card flex flex-col justify-between min-w-[90px]';
      card.innerHTML = `
        <div>
          <div class="text-[11px] font-semibold text-slate-300">${day.dayName}</div>
          <div class="text-[9px] text-slate-400">${day.formattedDate}</div>
        </div>
        <div class="my-1.5 text-2xl" title="${day.label}">${day.icon}</div>
        <div>
          <div class="text-xs font-bold text-white">${day.maxTemp}° / <span class="text-slate-400 font-normal">${day.minTemp}°</span></div>
          <div class="text-[10px] text-blue-300 flex items-center justify-center gap-0.5 mt-0.5">
            <i class="fa-solid fa-droplet text-[8px]"></i>
            <span>${day.rainProb}%</span>
          </div>
        </div>
      `;
      this.dom.weatherDailyGrid.appendChild(card);
    });

    // Weather Insights
    let insight = `สภาพอากาศช่วงเดินทาง (${startThai} - ${endThai}): อุณหภูมิเฉลี่ย <strong>${summary.avgTemp}°C</strong> `;
    if (summary.hasSnow) {
      insight += `มีเกล็ดหิมะหรืออุณหภูมิติดลบ แนะนำให้เตรียมเสื้อโค้ทหนาพิเศษ, Heattech, และรองเท้าบูทกันลื่นลุยหิมะ`;
    } else if (summary.isCold) {
      insight += `มีอากาศหนาวเย็นต่ำสุด <strong>${summary.minTemp}°C</strong> แนะนำเสื้อแจ็คเก็ตกันลม สเวตเตอร์ และผ้าพันคอ`;
    } else if (summary.isHot) {
      insight += `มีสภาพอากาศร้อนสูงสุด <strong>${summary.maxTemp}°C</strong> แนะนำเสื้อผ้าระบายอากาศ แว่นกันแดด และครีมกันแดด`;
    } else {
      insight += `อากาศสบายๆ กำลังดี เหมาะแก่การท่องเที่ยว`;
    }

    if (summary.willRain) {
      insight += ` • <strong>คำเตือนฝน:</strong> มีโอกาสฝนตกสูงสุด <strong>${summary.maxRainProb}%</strong> จึงได้เพิ่มร่มพับและเสื้อกันฝนลงในเช็กลิสต์ให้แล้ว`;
    }

    this.dom.weatherInsightText.innerHTML = insight;
  }

  renderChecklist() {
    this.dom.categoriesContainer.innerHTML = '';
    const { items, filter } = this.state;

    // Filter items
    const filteredItems = items.filter(item => {
      if (filter === 'packed') return item.checked;
      if (filter === 'unpacked') return !item.checked;
      return true;
    });

    // Update counter labels
    const totalCount = items.length;
    const packedCount = items.filter(i => i.checked).length;
    const unpackedCount = totalCount - packedCount;

    this.dom.countAll.textContent = totalCount;
    this.dom.countPacked.textContent = packedCount;
    this.dom.countUnpacked.textContent = unpackedCount;
    this.dom.badgeTotalItems.textContent = `${totalCount} ชิ้น`;

    // Group filtered items by category
    const categoryGroups = {};
    Object.values(CATEGORIES).forEach(cat => {
      categoryGroups[cat.id] = {
        ...cat,
        items: []
      };
    });

    filteredItems.forEach(item => {
      const catId = item.category || 'custom';
      if (!categoryGroups[catId]) {
        categoryGroups[catId] = {
          id: catId,
          name: 'อื่นๆ',
          icon: 'fa-box',
          color: 'slate',
          items: []
        };
      }
      categoryGroups[catId].items.push(item);
    });

    // Render each category container
    let renderedCategoriesCount = 0;

    Object.values(categoryGroups).forEach(cat => {
      if (cat.items.length === 0) return;
      renderedCategoriesCount++;

      const catCard = document.createElement('div');
      catCard.className = 'category-container bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 dark:border-slate-800 space-y-3';
      
      const catPackedCount = cat.items.filter(i => i.checked).length;
      const catTotalCount = cat.items.length;

      catCard.innerHTML = `
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <div class="flex items-center space-x-2.5">
            <div class="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm">
              <i class="fa-solid ${cat.icon}"></i>
            </div>
            <div>
              <h3 class="font-bold text-slate-800 dark:text-white text-sm sm:text-base">${cat.name}</h3>
            </div>
          </div>
          <span class="text-xs text-slate-400 dark:text-slate-400 font-medium">${catPackedCount}/${catTotalCount}</span>
        </div>
        <div class="divide-y divide-slate-100 dark:divide-slate-800" id="cat-items-${cat.id}">
          <!-- Items injected below -->
        </div>
      `;

      const itemsContainer = catCard.querySelector(`#cat-items-${cat.id}`);

      cat.items.forEach(item => {
        const itemRow = document.createElement('div');
        itemRow.className = `item-card flex items-center justify-between py-2.5 px-2 rounded-xl transition hover:bg-slate-50 dark:hover:bg-slate-800/60 ${item.checked ? 'checked' : ''}`;
        
        const totalItemWeightGrams = (item.weightGrams || 150) * (item.quantity || 1);
        const totalItemWeightDisplay = totalItemWeightGrams >= 1000 
          ? `${(totalItemWeightGrams / 1000).toFixed(1)} kg` 
          : `${totalItemWeightGrams} g`;

        let affiliateUrl = null;
        let isDirectShopee = false;
        if (APP_CONFIG.AFFILIATE?.ENABLED) {
          // 1. Check exact custom direct link first
          if (APP_CONFIG.AFFILIATE.ITEM_EXACT_LINKS) {
            for (const [key, directUrl] of Object.entries(APP_CONFIG.AFFILIATE.ITEM_EXACT_LINKS)) {
              if (item.name.toLowerCase().includes(key.toLowerCase())) {
                affiliateUrl = directUrl;
                isDirectShopee = true;
                break;
              }
            }
          }
          // 2. Fallback to keyword search on Shopee
          if (!affiliateUrl && APP_CONFIG.AFFILIATE.ITEM_KEYWORDS) {
            for (const [key, kw] of Object.entries(APP_CONFIG.AFFILIATE.ITEM_KEYWORDS)) {
              if (item.name.toLowerCase().includes(key.toLowerCase())) {
                affiliateUrl = APP_CONFIG.AFFILIATE.PLATFORMS.SHOPEE.searchUrl(kw);
                break;
              }
            }
          }
        }

        const affiliateBadge = affiliateUrl ? `
          <a 
            href="${affiliateUrl}" 
            target="_blank" 
            rel="noopener noreferrer sponsored" 
            class="inline-flex items-center gap-1 text-[10px] font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/60 hover:bg-orange-100 dark:hover:bg-orange-900/80 border border-orange-200 dark:border-orange-800/80 px-1.5 py-0.5 rounded-full transition shrink-0 no-print" 
            title="${isDirectShopee ? 'ดูสินค้าแนะนำบน Shopee' : 'ค้นหาและสั่งซื้อบน Shopee'}"
          >
            <i class="fa-solid fa-bag-shopping text-[8px]"></i>
            <span>${isDirectShopee ? 'ช้อป Shopee' : 'หาซื้อ'}</span>
          </a>
        ` : '';

        itemRow.innerHTML = `
          <div class="flex items-center space-x-3 min-w-0 pr-2">
            <input 
              type="checkbox" 
              class="custom-checkbox shrink-0" 
              data-item-id="${item.id}" 
              ${item.checked ? 'checked' : ''}
            >
            <div class="min-w-0">
              <div class="flex items-center space-x-1.5 flex-wrap gap-y-1">
                <span class="item-name font-medium text-slate-800 dark:text-slate-200 text-sm truncate">${item.name}</span>
                <span class="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full shrink-0">
                  ${item.quantity} ${item.unit || 'ชิ้น'}
                </span>
                <span class="text-[11px] font-semibold text-slate-400 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full shrink-0" title="น้ำหนักโดยประมาณ">
                  <i class="fa-solid fa-weight-hanging text-[9px] mr-1 text-slate-400"></i>${totalItemWeightDisplay}
                </span>
                ${item.isEssential ? '<span class="text-[10px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded shrink-0">จำเป็น</span>' : ''}
                ${affiliateBadge}
              </div>
              ${item.reason ? `<div class="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5"><i class="fa-solid fa-circle-info text-[9px] mr-1 text-slate-300 dark:text-slate-600"></i>${item.reason}</div>` : ''}
            </div>
          </div>

          <div class="flex items-center space-x-1 shrink-0 no-print">
            <button class="btn-delete-item p-1.5 text-slate-300 dark:text-slate-600 hover:text-rose-500 dark:hover:text-rose-400 rounded-lg transition" title="ลบรายการ" data-item-id="${item.id}">
              <i class="fa-regular fa-trash-can text-xs"></i>
            </button>
          </div>
        `;

        // Checkbox change listener
        const checkbox = itemRow.querySelector('.custom-checkbox');
        checkbox.addEventListener('change', (e) => {
          this.toggleItemChecked(item.id, e.target.checked);
        });

        // Delete button listener
        const btnDelete = itemRow.querySelector('.btn-delete-item');
        btnDelete.addEventListener('click', () => {
          this.deleteItem(item.id);
        });

        itemsContainer.appendChild(itemRow);
      });

      this.dom.categoriesContainer.appendChild(catCard);
    });

    if (renderedCategoriesCount === 0) {
      this.dom.categoriesContainer.innerHTML = `
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center border border-slate-200 dark:border-slate-800 text-slate-400 text-sm">
          <i class="fa-regular fa-circle-check text-2xl text-emerald-400 mb-2"></i>
          <p>ไม่มีรายการที่ตรงกับตัวกรองนี้</p>
        </div>
      `;
    }

    // Also update dynamic affiliate gear recommendations
    this.renderAffiliateGear();
  }

  /**
   * Render contextual recommended travel gear (Affiliate Shopping: Shopee / Lazada / Klook)
   */
  renderAffiliateGear() {
    if (!this.dom.affiliateGearGrid || !APP_CONFIG.AFFILIATE?.ENABLED) return;
    const summary = this.state.weather?.summary || {};
    const dest = this.state.selectedCity || {};
    const minTemp = summary.minTemp ?? 25;
    const isCold = summary.isCold || minTemp < 15;
    const isFreezing = summary.isFreezing || minTemp <= 4;
    const willRain = summary.willRain || (summary.maxRainProb >= 30);
    const isDomestic = dest.country && (dest.country.toLowerCase() === 'thailand' || dest.country.toLowerCase() === 'ไทย');

    const gearItems = [];

    // 1. Cold / Freezing Gear
    if (isFreezing) {
      gearItems.push({
        title: 'เสื้อขนเป็ด Ultra Light Down',
        icon: 'fa-snowflake',
        iconColor: 'text-sky-500 bg-sky-50 dark:bg-sky-950/60',
        badge: 'จำเป็น (<4°C)',
        badgeClass: 'text-sky-700 dark:text-sky-300 bg-sky-100 dark:bg-sky-950',
        desc: 'อุณหภูมิติดลบหรือใกล้จุดเยือกแข็ง ควรใช้ขนเป็ดแท้กักเก็บความอบอุ่น กันลมและหิมะ',
        shopeeKw: 'เสื้อกันหนาวขนเป็ด Ultra Light Down ลุยหิมะ',
        lazadaKw: 'เสื้อกันหนาวขนเป็ด'
      });
      gearItems.push({
        title: 'แผ่นแปะความร้อน (Hot Pack)',
        icon: 'fa-fire-flame-curved',
        iconColor: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60',
        badge: 'พกในกระเป๋า',
        badgeClass: 'text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950',
        desc: 'ให้ความอบอุ่นยาวนาน 8-12 ชั่วโมง ป้องกันมือและตัวแข็งขณะเดินเที่ยวกลางแจ้ง',
        shopeeKw: 'แผ่นแปะความร้อน ญี่ปุ่น ไคโระ hot pack',
        lazadaKw: 'แผ่นแปะความร้อน hot pack'
      });
    } else if (isCold) {
      gearItems.push({
        title: 'เสื้อ Heattech / ลองจอนบางเบา',
        icon: 'fa-shirt',
        iconColor: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60',
        badge: 'แนะนำ (<15°C)',
        badgeClass: 'text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-950',
        desc: 'ใส่เป็นเสื้อชั้นในกักเก็บความอบอุ่น ไม่หนาเทอะทะ ระบายอากาศดี แห้งไว',
        shopeeKw: 'เสื้อ heattech ลองจอนกันหนาว ผู้หญิง ผู้ชาย',
        lazadaKw: 'heattech ลองจอน'
      });
    }

    // 2. Rain Gear
    if (willRain) {
      gearItems.push({
        title: 'ร่มพับกัน UV น้ำหนักเบาพิเศษ',
        icon: 'fa-umbrella',
        iconColor: 'text-blue-500 bg-blue-50 dark:bg-blue-950/60',
        badge: `ฝนตก ${summary.maxRainProb || 40}%`,
        badgeClass: 'text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-950',
        desc: 'น้ำหนักเบาเพียง 100-150g พกพาสะดวก ไม่เปลืองโควตาน้ำหนักกระเป๋า Carry-on',
        shopeeKw: 'ร่มพับ น้ำหนักเบา กันแดด uv กันฝน พกพา',
        lazadaKw: 'ร่มพับ น้ำหนักเบา'
      });
    }

    // 3. Luggage Scale (Direct Shopee Affiliate Link)
    gearItems.push({
      title: 'เครื่องชั่งน้ำหนักกระเป๋าพกพา',
      icon: 'fa-weight-scale',
      iconColor: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60',
      badge: 'Shopee แนะนำ',
      badgeClass: 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950',
      desc: 'เช็กน้ำหนักสัมภาระก่อนไปสนามบิน ป้องกันถูกปรับค่าน้ำหนักเกินกิโลละ 500-1,000 บ.',
      shopeeUrl: APP_CONFIG.AFFILIATE.DIRECT_LINKS.SCALE,
      lazadaKw: 'ที่ชั่งน้ำหนักกระเป๋าเดินทาง'
    });

    // 4. Suitcase (Direct Shopee Affiliate Link)
    gearItems.push({
      title: 'กระเป๋าเดินทางล้อลากน้ำหนักเบา',
      icon: 'fa-suitcase-rolling',
      iconColor: 'text-blue-500 bg-blue-50 dark:bg-blue-950/60',
      badge: 'Shopee แนะนำ',
      badgeClass: 'text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-950',
      desc: 'ทนทาน ล้อลื่น 360 องศา น้ำหนักเบา จุสัมภาระได้เต็มที่ไม่เกินโควตาสายการบิน',
      shopeeUrl: APP_CONFIG.AFFILIATE.DIRECT_LINKS.SUITCASE,
      lazadaKw: 'กระเป๋าเดินทางล้อลาก'
    });

    // 5. Universal Travel Adapter (Abroad - Direct Shopee Affiliate Link)
    if (!isDomestic) {
      gearItems.push({
        title: 'Universal Travel Adapter All-in-one',
        icon: 'fa-plug',
        iconColor: 'text-purple-500 bg-purple-50 dark:bg-purple-950/60',
        badge: 'Shopee แนะนำ',
        badgeClass: 'text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950',
        desc: 'รองรับปลั๊กไฟ 150+ ประเทศ พร้อมพอร์ต USB-C Fast Charge ชาร์จไวพกตัวเดียวจบ',
        shopeeUrl: APP_CONFIG.AFFILIATE.DIRECT_LINKS.ADAPTER,
        lazadaKw: 'universal travel adapter'
      });

      // 6. eSIM (Abroad - Direct Shopee Affiliate Link)
      gearItems.push({
        title: `eSIM เน็ตเที่ยว ${dest.name || 'ต่างประเทศ'}`,
        icon: 'fa-qrcode',
        iconColor: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60',
        badge: 'Shopee แนะนำ',
        badgeClass: 'text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950',
        desc: 'สแกน QR Code ใช้งานเน็ตได้ทันทีเมื่อแลนดิ้ง ไม่ต้องถอดเปลี่ยนซิมเดิม',
        shopeeUrl: APP_CONFIG.AFFILIATE.DIRECT_LINKS.ESIM,
        klookDest: `${dest.name || dest.country || ''} eSIM`,
        isEsim: true
      });
    }

    // 7. Packing Cubes (Space Saver)
    gearItems.push({
      title: 'กระเป๋าจัดระเบียบ 6-in-1',
      icon: 'fa-boxes-packing',
      iconColor: 'text-rose-500 bg-rose-50 dark:bg-rose-950/60',
      badge: 'ประหยัดพื้นที่ 40%',
      badgeClass: 'text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950',
      desc: 'ช่วยบีบอัดผ้า จัดหมวดหมู่สัมภาระ และหยิบตรวจความปลอดภัยที่สนามบินได้เร็ว',
      shopeeKw: 'กระเป๋าจัดระเบียบเสื้อผ้า packing cubes 6 in 1',
      lazadaKw: 'กระเป๋าจัดระเบียบเสื้อผ้า'
    });

    // Render cards into grid
    this.dom.affiliateGearGrid.innerHTML = gearItems.map(item => {
      const shopeeTargetUrl = item.shopeeUrl || APP_CONFIG.AFFILIATE.PLATFORMS.SHOPEE.searchUrl(item.shopeeKw);
      
      return `
      <div class="bg-white dark:bg-slate-900 rounded-xl p-3 sm:p-3.5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-2 hover:border-orange-300 dark:hover:border-orange-800 transition group">
        <div>
          <div class="flex items-start justify-between gap-2 mb-1.5">
            <div class="w-8 h-8 rounded-lg ${item.iconColor} flex items-center justify-center text-sm shrink-0 group-hover:scale-105 transition">
              <i class="fa-solid ${item.icon}"></i>
            </div>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${item.badgeClass}">${item.badge}</span>
          </div>
          <h4 class="text-xs sm:text-sm font-bold text-slate-800 dark:text-white line-clamp-1">${item.title}</h4>
          <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">${item.desc}</p>
        </div>

        <div class="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 flex-wrap">
          <a 
            href="${shopeeTargetUrl}" 
            target="_blank" 
            rel="noopener noreferrer sponsored" 
            class="flex-1 py-1.5 px-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 shadow-sm transition"
          >
            <i class="fa-solid fa-bag-shopping text-[10px]"></i>
            <span>Shopee</span>
          </a>
          ${item.isEsim ? `
            <a 
              href="${APP_CONFIG.AFFILIATE.PLATFORMS.KLOOK.searchUrl(item.klookDest)}" 
              target="_blank" 
              rel="noopener noreferrer sponsored" 
              class="flex-1 py-1.5 px-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 shadow-sm transition"
            >
              <i class="fa-solid fa-ticket text-[10px]"></i>
              <span>Klook</span>
            </a>
          ` : `
            <a 
              href="${APP_CONFIG.AFFILIATE.PLATFORMS.LAZADA.searchUrl(item.lazadaKw || item.shopeeKw)}" 
              target="_blank" 
              rel="noopener noreferrer sponsored" 
              class="flex-1 py-1.5 px-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 shadow-sm transition"
            >
              <i class="fa-solid fa-store text-[10px]"></i>
              <span>Lazada</span>
            </a>
          `}
        </div>
      </div>
      `;
    }).join('');
  }

  toggleItemChecked(itemId, isChecked) {
    const item = this.state.items.find(i => i.id === itemId);
    if (item) {
      item.checked = isChecked;
      this.updateProgress();
      this.updateLuggageWeight();
      this.persistCurrentTrip();

      // Update card visual class
      const card = document.querySelector(`.custom-checkbox[data-item-id="${itemId}"]`)?.closest('.item-card');
      if (card) {
        if (isChecked) card.classList.add('checked');
        else card.classList.remove('checked');
      }

      // If active filter is unpacked/packed, re-render list
      if (this.state.filter !== 'all') {
        this.renderChecklist();
      }
    }
  }

  deleteItem(itemId) {
    this.state.items = this.state.items.filter(i => i.id !== itemId);
    this.updateProgress();
    this.updateLuggageWeight();
    this.persistCurrentTrip();
    this.renderChecklist();
    this.showToast('ลบรายการเรียบร้อยแล้ว', 'info');
  }

  setAllItemsChecked(checkedState) {
    this.state.items.forEach(item => item.checked = checkedState);
    this.updateProgress();
    this.updateLuggageWeight();
    this.persistCurrentTrip();
    this.renderChecklist();
    this.showToast(checkedState ? 'ติ๊กทุกรายการแล้ว' : 'ยกเลิกการติ๊กทั้งหมดแล้ว', 'info');
  }

  updateProgress() {
    const total = this.state.items.length;
    const packed = this.state.items.filter(i => i.checked).length;
    const percent = total === 0 ? 0 : Math.round((packed / total) * 100);

    this.dom.progressPercent.textContent = `${percent}%`;
    this.dom.progressCount.textContent = `จัดแล้ว ${packed} / ${total} ชิ้น`;
    this.dom.progressBarFill.style.width = `${percent}%`;

    // Visual color shift when 100%
    if (percent === 100 && total > 0) {
      this.dom.progressBarFill.className = 'progress-bar-fill bg-gradient-to-r from-emerald-400 to-emerald-600 h-full rounded-full';
      this.dom.progressPercent.className = 'text-2xl font-black text-emerald-600 dark:text-emerald-400';
    } else {
      this.dom.progressBarFill.className = 'progress-bar-fill theme-btn-gradient h-full rounded-full';
      this.dom.progressPercent.className = 'text-2xl font-black text-blue-600 dark:text-blue-400';
    }
  }

  updateFilterTabsUI() {
    this.dom.filterTabs.forEach(tab => {
      if (tab.dataset.filter === this.state.filter) {
        tab.className = 'filter-tab px-3 py-1.5 rounded-lg transition bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold';
      } else {
        tab.className = 'filter-tab px-3 py-1.5 rounded-lg transition text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium';
      }
    });
  }

  handleAddCustomItem(e) {
    e.preventDefault();
    const name = this.dom.addItemName.value.trim();
    const quantity = parseInt(this.dom.addItemQty.value, 10) || 1;
    const unit = this.dom.addItemUnit.value.trim() || 'ชิ้น';
    const weightGrams = parseInt(this.dom.addItemWeight.value, 10) || 150;
    const category = this.dom.addItemCategory.value;
    const reason = this.dom.addItemReason.value.trim();

    if (!name) return;

    const newItem = {
      id: `item_custom_${Date.now()}`,
      name,
      quantity,
      unit,
      category,
      checked: false,
      reason: reason || 'เพิ่มโดยผู้ใช้',
      isEssential: false,
      custom: true,
      weightGrams
    };

    this.state.items.unshift(newItem);
    this.updateProgress();
    this.updateLuggageWeight();
    this.persistCurrentTrip();
    this.renderChecklist();

    // Reset form & close modal
    this.dom.formAddItem.reset();
    this.dom.addItemQty.value = '1';
    this.dom.addItemUnit.value = 'ชิ้น';
    this.dom.addItemWeight.value = '150';
    this.dom.modalAddItem.classList.add('hidden');
    this.showToast(`เพิ่ม "${name}" (${weightGrams}g) ลงในรายการแล้ว`, 'success');
  }

  persistCurrentTrip() {
    const payload = {
      destination: this.state.selectedCity,
      days: this.state.days,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      weather: this.state.weather,
      items: this.state.items,
      baggage: this.state.baggage,
      budget: this.state.budget
    };
    StorageService.saveCurrentTrip(payload);
  }

  async restoreTrip(tripData) {
    this.state.selectedCity = tripData.destination;
    this.state.days = tripData.days || 4;
    this.state.startDate = tripData.startDate || this.formatDateYMD(new Date());
    this.state.endDate = tripData.endDate || this.formatDateYMD(new Date(Date.now() + 3 * 86400000));
    this.state.weather = tripData.weather;
    this.state.items = tripData.items || [];

    if (tripData.baggage) {
      this.state.baggage = { ...this.state.baggage, ...tripData.baggage };
      this.dom.selectBaggagePreset.value = this.state.baggage.presetId || 'checked_20';
      this.dom.checkWeightPackedOnly.checked = !!this.state.baggage.packedOnly;
    }

    if (tripData.budget) {
      this.state.budget = { ...this.state.budget, ...tripData.budget };
      this.dom.budgetFlights.value = this.state.budget.flights;
      this.dom.budgetHotel.value = this.state.budget.hotel;
      this.dom.budgetFood.value = this.state.budget.food;
      this.dom.budgetActivities.value = this.state.budget.activities;
      this.dom.budgetShopping.value = this.state.budget.shopping;
      this.dom.budgetEmergency.value = this.state.budget.emergency;
    }

    if (this.state.selectedCity) {
      this.dom.inputCity.value = `${this.state.selectedCity.name}, ${this.state.selectedCity.country}`;
      this.dom.btnClearCity.classList.remove('hidden');
      this.updateBookingLinks();
      await this.updateCurrencyAndRates();
    }

    this.dom.inputStartDate.value = this.state.startDate;
    this.dom.inputEndDate.value = this.state.endDate;
    this.dom.displayDays.textContent = this.state.days;

    if (this.state.weather) {
      this.updateLuggageWeight();
      this.calculateBudget();
      this.renderWeatherDashboard();
      this.renderChecklist();
      this.updateProgress();

      this.dom.emptyState.classList.add('hidden');
      this.dom.weatherSection.classList.remove('hidden');
      this.dom.budgetSection.classList.remove('hidden');
      this.dom.weightSection.classList.remove('hidden');
      this.dom.checklistSection.classList.remove('hidden');
    }
  }

  resetAll() {
    StorageService.clearCurrentTrip();
    this.state.selectedCity = null;
    this.state.weather = null;
    this.state.items = [];
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + 3);
    this.state.startDate = this.formatDateYMD(today);
    this.state.endDate = this.formatDateYMD(futureDate);
    this.state.days = 4;

    this.dom.inputCity.value = '';
    this.dom.btnClearCity.classList.add('hidden');
    this.dom.inputStartDate.value = this.state.startDate;
    this.dom.inputEndDate.value = this.state.endDate;
    this.dom.displayDays.textContent = this.state.days;

    this.dom.weatherSection.classList.add('hidden');
    this.dom.budgetSection.classList.add('hidden');
    this.dom.weightSection.classList.add('hidden');
    this.dom.checklistSection.classList.add('hidden');
    this.dom.emptyState.classList.remove('hidden');
    this.showToast('ล้างรายการทั้งหมดแล้ว', 'info');
  }

  saveTripBookmark() {
    if (!this.state.selectedCity || this.state.items.length === 0) {
      this.showToast('ยังไม่มีข้อมูลทริปที่จะบันทึก', 'error');
      return;
    }

    const tripData = {
      destination: this.state.selectedCity,
      days: this.state.days,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      weather: this.state.weather,
      items: this.state.items,
      baggage: this.state.baggage,
      budget: this.state.budget
    };

    const tripId = StorageService.saveTripToHistory(tripData);
    if (tripId) {
      this.updateSavedTripsBadge();
      this.showToast(`บันทึกทริป ${this.state.selectedCity.name} ลงประวัติเรียบร้อย`, 'success');
    }
  }

  updateSavedTripsBadge() {
    const saved = StorageService.getSavedTrips();
    this.dom.savedTripsCount.textContent = saved.length;
  }

  openHistoryModal() {
    const savedTrips = StorageService.getSavedTrips();
    this.dom.historyTripsList.innerHTML = '';

    if (savedTrips.length === 0) {
      this.dom.historyTripsList.innerHTML = `
        <div class="p-8 text-center text-slate-400 text-sm">
          <i class="fa-regular fa-bookmark text-2xl mb-2 text-slate-300"></i>
          <p>ยังไม่มีทริปที่บันทึกไว้</p>
          <p class="text-xs text-slate-400 mt-1">กดปุ่ม "บันทึกทริปนี้" เพื่อเก็บรายการไว้ดูย้อนหลัง</p>
        </div>
      `;
    } else {
      savedTrips.forEach(trip => {
        const item = document.createElement('div');
        item.className = 'p-3.5 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50/60 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between transition group';
        
        const packed = trip.items ? trip.items.filter(i => i.checked).length : 0;
        const total = trip.items ? trip.items.length : 0;
        const dateFormatted = new Date(trip.savedAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
        const dateRangeInfo = (trip.startDate && trip.endDate) ? `${this.formatDateThai(trip.startDate)} - ${this.formatDateThai(trip.endDate)}` : `${trip.days} วัน`;
        const weightInfo = trip.baggage ? ` • ⚖️ ${trip.baggage.totalKg || 0} kg` : '';
        const budgetInfo = trip.budget ? ` • 💰 ${trip.budget.totalTHB?.toLocaleString() || 0} ฿` : '';

        item.innerHTML = `
          <div class="cursor-pointer flex-grow pr-3" data-trip-id="${trip.id}">
            <div class="font-bold text-slate-800 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition flex items-center gap-1.5">
              <i class="fa-solid fa-map-pin text-rose-500 text-xs"></i>
              <span>${trip.title}</span>
            </div>
            <div class="text-xs text-slate-400 dark:text-slate-400 mt-0.5 flex items-center gap-2 flex-wrap">
              <span>📅 ${dateRangeInfo}</span>
              <span>•</span>
              <span class="text-blue-600 dark:text-blue-400 font-medium">เก็บแล้ว ${packed}/${total} ชิ้น${weightInfo}${budgetInfo}</span>
            </div>
          </div>
          <div class="flex items-center space-x-1 shrink-0">
            <button class="btn-load-saved-trip px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition" data-trip-id="${trip.id}">
              เปิดดู
            </button>
            <button class="btn-delete-saved-trip p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition" title="ลบ" data-trip-id="${trip.id}">
              <i class="fa-regular fa-trash-can text-sm"></i>
            </button>
          </div>
        `;

        item.querySelector('.btn-load-saved-trip').addEventListener('click', () => {
          this.restoreTrip(trip);
          this.dom.modalHistory.classList.add('hidden');
          this.showToast(`โหลดทริป ${trip.destination.name} สำเร็จ`, 'success');
        });

        item.querySelector('.btn-delete-saved-trip').addEventListener('click', (e) => {
          e.stopPropagation();
          if (confirm(`ต้องการลบทริป "${trip.title}" ออกจากประวัติ?`)) {
            StorageService.deleteSavedTrip(trip.id);
            this.updateSavedTripsBadge();
            this.openHistoryModal();
          }
        });

        this.dom.historyTripsList.appendChild(item);
      });
    }

    this.dom.modalHistory.classList.remove('hidden');
  }

  copyChecklistText() {
    const tripData = {
      destination: this.state.selectedCity,
      days: this.state.days,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      weather: this.state.weather,
      items: this.state.items,
      baggage: this.state.baggage,
      budget: this.state.budget
    };
    let text = StorageService.generateTextExport(tripData);
    text += `\n✨ Created By Panusbodee (https://github.com/panusbodee-owen)\n`;

    if (!text) {
      this.showToast('ไม่มีรายการสิ่งของสำหรับส่งออก', 'error');
      return;
    }

    navigator.clipboard.writeText(text).then(() => {
      this.showToast('คัดลอกรายการและงบประมาณลงคลิปบอร์ดแล้ว!', 'success');
      this.dom.modalExport.classList.add('hidden');
    }).catch(err => {
      console.error(err);
      this.showToast('ไม่สามารถคัดลอกลงคลิปบอร์ดได้', 'error');
    });
  }

  downloadJsonBackup() {
    const tripData = {
      destination: this.state.selectedCity,
      days: this.state.days,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      weather: this.state.weather,
      items: this.state.items,
      baggage: this.state.baggage,
      budget: this.state.budget,
      createdBy: 'Panusbodee (panusbodee-owen)',
      exportedAt: new Date().toISOString()
    };

    const jsonStr = JSON.stringify(tripData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `packing-list-${this.state.selectedCity?.name || 'trip'}-${this.state.days}days.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.dom.modalExport.classList.add('hidden');
    this.showToast('ดาวน์โหลดไฟล์ JSON เรียบร้อยแล้ว', 'success');
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    const bgColors = {
      success: 'bg-emerald-600 text-white shadow-emerald-500/20',
      error: 'bg-rose-600 text-white shadow-rose-500/20',
      info: 'bg-slate-900 dark:bg-slate-800 text-white shadow-slate-900/20 border border-slate-700/50'
    };

    const icons = {
      success: 'fa-solid fa-circle-check',
      error: 'fa-solid fa-triangle-exclamation',
      info: 'fa-solid fa-circle-info'
    };

    toast.className = `${bgColors[type] || bgColors.info} px-4 py-3 rounded-xl shadow-lg flex items-center space-x-2.5 text-xs sm:text-sm font-medium transition-all duration-300 transform translate-y-2 opacity-0 pointer-events-auto`;
    toast.innerHTML = `
      <i class="${icons[type] || icons.info} text-base"></i>
      <span>${message}</span>
    `;

    this.dom.toastContainer.appendChild(toast);

    // Animate In
    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
    });

    // Remove after 3 seconds
    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

// Bootstrap Application when DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new SmartPackingApp();
});
