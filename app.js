if ('serviceWorker' in navigator)
{
	const version = window.appConfig?.version ?? String(Date.now());
	const reloadKey = `easyPrayerReloadedFor-${version}`;
	let refreshing = false;

	function getUpdateBannerElements()
	{
		return {
			banner: document.getElementById('update-banner'),
			text: document.getElementById('update-banner-text'),
		};
	}

	function getCurrentLanguage()
	{
		try {
			const storedLanguage = localStorage.getItem('language');

			if (storedLanguage) {
				return storedLanguage;
			}
		} catch (error) {}

		return typeof window.defaultLanguage === 'string' ? window.defaultLanguage : 'en';
	}

	function translate(key)
	{
		const language = getCurrentLanguage();
		const fallbackLanguage = typeof window.defaultLanguage === 'string' ? window.defaultLanguage : 'en';
		const source = window.translations ?? {};

		return source[language]?.[key]
			?? source[fallbackLanguage]?.[key]
			?? source.en?.[key]
			?? key;
	}

	function showUpdateBanner(worker)
	{
		const { banner, text } = getUpdateBannerElements();

		if (!banner || !text) {
			return;
		}

		text.textContent = translate('updating-app');
		banner.hidden = false;
		worker.postMessage({ type: 'SKIP_WAITING' });
	}

	function trackInstallingWorker(worker)
	{
		if (!worker) {
			return;
		}

		worker.addEventListener('statechange', () => {
			if (worker.state === 'installed' && navigator.serviceWorker.controller) {
				showUpdateBanner(worker);
			}
		});
	}

	function hasReloadedForVersion()
	{
		try {
			return sessionStorage.getItem(reloadKey) === '1';
		} catch (error) {
			return false;
		}
	}

	function markReloadedForVersion()
	{
		try {
			sessionStorage.setItem(reloadKey, '1');
		} catch (error) {}
	}

	function registerServiceWorker()
	{
		navigator.serviceWorker.register(`/sw.js?v=${encodeURIComponent(version)}`).then(registration => {
			if (registration.waiting) {
				showUpdateBanner(registration.waiting);
			}

			trackInstallingWorker(registration.installing);

			registration.addEventListener('updatefound', () => {
				trackInstallingWorker(registration.installing);
			});

			registration.update().catch(() => {});

			window.setInterval(() => {
				registration.update().catch(() => {});
			}, 60 * 60 * 1000);
		}).catch(() => {});
	}

	navigator.serviceWorker.addEventListener('controllerchange', () => {
		if (refreshing) {
			return;
		}

		refreshing = true;

		if (hasReloadedForVersion()) {
			return;
		}

		markReloadedForVersion();
		window.location.reload();
	});

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', registerServiceWorker, { once: true });
	} else {
		registerServiceWorker();
	}
}
