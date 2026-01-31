# Tampermonkey Tab API Reference

Documentation for tab management and cross-tab communication.

---

## Tab-Persistent Storage

### GM_getTab(callback)

Get an object that persists for the lifetime of the current tab.

```javascript
// @grant GM_getTab

GM_getTab(function(tab) {
    console.log('Tab object:', tab);

    // Tab object is initially empty {}
    // Add any data you want
    tab.visitCount = (tab.visitCount || 0) + 1;
    tab.lastVisit = Date.now();

    // Data persists across page navigations within this tab
    console.log('Visits in this tab:', tab.visitCount);
});
```

### GM_saveTab(tab, cb)

Save changes to the tab object.

```javascript
// @grant GM_saveTab

GM_getTab(function(tab) {
    // Modify tab data
    tab.userData = {
        preferences: { theme: 'dark' },
        history: ['page1', 'page2']
    };

    // Save changes
    GM_saveTab(tab, function() {
        console.log('Tab data saved');
    });
});
```

### GM_getTabs(callback)

Get tab objects from all tabs running the script.

```javascript
// @grant GM_getTabs

GM_getTabs(function(tabs) {
    console.log('All tabs:', tabs);

    // tabs is an object: { tabId1: tabData1, tabId2: tabData2, ... }
    for (const [tabId, tabData] of Object.entries(tabs)) {
        console.log(`Tab ${tabId}:`, tabData);
    }

    // Count active tabs
    const tabCount = Object.keys(tabs).length;
    console.log(`Script running in ${tabCount} tabs`);
});
```

---

## Window Control

### GM_openInTab(url, options)

Open a new browser tab.

```javascript
// @grant GM_openInTab

// Simple - opens in background
GM_openInTab('https://example.com/');

// Open and focus
GM_openInTab('https://example.com/', { active: true });

// Full options
const newTab = GM_openInTab('https://example.com/', {
    active: true,           // Focus the new tab
    insert: true,           // Insert next to current tab
    setParent: true,        // Current tab is parent (closing parent closes this)
    incognito: false,       // Open in private/incognito mode
    loadInBackground: false // Legacy: opposite of active
});

// Control the opened tab
newTab.onclose = function() {
    console.log('New tab was closed');
};

// Check if closed
if (newTab.closed) {
    console.log('Tab is already closed');
}

// Close programmatically
setTimeout(() => {
    newTab.close();
}, 5000);
```

### window.close

Close the current tab (requires grant).

```javascript
// @grant window.close

// Close after confirmation
if (confirm('Close this tab?')) {
    window.close();
}

// Note: Cannot close the last tab in a window (security restriction)
```

### window.focus

Bring the window to the front.

```javascript
// @grant window.focus

// Focus this window/tab
window.focus();

// Unlike unsafeWindow.focus(), this works regardless of browser settings
```

---

## URL Change Detection

### window.onurlchange

Listen for URL changes in single-page applications (SPAs).

```javascript
// @grant window.onurlchange

// Check if supported
if (window.onurlchange === null) {
    // Feature is supported
    window.addEventListener('urlchange', function(info) {
        console.log('URL changed to:', info.url);

        // Re-run modifications for new page
        if (info.url.includes('/profile')) {
            modifyProfilePage();
        } else if (info.url.includes('/settings')) {
            modifySettingsPage();
        }
    });
}
```

### Comprehensive SPA Handler

```javascript
// @grant window.onurlchange

(function() {
    'use strict';

    // Initial page load
    handlePage(location.href);

    // URL changes (SPA navigation)
    if (window.onurlchange === null) {
        window.addEventListener('urlchange', (e) => handlePage(e.url));
    }

    function handlePage(url) {
        // Wait for content to load
        setTimeout(() => {
            if (url.includes('/dashboard')) {
                enhanceDashboard();
            } else if (url.includes('/search')) {
                enhanceSearch();
            }
        }, 100);
    }
})();
```

---

## Cross-Tab Communication

### Using GM_setValue/addValueChangeListener

```javascript
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_addValueChangeListener

// Unique ID for this tab
const TAB_ID = Math.random().toString(36).substr(2, 9);

// Broadcast a message to all tabs
function broadcast(type, data) {
    GM_setValue('broadcast', {
        type: type,
        data: data,
        sender: TAB_ID,
        timestamp: Date.now()
    });
}

// Listen for broadcasts
GM_addValueChangeListener('broadcast', (key, oldVal, newVal, remote) => {
    if (remote && newVal && newVal.sender !== TAB_ID) {
        console.log('Received:', newVal.type, newVal.data);
        handleMessage(newVal.type, newVal.data);
    }
});

function handleMessage(type, data) {
    switch (type) {
        case 'REFRESH':
            location.reload();
            break;
        case 'SETTINGS_CHANGED':
            applySettings(data);
            break;
        case 'PING':
            broadcast('PONG', { respondingTo: data.from });
            break;
    }
}

// Usage
broadcast('SETTINGS_CHANGED', { theme: 'dark' });
```

### Tab Registry

```javascript
// @grant GM_getTab
// @grant GM_saveTab
// @grant GM_getTabs
// @grant GM_addValueChangeListener

// Register this tab
function registerTab() {
    GM_getTab(tab => {
        tab.id = tab.id || Math.random().toString(36).substr(2, 9);
        tab.registered = Date.now();
        tab.url = location.href;
        GM_saveTab(tab);
    });
}

// Get list of active tabs
function getActiveTabs(callback) {
    GM_getTabs(tabs => {
        const activeTabs = Object.entries(tabs)
            .filter(([id, data]) => data.registered)
            .map(([id, data]) => ({
                id: data.id,
                url: data.url,
                age: Date.now() - data.registered
            }));
        callback(activeTabs);
    });
}

// Check if another tab has the same URL
function isDuplicateTab(callback) {
    GM_getTab(currentTab => {
        GM_getTabs(allTabs => {
            const duplicates = Object.values(allTabs).filter(
                t => t.url === location.href && t.id !== currentTab.id
            );
            callback(duplicates.length > 0, duplicates);
        });
    });
}

// Usage
registerTab();
isDuplicateTab((isDuplicate, others) => {
    if (isDuplicate) {
        console.log('Another tab has this page open:', others);
    }
});
```

### Leader Election

```javascript
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_addValueChangeListener

const TAB_ID = Math.random().toString(36).substr(2, 9);
let isLeader = false;

async function electLeader() {
    const leader = GM_getValue('leader', null);
    const now = Date.now();

    // Leader is valid if set within last 5 seconds
    if (leader && now - leader.timestamp < 5000 && leader.id !== TAB_ID) {
        isLeader = false;
        return;
    }

    // Claim leadership
    GM_setValue('leader', { id: TAB_ID, timestamp: now });

    // Wait and verify
    await new Promise(r => setTimeout(r, 100));

    const currentLeader = GM_getValue('leader');
    isLeader = currentLeader && currentLeader.id === TAB_ID;

    console.log(isLeader ? 'This tab is the leader' : 'Another tab is leader');
}

// Heartbeat to maintain leadership
setInterval(() => {
    if (isLeader) {
        GM_setValue('leader', { id: TAB_ID, timestamp: Date.now() });
    }
}, 3000);

// Re-elect if leader disappears
GM_addValueChangeListener('leader', () => {
    setTimeout(electLeader, 100);
});

electLeader();

// Only leader performs certain actions
function doLeaderOnlyTask() {
    if (!isLeader) return;
    console.log('Performing leader-only task');
}
```

---

## Async Versions

```javascript
// GM.getTab()
const tab = await GM.getTab();
tab.data = 'value';

// GM.saveTab()
await GM.saveTab(tab);

// GM.getTabs()
const tabs = await GM.getTabs();
```
