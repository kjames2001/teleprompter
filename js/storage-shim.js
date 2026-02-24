// LocalStorage shim for server-side persistence
(function() {
    const API_BASE = '';
    
    async function syncToServer(key, value, isDelete = false) {
        try {
            if (isDelete) {
                await fetch('/data/' + key, { method: 'DELETE' });
            } else if (value === null) {
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

    const originalSetItem = localStorage.setItem.bind(localStorage);
    const originalRemoveItem = localStorage.removeItem.bind(localStorage);
    const originalClear = localStorage.clear.bind(localStorage);

    localStorage.setItem = function(key, value) {
        originalSetItem(key, value);
        syncToServer(key, value);
    };

    localStorage.getItem = function(key) {
        return originalGetItem(key);
    };

    localStorage.removeItem = function(key) {
        originalRemoveItem(key);
        syncToServer(key, null, true);
    };

    localStorage.clear = function() {
        originalClear();
    };

    // Load all keys from server on startup
    async function initStorage() {
        const keys = ['Teleprompter-session', 'Teleprompter-Settings', 'teleprompter'];
        for (const key of keys) {
            const value = await loadFromServer(key);
            if (value !== null && value !== '') {
                try {
                    const parsed = JSON.parse(value);
                    const current = localStorage.getItem(key);
                    if (!current) {
                        originalSetItem(key, value);
                    }
                } catch(e) {
                    if (value) {
                        originalSetItem(key, value);
                    }
                }
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initStorage);
    } else {
        initStorage();
    }
})();
