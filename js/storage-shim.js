// LocalStorage shim for server-side persistence
(function() {
    const DATA_KEYS = [
        'IFTeleprompterSettings',
        'IFTeleprompterSession', 
        'IFTeleprompterSideBar',
        'IFTeleprompterControl',
        'IFTeleprompterThemeStyles',
        'IFTeleprompterThemeDefaultStyle'
    ];
    
    async function syncToServer(key, value, isDelete = false) {
        try {
            if (isDelete || value === null) {
                await fetch('/data/' + key, { method: 'DELETE' });
            } else {
                await fetch('/data/' + key, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: value
                });
            }
        } catch(e) {
            console.error('Failed to sync to server:', e);
        }
    }
    
    async function loadFromServer(key) {
        try {
            const response = await fetch('/data/' + key);
            if (response.ok) {
                return await response.text();
            }
        } catch(e) {
            console.error('Failed to load from server:', e);
        }
        return null;
    }

    // Store originals
    const originalSetItem = localStorage.setItem.bind(localStorage);
    const originalGetItem = localStorage.getItem.bind(localStorage);
    const originalRemoveItem = localStorage.removeItem.bind(localStorage);

    // Override setItem
    localStorage.setItem = function(key, value) {
        originalSetItem(key, value);
        syncToServer(key, value);
    };

    // Override getItem
    localStorage.getItem = function(key) {
        return originalGetItem(key);
    };

    // Override removeItem  
    localStorage.removeItem = function(key) {
        originalRemoveItem(key);
        syncToServer(key, null, true);
    };

    // Load all known keys from server on startup
    async function initStorage() {
        console.log('Initializing storage shim...');
        for (const key of DATA_KEYS) {
            const value = await loadFromServer(key);
            if (value !== null && value !== '') {
                console.log('Loading from server:', key);
                originalSetItem(key, value);
            }
        }
    }

    // Run immediately
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initStorage);
    } else {
        initStorage();
    }
})();
