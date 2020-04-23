window.onload = ()=>{

	// Define elements
	let closeNavLeftBtn     = document.getElementById('close_nav_left');
	let closeNavRightBtn    = document.getElementById('close_nav_right');
	let closePopupBtn       = document.getElementById('close_popup_btn');
	let navLeft             = document.getElementById('nav_left');
	let navRight            = document.getElementById('nav_right');
	let navTop              = document.getElementById('nav_top');
	let openNavLeftBtn      = document.getElementById('open_nav_left');
	let openNavRightBtn     = document.getElementById('open_nav_right');
	let programInfoBtn      = document.getElementById('program_info_btn');
	let programInfoContent  = document.getElementById('program_info_content');
	let programInfoPopup    = document.getElementById('program_info_popup');
	let prayerTimes         = document.getElementById('prayer_times');
	let leftResetBtn        = document.getElementById('left_reset_btn');
	let rightResetBtn       = document.getElementById('right_reset_btn');
	let topBtn              = document.getElementById('top_btn');
	let countryList         = document.getElementById('country_list');

	// Labels
	let countryListLabel   = document.getElementById('country_list_label');
	let cityListLabel      = document.getElementById('city_list_label');


	// Set current language first
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
			var currentLanguage = 'tr';
		}

		var currentLanguage = defaultLanguage;
	}

	setLabels(currentLanguage);
	fillSelects();

	// Than install event listeners for quick responsiveness then settings if exist
	installEventListeners();
	restoreSettings();

	function installEventListeners()
	{
		// Language list
		// languageList.addEventListener('change', (e)=>{
		// 	setLanguage(languageList.value);
		// });

		// Reset settings button
		leftResetBtn.addEventListener('click', (e)=>{
			resetSettings();
		});

		// Page no input
		// pageNo.addEventListener('keyup', function(e){if (e.keyCode == 13) pageToTop()});
		// gotoPageBtn.addEventListener('click', pageToTop);

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
			setLanguage(language);
		}
	}

	function setLanguage(language)
	{
		setLabels(language);
		currentLanguage = language;
		localStorage.setItem('language', language);
		closeNavs();
	}

	function setLabels(language)
	{
		countryListLabel.textContent   = translations[language][countryListLabel.id];
		cityListLabel.textContent   = translations[language][cityListLabel.id];
		leftResetBtn.textContent            = translations[language][leftResetBtn.id];
	}

	function fillSelects()
	{
		// createOptions(languageList, languages, defaultLanguage);
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

	function addBookmark()
	{
		bookmarkTarget = this.id;
		bookmarkLabel  = this.textContent;
		setBookmark(bookmarkTarget, bookmarkLabel);
		localStorage.setItem('bookmarkTarget', bookmarkTarget);
		localStorage.setItem('bookmarkLabel', bookmarkLabel);
	}

	function setBookmark(bookmarkTarget, bookmarkLabel)
	{
		bookmark = document.getElementById('bookmark');
		if(bookmark) bookmark.remove();

		newBookmark                = document.createElement('span');
		newBookmark.id             = 'bookmark';
		newBookmark.dataset.target = bookmarkTarget;
		newBookmarkLabel           = document.createTextNode(bookmarkLabel);
		newBookmark.appendChild(newBookmarkLabel);
		newBookmark.addEventListener('click', ()=>{gotoBookmark(bookmarkTarget)});
		bookmarkContainer.appendChild(newBookmark);
	}

	function gotoBookmark(bookmarkTarget)
	{
		closeNavs();
		document.getElementById(bookmarkTarget).scrollIntoView();
		window.scrollBy(0, -navTop.offsetHeight);
	}

	function removeBookmark()
	{
		let bookmark = document.getElementById('bookmark');

		if (bookmark)
		{
			let answer = confirm(translations[currentLanguage]['confirm_delete_bookmark']);
			if (answer)
			{
				bookmark.remove();
				localStorage.removeItem('bookmarkTarget');
				localStorage.removeItem('bookmarkLabel');
			}
		}
	}

	function setColor(color)
	{
		document.documentElement.style.setProperty('--set-color', color);
		localStorage.setItem('color', color);
		closeNavs();
	}

	async function setBgColor(bgColor)
	{
		function setProp(){
			document.documentElement.style.setProperty('--set-bg-color', bgColor);
		}
		await setProp()
		console.log('bg changed')
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
		fontFamilyList.value = defaultFontFamily;
		fontSizeList.value   = defaultFontSize;
		colorList.value      = defaultColor;
		bgColorList.value    = defaultBgColor;
		languageList.value   = defaultLanguage;

		// Propagate reset settings
		fontFamilyList.dispatchEvent(new Event('change', {'bubbles': true}));
		fontSizeList.dispatchEvent(new Event('change', {'bubbles': true}));
		colorList.dispatchEvent(new Event('change', {'bubbles': true}));
		bgColorList.dispatchEvent(new Event('change', {'bubbles': true}));
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
		console.log('nav left clicked')
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

	function quranToTop()
	{
		closeNavs();
		document.getElementById('quran_container').scrollIntoView();
	}

	function quranToBottom()
	{
		closeNavs();
		document.getElementById('quran_container').scrollIntoView({block:'end'});
	}

	function suraToTop()
	{
		closeNavs();
		document.getElementById('sura_'+suraList.value).scrollIntoView();
		window.scrollBy(0, -navTop.offsetHeight);
	}

	function suraShortcutToTop()
	{
		closeNavs();
		document.getElementById('sura_'+this.dataset.suraId).scrollIntoView();
		window.scrollBy(0, -navTop.offsetHeight);
	}

	function juzToTop()
	{
		closeNavs();
		document.getElementById('j'+juzList.value).scrollIntoView();
		window.scrollBy(0, -navTop.offsetHeight);
	}

	function pageToTop()
	{
		closeNavs();
		document.getElementById('p'+pageNo.value).scrollIntoView();
		window.scrollBy(0, -navTop.offsetHeight);
	}
};

function loading(load = true, opacity = 1)
{
	let loadingOverlay = document.getElementById('loading_overlay');

	if(load)
	{
		loadingOverlay.style.opacity = opacity;
		loadingOverlay.style.visibility = 'visible';
	}
	else
	{
		loadingOverlay.style.opacity = '0';
		loadingOverlay.style.visibility = 'hidden';
	}

}
