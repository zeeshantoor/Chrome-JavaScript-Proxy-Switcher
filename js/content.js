const setProxyButton = document.createElement('button');
setProxyButton.id = 'btn-set-proxy-address__extension';
setProxyButton.style.display = 'none';

setProxyButton.addEventListener('click', async function(ev) {
	ev.preventDefault();
	ev.stopImmediatePropagation();

	const config = {
		address: ev.target.getAttribute('data-proxy-address'),
		username: ev.target.getAttribute('data-proxy-username'),
		password: ev.target.getAttribute('data-proxy-password')
	};

	try {
		const response = await chrome.runtime.sendMessage({
			type: 'SET_PROXY',
			data: config
		});

		if (!response.success) {
			console.error('Failed to set proxy:', response.error);
		}
	} catch (error) {
		console.error('Error setting proxy:', error);
	}

	// Clean up attributes
	ev.target.removeAttribute('data-proxy-address');
	ev.target.removeAttribute('data-proxy-username');
	ev.target.removeAttribute('data-proxy-password');
});

document.body.appendChild(setProxyButton);
