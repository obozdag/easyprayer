window.addEventListener('load', () => {
	'use strict';

	const $ = id => document.getElementById(id);
	const elements = {
		bgColorList: $('bg-color-list'), citySearch: $('city-search'), citySuggestions: $('city-suggestions'),
		closeNavLeftBtn: $('close-nav-left'), closeNavRightBtn: $('close-nav-right'), closePopupBtn: $('close-popup-btn'),
		colorList: $('color-list'), countryList: $('country-list'), customSoundFile: $('custom-sound-file'),
		customSoundRow: $('custom-sound-row'), emptyChooseCityBtn: $('empty-choose-city-btn'),
		emptyUseLocationBtn: $('empty-use-location-btn'), fontSizeList: $('font-size-list'),
		getLocationBtn: $('get-location-btn'), header: $('header'), languageList: $('language-list'),
		latInput: $('lat'), locationEmptyState: $('location-empty-state'), locationLoading: $('location-loading'),
		locationMessage: $('location-message'), lonInput: $('lon'), madhabList: $('madhab-list'),
		methodList: $('method-list'), monthBtn: $('month-btn'), navLeft: $('nav-left'), navRight: $('nav-right'),
		openNavLeftBtn: $('open-nav-left'), openNavRightBtn: $('open-nav-right'),
		prayerSoundEnabled: $('prayer-sound-enabled'), prayerSoundList: $('prayer-sound-list'),
		prayerTable: $('prayer-table'), prayerTimes: $('prayer-times'), programInfoBtn: $('program-info-btn'),
		programInfoContent: $('program-info-content'), programInfoPopup: $('program-info-popup'),
		removeLocationBtn: $('remove-location-btn'), rightResetBtn: $('right-reset-btn'),
		savedLocations: $('saved-locations'), soundMessage: $('sound-message'),
		testPrayerSoundBtn: $('test-prayer-sound-btn'), updateBannerText: $('update-banner-text'), weekBtn: $('week-btn'),
	};

	let activeLocation = null;
	let audioContext = null;
	let cityAbortController = null;
	let cityResults = [];
	let citySearchTimer = null;
	let currentLanguage = localStorage.getItem('language') || defaultLanguage;
	let currentMadhab = localStorage.getItem('madhab') || defaultMadhab;
	let currentMethod = localStorage.getItem('method') || defaultMethod;
	let currentPeriod = periods[defaultPeriod];
	let highlightedCity = -1;
	let savedLocationList = readJson('savedLocations', []);

	fillStaticSelects();
	restoreSettings();
	setLabels();
	installEventListeners();
	loadCountries();
	restoreLocation();
	window.setInterval(checkPrayerAlert, 20000);

	function t(key) {
		return translations[currentLanguage]?.[key]
			?? translations[defaultLanguage]?.[key]
			?? translations.en?.[key]
			?? key;
	}

	function readJson(key, fallback) {
		try {
			const value = JSON.parse(localStorage.getItem(key));
			return value ?? fallback;
		} catch (error) {
			return fallback;
		}
	}

	function createOptions(select, options, selected) {
		select.replaceChildren();
		Object.entries(options).forEach(([value, text]) => {
			const option = document.createElement('option');
			option.value = value;
			option.textContent = text;
			select.appendChild(option);
		});
		select.value = selected;
	}

	function fillStaticSelects() {
		createOptions(elements.fontSizeList, fontSizes, defaultFontSize);
		createOptions(elements.colorList, colors, defaultColor);
		createOptions(elements.bgColorList, bgColors, defaultBgColor);
		createOptions(elements.languageList, languages, currentLanguage);
		fillLocalizedSelects();
	}

	function fillLocalizedSelects() {
		createOptions(elements.madhabList, t('madhabs'), currentMadhab);
		createOptions(elements.methodList, t('methods'), currentMethod);
		createOptions(elements.prayerSoundList, t('prayer-sounds'), localStorage.getItem('prayerSound') || prayerSounds.softChime);
	}

	function setLabels() {
		[
			'bg-color-list-label', 'city-search-label', 'color-list-label', 'country-list-label',
			'custom-sound-label', 'font-size-list-label', 'header', 'language-list-label',
			'lat-input-label', 'location-header', 'location-latitude-label', 'location-longitude-label',
			'location-map-label', 'location-settings-header', 'lon-input-label', 'madhab-list-label',
			'method-list-label', 'prayer-sound-enabled-label', 'prayer-sound-list-label',
			'saved-locations-label', 'settings-header',
		].forEach(id => {
			const element = $(id);
			if (element) element.textContent = t(id);
		});
		elements.getLocationBtn.textContent = t('get-location-btn');
		elements.rightResetBtn.textContent = t('right-reset-btn');
		elements.testPrayerSoundBtn.textContent = t('test-prayer-sound-btn');
		elements.citySearch.placeholder = t('city-search-placeholder');
		elements.removeLocationBtn.setAttribute('aria-label', t('remove-location'));
		$('location-empty-text').textContent = t('location-empty');
		elements.emptyUseLocationBtn.textContent = t('get-location-btn');
		elements.emptyChooseCityBtn.textContent = t('choose-city');
		if (elements.updateBannerText) elements.updateBannerText.textContent = t('updating-app');
		if (elements.countryList.options.length > 0 && elements.countryList.options[0].value === '') {
			elements.countryList.options[0].textContent = t('all-countries');
		}
		fillLocalizedSelects();
		renderSavedLocations();
	}

	function installEventListeners() {
		elements.languageList.addEventListener('change', () => {
			currentLanguage = elements.languageList.value;
			localStorage.setItem('language', currentLanguage);
			setLabels(); showTimes(); closeNavs();
		});
		elements.madhabList.addEventListener('change', () => {
			currentMadhab = elements.madhabList.value;
			localStorage.setItem('madhab', currentMadhab); showTimes(); closeNavs();
		});
		elements.methodList.addEventListener('change', () => {
			currentMethod = elements.methodList.value;
			localStorage.setItem('method', currentMethod); showTimes(); closeNavs();
		});
		elements.bgColorList.addEventListener('change', () => setVisualSetting('bgColor', '--set-bg-color', elements.bgColorList.value, defaultBgColor));
		elements.colorList.addEventListener('change', () => setVisualSetting('color', '--set-color', elements.colorList.value, defaultColor));
		elements.fontSizeList.addEventListener('change', () => setVisualSetting('fontSize', '--set-font-size', elements.fontSizeList.value, defaultFontSize));
		elements.rightResetBtn.addEventListener('click', resetSettings);
		elements.getLocationBtn.addEventListener('click', getLocation);
		elements.emptyUseLocationBtn.addEventListener('click', getLocation);
		elements.emptyChooseCityBtn.addEventListener('click', openCitySearch);
		elements.countryList.addEventListener('change', () => {
			if (elements.citySearch.value.trim().length >= 2) searchCities();
		});
		elements.citySearch.addEventListener('input', queueCitySearch);
		elements.citySearch.addEventListener('keydown', handleCityKeys);
		elements.savedLocations.addEventListener('change', selectSavedLocation);
		elements.removeLocationBtn.addEventListener('click', removeActiveLocation);
		elements.prayerSoundEnabled.addEventListener('change', togglePrayerSound);
		elements.prayerSoundList.addEventListener('change', () => {
			localStorage.setItem('prayerSound', elements.prayerSoundList.value); showCustomSoundInput();
		});
		elements.testPrayerSoundBtn.addEventListener('click', () => playPrayerSound(true));
		elements.customSoundFile.addEventListener('change', saveCustomSound);
		elements.monthBtn.addEventListener('click', () => setPeriod('month'));
		elements.weekBtn.addEventListener('click', () => setPeriod('week'));
		elements.programInfoPopup.addEventListener('click', closeInfoPopup);
		elements.programInfoBtn.addEventListener('click', openInfoPopup);
		elements.closePopupBtn.addEventListener('click', closeInfoPopup);
		elements.openNavLeftBtn.addEventListener('click', openNavLeft);
		elements.closeNavLeftBtn.addEventListener('click', closeNavLeft);
		elements.prayerTimes.addEventListener('swipeRight', openNavLeft);
		elements.navLeft.addEventListener('swipeLeft', closeNavLeft);
		elements.openNavRightBtn.addEventListener('click', openNavRight);
		elements.closeNavRightBtn.addEventListener('click', closeNavRight);
		elements.prayerTimes.addEventListener('swipeLeft', openNavRight);
		elements.navRight.addEventListener('swipeRight', closeNavRight);
		elements.prayerTimes.addEventListener('click', closeNavs);
		document.addEventListener('click', event => {
			if (!event.target.closest('.city-search-wrap')) hideCitySuggestions();
		});
		document.addEventListener('visibilitychange', () => {
			if (!document.hidden) { showTimes(); checkPrayerAlert(); }
		});
		window.addEventListener('focus', checkPrayerAlert);
	}

	function restoreSettings() {
		const bgColor = localStorage.getItem('bgColor') || defaultBgColor;
		const color = localStorage.getItem('color') || defaultColor;
		const fontSize = localStorage.getItem('fontSize') || defaultFontSize;
		elements.bgColorList.value = bgColor;
		elements.colorList.value = color;
		elements.fontSizeList.value = fontSize;
		document.documentElement.style.setProperty('--set-bg-color', bgColor);
		document.documentElement.style.setProperty('--set-color', color);
		document.documentElement.style.setProperty('--set-font-size', fontSize);
		elements.prayerSoundEnabled.checked = localStorage.getItem('prayerSoundEnabled') === '1';
		showCustomSoundInput();
	}

	function setVisualSetting(storageKey, cssProperty, value, defaultValue) {
		document.documentElement.style.setProperty(cssProperty, value);
		if (value === defaultValue) localStorage.removeItem(storageKey);
		else localStorage.setItem(storageKey, value);
		closeNavs();
	}

	function resetSettings() {
		[
			[elements.bgColorList, defaultBgColor], [elements.colorList, defaultColor],
			[elements.fontSizeList, defaultFontSize], [elements.languageList, defaultLanguage],
			[elements.methodList, defaultMethod], [elements.madhabList, defaultMadhab],
		].forEach(([element, value]) => {
			element.value = value;
			element.dispatchEvent(new Event('change', { bubbles: true }));
		});
		elements.prayerSoundEnabled.checked = false;
		localStorage.removeItem('prayerSoundEnabled');
		elements.soundMessage.textContent = t('sound-disabled');
	}

	async function loadCountries() {
		const allOption = document.createElement('option');
		allOption.value = ''; allOption.textContent = t('all-countries');
		elements.countryList.replaceChildren(allOption);
		try {
			const response = await fetch('/api/cities.php?action=countries');
			if (!response.ok) throw new Error('Country list failed');
			const countries = await response.json();
			countries.forEach(country => {
				const option = document.createElement('option');
				option.value = country.code; option.textContent = country.name;
				elements.countryList.appendChild(option);
			});
		} catch (error) {}
	}

	function queueCitySearch() {
		window.clearTimeout(citySearchTimer);
		citySearchTimer = window.setTimeout(searchCities, 300);
	}

	async function searchCities() {
		const query = elements.citySearch.value.trim();
		if (query.length < 2) { hideCitySuggestions(); return; }
		cityAbortController?.abort();
		cityAbortController = new AbortController();
		const params = new URLSearchParams({ q: query, limit: '8' });
		if (elements.countryList.value) params.set('country', elements.countryList.value);
		try {
			const response = await fetch(`/api/cities.php?${params}`, { signal: cityAbortController.signal });
			if (!response.ok) throw new Error('City search failed');
			cityResults = await response.json(); highlightedCity = -1; renderCitySuggestions();
		} catch (error) {
			if (error.name === 'AbortError') return;
			cityResults = []; elements.locationMessage.textContent = t('city-search-error'); hideCitySuggestions();
		}
	}

	function renderCitySuggestions() {
		elements.citySuggestions.replaceChildren();
		if (cityResults.length === 0) {
			const item = document.createElement('li');
			item.textContent = t('city-search-empty'); item.setAttribute('aria-disabled', 'true');
			elements.citySuggestions.appendChild(item);
		} else {
			cityResults.forEach((city, index) => {
				const item = document.createElement('li');
				item.id = `city-option-${index}`; item.role = 'option';
				const button = document.createElement('button');
				button.type = 'button'; button.className = 'city-option-btn'; button.textContent = city.name;
				const details = document.createElement('small');
				details.textContent = [city.admin, city.country].filter(Boolean).join(', ');
				button.appendChild(details);
				button.addEventListener('click', () => chooseCity(city));
				item.appendChild(button);
				elements.citySuggestions.appendChild(item);
			});
		}
		elements.citySuggestions.hidden = false;
		elements.citySearch.setAttribute('aria-expanded', 'true');
	}

	function handleCityKeys(event) {
		if (elements.citySuggestions.hidden || cityResults.length === 0) return;
		if (event.key === 'ArrowDown') highlightedCity = Math.min(highlightedCity + 1, cityResults.length - 1);
		else if (event.key === 'ArrowUp') highlightedCity = Math.max(highlightedCity - 1, 0);
		else if (event.key === 'Enter' && highlightedCity >= 0) {
			event.preventDefault(); chooseCity(cityResults[highlightedCity]); return;
		} else if (event.key === 'Escape') { hideCitySuggestions(); return; }
		else return;
		event.preventDefault();
		Array.from(elements.citySuggestions.children).forEach((item, index) => {
			item.classList.toggle('active', index === highlightedCity);
			item.setAttribute('aria-selected', index === highlightedCity ? 'true' : 'false');
		});
		elements.citySearch.setAttribute('aria-activedescendant', `city-option-${highlightedCity}`);
	}

	function hideCitySuggestions() {
		elements.citySuggestions.hidden = true;
		elements.citySearch.setAttribute('aria-expanded', 'false');
		elements.citySearch.removeAttribute('aria-activedescendant');
	}

	function chooseCity(city) {
		const location = {
			id: `city-${city.id}`, name: city.name, admin: city.admin || '', country: city.country,
			countryCode: city.countryCode, latitude: Number(city.latitude), longitude: Number(city.longitude),
			timezone: city.timezone, type: 'city',
		};
		elements.citySearch.value = ''; elements.countryList.value = city.countryCode;
		hideCitySuggestions(); setActiveLocation(location, true);
		elements.locationMessage.textContent = t('city-saved'); closeNavs();
	}

	function saveLocations() { localStorage.setItem('savedLocations', JSON.stringify(savedLocationList)); }

	function setActiveLocation(location, save) {
		activeLocation = location;
		if (save) {
			const index = savedLocationList.findIndex(item => item.id === location.id);
			if (index >= 0) savedLocationList[index] = location;
			else savedLocationList.push(location);
			saveLocations();
		}
		localStorage.setItem('activeLocationId', location.id);
		localStorage.setItem('latitude', String(location.latitude));
		localStorage.setItem('longitude', String(location.longitude));
		renderSavedLocations(); showPosition(); showTimes();
	}

	function renderSavedLocations() {
		elements.savedLocations.replaceChildren();
		if (savedLocationList.length === 0) {
			const option = document.createElement('option');
			option.value = ''; option.textContent = t('no-saved-locations');
			elements.savedLocations.appendChild(option); elements.removeLocationBtn.disabled = true; return;
		}
		savedLocationList.forEach(location => {
			const option = document.createElement('option');
			option.value = location.id;
			option.textContent = location.type === 'current'
				? `${t('current-location')} — ${location.name}`
				: [location.name, location.country].filter(Boolean).join(', ');
			elements.savedLocations.appendChild(option);
		});
		elements.savedLocations.value = activeLocation?.id || localStorage.getItem('activeLocationId') || savedLocationList[0].id;
		elements.removeLocationBtn.disabled = false;
	}

	function selectSavedLocation() {
		const location = savedLocationList.find(item => item.id === elements.savedLocations.value);
		if (location) setActiveLocation(location, false);
	}

	function removeActiveLocation() {
		if (!activeLocation) return;
		savedLocationList = savedLocationList.filter(item => item.id !== activeLocation.id); saveLocations();
		if (savedLocationList.length > 0) setActiveLocation(savedLocationList[0], false);
		else {
			activeLocation = null;
			localStorage.removeItem('activeLocationId'); localStorage.removeItem('latitude'); localStorage.removeItem('longitude');
			renderSavedLocations(); showEmptyState();
		}
	}

	function restoreLocation() {
		const activeId = localStorage.getItem('activeLocationId');
		const stored = savedLocationList.find(location => location.id === activeId) || savedLocationList[0];
		if (stored) { setActiveLocation(stored, false); return; }
		const oldLatitude = Number(localStorage.getItem('latitude'));
		const oldLongitude = Number(localStorage.getItem('longitude'));
		if (Number.isFinite(oldLatitude) && Number.isFinite(oldLongitude) && localStorage.getItem('latitude') !== null) {
			setActiveLocation({
				id: 'current-location', name: t('current-location'), admin: '', country: '', countryCode: '',
				latitude: oldLatitude, longitude: oldLongitude,
				timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC', type: 'current',
			}, true); return;
		}
		showEmptyState(); getLocation();
	}

	function getPosition() {
		return new Promise((resolve, reject) => {
			navigator.geolocation.getCurrentPosition(resolve, reject, {
				enableHighAccuracy: false, timeout: 10000, maximumAge: 15 * 60 * 1000,
			});
		});
	}

	async function getLocation() {
		showLoading(); elements.locationMessage.textContent = '';
		try {
			const position = await getPosition();
			const latitude = Number(position.coords.latitude.toFixed(locationPrecision));
			const longitude = Number(position.coords.longitude.toFixed(locationPrecision));
			let nearest = {};
			try {
				const response = await fetch(`/api/cities.php?lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}`);
				if (response.ok) nearest = await response.json();
			} catch (error) {}
			setActiveLocation({
				id: 'current-location', name: nearest.name || t('current-location'), admin: nearest.admin || '',
				country: nearest.country || '', countryCode: nearest.countryCode || '', latitude, longitude,
				timezone: nearest.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC', type: 'current',
			}, true);
			elements.locationMessage.textContent = t('location-found'); closeNavs();
		} catch (error) {
			showEmptyState(); elements.locationMessage.textContent = t('location-failed'); openCitySearch();
		} finally { hideLoading(); }
	}

	function showLoading() { elements.locationLoading.className = 'visible'; }
	function hideLoading() { elements.locationLoading.className = 'invisible'; }

	function showEmptyState() {
		elements.locationEmptyState.hidden = false; $('prayer-place').hidden = true;
		elements.prayerTable.hidden = true; elements.prayerTable.replaceChildren();
	}

	function showPosition() {
		if (!activeLocation) return;
		elements.locationEmptyState.hidden = true; $('prayer-place').hidden = false; elements.prayerTable.hidden = false;
		elements.latInput.value = activeLocation.latitude; elements.lonInput.value = activeLocation.longitude;
		$('location-latitude').textContent = activeLocation.latitude;
		$('location-longitude').textContent = activeLocation.longitude;
		$('location-city').textContent = [activeLocation.name, activeLocation.admin].filter(Boolean).join(', ');
		$('location-country').textContent = activeLocation.country;
		$('location-map-link').href = `https://www.google.com/maps/@${activeLocation.latitude},${activeLocation.longitude},${mapZoom}z`;
	}

	function getPrayerTimes(dayMoment) {
		const coordinates = new adhan.Coordinates(activeLocation.latitude, activeLocation.longitude);
		const params = adhan.CalculationMethod[currentMethod]();
		params.madhab = adhan.Madhab[currentMadhab];
		params.highLatitudeRule = adhan.HighLatitudeRule.SeventhOfTheNight;
		const calculationDate = new Date(dayMoment.year(), dayMoment.month(), dayMoment.date(), 12);
		return new adhan.PrayerTimes(coordinates, calculationDate, params);
	}

	function showTimes() {
		if (!activeLocation) return;
		elements.prayerTable.replaceChildren(); fillTableHeaders();
		const timezone = activeLocation.timezone || 'UTC';
		const today = moment().tz(timezone).startOf('day');
		for (let index = 0; index < currentPeriod; index += 1) {
			const dayMoment = today.clone().add(index, 'days');
			const prayerTimes = getPrayerTimes(dayMoment);
			const day = `${dayMoment.date()} ${t('months')[dayMoment.month()]}<br><span class="day">${t('days')[dayMoment.day()]}</span>`;
			const formatted = {};
			['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'].forEach(prayer => {
				formatted[prayer] = moment(prayerTimes[prayer]).tz(timezone).format('HH:mm');
			});
			fillTableCells(day, formatted);
		}
		checkPrayerAlert();
	}

	function fillTableHeaders() {
		const row = document.createElement('tr'); row.appendChild(document.createElement('th'));
		Object.values(t('prayer_names')).forEach(name => {
			const cell = document.createElement('th'); cell.textContent = name; row.appendChild(cell);
		});
		elements.prayerTable.appendChild(row);
	}

	function fillTableCells(day, prayerTimes) {
		const row = document.createElement('tr'); const dateCell = document.createElement('td');
		dateCell.className = 'date-cell'; dateCell.innerHTML = day; row.appendChild(dateCell);
		Object.values(prayerTimes).forEach(time => {
			const cell = document.createElement('td'); cell.textContent = time; row.appendChild(cell);
		});
		elements.prayerTable.appendChild(row);
	}

	function setPeriod(period) {
		if (currentPeriod !== periods[period]) { currentPeriod = periods[period]; showTimes(); }
	}

	function togglePrayerSound() {
		const enabled = elements.prayerSoundEnabled.checked;
		localStorage.setItem('prayerSoundEnabled', enabled ? '1' : '0');
		elements.soundMessage.textContent = t(enabled ? 'sound-enabled' : 'sound-disabled');
		if (enabled) playPrayerSound(true);
	}

	function showCustomSoundInput() {
		elements.customSoundRow.hidden = elements.prayerSoundList.value !== prayerSounds.custom;
	}

	async function playPrayerSound(preview = false) {
		if (!preview && localStorage.getItem('prayerSoundEnabled') !== '1') return false;
		const sound = elements.prayerSoundList.value || prayerSounds.softChime;
		try {
			if (sound === prayerSounds.custom) {
				const blob = await readCustomSound();
				if (!blob) { elements.soundMessage.textContent = t('custom-sound-required'); return false; }
				const url = URL.createObjectURL(blob); const audio = new Audio(url); audio.volume = 0.45;
				audio.addEventListener('ended', () => URL.revokeObjectURL(url), { once: true });
				await audio.play(); return true;
			}
			const AudioContextClass = window.AudioContext || window.webkitAudioContext;
			if (!AudioContextClass) throw new Error('Audio is unsupported');
			audioContext = audioContext || new AudioContextClass();
			if (audioContext.state === 'suspended') await audioContext.resume();
			playBuiltInSound(sound); return true;
		} catch (error) {
			elements.soundMessage.textContent = t('sound-blocked'); return false;
		}
	}

	function playBuiltInSound(sound) {
		const now = audioContext.currentTime;
		const notes = sound === prayerSounds.singleTone
			? [{ frequency: 523.25, start: 0, duration: .4 }]
			: [{ frequency: 659.25, start: 0, duration: .45 }, { frequency: 783.99, start: .38, duration: .65 }];
		notes.forEach(note => {
			const oscillator = audioContext.createOscillator(); const gain = audioContext.createGain();
			oscillator.type = 'sine'; oscillator.frequency.value = note.frequency;
			gain.gain.setValueAtTime(0.0001, now + note.start);
			gain.gain.exponentialRampToValueAtTime(0.12, now + note.start + .03);
			gain.gain.exponentialRampToValueAtTime(0.0001, now + note.start + note.duration);
			oscillator.connect(gain).connect(audioContext.destination);
			oscillator.start(now + note.start); oscillator.stop(now + note.start + note.duration);
		});
	}

	function openSoundDatabase() {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open('easyPrayer', 1);
			request.onupgradeneeded = () => {
				if (!request.result.objectStoreNames.contains('settings')) request.result.createObjectStore('settings');
			};
			request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
		});
	}

	async function saveCustomSound() {
		const file = elements.customSoundFile.files[0];
		if (!file || !file.type.startsWith('audio/') || file.size > 5 * 1024 * 1024) {
			elements.soundMessage.textContent = t('custom-sound-invalid'); elements.customSoundFile.value = ''; return;
		}
		try {
			const db = await openSoundDatabase();
			await new Promise((resolve, reject) => {
				const transaction = db.transaction('settings', 'readwrite');
				transaction.objectStore('settings').put(file, 'customPrayerSound');
				transaction.oncomplete = resolve; transaction.onerror = () => reject(transaction.error);
			});
			db.close(); elements.soundMessage.textContent = t('custom-sound-saved'); playPrayerSound(true);
		} catch (error) { elements.soundMessage.textContent = t('custom-sound-invalid'); }
	}

	async function readCustomSound() {
		const db = await openSoundDatabase();
		return new Promise((resolve, reject) => {
			const transaction = db.transaction('settings', 'readonly');
			const request = transaction.objectStore('settings').get('customPrayerSound');
			request.onsuccess = () => { db.close(); resolve(request.result || null); };
			request.onerror = () => { db.close(); reject(request.error); };
		});
	}

	async function checkPrayerAlert() {
		if (!activeLocation || localStorage.getItem('prayerSoundEnabled') !== '1') return;
		const timezone = activeLocation.timezone || 'UTC';
		const now = moment().tz(timezone); const dayMoment = now.clone().startOf('day');
		const prayerTimes = getPrayerTimes(dayMoment);
		for (const prayer of ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha']) {
			const prayerMoment = moment(prayerTimes[prayer]).tz(timezone);
			const secondsAfter = now.diff(prayerMoment, 'seconds');
			const alertKey = `${activeLocation.id}:${dayMoment.format('YYYY-MM-DD')}:${prayer}`;
			if (secondsAfter >= 0 && secondsAfter < 60 && localStorage.getItem('lastPrayerAlert') !== alertKey) {
				localStorage.setItem('lastPrayerAlert', alertKey); await playPrayerSound(false); break;
			}
		}
	}

	function openCitySearch() {
		elements.navLeft.classList.add('open'); elements.navRight.classList.remove('open');
		window.setTimeout(() => elements.citySearch.focus(), 250);
	}
	function closeNavs() {
		elements.navLeft.classList.remove('open'); elements.navRight.classList.remove('open');
		elements.programInfoPopup.classList.remove('open'); hideCitySuggestions();
	}
	function openNavLeft() {
		elements.navLeft.classList.toggle('open'); elements.navRight.classList.remove('open');
		elements.programInfoPopup.classList.remove('open');
	}
	function closeNavLeft() { elements.navLeft.classList.remove('open'); }
	function openNavRight() {
		elements.navLeft.classList.remove('open'); elements.navRight.classList.toggle('open');
		elements.programInfoPopup.classList.remove('open');
	}
	function closeNavRight() { elements.navRight.classList.remove('open'); }

	async function openInfoPopup() {
		elements.navLeft.classList.remove('open'); elements.navRight.classList.remove('open');
		try {
			const response = await fetch(`languages/${currentLanguage}/program_info.php`);
			elements.programInfoContent.innerHTML = await response.text();
		} catch (error) { elements.programInfoContent.textContent = ''; }
		elements.programInfoPopup.classList.toggle('open');
	}
	function closeInfoPopup() { elements.programInfoPopup.classList.remove('open'); }
});
