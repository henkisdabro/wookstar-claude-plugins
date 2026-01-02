# GTM Debugging and Testing

**Sources**:

- <https://support.google.com/tagmanager/answer/6107056>
- <https://developers.google.com/tag-platform/tag-manager/server-side/debug>

**Last Updated**: 2025-01-09

## Overview

Testing and debugging are critical components of any Google Tag Manager implementation. GTM provides comprehensive tools to help you verify that tags fire correctly, triggers activate as expected, and data flows accurately to your analytics platforms. This guide covers all debugging tools and workflows.

## Preview Mode

### Enabling Preview Mode

1. Navigate to [tagmanager.google.com](https://tagmanager.google.com)
2. Open your container workspace
3. Click "Preview" in the top right corner
4. Tag Assistant launches in a new tab
5. Enter your website URL
6. Optional: Uncheck "Include debug signal in the URL" if it causes issues
7. Click "Connect"
8. Your website opens in a new window with "Connected" indicator
9. Return to Tag Assistant and click "Continue"

### Tag Assistant Companion Extension

Installing the [Tag Assistant Companion Chrome extension](https://chrome.google.com/webstore/detail/tag-assistant-companion/jmekfmbnaedfebfnmakmokmlfpblbfdm) improves the preview experience by opening your website in a new tab instead of a popup window.

### Previewing Older Versions

To test a previously published version:

1. Go to "Versions" in workspace navigation
2. Find the version to preview
3. Click "More Actions" (three dots)
4. Select "Preview"

## Debug Interface

### Interface Sections

**Summary Panel**: Timeline of events as you interact with your website

```
Container Loaded
   Page View
   DOM Ready
   Window Loaded
   Click (Button)
   Custom Event (form_submit)
```

Click any event to see details.

**Tags Panel**: Lists tags that fired and didn't fire

- Green indicators: Successfully fired tags
- Red indicators: Failed tags
- Number shows fire count

**Data Layer Panel**: Shows data layer state and events

```javascript
{
  "gtm.start": 1704844800000,
  "event": "gtm.js",
  "gtm.uniqueEventId": 1
}
```

**Variables Panel**: Lists all variables and their values

| Variable Name | Value | Type |
|--------------|-------|------|
| Page URL | https://example.com/products | Built-in |
| Page Path | /products | Built-in |
| Product Name | Blue Widget | Data Layer Variable |

**Errors Panel**: Shows JavaScript errors and tag failures

```
Tag: GA4 Event - Purchase
Error: sendBeacon failed - network error

Tag: Facebook Pixel
Error: fbq is not defined
```

## Debugging Workflows

### Tag Not Firing

**Checklist**:

1. **Check the trigger**
   - Is the trigger configured correctly?
   - Are the trigger conditions being met?
   - Check trigger variables resolve correctly

2. **Check for blocking triggers**
   - Does the tag have any exception triggers?
   - Are those triggers inadvertently activating?

3. **Check tag priority/sequencing**
   - Does another tag need to fire first?
   - Is tag sequencing configured correctly?

4. **Check the data layer**
   - Is required data present when trigger evaluates?
   - Are data layer variables returning expected values?

### Trigger Not Activating

**Debugging Steps**:

1. **Verify trigger conditions**
   - Check trigger type matches action
   - Verify condition values match actual data
   - Test with simpler conditions

2. **Check built-in variables**
   - Are required built-in variables enabled?
   - Go to Variables > Configure
   - Enable missing variables

3. **Test variable values**
   - Check Variables panel
   - Verify trigger conditions match actual values
   - Look for type mismatches (string vs number)

### Variable Returning Undefined

**Common Causes**:

1. **Data layer variable not found**

   ```javascript
   // Data layer:
   { "product_name": "Widget" }

   // Variable configured as:
   productName  // Wrong - case sensitive!

   // Should be:
   product_name  // Correct
   ```

2. **Timing issue**
   - Data pushed after tag fires
   - Use Custom Event trigger to wait for data

3. **Incorrect data layer version**
   - Check Data Layer Version setting
   - Version 2 vs Version 1 syntax differs

### Data Layer Issues

**Debug Pattern**:

```javascript
// In browser console, inspect data layer
console.log(window.dataLayer);

// Check for specific event
window.dataLayer.filter(function(item) {
  return item.event === 'purchase';
});

// Watch for new pushes
var originalPush = window.dataLayer.push;
window.dataLayer.push = function() {
  console.log('DataLayer push:', arguments[0]);
  return originalPush.apply(this, arguments);
};
```

## Sharing Preview Mode

### Share with Colleagues

1. In Tag Assistant, click "More Actions" (three dots)
2. Select "Share"
3. Enter your website domain
4. Copy the preview URL
5. Send to colleagues

Recipients can:

- Connect to your site in preview mode
- View the Tag Assistant debug interface
- See the same container draft you're testing

**Note**: The preview URL is temporary and expires after the debug session ends.

## Browser Developer Tools

### Network Tab

Monitor tag requests:

1. Open DevTools (F12)
2. Go to Network tab
3. Filter: "analytics", "gtm", "google-analytics"
4. Trigger events on your site
5. Inspect requests:
   - Check parameters sent
   - Verify timing
   - Look for errors (red status codes)

### Console Tab

Monitor JavaScript execution:

```javascript
// Check GTM loaded
console.log(google_tag_manager);

// Check dataLayer
console.log(dataLayer);

// Monitor events
dataLayer.push = new Proxy(dataLayer.push, {
  apply: function(target, thisArg, args) {
    console.log('DataLayer event:', args[0]);
    return target.apply(thisArg, args);
  }
});
```

### Application Tab

Inspect cookies:

1. Open Application tab
2. Go to Cookies
3. Select your domain
4. Check for:
   - `_ga` (GA client ID)
   - `_gid` (GA session ID)
   - Custom cookies

## GA4 DebugView

### Enable Debug Mode

**Method 1: Via GTM data layer**

```javascript
window.dataLayer.push({
  'debug_mode': true
});
```

**Method 2: Chrome extension**

Install Google Analytics Debugger extension.

### Using DebugView

1. Go to GA4 property
2. Navigate to Configure > DebugView
3. See real-time events from your debug session

**Verify in DebugView**:

- Events appear immediately
- Parameters are correct
- Event sequence matches expectations

## Testing Checklist

### Pre-Publishing Checklist

Before publishing any container version:

- [ ] Enable preview mode
- [ ] Test on all key pages:
  - [ ] Homepage
  - [ ] Product pages
  - [ ] Category pages
  - [ ] Cart/checkout
  - [ ] Confirmation page
- [ ] Verify all critical tags fire
- [ ] Check data layer on each page
- [ ] Test all conversion events
- [ ] Verify cross-domain tracking
- [ ] Test with ad blockers disabled and enabled
- [ ] Check mobile experience (responsive design mode)
- [ ] Verify no JavaScript errors
- [ ] Confirm data in vendor platforms (GA4, Ads, etc.)

### E-commerce Testing Flow

```javascript
// 1. View item list - verify items array
// 2. Select item - verify item details
// 3. View item - verify product data
// 4. Add to cart - verify cart event
// 5. View cart - verify cart contents
// 6. Begin checkout - verify checkout start
// 7. Add shipping info - verify shipping selection
// 8. Add payment info - verify payment method
// 9. Purchase - verify transaction data
```

### Cross-Domain Testing

When testing cross-domain tracking:

1. Enable preview on primary domain
2. Navigate to secondary domain
3. Verify preview mode persists
4. Check data layer for linker parameters
5. Confirm client IDs match across domains

## Common Issues and Solutions

### Container Not Loading

**Symptoms**: No GTM events in Preview mode

**Solutions**:

- Verify snippet is on page
- Check container ID is correct
- Look for JavaScript errors before GTM
- Check Content Security Policy

### Tags Fire Multiple Times

**Symptoms**: Duplicate events in analytics

**Solutions**:

- Check for duplicate triggers
- Review History Change triggers on SPAs
- Verify tag firing options
- Check for multiple container installations

### Performance Issues

**Symptoms**: Slow page load, high tag count

**Solutions**:

- Review number of tags firing
- Check custom HTML execution time
- Audit unnecessary triggers
- Consider tag deferral for non-essential tags

### Data Layer Values Incorrect

**Symptoms**: Wrong values in analytics

**Solutions**:

- Check data layer push timing
- Verify variable configuration
- Check for data type issues
- Review data layer path

## Troubleshooting Tips

### Clear Browser Cache

Sometimes old container versions cache:

1. Hard refresh: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)
2. Clear cache completely
3. Close and reopen preview mode

### Check Container Version

Verify correct container loads:

```javascript
// In console:
google_tag_manager['GTM-XXXXX'].dataLayer.get('gtm.version')
```

### Verify Container ID

Ensure correct container on page:

```html
<!-- Check page source for -->
<script>
(function(w,d,s,l,i){...})(window,document,'script','dataLayer','GTM-XXXXX');
</script>
```

### Multiple Containers

If multiple containers exist:

- Each fires independently
- Check all containers in preview
- Avoid duplicate tags across containers

## Version Comparison

Compare container versions:

1. Go to "Versions"
2. Select two versions
3. Click "Compare"
4. Review differences:
   - Tags added/removed/modified
   - Trigger changes
   - Variable updates

## Exit Preview Mode

To stop debugging:

1. Click X in Tag Assistant debug interface
2. Click "Stop debugging" on Tag Assistant page
3. Close preview window

Preview mode only affects your browser - regular visitors don't see the debug interface.

## Documentation Template

When testing, document results:

```
Version: 123
Changes:
- Added GA4 purchase event
- Modified product click trigger
- Updated checkout flow

Tests Performed:
- [PASS] Purchase event fires on confirmation page
- [PASS] Product clicks tracked correctly
- [PASS] Checkout funnel complete
- [FAIL] Cross-domain tracking issue on subdomain (to fix)

Tested By: [Name]
Date: 2025-01-09
```

## Resources

- [GTM Preview and Debug Containers](https://support.google.com/tagmanager/answer/6107056)
- [Preview and Debug Server Containers](https://developers.google.com/tag-platform/tag-manager/server-side/debug)
- [Tag Assistant](https://support.google.com/tagassistant/answer/10039345)
- [GA4 DebugView](https://support.google.com/analytics/answer/7201382)
- [GTM Troubleshooting](https://support.google.com/tagmanager/topic/9002003)
