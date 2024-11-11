window.onload = ()=>{

	// Define elements
	let closeNavLeftBtn        = document.getElementById('close_nav_left');
	let closeNavRightBtn       = document.getElementById('close_nav_right');
	let closePopupBtn          = document.getElementById('close_popup_btn');
	let navLeft                = document.getElementById('nav_left');
	let navRight               = document.getElementById('nav_right');
	let navTop                 = document.getElementById('nav_top');
	let openNavLeftBtn         = document.getElementById('open_nav_left');
	let openNavRightBtn        = document.getElementById('open_nav_right');
	let programInfoBtn         = document.getElementById('program_info_btn');
	let programInfoContent     = document.getElementById('program_info_content');
	let programInfoPopup       = document.getElementById('program_info_popup');
	let prayerTimes            = document.getElementById('prayer_times');
	let rightResetBtn          = document.getElementById('right_reset_btn');
	let monthBtn               = document.getElementById('month_btn');
	let weekBtn                = document.getElementById('week_btn');
	let countryList            = document.getElementById('country_list');
	let asrList                = document.getElementById('asr_list');
	let methodList             = document.getElementById('method_list');
	let languageList           = document.getElementById('language_list');
	let settingsHeader         = document.getElementById('settings_header');
	let header                 = document.getElementById('header');
	let locationHeader         = document.getElementById('location_header');
	let locationSettingsHeader = document.getElementById('location_settings_header');
	let latInput               = document.getElementById('lat');
	let lonInput               = document.getElementById('lon');
	let prayerTable            = document.getElementById('prayer_table')
	// Labels
	let countryListLabel       = document.getElementById('country_list_label');
	let cityListLabel          = document.getElementById('city_list_label');
	let languageListLabel      = document.getElementById('language_list_label');
	let asrListLabel           = document.getElementById('asr_list_label');
	let methodListLabel        = document.getElementById('method_list_label');
	let latInputLabel          = document.getElementById('lat_input_label');
	let lonInputLabel          = document.getElementById('lon_input_label');
	let locationLatitudeLabel  = document.getElementById('location_latitude_label');
	let locationLongitudeLabel = document.getElementById('location_longitude_label');
	let locationMapLabel       = document.getElementById('location_map_label');

	var currentLanguage;
	let currentPeriod = periods[defaultPeriod];

	// Set current language first
	setCurrentLanguage()
	setLabels(currentLanguage);
	fillSelects();

	// Than install event listeners for quick responsiveness then settings if exist
	installEventListeners();
	restoreSettings();

	let latitude = 50.4862592;
	let longitude = 8.2737342;

	// document.getElementById('prayer_city').innerHTML = 'Neustadt'
	// document.getElementById('prayer_country').innerHTML = '(Marburg Germany)'

	getPosition().then(position=>{
		latitude  = position.coords.latitude
		longitude = position.coords.longitude
		setLocationInputs()
		showPosition(latitude, longitude)
		showTimes()
	})

	function setCurrentLanguage()
	{
		if( typeof currentLanguage === 'undefined')
		{
			let lang   = navigator.language.split(/[_-]/)[0];

			if (languages.hasOwnProperty(lang))
			{
				defaultLanguage = lang;
			}
			else
			{
				defaultLanguage = 'en';
			}

			if (defaultLanguage != 'tr')
			{
				currentLanguage = 'tr';
			}

			currentLanguage = defaultLanguage;
		}
	}

	function installEventListeners()
	{
		// Language list
		languageList.addEventListener('change', (e)=>{
			setLanguage(languageList.value)
			showTimes()
		});

		// Reset settings button
		rightResetBtn.addEventListener('click', (e)=>{
			resetSettings()
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
	}

	function setLanguage(language)
	{
		setLabels(language);
		fillAsr(language);
		fillMethod(language);
		currentLanguage = language;
		localStorage.setItem('language', language);
		closeNavs();
	}

	function setLabels(language)
	{
		languageListLabel.textContent      = translations[language][languageListLabel.id];
		countryListLabel.textContent       = translations[language][countryListLabel.id];
		cityListLabel.textContent          = translations[language][cityListLabel.id];
		asrListLabel.textContent           = translations[language][asrListLabel.id];
		methodListLabel.textContent        = translations[language][methodListLabel.id];
		latInputLabel.textContent          = translations[language][latInputLabel.id];
		lonInputLabel.textContent          = translations[language][lonInputLabel.id];
		locationLatitudeLabel.textContent  = translations[language][locationLatitudeLabel.id];
		locationLongitudeLabel.textContent = translations[language][locationLongitudeLabel.id];
		rightResetBtn.textContent          = translations[language][rightResetBtn.id];
		settingsHeader.textContent         = translations[language][settingsHeader.id];
		header.textContent                 = translations[language][header.id];
		locationMapLabel.textContent       = translations[language][location_map_label.id];
		locationHeader.textContent         = translations[language][location_header.id];
		locationSettingsHeader.textContent = translations[language][locationSettingsHeader.id];
	}

	function fillSelects()
	{
		createOptions(languageList, languages, defaultLanguage);
		createOptions(asrList, asr, 'safi');
		createOptions(methodList, methods, 'mwl');
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

	function fillAsr(language)
	{
		// First remove list items before adding new ones
		while(child = asrList.lastChild){asrList.removeChild(child)}

		createOptions(asrList, translations[language]['asr'], defaultAsr);
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
		localStorage.setItem('color', color);
		closeNavs();
	}

	async function setBgColor(bgColor)
	{
		document.documentElement.style.setProperty('--set-bg-color', bgColor);
		localStorage.setItem('bgColor', bgColor);
		closeNavs();
	}

	async function setFontSize(fontSize)
	{
		document.documentElement.style.setProperty('--set-font-size', fontSize)
		localStorage.setItem('fontSize', fontSize);
		closeNavs();
	}

	function setFontFamily(fontFamily)
	{
		document.documentElement.style.setProperty('--set-font-family', fontFamily);
		localStorage.setItem('fontFamily', fontFamily);
		closeNavs();
	}

	function resetSettings()
	{
		// Reset selection list values
		asrList.value      = defaultAsr;
		languageList.value = defaultLanguage;

		// Propagate reset settings
		asrList.dispatchEvent(new Event('change', {'bubbles': true}));
		languageList.dispatchEvent(new Event('change', {'bubbles': true}));
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
		path = 'languages/'+language+'/'+file+'.html'
		await fetch(path).then(data=>data.text()).then(html=>{
			result = html
		})
		return result
	}

	function closeInfoPopup()
	{
		programInfoPopup.classList.remove('open');
	}

	function getPosition(options)
	{
		//to get current position
		return new Promise(function(resolve, reject){
			navigator.geolocation.getCurrentPosition(resolve, reject, options)
		})
	}

	function showPosition(lat, lon)
	{
		mapHref = `https://www.google.com/maps/@${lat},${lon},${mapZoom}z`
		document.getElementById('location_latitude_label').textContent = translations[currentLanguage]['latitude']
		document.getElementById('location_latitude').textContent = latitude.toFixed(locationPrecision)
		document.getElementById('location_longitude_label').textContent = translations[currentLanguage]['longitude']
		document.getElementById('location_longitude').textContent = longitude.toFixed(locationPrecision)
		document.getElementById('location_map_link').href = mapHref
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
		var params              = adhan.CalculationMethod.MuslimWorldLeague();
		params.madhab           = adhan.Madhab.Shafi;
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
			// prayTimes = {
			// 	'fajr'   : formattedTime(prayerTimes.fajr, offset),
			// 	'sunrise': formattedTime(prayerTimes.sunrise, offset),
			// 	'dhuhr'  : formattedTime(prayerTimes.dhuhr, offset),
			// 	'asr'    : formattedTime(prayerTimes.asr, offset),
			// 	'maghrib': formattedTime(prayerTimes.maghrib, offset),
			// 	'isha'   : formattedTime(prayerTimes.isha, offset),
			// }

			fillTableCells(day, prayTimes);
		}
	}

	function fillTableHeaders()
	{
		prayerNames = translations[currentLanguage]['prayer_names']
		headers = document.createElement('tr');
			th = document.createElement('th');
			// th.textContent = translations['tr']['date'];
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
			td.classList = 'date_cell'
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
		latInput.value = latitude.toFixed(locationPrecision)
		lonInput.value = longitude.toFixed(locationPrecision)
	}
}