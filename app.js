if ('serviceWorker' in navigator)
{
	const version = window.appConfig?.version ?? String(Date.now());
	const reloadKey = `easyPrayerReloadedFor-${version}`;
	let refreshing = false;

	function getUpdateBannerElements()
	{
		return {
			banner: document.getElementById('update-banner'),
			reloadButton: document.getElementById('update-banner-reload'),
		};
	}

	function showUpdateBanner(worker)
	{
		const { banner, reloadButton } = getUpdateBannerElements();

		if (!banner || !reloadButton) {
			return;
		}

		banner.hidden = false;
		reloadButton.onclick = () => {
			worker.postMessage({ type: 'SKIP_WAITING' });
		};
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
