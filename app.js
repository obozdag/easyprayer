if ('serviceWorker' in navigator)
{
	const version = window.appConfig?.version ?? String(Date.now());
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
		window.location.reload();
	});

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', registerServiceWorker, { once: true });
	} else {
		registerServiceWorker();
	}
}
