# Chrome Proxy Switcher Extension

A Chrome extension that allows you to easily switch between different proxy configurations.

## Features

- Set proxy server with host and port
- Support for HTTP and HTTPS proxies
- Proxy authentication support
- Quick enable/disable proxy
- Clean and simple interface

## Installation

1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory

## Usage

1. Click the extension icon in Chrome toolbar
2. Enter your proxy details:
   - Proxy address (host:port or protocol://host:port)
   - Username (if required)
   - Password (if required)
3. Click "Save" to apply the proxy settings
4. Click "Clear" to disable the proxy

## Development

The extension is built using vanilla JavaScript and Chrome Extension APIs.

### Project Structure
├── js/
│ ├── background.js # Background service worker
│ ├── content.js # Content script
│ └── options.js # Options page logic
├── manifest.json # Extension manifest
└── options.html # Options page HTML


## License

MIT