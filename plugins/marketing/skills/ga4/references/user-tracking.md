# GA4 User ID and Cross-Device Tracking

Complete guide to User ID implementation, user properties, and cross-device tracking in GA4.

## Overview

User ID enables cross-device tracking for authenticated users. User properties allow tracking custom user attributes across all events. Together, they provide a unified view of user behaviour across devices and sessions.

## User ID Implementation

### What is User ID

- Persistent identifier for authenticated users
- Enables cross-device tracking
- Requires explicit user authentication
- Must not contain PII (hash if needed)
- Set when user logs in, cleared on logout

### Implementation Methods

#### Method 1: gtag.js

**On Login:**
```javascript
// Set User ID when user logs in
gtag('config', 'G-XXXXXXXXXX', {
  'user_id': 'USER_12345'
});

// Or use gtag('set')
gtag('set', 'user_id', 'USER_12345');
```

**On Logout:**
```javascript
// Clear User ID - MUST use null, never empty string
gtag('set', 'user_id', null);
```

#### Method 2: GTM Data Layer

**Push to Data Layer:**
```javascript
// On login
dataLayer.push({
  'user_id': 'USER_12345'
});

// On logout
dataLayer.push({
  'user_id': null
});
```

**GTM Configuration:**
1. Create Data Layer Variable: `user_id`
2. In GA4 Configuration tag, add parameter:
   - Parameter: `user_id`
   - Value: `{{DL - User ID}}`

#### Method 3: Measurement Protocol

```json
{
  "client_id": "client_123",
  "user_id": "USER_12345",
  "events": [
    {
      "name": "login",
      "params": {
        "method": "email"
      }
    }
  ]
}
```

### User ID Best Practices

| Do | Don't |
|----|-------|
| Use internal user IDs | Use email addresses |
| Hash sensitive IDs | Use phone numbers |
| Set on login | Use PII directly |
| Clear on logout | Use empty string to clear |
| Document ID format | Expose ID format publicly |

### User ID Format Examples

**Good:**
- `USER_12345` (internal ID)
- `abc123def456` (hashed value)
- `u_a1b2c3d4` (prefixed ID)

**Bad:**
- `john@example.com` (email - PII)
- `+1-555-123-4567` (phone - PII)
- `John Smith` (name - PII)

## Reporting Identity

Configure how GA4 identifies users across sessions.

### Path

Admin -> Data Settings -> Reporting Identity

### Options

| Option | Description | Best For |
|--------|-------------|----------|
| Blended | User ID + Device ID + Google Signals | Most comprehensive |
| Observed | User ID + Device ID only | More privacy-focused |
| Device-based | Device ID only | Most restrictive |

### Blended (Recommended)

- Uses User ID when available
- Falls back to Device ID + Google Signals
- Most complete user view
- Enables cross-device insights

### Observed

- Uses User ID and Device ID only
- No Google Signals data
- More privacy-focused
- Fewer users identified

### Device-based

- Uses only client_id (device)
- No cross-device tracking
- Maximum privacy
- Limited user insights

## User Properties

### What are User Properties

- Custom attributes set at user level
- Persist across all events from that user
- Different from event parameters
- Must be registered as custom dimensions to report

### Limits

| Limit | Value |
|-------|-------|
| User properties per property | 25 |
| Property name length | 24 characters |
| Property value length | 36 characters |

### Setting User Properties

**gtag.js:**
```javascript
gtag('set', 'user_properties', {
  'user_tier': 'premium',
  'account_age_days': 365,
  'preferred_category': 'electronics'
});
```

**GTM Data Layer:**
```javascript
dataLayer.push({
  'user_properties': {
    'user_tier': 'premium',
    'account_age_days': 365
  }
});
```

**Measurement Protocol:**
```json
{
  "client_id": "client_123",
  "user_properties": {
    "user_tier": {
      "value": "premium"
    },
    "account_age_days": {
      "value": 365
    }
  },
  "events": [...]
}
```

### Common User Properties

| Property | Values | Use Case |
|----------|--------|----------|
| user_tier | free, premium, enterprise | Segment by subscription |
| signup_date | YYYY-MM-DD | Cohort analysis |
| subscription_status | active, trial, cancelled | Revenue analysis |
| customer_ltv | Numeric bucket | Value segmentation |
| industry | Technology, Finance, etc. | B2B analysis |
| company_size | 1-10, 11-50, 51-200, etc. | Enterprise targeting |
| interests | Category string | Personalisation |

### PII Considerations

**Avoid:**
- email
- name
- phone_number
- address
- credit_card

**Use Instead:**
- email_domain
- first_name_initial
- user_segment
- location_region

## Cross-Device Tracking

### How It Works

1. User visits on mobile (logged in) -> user_id set
2. User visits on desktop (logged in) -> same user_id
3. GA4 stitches sessions together
4. Reports show unified user journey

### Requirements

- User ID implemented and set on login
- Google Signals enabled (for Blended identity)
- Users signed into Google accounts
- User opt-in to personalisation

### Enabling Google Signals

1. Admin -> Data Settings -> Data Collection
2. Enable Google Signals
3. Accept terms
4. Wait 24 hours for data

### Cross-Domain Tracking

For User ID across domains:

**gtag.js Configuration:**
```javascript
gtag('config', 'G-XXXXXXXXXX', {
  'linker': {
    'domains': ['example.com', 'shop.example.com', 'blog.example.com']
  }
});
```

**What This Does:**
- Passes client_id between domains via URL parameter
- Preserves user_id if set
- Maintains session continuity
- Uses `_gl` URL parameter

**GTM Setup:**
1. In GA4 Configuration tag
2. Expand Configuration Settings
3. Add Fields to Set:
   - Field Name: linker
   - Value: `{"domains": ["example.com", "shop.example.com"]}`

### Testing Cross-Domain

1. Visit domain1.com
2. Click link to domain2.com
3. Verify `_gl` parameter in URL
4. Check DebugView shows same user
5. Confirm session continues

## User-Scoped Custom Dimensions

Register user properties for reporting:

### Registration

1. Admin -> Data Display -> Custom Definitions
2. Click "Create custom dimension"
3. Configure:
   - Dimension name: "User Tier"
   - Scope: User
   - User property: `user_tier`
4. Save

### Using in Reports

- Add as dimension in Explorations
- Filter/segment by dimension
- Analyse user cohorts
- Compare user segments

## User Data Deletion

### GDPR/CCPA Compliance

**Path:** Admin -> Data Settings -> Data Deletion Requests

### Process

1. Click "Create deletion request"
2. Select parameter: User ID
3. Enter User ID value to delete
4. Choose scope: All data or date range
5. Submit request

### Processing

- Takes up to 72 hours
- Deletes ALL events for that User ID
- Cannot be undone
- Confirmation email sent

### Use Cases

- GDPR right to erasure requests
- CCPA deletion requests
- User account deletion
- Data cleanup

## Testing User ID

### Verification Workflow

1. **Implement User ID**
2. **Enable DebugView**
3. **Test Login:**
   - Before login: Events have only client_id
   - After login: Verify user_id in event details
4. **Test Logout:**
   - After logout: Verify user_id cleared/null
5. **Test Cross-Device:**
   - Login on Device 1
   - Login on Device 2 with same account
   - Verify same user_id

### DebugView Verification

1. Open Admin -> DebugView
2. Click any event
3. Expand event details
4. Check "User ID" field populated

### Reports Verification

- Wait 24-48 hours
- Check user count vs sessions
- Lower user count = User ID working (same user, multiple sessions)

## Common Issues

### User ID Not Appearing

**Causes:**
- Set after gtag config
- Cleared immediately
- Wrong parameter name

**Solutions:**
1. Set user_id in config call
2. Verify login flow
3. Check parameter is 'user_id' exactly

### Cross-Device Not Working

**Causes:**
- Different User IDs
- User ID not set on all devices
- Reporting Identity not configured

**Solutions:**
1. Verify same User ID across devices
2. Ensure login sets User ID
3. Check Reporting Identity = Blended

### User Properties Not in Reports

**Cause:** Not registered as custom dimensions

**Solution:**
1. Register as user-scoped custom dimension
2. Wait 24-48 hours
3. Use in Explorations

## Quick Reference

### Set User ID

```javascript
gtag('config', 'G-XXXXXXXXXX', {
  'user_id': 'USER_123'
});
```

### Set User Properties

```javascript
gtag('set', 'user_properties', {
  'user_tier': 'premium'
});
```

### Clear User ID

```javascript
gtag('set', 'user_id', null);
```

### Limits

- 25 user properties per property
- User property name: 24 characters max
- User property value: 36 characters max
- User ID: Must not contain PII
