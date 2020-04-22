window.onload = ()=>{

	// Define elements
	let closeNavLeftBtn     = document.getElementById('close_nav_left');
	let closeNavRightBtn    = document.getElementById('close_nav_right');
	let closePopupBtn       = document.getElementById('close_popup_btn');
	let colorList           = document.getElementById('color_list');
	let fontFamilyList      = document.getElementById('font_family_list');
	let fontSizeList        = document.getElementById('font_size_list');
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

	// Labels
	let bgColorListLabel    = document.getElementById('bg_color_list_label');
	let colorListLabel      = document.getElementById('color_list_label');
	let fontFamilyListLabel = document.getElementById('font_family_list_label');
	let fontSizeListLabel   = document.getElementById('font_size_list_label');
	let languageListLabel   = document.getElementById('language_list_label');
	let pageInputLabel      = document.getElementById('page_input_label');
	let suraShortcutsLabel  = document.getElementById('sura_shortcuts_label');


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
			replaceBookmarksAndInfos(defaultLanguage);
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
		languageList.addEventListener('change', (e)=>{
			setLanguage(languageList.value);
		});

		// Font family List
		fontFamilyList.addEventListener('change', ()=>{
			setFontFamily(fontFamilyList.value);
		});

		// Font size list
		fontSizeList.addEventListener('change', (e)=>{
			setFontSize(fontSizeList.value);
		});

		// Color list
		colorList.addEventListener('change', (e)=>{
			setColor(colorList.value);
		});

		// Background color list
		bgColorList.addEventListener('change', (e)=>{
			setBgColor(bgColorList.value);
		});

		// Reset settings button
		leftResetBtn.addEventListener('click', (e)=>{
			resetSettings();
		});

		// Page no input
		pageNo.addEventListener('keyup', function(e){if (e.keyCode == 13) pageToTop()});
		gotoPageBtn.addEventListener('click', pageToTop);

		// Clean bookmark
		bookmarkIcon.addEventListener('click', removeBookmark);

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
		// Restore bookmark
		if (localStorage.getItem('bookmarkTarget'))
		{
			bookmarkTarget = localStorage.getItem('bookmarkTarget');
			bookmarkLabel  = localStorage.getItem('bookmarkLabel');
			setBookmark(bookmarkTarget, bookmarkLabel);
			gotoBookmark(bookmarkTarget);
		}

		// Restore language
		if (localStorage.getItem('language'))
		{
			language = localStorage.getItem('language');
			languageList.value = language;
			setLanguage(language);
		}

		// Restore font family
		if (localStorage.getItem('fontFamily'))
		{
			fontFamily = localStorage.getItem('fontFamily');
			fontFamilyList.value = fontFamily;
			setFontFamily(fontFamily);
		}

		// Restore font size
		if (localStorage.getItem('fontSize'))
		{
			fontSize = localStorage.getItem('fontSize');
			fontSizeList.value = fontSize;
			setFontSize(fontSize);
		}

		// Restore color
		if (localStorage.getItem('color'))
		{
			color = localStorage.getItem('color');
			colorList.value = color;
			setColor(color);
		}

		// Restore background color
		if (localStorage.getItem('bgColor'))
		{
			bgColor = localStorage.getItem('bgColor');
			bgColorList.value = bgColor;
			setBgColor(bgColor);
		}
	}

	function setLanguage(language)
	{
		setLabels(language);
		replaceBookmarksAndInfos(language);
		currentLanguage = language;
		localStorage.setItem('language', language);
		closeNavs();
	}

	function replaceBookmarksAndInfos(language)
	{
		for (var i = 0; i < juzAnchors.length; i++) {
			juzAnchors[i].textContent = juzAnchors[i].textContent.replace(translations[currentLanguage]['juz_anchor_label'], translations[language]['juz_anchor_label']);
		}

		for (var i = 0; i < pageAnchors.length; i++) {
			pageAnchors[i].textContent = pageAnchors[i].textContent.replace(translations[currentLanguage]['page_anchor_label'], translations[language]['page_anchor_label']);
		}

		for (var i = 0; i < pageInfos.length; i++) {
			pageInfos[i].textContent = pageInfos[i].textContent.replace(translations[currentLanguage]['page_info_page'], translations[language]['page_info_page']);
			pageInfos[i].textContent = pageInfos[i].textContent.replace(translations[currentLanguage]['page_info_juz'], translations[language]['page_info_juz']);
		}

		let bookmark = document.getElementById('bookmark');
		if (bookmark)
		{
			bookmark.textContent = bookmark.textContent.replace(translations[currentLanguage]['juz_anchor_label'], translations[language]['juz_anchor_label']);
			bookmark.textContent = bookmark.textContent.replace(translations[currentLanguage]['page_anchor_label'], translations[language]['page_anchor_label']);
		}
	}

	function setLabels(language)
	{
		suraListLabel.textContent       = translations[language][suraListLabel.id];
		suraShortcutsLabel.textContent  = translations[language][suraShortcutsLabel.id];
		juzListLabel.textContent        = translations[language][juzListLabel.id];
		pageInputLabel.textContent      = translations[language][pageInputLabel.id];
		fontFamilyListLabel.textContent = translations[language][fontFamilyListLabel.id];
		fontSizeListLabel.textContent   = translations[language][fontSizeListLabel.id];
		colorListLabel.textContent      = translations[language][colorListLabel.id];
		bgColorListLabel.textContent    = translations[language][bgColorListLabel.id];
		languageListLabel.textContent   = translations[language][languageListLabel.id];
		gotoPageBtn.textContent         = translations[language][gotoPageBtn.id];
		leftResetBtn.textContent            = translations[language][leftResetBtn.id];
	}

	function fillSelects()
	{
		createOptions(fontFamilyList, fontFamilies, defaultFontFamily);
		createOptions(fontSizeList, fontSizes, defaultFontSize);
		createOptions(colorList, colors, defaultColor);
		createOptions(bgColorList, bgColors, defaultBgColor);
		createOptions(languageList, languages, defaultLanguage);
		createOptions(juzList, ajza, null);
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
