<?php
	$app_config  = json_decode((string) file_get_contents(__DIR__ . '/app_config.json'), true);
	$app_config  = is_array($app_config) ? $app_config : [];
	$prg_name    = $app_config['programName'] ?? 'Easy Prayer';
	$version     = isset($app_config['version']) && trim((string) $app_config['version']) !== ''
		? trim((string) $app_config['version'])
		: 'dev';
	$version_tag = $version === 'dev' ? 'dev' : 'v' . $version;
	$asset_query = $version === 'dev' ? '' : '?v=' . rawurlencode($version);
	$color       = $app_config['color'] ?? 'steelblue';
	$canonical   = $app_config['canonicalUrl'] ?? 'https://prayer.fklavye.net';
	$repository  = $app_config['repositoryUrl'] ?? 'https://github.com/obozdag/easyprayer';

	function e($value): string
	{
		return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
	}
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<title><?= e($prg_name) ?></title>
	<meta charset="utf-8">
	<meta name="description" content="Easy Prayer, easy to use, lightweight (200KB), multi language, responsive, progressive web app.">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="apple-mobile-web-app-status-bar" content="<?= e($color) ?>">
	<meta name="theme-color" content="<?= e($color) ?>">
	<link rel="canonical" href="<?= e($canonical) ?>">
	<link rel="stylesheet" type="text/css" href="/css/easy_prayer.css">
	<link rel="apple-touch-icon" href="/css/icons/apple-touch-icon.png<?= e($asset_query) ?>">
	<link rel="manifest" href="/easy_prayer.json<?= e($asset_query) ?>">
	<script type="text/javascript">
		window.appConfig = {
			programName: '<?= e($prg_name) ?>',
			version: '<?= e($version) ?>',
			versionLabel: '<?= e($version_tag) ?>'
		};
		var prg_name = window.appConfig.programName;
		var version  = window.appConfig.versionLabel;
	</script>
	<script defer src="/js/adhan.umd.js"></script>
	<script defer src="/js/moment-with-locales.min.js"></script>
	<script defer src="/js/moment-timezone-with-data.js"></script>
	<script defer src="/js/swipe.js"></script>
	<script defer src="/js/lang.js"></script>
	<script defer src="/js/settings.js"></script>
	<script defer src="/js/easyprayer.js"></script>
	<script defer src="/app.js<?= e($asset_query) ?>"></script>
</head>
<body>
	<div id="update-banner" class="update-banner" hidden>
		<span id="update-banner-text">New version available.</span>
		<button type="button" id="update-banner-reload" class="btn update-banner-btn">Reload</button>
	</div>
	<nav id="nav-top">
		<button type="button" id="open-nav-left" class="nav-top-btn rb-map-location-dot" title="Nav Left" aria-label="Open location settings"></button>
		<button type="button" id="program-info-btn" class="nav-top-btn rb-call-prayer-solid" title="Program Info" aria-label="Program info"></button>
		<button type="button" id="month-btn" class="nav-top-btn rb-monthly-calendar" title="Month" aria-label="Show monthly table"></button>
		<button type="button" id="week-btn" class="nav-top-btn rb-weekly-calendar" title="Week" aria-label="Show weekly table"></button>
		<!-- <span><i id="bookmark-icon" class="nav-top-btn rb-bookmark" title="Bookmark"></i><span id="bookmark-container"></span></span> -->
		<button type="button" id="open-nav-right" class="nav-top-btn rb-slider" title="Nav Right" aria-label="Open settings"></button>
	</nav>
	<nav id="nav-left">
		<button type="button" id="close-nav-left" class="close-btn right rb-circle-xmark" aria-label="Close location settings"></button>
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
		<button type="button" id="close-nav-right" class="close-btn left rb-circle-xmark" aria-label="Close settings"></button>
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
						<a id="location-map-link" href="" target="_blank" rel="noopener">
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
				<button type="button" id="close-popup-btn" class="close-btn right rb-circle-xmark" aria-label="Close program info"></button>
				<h3><i class="logo rb-call-prayer-solid"></i> <?= e($prg_name . ' ' . $version_tag) ?></h3>
				<div id="program-info-content"></div>
			</div>
		</div>
	</div>
	<footer>
		<a target="_blank" rel="noopener" href="<?= e($repository) ?>">
			<i class="logo rb-call-prayer-solid" title="<?= e($prg_name) ?>"></i>
			<?= e($prg_name . ' ' . $version_tag) ?>
		</a>
	</footer>
</body>
</html>
