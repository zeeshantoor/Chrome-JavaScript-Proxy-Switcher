class ProxyManager {
	constructor() {
		this.initializeListeners();
	}

	initializeListeners() {
		// Listen for messages from content script or popup
		chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
			if (message.type === 'SET_PROXY') {
				this.configureProxy(message.data)
					.then(() => sendResponse({success: true}))
					.catch(error => sendResponse({success: false, error: error.message}));
				return true; // Required for async response
			}
		});

		// Listen for storage changes
		chrome.storage.onChanged.addListener((changes, namespace) => {
			if (namespace === 'sync' && (changes.proxyConfig)) {
				this.handleStorageChange(changes.proxyConfig.newValue);
			}
		});

		// Handle auth requests
		chrome.webRequest.onAuthRequired.addListener(
			this.handleAuthRequest.bind(this),
			{urls: ["<all_urls>"]}
		);
	}

	async configureProxy(config) {
		try {
			const proxySettings = this.createProxySettings(config);
			
			// Store configuration
			await chrome.storage.sync.set({
				proxyConfig: config
			});

			// Apply proxy settings
			await chrome.proxy.settings.set({
				value: proxySettings,
				scope: 'regular'
			});

			console.log('Proxy configured successfully');
			return true;
		} catch (error) {
			console.error('Failed to configure proxy:', error);
			throw error;
		}
	}

	createProxySettings(config) {
		if (!config || !config.address) {
			return { mode: 'direct' };
		}

		const { address } = config;
		let scheme = 'http', host, port;

		try {
			if (address.includes('://')) {
				const url = new URL(address);
				scheme = url.protocol.replace(':', '');
				host = url.hostname;
				port = url.port ? parseInt(url.port) : (scheme === 'https' ? 443 : 80);
			} else {
				const parts = address.split(':');
				host = parts[0];
				port = parts.length > 1 ? parseInt(parts[1]) : 80;
			}

			return {
				mode: 'fixed_servers',
				rules: {
					singleProxy: {
						scheme: scheme,
						host: host,
						port: port
					},
					bypassList: ['localhost', '127.0.0.1']
				}
			};
		} catch (error) {
			console.error('Error parsing proxy address:', error);
			throw new Error('Invalid proxy address format');
		}
	}

	async handleAuthRequest(details) {
		try {
			const { proxyConfig } = await chrome.storage.sync.get('proxyConfig');
			if (proxyConfig && proxyConfig.username && proxyConfig.password) {
				return {
					authCredentials: {
						username: proxyConfig.username,
						password: proxyConfig.password
					}
				};
			}
		} catch (error) {
			console.error('Auth handling error:', error);
		}
		return {}; // Return empty object if no credentials
	}

	async handleStorageChange(newConfig) {
		if (newConfig) {
			await this.configureProxy(newConfig);
		} else {
			await this.clearProxy();
		}
	}

	async clearProxy() {
		try {
			await chrome.proxy.settings.clear({ scope: 'regular' });
			console.log('Proxy settings cleared');
		} catch (error) {
			console.error('Failed to clear proxy:', error);
		}
	}
}

// Initialize proxy manager
const proxyManager = new ProxyManager();
