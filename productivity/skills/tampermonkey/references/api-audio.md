# Tampermonkey Audio API Reference

Documentation for browser tab audio control functions.

---

## Overview

The GM_audio API (v5.0+) allows userscripts to:
- Mute and unmute browser tabs
- Check if a tab is currently playing audio
- Monitor audio state changes

**Required grant:**
```javascript
// @grant GM_audio
```

---

## GM_audio.setMute(details, callback?)

Mute or unmute the current tab.

### Basic Usage

```javascript
// @grant GM_audio

// Mute the tab
GM_audio.setMute({ isMuted: true }, function(error) {
    if (error) {
        console.error('Failed to mute:', error);
    } else {
        console.log('Tab muted');
    }
});

// Unmute the tab
GM_audio.setMute({ isMuted: false }, function(error) {
    if (error) {
        console.error('Failed to unmute:', error);
    } else {
        console.log('Tab unmuted');
    }
});
```

### Async Version

```javascript
// @grant GM.audio

// Mute
await GM.audio.setMute({ isMuted: true });
console.log('Tab muted');

// Unmute
await GM.audio.setMute({ isMuted: false });
console.log('Tab unmuted');
```

---

## GM_audio.getState(callback)

Get the current audio state of the tab.

### Basic Usage

```javascript
// @grant GM_audio

GM_audio.getState(function(state) {
    if (!state) {
        console.error('Failed to get audio state');
        return;
    }

    console.log('Is muted:', state.isMuted);
    console.log('Mute reason:', state.muteReason);  // Why it was muted
    console.log('Is audible:', state.isAudible);    // Currently playing sound
});
```

### State Object Properties

| Property | Type | Description |
|----------|------|-------------|
| `isMuted` | boolean | Whether tab is currently muted |
| `muteReason` | string | Why the tab was muted (see below) |
| `isAudible` | boolean | Whether tab is currently playing audio |

### Mute Reasons

| Value | Description |
|-------|-------------|
| `user` | User manually muted (browser UI) |
| `capture` | Muted by tab capture API |
| `extension` | Muted by a browser extension |

### Async Version

```javascript
// @grant GM.audio

const state = await GM.audio.getState();
console.log(`Muted: ${state.isMuted}, Audible: ${state.isAudible}`);
```

---

## GM_audio.addStateChangeListener(listener, callback)

Listen for changes to the tab's audio state.

### Basic Usage

```javascript
// @grant GM_audio

function audioListener(event) {
    if ('muted' in event) {
        if (event.muted) {
            console.log('Tab was muted. Reason:', event.muted);
        } else {
            console.log('Tab was unmuted');
        }
    }

    if ('audible' in event) {
        console.log('Audible state changed:', event.audible);
    }
}

GM_audio.addStateChangeListener(audioListener, function(error) {
    if (error) {
        console.error('Failed to add listener:', error);
    } else {
        console.log('Audio state listener registered');
    }
});
```

### Event Object Properties

| Property | Type | Description |
|----------|------|-------------|
| `muted` | string or false | Mute reason if muted, false if unmuted |
| `audible` | boolean | Current audible state |

### Async Version

```javascript
// @grant GM.audio

await GM.audio.addStateChangeListener((event) => {
    if (event.muted) {
        console.log('Tab muted by:', event.muted);
    }
    if ('audible' in event) {
        console.log('Audio playing:', event.audible);
    }
});
```

---

## GM_audio.removeStateChangeListener(listener, callback)

Remove a previously registered state change listener.

### Basic Usage

```javascript
// @grant GM_audio

function myListener(event) {
    console.log('Audio event:', event);
}

// Register
GM_audio.addStateChangeListener(myListener, () => {
    console.log('Listener added');
});

// Later, remove
GM_audio.removeStateChangeListener(myListener, () => {
    console.log('Listener removed');
});
```

### Async Version

```javascript
// @grant GM.audio

await GM.audio.removeStateChangeListener(myListener);
console.log('Listener removed');
```

---

## Common Patterns

### Auto-Mute Tab

```javascript
// @grant GM_audio

// Mute tab on script load
GM_audio.setMute({ isMuted: true });

// Or with async
(async () => {
    await GM.audio.setMute({ isMuted: true });
})();
```

### Mute Toggle with Menu Command

```javascript
// @grant GM_audio
// @grant GM_registerMenuCommand

let isMuted = false;

async function toggleMute() {
    isMuted = !isMuted;
    await GM.audio.setMute({ isMuted });
    console.log(isMuted ? 'Muted' : 'Unmuted');
}

GM_registerMenuCommand('Toggle Mute', toggleMute, 'm');
```

### Audio Activity Monitor

```javascript
// @grant GM_audio

GM_audio.addStateChangeListener((event) => {
    if ('audible' in event) {
        if (event.audible) {
            console.log('Audio started playing');
            // Maybe show an indicator
            showAudioIndicator(true);
        } else {
            console.log('Audio stopped');
            showAudioIndicator(false);
        }
    }
});

function showAudioIndicator(playing) {
    let indicator = document.getElementById('audio-indicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'audio-indicator';
        indicator.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            padding: 5px 10px;
            background: #333;
            color: white;
            border-radius: 4px;
            z-index: 999999;
        `;
        document.body.appendChild(indicator);
    }
    indicator.textContent = playing ? '🔊 Playing' : '🔇 Silent';
    indicator.style.display = playing ? 'block' : 'none';
}
```

### Auto-Unmute on Specific Pages

```javascript
// @grant GM_audio

// Unmute when visiting video pages
if (location.pathname.includes('/video/') || location.pathname.includes('/watch')) {
    GM_audio.setMute({ isMuted: false }, (error) => {
        if (!error) {
            console.log('Auto-unmuted for video page');
        }
    });
}
```

### Remember Mute Preference

```javascript
// @grant GM_audio
// @grant GM_getValue
// @grant GM_setValue

(async () => {
    // Restore user's mute preference
    const wasMuted = GM_getValue('userMutePreference', false);
    await GM.audio.setMute({ isMuted: wasMuted });

    // Listen for changes
    await GM.audio.addStateChangeListener((event) => {
        if ('muted' in event) {
            // Save preference when user changes it
            GM_setValue('userMutePreference', !!event.muted);
        }
    });
})();
```

---

## Error Handling

```javascript
// @grant GM_audio

GM_audio.setMute({ isMuted: true }, (error) => {
    if (error) {
        switch (error) {
            case 'not_supported':
                console.log('Audio control not supported in this browser');
                break;
            case 'permission_denied':
                console.log('Permission to control audio denied');
                break;
            default:
                console.log('Unknown error:', error);
        }
    }
});
```
