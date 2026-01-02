# GA4 Property Setup and Installation

Complete guide for creating Google Analytics 4 accounts, properties, data streams, and installing tracking code.

## Overview

Setting up Google Analytics 4 requires creating an account hierarchy, configuring data streams, and installing tracking code. This reference provides step-by-step guidance for all GA4 setup methods from initial property creation through implementation verification.

## Account Hierarchy

GA4 uses a three-level hierarchy:

```
Google Account (Login credentials)
└── Analytics Account (Container for properties)
    └── GA4 Property (Analytics container for website/app)
        └── Data Stream (Platform-specific: Web, iOS, Android)
            └── Events and Parameters
```

### Level Definitions

| Level | Purpose | Limit |
|-------|---------|-------|
| Analytics Account | Organisation container | 2,000 properties |
| GA4 Property | Website/app container | 1,000 data streams |
| Data Stream | Platform-specific tracking | Unique Measurement ID |

## Creating a GA4 Property

### Step 1: Navigate to Analytics

1. Go to analytics.google.com
2. Sign in with Google account
3. Click Admin (bottom-left)
4. Click "Create" -> "Property"

### Step 2: Configure Property Details

**Property Name:**
- Use descriptive name: "Main Website", "E-commerce Site"
- Include environment if needed: "Production Website"

**Reporting Time Zone:**
- Select primary business timezone
- Affects day boundaries in reports
- Cannot be changed retroactively

**Currency:**
- Select reporting currency (USD, EUR, GBP, AUD)
- All monetary values converted to this currency

### Step 3: Business Information

**Industry Category:**
- Select relevant industry
- Influences default reports and benchmarks

**Business Objectives:**
- Get baseline reports (recommended for beginners)
- Examine user behaviour
- Measure customer actions
- Get insights on customers
- Improve marketing ROI

### Step 4: Accept Terms

- Google Analytics Terms of Service
- Data Processing Amendment (GDPR)
- Click "Create"

## Data Stream Configuration

### Web Data Stream

**Creating the Stream:**

1. Admin -> Data Streams
2. Click "Add Stream"
3. Select "Web"
4. Enter website URL (example.com, not https://www.example.com)
5. Enter stream name ("Main Website")
6. Enable Enhanced Measurement (recommended)
7. Click "Create stream"

**Enhanced Measurement Events:**

| Event | Trigger | Toggle |
|-------|---------|--------|
| page_view | Page loads | Always on |
| scroll | 90% vertical scroll | Optional |
| click | Outbound link clicks | Optional |
| view_search_results | Site search | Optional |
| video_start/progress/complete | YouTube engagement | Optional |
| file_download | PDF, DOC, ZIP clicks | Optional |
| form_start/form_submit | Form interactions | Optional |

**Measurement ID:**
- Format: G-XXXXXXXXXX
- Location: Data Streams -> Click stream -> Top section
- Copy for installation

### iOS Data Stream

**Prerequisites:**
- Apple Developer account
- iOS app in development/published
- Firebase project (auto-created)

**Setup:**

1. Admin -> Data Streams -> Add Stream -> iOS app
2. Enter Bundle ID (com.company.appname)
3. Enter App Store ID (optional)
4. Click "Register app"
5. Download GoogleService-Info.plist
6. Add to Xcode project

**Firebase SDK Installation:**

```ruby
# Podfile
pod 'Firebase/Analytics'
```

```swift
// AppDelegate.swift
import Firebase

func application(_ application: UIApplication,
                didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    FirebaseApp.configure()
    return true
}
```

### Android Data Stream

**Prerequisites:**
- Android Studio
- Android app package name

**Setup:**

1. Admin -> Data Streams -> Add Stream -> Android app
2. Enter package name (com.company.appname)
3. Click "Register app"
4. Download google-services.json
5. Place in app/ directory

**Firebase SDK Installation:**

```gradle
// Project build.gradle
buildscript {
    dependencies {
        classpath 'com.google.gms:google-services:4.3.15'
    }
}

// App build.gradle
plugins {
    id 'com.google.gms.google-services'
}

dependencies {
    implementation platform('com.google.firebase:firebase-bom:32.0.0')
    implementation 'com.google.firebase:firebase-analytics'
}
```

## Installation Methods

### Method 1: CMS Plugin (Easiest)

**WordPress - Site Kit by Google:**

1. Plugins -> Add New -> Search "Site Kit by Google"
2. Install and Activate
3. Site Kit -> Start Setup
4. Connect Google account
5. Select or create GA4 property
6. Activate Analytics module

**Shopify:**

1. Settings -> Customer events
2. Add custom pixel -> Google Analytics 4
3. Enter Measurement ID
4. Save

**Wix:**

1. Settings -> Marketing & SEO -> Marketing Integrations
2. Google Analytics -> Connect
3. Sign in and select GA4 property

### Method 2: gtag.js Direct

Place in `<head>` section before other scripts:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Method 3: Google Tag Manager (Recommended)

**Step 1: Install GTM Container**

Head snippet (after `<head>`):
```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
<!-- End Google Tag Manager -->
```

Body snippet (after `<body>`):
```html
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
```

**Step 2: Create GA4 Configuration Tag**

1. GTM -> Tags -> New
2. Tag Type: Google Tag
3. Tag ID: G-XXXXXXXXXX
4. Trigger: Initialisation - All Pages
5. Save and Publish

## Installation Verification

### Immediate Verification (0-5 minutes)

1. **Enable Debug Mode:**
   - Install Google Analytics Debugger Chrome extension
   - Enable extension (icon turns blue)
   - Visit website

2. **Check DebugView:**
   - GA4 -> Admin -> DebugView
   - Select device from dropdown
   - Confirm events appearing

3. **Expected Events:**
   - session_start
   - first_visit (new users)
   - page_view

### Realtime Verification (5-30 minutes)

1. Reports -> Realtime
2. Confirm active users showing
3. Verify events by name
4. Check user location on map

### Standard Reports (24-48 hours)

Standard reports have processing delay:
- Reports -> Acquisition -> User acquisition
- Reports -> Engagement -> Events
- Reports -> Engagement -> Pages and screens

## Post-Setup Configuration

### Data Retention

**Location:** Admin -> Data Settings -> Data Retention

| Option | Use Case |
|--------|----------|
| 2 months | Privacy-focused, GDPR |
| 14 months | Year-over-year analysis |

**Reset on New Activity:** ON (recommended) - timer resets when user returns

### Internal Traffic Filter

**Location:** Admin -> Data Settings -> Data Filters

1. Create Filter -> Internal Traffic
2. Enter office IP addresses
3. Set to "Testing" first
4. Verify in DebugView (traffic_type = internal)
5. Set to "Active"

### Google Signals

**Location:** Admin -> Data Settings -> Data Collection

- Enables demographics (age, gender)
- Enables cross-device tracking
- Requires user consent for personalised ads

## Common Issues

### No Data Appearing

- Verify Measurement ID is correct
- Check code placement in `<head>`
- Disable ad blockers for testing
- Wait 24-48 hours for standard reports

### Data Only in DebugView

- Remove debug_mode: true from production
- Disable Google Analytics Debugger extension
- Check for internal traffic filters

### Duplicate Events

- Remove duplicate tracking implementations
- Choose one method: gtag.js OR GTM OR plugin
- Check for multiple Measurement IDs

### Wrong Timezone

- Cannot change retroactively
- Affects only future data
- Consider creating new property if critical

## Next Steps

After completing setup:

1. Configure Enhanced Measurement events
2. Set up internal traffic filters
3. Create first custom events
4. Register custom dimensions
5. Link Google Ads (if applicable)
6. Set up BigQuery export (for advanced analysis)
