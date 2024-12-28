document.addEventListener('DOMContentLoaded', async () => {
    // Load saved settings
    const { proxyConfig } = await chrome.storage.sync.get('proxyConfig');
    if (proxyConfig) {
        document.getElementById('proxyAddress').value = proxyConfig.address || '';
        document.getElementById('proxyUsername').value = proxyConfig.username || '';
        document.getElementById('proxyPassword').value = proxyConfig.password || '';
    }

    // Save button handler
    document.getElementById('save').addEventListener('click', async () => {
        const config = {
            address: document.getElementById('proxyAddress').value,
            username: document.getElementById('proxyUsername').value,
            password: document.getElementById('proxyPassword').value
        };

        try {
            await chrome.runtime.sendMessage({
                type: 'SET_PROXY',
                data: config
            });
            
            document.getElementById('status').textContent = 'Saved';
            setTimeout(() => {
                document.getElementById('status').textContent = '';
            }, 1000);
        } catch (error) {
            document.getElementById('status').textContent = 'Error saving settings';
        }
    });

    // Clear button handler
    document.getElementById('clear').addEventListener('click', async () => {
        document.getElementById('proxyAddress').value = '';
        document.getElementById('proxyUsername').value = '';
        document.getElementById('proxyPassword').value = '';
        
        await chrome.storage.sync.remove('proxyConfig');
        await chrome.runtime.sendMessage({
            type: 'SET_PROXY',
            data: null
        });
    });
});
