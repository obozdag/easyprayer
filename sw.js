importScripts('/app-config.php');

const version = self.EASY_PRAYER_CONFIG?.version ?? 'dev';
const CACHE_REVISION = `v${version}`;
const ASSET_VERSION = `v=${version}`;
const APP_SHELL_CACHE = `easy-prayer-app-shell-${CACHE_REVISION}`;
const RUNTIME_CACHE = `easy-prayer-runtime-${CACHE_REVISION}`;

const staticContentToCache = [
	'app.js',
	'app-config.php',
	'css/easy_prayer.css',
	'css/rb.css',
	'css/fonts/rb.woff',
	`css/icons/apple-touch-icon.png?${ASSET_VERSION}`,
	`css/icons/easy_prayer_128x128.png?${ASSET_VERSION}`,
	`css/icons/easy_prayer_144x144.png?${ASSET_VERSION}`,
	`css/icons/easy_prayer_152x152.png?${ASSET_VERSION}`,
	`css/icons/easy_prayer_192x192.png?${ASSET_VERSION}`,
	`css/icons/easy_prayer_32x32.png?${ASSET_VERSION}`,
	`css/icons/easy_prayer_384x384.png?${ASSET_VERSION}`,
	`css/icons/easy_prayer_48x48.png?${ASSET_VERSION}`,
	`css/icons/easy_prayer_512x512.png?${ASSET_VERSION}`,
	`css/icons/easy_prayer_64x64.png?${ASSET_VERSION}`,
	`css/icons/easy_prayer_72x72.png?${ASSET_VERSION}`,
	`css/icons/easy_prayer_96x96.png?${ASSET_VERSION}`,
	`css/icons/easy_prayer_maskable_192x192.png?${ASSET_VERSION}`,
	`css/icons/easy_prayer_maskable_512x512.png?${ASSET_VERSION}`,
	'css/icons/loading.gif',
	`easy_prayer.json?${ASSET_VERSION}`,
	'favicon.ico',
	'index.php',
	'js/adhan.umd.js',
	'js/easyprayer.js',
	'js/lang.js',
	'js/moment-timezone-with-data.js',
	'js/moment-with-locales.min.js',
	'js/settings.js',
	'js/swipe.js',
	'languages/en/program_info.php',
	'languages/tr/program_info.php',
];

function normalizeCacheKey(request)
{
	const url = new URL(request.url);
	return `${url.pathname.slice(1)}${url.search}`;
}

function isCacheableRequest(request)
{
	const url = new URL(request.url);
	return url.protocol === 'http:' || url.protocol === 'https:';
}

function canStoreResponse(response)
{
	return response && response.ok;
}

function storeResponse(cache, key, response)
{
	if (canStoreResponse(response)) {
		cache.put(key, response.clone()).catch(() => {});
	}
}

function isAppShellRequest(request)
{
	const url = new URL(request.url);
	return url.origin === self.location.origin && staticContentToCache.includes(normalizeCacheKey(request));
}

async function warmAppShellCache(cache)
{
	await Promise.allSettled(staticContentToCache.map(async file => {
		const response = await fetch(file, { cache: 'reload' });

		if (canStoreResponse(response)) {
			await cache.put(file, response);
		}
	}));
}

async function handleNavigation(request)
{
	const cache = await caches.open(APP_SHELL_CACHE);

	try {
		const response = await fetch(request);
		storeResponse(cache, 'index.php', response);
		return response;
	} catch (error) {
		const cachedResponse = await cache.match('index.php');

		return cachedResponse ?? new Response('', {
			status: 503,
			statusText: 'Offline',
		});
	}
}

self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(APP_SHELL_CACHE)
			.then(cache => warmAppShellCache(cache))
			.then(() => self.skipWaiting()),
	);
});

self.addEventListener('activate', event => {
	event.waitUntil(
		caches.keys()
			.then(keys => Promise.all(
				keys
					.filter(key => key !== APP_SHELL_CACHE && key !== RUNTIME_CACHE)
					.map(key => caches.delete(key)),
			))
			.then(() => self.clients.claim()),
	);
});

self.addEventListener('message', event => {
	if (event.data?.type === 'SKIP_WAITING') {
		self.skipWaiting();
	}
});

self.addEventListener('fetch', event => {
	if (event.request.method !== 'GET' || !isCacheableRequest(event.request)) {
		return;
	}

	if (event.request.mode === 'navigate') {
		event.respondWith(handleNavigation(event.request));
		return;
	}

	if (isAppShellRequest(event.request)) {
		event.respondWith(
			caches.open(APP_SHELL_CACHE).then(async cache => {
				const cacheKey = normalizeCacheKey(event.request);
				const cachedResponse = await cache.match(cacheKey);

				if (cachedResponse) {
					return cachedResponse;
				}

				try {
					const response = await fetch(event.request);
					storeResponse(cache, cacheKey, response);
					return response;
				} catch (error) {
					return new Response('', {
						status: 503,
						statusText: 'Offline',
					});
				}
			}),
		);
		return;
	}

	event.respondWith(
		caches.open(RUNTIME_CACHE).then(async cache => {
			try {
				const response = await fetch(event.request);
				storeResponse(cache, event.request, response);
				return response;
			} catch (error) {
				const cachedResponse = await cache.match(event.request);

				return cachedResponse ?? new Response('', {
					status: 503,
					statusText: 'Offline',
				});
			}
		}),
	);
});
