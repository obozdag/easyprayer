<!DOCTYPE html>
<html>
<head>
	<title>Easy Prayer</title>
	<meta charset="utf-8">
	<meta name="description" content="Easy Prayer, easy to use, lightweight (200KB), multi language, responsive, progressive web app.">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="apple-mobile-web-app-status-bar" content="steelblue">
	<meta name="theme-color" content="steelblue">
	<!-- <link rel="canonical" href="https://prayer.fklavye.net"> -->
	<link rel="stylesheet" type="text/css" href="css/easy_prayer.css">
	<link rel="apple-touch-icon" href="css/icons/easy_prayer_96x96.png">
	<script src="js/adhan.umd.js"></script>
	<script src="js/moment-with-locales.min.js"></script>
	<script src="js/moment-timezone-with-data.js"></script>
	<!-- <link rel="manifest" href="easy_prayer.json"> -->
</head>
<body>
	<nav id="nav_top">
		<i id="open_nav_left" class="nav_top_btn rb-map-location-dot" title="Nav Left"></i>
		<i id="program_info_btn" class="nav_top_btn rb-call-prayer-solid" title="Program Info"></i>
		<i id="month_btn" class="nav_top_btn rb-monthly-calendar" title="Month"></i>
		<i id="week_btn" class="nav_top_btn rb-weekly-calendar" title="Week"></i>
		<span><i id="bookmark_icon" class="nav_top_btn rb-bookmark" title="Bookmark"></i><span id="bookmark_container"></span></span>
		<i id="open_nav_right" class="nav_top_btn rb-slider" title="Nav Right"></i>
	</nav>
	<nav id="nav_left">
		<i id="close_nav_left" class="close_btn right rb-circle-xmark"></i>
		<h4 id="location_settings_header" class="settings_header"></h4>
		<div class="settings">
			<div class="row">
				<label id="country_list_label"></label>
				<select id="country_list"></select>
			</div>
			<div class="row">
				<label id="city_list_label"></label>
				<select id="city_list"></select>
			</div>
			<div class="row">
				<label id="lat_input_label"></label>
				<input type="text" id="lat" size="10" maxlength="10" pattern="\d" title="Latitude">
			</div>
			<div class="row">
				<label id="lon_input_label"></label>
				<input type="text" id="lon" size="10" maxlength="10" pattern="\d" title="Longitude">
			</div>
		</div>
	</nav>
	<nav id="nav_right">
		<i id="close_nav_right" class="close_btn left rb-circle-xmark"></i>
		<div class="settings">
			<h4 id="settings_header" class="settings_header"></h4>
			<div class="row">
				<label id="method_list_label"></label>
				<select id="method_list"></select>
			</div>
			<div class="row">
				<label id="asr_list_label"></label>
				<select id="asr_list"></select>
			</div>
			<div class="row">
				<label id="language_list_label"></label>
				<select id="language_list"></select>
			</div>
			<div class="row">
				<label></label>
				<button type="button" class="btn btn_nav" id="right_reset_btn"></button>
			</div>
		</div>
	</nav>
	<div class="container">
		<h4 id="header"></h4>
		<div id="prayer_times">
			<div id="prayer_place">
				<h5>
					<span id="location_header"></span>
					<span class="location_info">
						<span id="location_latitude_label"></span> <span id="location_latitude"></span>
						<span id="location_longitude_label"></span> <span id="location_longitude"></span>
						<a id="location_map_link" href="">
							<span id="location_map_label"></span>
							<i class="rb-globe"></i>
						</a>
					</span>
				</h5>
				<h5>
					<small><span id="location_city"></span></small>
					<small><span id="location_country"></span></small>
				</h5>
			</div>
			<table id="prayer_table">
			</table>
		</div>
	</div>
	<footer><a target="_blank" href="https://github.com/obozdag/prayer"><i class="logo rb-call-prayer-solid" title="Easy Prayer"></i> Easy Prayer</a></footer>
	<div class="overlay" id="program_info_popup">
		<div class="popup">
			<i id="close_popup_btn" class="close_btn right rb-circle-xmark"></i>
			<h3><i class="logo rb-call-prayer-solid"></i> Easy Prayer v.8</h3>
			<div id="program_info_content">
			</div>
		</div>
	</div>
	<script src="js/swipe.js"></script>
	<script src="js/lang.js"></script>
	<script src="js/settings.js"></script>
	<script src="js/easy_prayer.js"></script>
	<!-- <script src="app.js"></script> -->
</body>
</html>
