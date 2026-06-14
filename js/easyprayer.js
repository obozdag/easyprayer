window.onload = ()=>{
	// Define elements
	let closeNavLeftBtn        = document.getElementById('close-nav-left');
	let closeNavRightBtn       = document.getElementById('close-nav-right');
	let closePopupBtn          = document.getElementById('close-popup-btn');
	let countryList            = document.getElementById('country-list');
	let getLocationBtn         = document.getElementById('get-location-btn');
	let header                 = document.getElementById('header');
	let languageList           = document.getElementById('language-list');
	let latInput               = document.getElementById('lat');
	let locationHeader         = document.getElementById('location-header');
	let locationLoading        = document.getElementById('location-loading');
	let locationSettingsHeader = document.getElementById('location-settings-header');
	let lonInput               = document.getElementById('lon');
	let madhabList             = document.getElementById('madhab-list');
	let methodList             = document.getElementById('method-list');
	let monthBtn               = document.getElementById('month-btn');
	let navLeft                = document.getElementById('nav-left');
	let navRight               = document.getElementById('nav-right');
	let navTop                 = document.getElementById('nav-top');
	let openNavLeftBtn         = document.getElementById('open-nav-left');
	let openNavRightBtn        = document.getElementById('open-nav-right');
	let prayerTable            = document.getElementById('prayer-table')
	let prayerTimes            = document.getElementById('prayer-times');
	let programInfoBtn         = document.getElementById('program-info-btn');
	let programInfoContent     = document.getElementById('program-info-content');
	let programInfoPopup       = document.getElementById('program-info-popup');
	let rightResetBtn          = document.getElementById('right-reset-btn');
	let settingsHeader         = document.getElementById('settings-header');
	let weekBtn                = document.getElementById('week-btn');

	// Labels
	let cityListLabel          = document.getElementById('city-list-label');
	let countryListLabel       = document.getElementById('country-list-label');
	let languageListLabel      = document.getElementById('language-list-label');
	let latInputLabel          = document.getElementById('lat-input-label');
	let locationLatitudeLabel  = document.getElementById('location-latitude-label');
	let locationLongitudeLabel = document.getElementById('location-longitude-label');
	let locationMapLabel       = document.getElementById('location-map-label');
	let lonInputLabel          = document.getElementById('lon-input-label');
	let madhabListLabel        = document.getElementById('madhab-list-label');
	let methodListLabel        = document.getElementById('method-list-label');

	let bgColorList            = document.getElementById('bg-color-list');
	let colorList              = document.getElementById('color-list');
	let fontSizeList           = document.getElementById('font-size-list');

	let bgColorListLabel       = document.getElementById('bg-color-list-label');
	let colorListLabel         = document.getElementById('color-list-label');
	let fontSizeListLabel      = document.getElementById('font-size-list-label');


	var currentLanguage;
	let currentPeriod = periods[defaultPeriod];

	// Set current language, madhab, method and position first

	setCurrentLanguage()
	setCurrentMadhab()
	setCurrentMethod()

	setLabels(currentLanguage);
	fillSelects();

	// Than install event listeners for quick responsiveness then settings if exist
	installEventListeners();
	restoreSettings();

	setLocation()

	function getPosition(options)
	{
		//to get current position
		return new Promise(function(resolve, reject){
			navigator.geolocation.getCurrentPosition(resolve, reject, options)
		})
	}

	function getLocation()
	{
		showLoading()
		getPosition().then(position=>{
			latitude  = position.coords.latitude
			longitude = position.coords.longitude
			setLocationInputs()
			saveLocation()
			showPosition(latitude, longitude)
			showTimes()
			hideLoading()
			closeNavs();
		})
	}

	function showLoading() {
		locationLoading.className = 'visible'
	}

	function hideLoading() {
		locationLoading.className = 'invisible'
	}

	function showPosition(lat, lon)
	{
		mapHref = `https://www.google.com/maps/@${lat},${lon},${mapZoom}z`
		document.getElementById('location-latitude-label').textContent = translations[currentLanguage]['latitude']
		document.getElementById('location-latitude').textContent = latitude
		document.getElementById('location-longitude-label').textContent = translations[currentLanguage]['longitude']
		document.getElementById('location-longitude').textContent = longitude
		document.getElementById('location-map-link').href = mapHref
	}

	function setLocation(){
		if(localStorage.getItem('latitude') && localStorage.getItem('longitude')){
			latitude = parseFloat(localStorage.getItem('latitude'));
			longitude = parseFloat(localStorage.getItem('longitude'));
			setLocationInputs();
			showPosition(latitude, longitude);
			showTimes();
		} else {
			getLocation();
		}
	}

	function saveLocation()
	{
		localStorage.setItem('latitude', latitude);
		localStorage.setItem('longitude', longitude);
	}

	function setCurrentLanguage()
	{
		if( typeof currentLanguage === 'undefined')
		{
			currentLanguage = defaultLanguage;
		}
	}

	function setCurrentMadhab()
	{
		if( typeof currentMadhab === 'undefined')
		{
			currentMadhab = defaultMadhab;
		}
	}

	function setCurrentMethod()
	{
		if( typeof currentMethod === 'undefined')
		{
			currentMethod = defaultMethod;
		}
	}

	function installEventListeners()
	{
		// Language list
		languageList.addEventListener('change', (e)=>{
			setLanguage(languageList.value)
			showTimes()
		});

		// Madhab list
		madhabList.addEventListener('change', (e)=>{
			setMadhab(madhabList.value)
			showTimes()
		});

		// Madhab list
		methodList.addEventListener('change', (e)=>{
			setMethod(methodList.value)
			showTimes()
		});

		// Reset settings button
		rightResetBtn.addEventListener('click', (e)=>{
			resetSettings()
		});

		// Get location button
		getLocationBtn.addEventListener('click', (e)=>{
			getLocation();
		});

		// Month button
		monthBtn.addEventListener('click', (e)=>{
			if (currentPeriod != periods['month'])
			{
				currentPeriod = periods['month']
				showTimes()
			}
		});

		// Week button
		weekBtn.addEventListener('click', (e)=>{
			if (currentPeriod != periods['week'])
			{
				currentPeriod = periods['week']
				showTimes()
			}
		});

		// Program info
		programInfoPopup.addEventListener('click', closeInfoPopup);
		programInfoBtn.addEventListener('click', openInfoPopup);
		closePopupBtn.addEventListener('click', closeInfoPopup);

		// Nav left
		openNavLeftBtn.addEventListener('click', openNavLeft);
		closeNavLeftBtn.addEventListener('click', closeNavLeft);
		prayerTimes.addEventListener('swipeRight', openNavLeft);
		navLeft.addEventListener('swipeLeft', closeNavLeft);

		// Nav right
		openNavRightBtn.addEventListener('click', openNavRight);
		closeNavRightBtn.addEventListener('click', closeNavRight);
		prayerTimes.addEventListener('swipeLeft', openNavRight);
		navRight.addEventListener('swipeRight', closeNavRight);

		prayerTimes.addEventListener('click', closeNavs);
	}

	function restoreSettings()
	{
		// Restore language
		if (localStorage.getItem('language'))
		{
			language = localStorage.getItem('language');
			languageList.value = language;
			setLanguage(language)
		}

		// Restore madhab
		if (localStorage.getItem('madhab'))
		{
			madhab = localStorage.getItem('madhab');
			madhabList.value = madhab;
			setMadhab(madhab)
		}

		// Restore medhod
		if (localStorage.getItem('method'))
		{
			method = localStorage.getItem('method');
			methodList.value = method;
			setMethod(method)
		}

		// Restore position
		if (localStorage.getItem('latitude') && localStorage.getItem('longitude'))
		{
			latitude = localStorage.getItem('latitude');
			longitude = localStorage.getItem('longitude');
		}
	}

	function setLanguage(language)
	{
		setLabels(language);
		fillMadhab(language);
		fillMethod(language);
		currentLanguage = language;
		localStorage.setItem('language', language);
		closeNavs();
	}

	function setMadhab(madhab)
	{
		currentMadhab = madhab;
		localStorage.setItem('madhab', madhab);
		closeNavs();
	}

	function setMethod(method)
	{
		currentMethod = method;
		localStorage.setItem('method', method);
		closeNavs();
	}

	function setLabels(language)
	{
		bgColorListLabel.textContent       = translations[language][bgColorListLabel.id];
		colorListLabel.textContent         = translations[language][colorListLabel.id];
		fontSizeListLabel.textContent      = translations[language][fontSizeListLabel.id];

		cityListLabel.textContent          = translations[language][cityListLabel.id];
		countryListLabel.textContent       = translations[language][countryListLabel.id];
		getLocationBtn.textContent         = translations[language][getLocationBtn.id];
		header.textContent                 = translations[language][header.id];
		languageListLabel.textContent      = translations[language][languageListLabel.id];
		latInputLabel.textContent          = translations[language][latInputLabel.id];
		locationHeader.textContent         = translations[language][locationHeader.id];
		locationLatitudeLabel.textContent  = translations[language][locationLatitudeLabel.id];
		locationLongitudeLabel.textContent = translations[language][locationLongitudeLabel.id];
		locationMapLabel.textContent       = translations[language][locationMapLabel.id];
		locationSettingsHeader.textContent = translations[language][locationSettingsHeader.id];
		lonInputLabel.textContent          = translations[language][lonInputLabel.id];
		madhabListLabel.textContent        = translations[language][madhabListLabel.id];
		methodListLabel.textContent        = translations[language][methodListLabel.id];
		rightResetBtn.textContent          = translations[language][rightResetBtn.id];
		settingsHeader.textContent         = translations[language][settingsHeader.id];
	}

	function fillSelects()
	{
		createOptions(fontSizeList, fontSizes, defaultFontSize);
		createOptions(colorList, colors, defaultColor);
		createOptions(bgColorList, bgColors, defaultBgColor);
		createOptions(languageList, languages, defaultLanguage);

		createOptions(madhabList, madhabs, defaultMadhab);
		createOptions(methodList, methods, defaultMethod);
	}

	function createOptions(selectElement, options, defaultOption)
	{
		for ([value, text] of Object.entries(options))
		{
			option = document.createElement('option');
			option.value = value;
			option.textContent = text;
			selectElement.appendChild(option);
			if (defaultOption == value) selectElement.value = value;
		}
	}

	function fillMadhab(language)
	{
		// First remove list items before adding new ones
		while(child = madhabList.lastChild){madhabList.removeChild(child)}

		createOptions(madhabList, translations[language]['madhabs'], defaultMadhab);
	}

	function fillMethod(language)
	{
		// First remove list items before adding new ones
		while(child = methodList.lastChild){methodList.removeChild(child)}

		createOptions(methodList, translations[language]['methods'], defaultMethod);
	}

	function setColor(color)
	{
		document.documentElement.style.setProperty('--set-color', color);

		if (color != defaultColor)
		{
			localStorage.setItem('color', color);
		}
		else
		{
			localStorage.removeItem('color')
		}

		closeNavs();
	}

	function setBgColor(bgColor)
	{
		document.documentElement.style.setProperty('--set-bg-color', bgColor);

		if (bgColor != defaultBgColor)
		{
			localStorage.setItem('bgColor', bgColor);
		}
		else
		{
			localStorage.removeItem('bgColor')
		}

		closeNavs();
	}

	function setFontSize(fontSize)
	{
		document.documentElement.style.setProperty('--set-font-size', fontSize)

		if (fontSize != defaultFontSize)
		{
			localStorage.setItem('fontSize', fontSize);
		}
		else
		{
			localStorage.removeItem('fontSize')
		}

		closeNavs();
	}

	function resetSettings()
	{
		// Reset selection list values
		bgColorList.value  = defaultBgColor;
		colorList.value    = defaultColor;
		fontSizeList.value = defaultFontSize;
		languageList.value = defaultLanguage;

		methodList.value   = defaultMethod;
		madhabList.value   = defaultMadhab;

		// Propagate reset settings
		bgColorList.dispatchEvent(new Event('change', {'bubbles': true}));
		colorList.dispatchEvent(new Event('change', {'bubbles': true}));
		fontSizeList.dispatchEvent(new Event('change', {'bubbles': true}));
		languageList.dispatchEvent(new Event('change', {'bubbles': true}));

		methodList.dispatchEvent(new Event('change', {'bubbles': true}));
		madhabList.dispatchEvent(new Event('change', {'bubbles': true}));
	}

	function closeNavs()
	{
		navLeft.classList.remove('open');
		navRight.classList.remove('open');
		programInfoPopup.classList.remove('open');
	}

	function closeNavLeft()
	{
		navLeft.classList.remove('open');
	}

	function closeNavRight()
	{
		navRight.classList.remove('open');
	}

	function openNavLeft()
	{
		navLeft.classList.toggle('open');
		navRight.classList.remove('open');
		programInfoPopup.classList.remove('open');
	}

	function openNavRight()
	{
		navLeft.classList.remove('open');
		navRight.classList.toggle('open');
		programInfoPopup.classList.remove('open');
	}

	async function openInfoPopup()
	{
		navLeft.classList.remove('open');
		navRight.classList.remove('open');
		programInfoContent.innerHTML = await fetchLangHTML(currentLanguage, 'program_info')
		programInfoPopup.classList.toggle('open');
	}

	async function fetchLangHTML(language, file)
	{
		result = ''
		console.log(result)
		path = 'languages/' + language + '/' + file + '.php?' + Date.now()
		await fetch(path).then(data => data.text()).then(html => {result = html})
		return result
	}

	function closeInfoPopup()
	{
		programInfoPopup.classList.remove('open');
	}

	function clearTimes()
	{
		while(child = prayerTable.lastChild){prayerTable.removeChild(child)}
	}

	function showTimes()
	{
		clearTimes();
		fillTableHeaders();
		var coordinates         = new adhan.Coordinates(latitude, longitude);
		var params              = adhan.CalculationMethod[currentMethod]();
		params.madhab           = adhan.Madhab[currentMadhab];
		params.highLatitudeRule = adhan.HighLatitudeRule.SeventhOfTheNight;

		var today = new Date();

		for (i = 0; i < currentPeriod; i++)
		{
			var date  = new Date();
			date.setDate(today.getDate() + i);
			var prayerTimes   = new adhan.PrayerTimes(coordinates, date, params);
			// var formattedTime = adhan.Date.formattedTime;
			month_name = (translations[currentLanguage]['months'][date.getMonth()])
			day_name = (translations[currentLanguage]['days'][date.getDay()])
			day = date.getDate() + ' ' + month_name + '<br>' + '<span class="day">' + day_name + '</span>'
			offset = date.toString().match(/([-\+][0-9]+)\s/)[1].substring(0, 3)
			prayTimes = {
				'fajr'   : moment(prayerTimes.fajr).tz('Europe/Berlin').format('HH:mm'),
				'sunrise': moment(prayerTimes.sunrise).tz('Europe/Berlin').format('HH:mm'),
				'dhuhr'  : moment(prayerTimes.dhuhr).tz('Europe/Berlin').format('HH:mm'),
				'asr'    : moment(prayerTimes.asr).tz('Europe/Berlin').format('HH:mm'),
				'maghrib': moment(prayerTimes.maghrib).tz('Europe/Berlin').format('HH:mm'),
				'isha'   : moment(prayerTimes.isha).tz('Europe/Berlin').format('HH:mm'),
			}

			fillTableCells(day, prayTimes);
		}
	}

	function fillTableHeaders()
	{
		prayerNames = translations[currentLanguage]['prayer_names']
		headers = document.createElement('tr');
			th = document.createElement('th');
			th.textContent = '';
			headers.appendChild(th);

		createTableHeaders(headers, prayerNames);

		prayerTable.appendChild(headers)
	}

	function createTableHeaders(trElement, prayerNames)
	{
		for ([value, text] of Object.entries(prayerNames))
		{
			th = document.createElement('th');
			th.textContent = text;
			trElement.appendChild(th);
		}
	}

	function fillTableCells(day, prayerTimes)
	{
		timeRow = document.createElement('tr');
			td = document.createElement('td');
			td.classList = 'date-cell'
			td.innerHTML = day;
			timeRow.appendChild(td);
		createTableCells(timeRow, prayerTimes);
		prayerTable.appendChild(timeRow)
	}

	function createTableCells(trElement, prayerTimes)
	{
		for ([value, text] of Object.entries(prayerTimes))
		{
			td = document.createElement('td');
			td.textContent = text;
			trElement.appendChild(td);
		}
	}

	function setLocationInputs()
	{
		latInput.value = latitude
		lonInput.value = longitude
	}
}