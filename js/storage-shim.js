// LocalStorage shim for server-side persistence
// Must be loaded BEFORE any other scripts that use localStorage
(function() {
    const DATA_KEYS = [
        'IFTeleprompterSettings',
        'IFTeleprompterSession', 
        'IFTeleprompterSideBar',
        'IFTeleprompterControl',
        'IFTeleprompterThemeStyles',
        'IFTeleprompterThemeDefaultStyle',
        'IFTeleprompterVersion'
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
            console.log('Synced to server:', key);
        } catch(e) {
            console.error('Failed to sync to server:', e);
        }
    }
    
    async function loadFromServer(key) {
        try {
            const response = await fetch('/data/' + key);
            if (response.ok) {
                const text = await response.text();
                if (text) {
                    console.log('Loaded from server:', key);
                    return text;
                }
            }
        } catch(e) {
            console.error('Failed to load from server:', e);
        }
        return null;
    }

    // Store original prototype methods
    const originalProtoSetItem = Storage.prototype.setItem;
    const originalProtoGetItem = Storage.prototype.getItem;
    const originalProtoRemoveItem = Storage.prototype.removeItem;

    // Override prototype methods to catch ALL localStorage usage
    Storage.prototype.setItem = function(key, value) {
        originalProtoSetItem.call(this, key, value);
        syncToServer(key, value);
    };

    Storage.prototype.getItem = function(key) {
        return originalProtoGetItem.call(this, key);
    };

    Storage.prototype.removeItem = function(key) {
        originalProtoRemoveItem.call(this, key);
        syncToServer(key, null, true);
    };

    // Load all known keys from server on startup
    async function initStorage() {
        console.log('Initializing storage shim...');
        for (const key of DATA_KEYS) {
            const value = await loadFromServer(key);
            if (value !== null && value !== '') {
                console.log('Loading from server:', key);
                originalProtoSetItem.call(localStorage, key, value);
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
