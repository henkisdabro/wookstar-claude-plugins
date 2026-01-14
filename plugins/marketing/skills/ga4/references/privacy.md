# GA4 Privacy and Compliance

Expert guidance for GA4 privacy including GDPR, CCPA, Consent Mode v2, and data deletion.

## Overview

GA4 provides privacy-focused features for GDPR, CCPA, and global privacy regulations including Consent Mode, data controls, and compliance workflows.

## Consent Mode v2

### What is Consent Mode

Google's API for communicating user consent status to GA4, Google Ads, and other Google tags.

### Consent Parameters

| Parameter | Purpose | Values |
|-----------|---------|--------|
| ad_storage | Advertising cookies | granted / denied |
| analytics_storage | Analytics cookies | granted / denied |
| ad_user_data | User data for advertising (NEW) | granted / denied |
| ad_personalization | Personalized ads (NEW) | granted / denied |
| personalization_storage | Website personalisation | granted / denied |
| functionality_storage | Essential functionality | granted / denied |
| security_storage | Security features | granted / denied |

### Consent Mode v2 Requirements

As of March 2024, v2 parameters required for EU/EEA:
- ad_user_data
- ad_personalization

Without these, remarketing lists won't populate for EU users.

## Implementing Consent Mode

### Basic gtag.js Implementation

**Step 1: Set Default Consent (BEFORE gtag.js loads)**

```html
<script>
  // Set default consent to denied
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}

  gtag('consent', 'default', {
    'ad_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied',
    'analytics_storage': 'denied'
  });
</script>

<!-- Then load gtag.js -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**Step 2: Update Consent After User Choice**

```javascript
// User accepts all cookies
gtag('consent', 'update', {
  'ad_storage': 'granted',
  'ad_user_data': 'granted',
  'ad_personalization': 'granted',
  'analytics_storage': 'granted'
});

// User accepts only analytics
gtag('consent', 'update', {
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'analytics_storage': 'granted'
});

// User denies all
gtag('consent', 'update', {
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'analytics_storage': 'denied'
});
```

### GTM Implementation

**Method 1: Using CMP Template**

Most CMPs (OneTrust, Cookiebot, etc.) provide GTM templates:

1. Install CMP template from Community Gallery
2. Configure default consent in template
3. Template auto-updates consent on user choice

**Method 2: Manual GTM Setup**

**Create Consent Initialisation Tag:**

1. Tag Type: Custom HTML
2. Code:
```html
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('consent', 'default', {
    'ad_storage': 'denied',
    'analytics_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied'
  });
</script>
```
3. Trigger: Consent Initialisation - All Pages
4. Tag firing priority: 999 (fires first)

**Create Consent Update Tag:**

1. Tag Type: Custom HTML
2. Trigger: Custom event from CMP

## Regional Settings

### EU-Specific Consent

```javascript
// Denied for EU countries, granted elsewhere
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'analytics_storage': 'denied'
}, {
  'region': ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI',
             'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU',
             'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'GB']
});

// Granted for non-EU
gtag('consent', 'default', {
  'ad_storage': 'granted',
  'analytics_storage': 'granted'
});
```

### California (CCPA)

```javascript
gtag('consent', 'default', {
  'ad_storage': 'granted',
  'analytics_storage': 'granted'
}, {
  'region': ['US-CA']
});
```

## Consent Mode Behaviour

### When analytics_storage = "denied"

| Feature | Behaviour |
|---------|-----------|
| Cookies | Not stored |
| client_id | Not persisted |
| Tracking | Cookieless pings |
| Modelling | Used to fill gaps |
| User journey | Limited |

### When analytics_storage = "granted"

| Feature | Behaviour |
|---------|-----------|
| Cookies | Stored (_ga, _ga_*) |
| client_id | Persists across sessions |
| Tracking | Full functionality |
| Modelling | Not needed |
| User journey | Complete |

### Conversion Modelling

When consent denied, GA4 uses:
- Machine learning to estimate conversions
- Aggregated, anonymised data
- Behavioural patterns
- "Modelled" label in reports

## Data Retention

### Configuration

**Path:** Admin -> Data Settings -> Data Retention

| Option | Use Case |
|--------|----------|
| 2 months | Privacy-focused, GDPR minimum |
| 14 months | Year-over-year analysis |

### What's Affected

**Affected (user/event data in Explorations):**
- User-level data
- Event-level data
- User Explorer report

**Not Affected (aggregated data):**
- Standard reports
- Conversion data
- Audience data

### Reset on New Activity

- **ON:** Timer resets when user returns
- **OFF:** Data deleted at fixed date

## Data Deletion Requests

### GDPR Article 17 (Right to Erasure)

**Path:** Admin -> Data Settings -> Data Deletion Requests

### Process

1. Click "Create deletion request"
2. Select parameter:
   - User ID
   - Client ID (user_pseudo_id)
   - App Instance ID
3. Enter identifier value
4. Choose date range or "All time"
5. Submit request

### Processing

- Takes up to 72 hours
- Deletes ALL events for identifier
- Cannot be undone
- Confirmation email sent

### Best Practice

- Maintain deletion request log
- Respond within 30 days (GDPR)
- Document process in privacy policy

## IP Anonymisation

### GA4 Default Behaviour

- GA4 does NOT log or store IP addresses
- IP used only for geolocation derivation
- No additional anonymisation needed
- Privacy-first by design

### Unlike Universal Analytics

- No `anonymize_ip` parameter needed
- IP never in reports or exports
- Location derived, IP discarded

## Google Signals

### What It Enables

- Demographics (age, gender)
- Interests reporting
- Cross-device tracking (without User ID)
- Remarketing audiences

### Privacy Implications

- Requires consent for personalised ads
- Subject to data thresholds
- User opt-out via Ads Settings

### Configuration

**Path:** Admin -> Data Settings -> Data Collection

- Enable only with proper consent
- Respect user opt-outs
- Document in privacy policy

## GDPR Compliance Checklist

### Legal Requirements

- [ ] Privacy policy updated with GA4 usage
- [ ] Cookie consent banner implemented
- [ ] Legal basis documented (consent/legitimate interest)
- [ ] DPA with Google signed
- [ ] Cross-border data transfer disclosures

### Technical Implementation

- [ ] Consent Mode v2 configured
- [ ] All 4 v2 parameters set (ad_storage, analytics_storage, ad_user_data, ad_personalization)
- [ ] Default consent = denied for EU
- [ ] Consent updates on user acceptance
- [ ] Data retention configured

### Operational Processes

- [ ] Data deletion process documented
- [ ] User opt-out mechanism available
- [ ] Regular privacy audit schedule
- [ ] Staff training on procedures

## CCPA Compliance

### Requirements

- Allow opt-out of "sale" of personal information
- "Do Not Sell My Personal Information" link
- Honor Global Privacy Control (GPC)

### GPC Implementation

```javascript
// Detect GPC signal
if (navigator.globalPrivacyControl) {
  gtag('consent', 'update', {
    'ad_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied',
    'analytics_storage': 'granted'  // Analytics OK, ads denied
  });
}
```

### GTM Variable for GPC

1. Variable Type: JavaScript Variable
2. Global Variable Name: `navigator.globalPrivacyControl`
3. Use in consent logic

## Consent Management Platforms

### Popular CMPs

- OneTrust
- Cookiebot
- Termly
- Osano
- TrustArc

### GTM CMP Templates

1. Community Template Gallery -> Search CMP
2. Install template
3. Configure settings
4. Auto-updates consent to GA4

## Testing Consent Mode

### Verification Steps

**1. DebugView Test:**
- Before consent: Check analytics_storage = denied
- After consent: Check analytics_storage = granted

**2. Check Event Parameters:**
- Look for `gcs` parameter (Google Consent State)
- Events include consent status

**3. Cookie Inspection:**
- Before consent: No `_ga` cookie
- After consent: `_ga` cookie set

**4. GTM Preview:**
- Consent Initialisation fires first
- GA4 tag respects consent
- Consent update fires on user action

### Chrome DevTools Check

```javascript
// Check current consent state
dataLayer.filter(item => item[0] === 'consent')
```

## Server-Side Consent

### Measurement Protocol

```json
{
  "client_id": "client_123",
  "consent": {
    "ad_storage": "denied",
    "analytics_storage": "granted",
    "ad_user_data": "denied",
    "ad_personalization": "denied"
  },
  "events": [...]
}
```

### Best Practice

- Pass consent from frontend to backend
- Include in all Measurement Protocol requests
- Store user preferences in database

## Quick Reference

### Consent Parameters (v2)

```javascript
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'analytics_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied'
});
```

### Update After Consent

```javascript
gtag('consent', 'update', {
  'ad_storage': 'granted',
  'analytics_storage': 'granted',
  'ad_user_data': 'granted',
  'ad_personalization': 'granted'
});
```

### Data Deletion

Admin -> Data Settings -> Data Deletion Requests -> Create

### Key Compliance Points

- v2 parameters required for EU (March 2024)
- Default to denied, update on consent
- Data retention: 2 or 14 months
- No IP storage in GA4
- Respond to deletion within 30 days
