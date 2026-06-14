<?php
	$prg_name = 'Easy Prayer';
	$version  = 'v0.99';
?>
<!DOCTYPE html>
<html>
<head>
	<title>Easy Prayer</title>
	<meta charset="utf-8">
	<meta name="description" content="Easy Prayer, easy to use, lightweight (200KB), multi language, responsive, progressive web app.">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="apple-mobile-web-app-status-bar" content="steelblue">
	<meta name="theme-color" content="steelblue">
	<link rel="canonical" href="https://prayer.fklavye.net">
	<link rel="stylesheet" type="text/css" href="css/easy_prayer.css">
	<link rel="apple-touch-icon" href="css/icons/easy_prayer_96x96.png">
	<link rel="manifest" href="easy_prayer.json">
	<script type="text/javascript">
		var prg_name = '<?= $prg_name ?>';
		var version  = '<?= $version ?>';
	</script>
	<script src="js/adhan.umd.js"></script>
	<script src="js/moment-with-locales.min.js"></script>
	<script src="js/moment-timezone-with-data.js"></script>
	<script src="js/swipe.js"></script>
	<script src="js/lang.js"></script>
	<script src="js/settings.js"></script>
	<script src="js/easyprayer.js"></script>
	<script src="app.js"></script>
</head>
<body>
	<nav id="nav-top">
		<i id="open-nav-left" class="nav-top-btn rb-map-location-dot" title="Nav Left"></i>
		<i id="program-info-btn" class="nav-top-btn rb-call-prayer-solid" title="Program Info"></i>
		<i id="month-btn" class="nav-top-btn rb-monthly-calendar" title="Month"></i>
		<i id="week-btn" class="nav-top-btn rb-weekly-calendar" title="Week"></i>
		<!-- <span><i id="bookmark-icon" class="nav-top-btn rb-bookmark" title="Bookmark"></i><span id="bookmark-container"></span></span> -->
		<i id="open-nav-right" class="nav-top-btn rb-slider" title="Nav Right"></i>
	</nav>
	<nav id="nav-left">
		<i id="close-nav-left" class="close-btn right rb-circle-xmark"></i>
		<h4 id="location-settings-header" class="settings-header"></h4>
		<div class="settings">
			<div class="row">
				<label id="country-list-label"></label>
				<select id="country-list"></select>
			</div>
			<div class="row">
				<label id="city-list-label"></label>
				<select id="city-list"></select>
			</div>
			<div class="row">
				<label id="lat-input-label"></label>
				<input type="text" id="lat" size="10" maxlength="10" pattern="\d" title="Latitude">
			</div>
			<div class="row">
				<label id="lon-input-label"></label>
				<input type="text" id="lon" size="10" maxlength="10" pattern="\d" title="Longitude">
			</div>
			<div class="row">
				<label></label>
				<button type="button" class="btn btn-nav" id="get-location-btn"></button>
			</div>
			<div class="row">
				<label></label>
				<span class="invisible" id="location-loading"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><radialGradient id="a12" cx=".66" fx=".66" cy=".3125" fy=".3125" gradientTransform="scale(1.5)"><stop offset="0" stop-color="#FF156D"></stop><stop offset=".3" stop-color="#FF156D" stop-opacity=".9"></stop><stop offset=".6" stop-color="#FF156D" stop-opacity=".6"></stop><stop offset=".8" stop-color="#FF156D" stop-opacity=".3"></stop><stop offset="1" stop-color="#FF156D" stop-opacity="0"></stop></radialGradient><circle transform-origin="center" fill="none" stroke="url(#a12)" stroke-width="15" stroke-linecap="round" stroke-dasharray="200 1000" stroke-dashoffset="0" cx="100" cy="100" r="70"><animateTransform type="rotate" attributeName="transform" calcMode="spline" dur="2" values="360;0" keyTimes="0;1" keySplines="0 0 1 1" repeatCount="indefinite"></animateTransform></circle><circle transform-origin="center" fill="none" opacity=".2" stroke="#FF156D" stroke-width="15" stroke-linecap="round" cx="100" cy="100" r="70"></circle></svg></span>
			</div>
		</div>
	</nav>
	<nav id="nav-right">
		<i id="close-nav-right" class="close-btn left rb-circle-xmark"></i>
		<div class="settings">
			<h4 id="settings-header" class="settings-header"></h4>
			<div class="row">
				<label id="method-list-label"></label>
				<select id="method-list"></select>
			</div>
			<div class="row">
				<label id="madhab-list-label"></label>
				<select id="madhab-list"></select>
			</div>
			<div class="row"></div>
			<div class="row">
				<label id="font-size-list-label"></label>
				<select id="font-size-list"></select>
			</div>
			<div class="row">
				<label id="color-list-label"></label>
				<select id="color-list"></select>
			</div>
			<div class="row">
				<label id="bg-color-list-label"></label>
				<select id="bg-color-list"></select>
			</div>
			<div class="row">
				<label id="language-list-label"></label>
				<select id="language-list"></select>
			</div>
			<div class="row">
				<label></label>
				<button type="button" class="btn btn-nav" id="right-reset-btn"></button>
			</div>
		</div>
	</nav>
	<div class="container">
		<h4 id="header"></h4>
		<div id="prayer-times">
			<div id="prayer-place">
				<h5>
					<span id="location-header"></span>:<br>
					<span class="location-info">
						<span id="location-latitude-label"></span>: <span id="location-latitude"></span><br>
						<span id="location-longitude-label"></span>: <span id="location-longitude"></span><br>
						<a id="location-map-link" href="" target="-blank">
							<span id="location-map-label"></span>
							<i class="rb-globe"></i>
						</a>
					</span>
				</h5>
				<h5>
					<small><span id="location-city"></span></small>
					<small><span id="location-country"></span></small>
				</h5>
			</div>
			<table id="prayer-table">
			</table>
		</div>
		<div class="overlay" id="program-info-popup">
			<div class="popup">
				<i id="close-popup-btn" class="close-btn right rb-circle-xmark"></i>
				<h3><i class="logo rb-call-prayer-solid"></i> <?= $prg_name.' '.$version ?></h3>
				<div id="program-info-content"></div>
			</div>
		</div>
	</div>
	<footer>
		<a target="_blank" href="https://github.com/obozdag/prayer">
			<i class="logo rb-call-prayer-solid" title="<?= $prg_name ?>"></i>
			<?= $prg_name ?>
		</a>
	</footer>
</body>
</html>
