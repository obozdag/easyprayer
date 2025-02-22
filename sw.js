var version = 'Easy Prayer v0.92';

var staticContentToCache = [
	'favicon.ico',
	'css/easy_prayer.css',
	'css/fonts/rb_icons.ttf',
	'css/icons/easy_prayer_32x32.png',
	'css/icons/easy_prayer_48x48.png',
	'css/icons/easy_prayer_64x64.png',
	'css/icons/easy_prayer_72x72.png',
	'css/icons/easy_prayer_96x96.png',
	'css/icons/easy_prayer_128x128.png',
	'css/icons/easy_prayer_144x144.png',
	'css/icons/easy_prayer_152x152.png',
	'css/icons/easy_prayer_192x192.png',
	'css/icons/easy_prayer_384x384.png',
	'css/icons/easy_prayer_512x512.png',
	'css/icons/loading.gif',
	'app.js',
	'js/adhan.umd.js',
	'js/moment-timezone-with-data.js',
	'js/moment-with-locales.min.js',
	'js/swipe.js',
	'js/lang.js',
	'js/setting.js',
	'js/easyprayer.js',
	'languages/en/program_info.html',
	'languages/tr/program_info.html',
];

// Installing Service Worker
self.addEventListener('install', evt => {
	evt.waitUntil(
		caches.open(version).then(cache => {
			return staticContentToCache.forEach(function(file){
				cache.add(file).catch(err => console.log(err+file))
			})
		})
		.then(function(){return self.skipWaiting()})
	)})

// Activating Service Worker
self.addEventListener('activate', evt => {
	evt.waitUntil(
		caches.keys().then(keys => {
			return Promise.all(keys
				.filter(key => key !== version)
				.map(key => caches.delete(key))
			)
	}))})


// Fetching content using Service Worker
self.addEventListener('fetch', evt => {
	evt.respondWith(
		caches.match(evt.request).then(
			cacheResponse => {
				return cacheResponse || fetch(evt.request);
		}))
	})
