# GA4 DebugView Testing and Validation

Comprehensive guide to testing and validating GA4 implementation using DebugView.

## Overview

DebugView is GA4's real-time debugging tool for validating implementation, testing events, and troubleshooting tracking issues. Events appear in DebugView within seconds, enabling rapid testing before data reaches standard reports.

## Accessing DebugView

**Path:** GA4 Admin -> DebugView

**Requirements:**
- Debug mode enabled on website/app
- Events sent within last 30 minutes
- Active user session

## Enabling Debug Mode

### Method 1: Chrome Extension (Recommended)

1. Install "Google Analytics Debugger" from Chrome Web Store
2. Navigate to your website
3. Enable extension (icon turns blue)
4. Events automatically appear in DebugView

**Benefits:** Easy toggle, no code changes, works instantly

### Method 2: URL Parameter

Add `?debug_mode=true` to any URL:

```
https://yourwebsite.com?debug_mode=true
https://yourwebsite.com/page?debug_mode=true
```

**Benefits:** No extension needed, works for sharing debug links

### Method 3: gtag.js Configuration

```javascript
gtag('config', 'G-XXXXXXXXXX', {
  'debug_mode': true
});
```

**Important:** Remove for production.

### Method 4: GTM Configuration

In GA4 Configuration tag:
1. Expand "Configuration Settings"
2. Add Fields to Set:
   - Field Name: debug_mode
   - Value: true

**Important:** Remove or use variable for production.

### Method 5: Mobile App Debug

**iOS (Xcode):**
1. Edit Scheme -> Arguments
2. Add: `-FIRDebugEnabled`

**Android (ADB):**
```bash
adb shell setprop debug.firebase.analytics.app com.example.app
```

## DebugView Interface

### Device Stream (Left Panel)

- Shows active debug sessions
- Displays device type
- Lists user_pseudo_id or user_id
- Shows session timing
- Select device to view events

### Event Stream (Centre Panel)

- Real-time event list
- Event names with timestamps
- Event count per type
- Click event for details
- Chronological order

### Event Details (Right Panel)

Click any event to see:
- Event name
- Timestamp
- All event parameters
- User properties
- Device information

## Reading Event Data

### Event Card Information

| Element | Description |
|---------|-------------|
| Event Name | e.g., page_view, purchase |
| Timestamp | When event fired |
| Event Count | Times this event fired |
| Parameters | All sent parameters |
| User Properties | User-level attributes |

### Example Event

```
Event: purchase
Timestamp: 14:23:45
Parameters:
  transaction_id: "T_12345"
  value: 99.99
  currency: "USD"
  items: [Array with 2 items]
User Properties:
  user_tier: "premium"
```

## Validation Workflows

### Workflow 1: New Implementation Test

1. Enable debug mode
2. Open DebugView
3. Load website page
4. Verify automatic events:
   - session_start
   - page_view
   - first_visit (if new user)
5. Navigate to second page
6. Verify page_view fires again
7. Check parameters on all events

### Workflow 2: Custom Event Test

1. Enable debug mode
2. Open DebugView
3. Trigger custom event (click button, submit form)
4. Verify event appears with correct name
5. Check all expected parameters present
6. Verify parameter values correct
7. Confirm data types (number vs string)

### Workflow 3: Ecommerce Test

1. Enable debug mode
2. Complete purchase flow
3. Verify each step:

| Step | Event | Check |
|------|-------|-------|
| Product page | view_item | items array populated |
| Add to cart | add_to_cart | items, value, currency |
| Checkout | begin_checkout | items, value |
| Shipping | add_shipping_info | shipping_tier |
| Payment | add_payment_info | payment_type |
| Confirmation | purchase | transaction_id unique |

4. Verify items array structure
5. Confirm value matches cart total

### Workflow 4: GTM Integration Test

1. Enable GTM Preview mode
2. Enable GA4 debug mode
3. Trigger GTM tag
4. Verify in GTM Preview:
   - Tag fires
   - Variables populated
5. Verify in DebugView:
   - Event appears
   - Parameters match GTM
6. Cross-reference both tools

## Validation Checklists

### Page View Validation

- [ ] page_view event appears
- [ ] page_location parameter present (full URL)
- [ ] page_title parameter present
- [ ] page_referrer present (if applicable)
- [ ] Fires on every page navigation

### Purchase Event Validation

- [ ] purchase event fires once
- [ ] transaction_id is unique
- [ ] value parameter matches total
- [ ] currency parameter present (USD, EUR, etc.)
- [ ] items array populated
- [ ] Each item has item_id or item_name
- [ ] Each item has price and quantity

### Custom Event Validation

- [ ] Event name appears correctly
- [ ] Event name follows snake_case
- [ ] Event name under 40 characters
- [ ] All expected parameters present
- [ ] Parameter names under 40 characters
- [ ] Parameter values under 100 characters
- [ ] Correct data types (string, number)
- [ ] No PII in parameters

### User Properties Validation

- [ ] User properties appear in event details
- [ ] Property names correct
- [ ] Property values expected format
- [ ] Properties persist across events

## Troubleshooting

### Issue: Events Not Appearing

**Causes:**
- Debug mode not enabled
- Wrong GA4 property selected
- Events sent more than 30 minutes ago
- Measurement ID incorrect
- Ad blocker blocking

**Solutions:**
1. Verify debug mode enabled (extension active)
2. Check correct property in DebugView
3. Refresh page and try again
4. Verify Measurement ID
5. Disable ad blockers for testing
6. Try incognito mode

### Issue: Missing Parameters

**Causes:**
- Parameter name misspelled
- Value is undefined/null
- Data layer not populated
- GTM variable not firing

**Solutions:**
1. Check exact parameter name (case-sensitive)
2. Validate value before sending
3. Check GTM Preview for data layer
4. Verify GTM variable configuration

### Issue: Wrong Parameter Values

**Causes:**
- Incorrect data type (string vs number)
- Variable mapping wrong in GTM
- JavaScript returning wrong value
- Encoding issues

**Solutions:**
1. Check data type expectations
2. Verify GTM variable mapping
3. Console.log values before sending
4. Check for special character issues

### Issue: Duplicate Events

**Causes:**
- Multiple tags firing for same event
- Both gtag.js AND GTM installed
- Trigger firing multiple times
- Event pushed to data layer twice

**Solutions:**
1. Check for duplicate GTM tags
2. Choose one implementation method
3. Add trigger conditions to prevent duplicates
4. Debug data layer pushes

### Issue: Events in DebugView but Not Reports

**Expected:** Standard reports have 24-48 hour delay

**If persistent:**
1. Check Realtime reports (faster)
2. Verify event count meets threshold
3. Check data retention settings
4. Confirm no filters blocking data

## Testing User Properties

### Set User Properties

```javascript
gtag('set', 'user_properties', {
  'user_tier': 'premium',
  'account_age_days': 365
});
```

### Verify in DebugView

1. Click any event in stream
2. Scroll to User Properties section
3. Verify properties appear
4. Check values correct
5. Confirm properties persist across events

## Best Practices

### Before Launch

- [ ] Test all critical events (purchase, sign_up)
- [ ] Verify on multiple browsers
- [ ] Test on mobile devices
- [ ] Check in incognito mode
- [ ] Test with new vs returning users
- [ ] Verify consent mode behaviour

### During Development

- [ ] Test each new event immediately
- [ ] Use DebugView + GTM Preview together
- [ ] Document expected vs actual
- [ ] Screenshot issues for team
- [ ] Test edge cases

### After Launch

- [ ] Monitor DebugView first 30 minutes
- [ ] Check for unexpected duplicates
- [ ] Verify volumes match expectations
- [ ] Confirm in standard reports (24-48 hours)

## Quick Reference

### Enable Debug Mode

| Method | How |
|--------|-----|
| Chrome extension | Install and enable |
| URL parameter | ?debug_mode=true |
| gtag.js | debug_mode: true |
| GTM | Add debug_mode field |

### Access DebugView

Admin -> DebugView

### Key Checks

- Event names: max 40 characters, snake_case
- Parameters: max 25 per event
- Parameter names: max 40 characters
- Parameter values: max 100 characters
- No PII in any fields
- Unique transaction_id for purchases

### Event Lifecycle

1. User action triggers event
2. Event sent to GA4
3. Appears in DebugView (seconds)
4. Appears in Realtime (30 seconds)
5. Appears in standard reports (24-48 hours)
