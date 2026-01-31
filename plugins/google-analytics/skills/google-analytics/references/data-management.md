# GA4 Data Management and Admin Settings

Expert guidance for GA4 Admin settings including data retention, filters, user access, and property configuration.

## Overview

GA4 Admin settings control data retention, data filters, user permissions, property configuration, and data collection parameters. Proper configuration ensures data quality and team collaboration.

## Accessing Admin Settings

**Path:** GA4 Property -> Admin (bottom-left gear icon)

**Structure:**
- Account Column: Account-level settings
- Property Column: Property-level settings

## Data Settings

### Data Retention

**Path:** Admin -> Data Settings -> Data Retention

| Option | Use Case |
|--------|----------|
| 2 months | Privacy-focused, GDPR |
| 14 months | Year-over-year analysis |

**What's Affected:**
- User-level data in Explorations
- Event-level data in Explorations
- User Explorer report

**Not Affected:**
- Standard reports (aggregated, kept longer)
- Conversion data
- Audience data

**Reset on New Activity:**
- **ON:** Timer resets when user returns (rolling window)
- **OFF:** Data deleted at fixed date

**Recommendation:**
- Standard sites: 2 months
- Ecommerce/high-value: 14 months
- Export to BigQuery for unlimited retention

### Data Collection

**Path:** Admin -> Data Settings -> Data Collection

**Google Signals:**
- Enable for demographics, interests
- Enables cross-device tracking
- Requires user opt-in for personalisation
- Impacts data thresholds in reports

**User-Provided Data:**
- Mark if collecting email, address, phone
- Required for certain Google Ads features
- Impacts policy compliance

## Data Filters

**Path:** Admin -> Data Settings -> Data Filters

### Filter Types

| Type | Purpose |
|------|---------|
| Internal Traffic | Exclude office/employee traffic |
| Developer Traffic | Exclude staging/development |
| Unwanted Referrals | Exclude payment processors |

### Creating Internal Traffic Filter

**Step 1: Define Internal Traffic**

1. Admin -> Data Streams -> Stream settings
2. Configure tag settings -> Define internal traffic
3. Add rules:
   - Rule name: "Office IP"
   - Match type: IP address equals/begins with
   - IP address: Enter office IPs
4. Save

**Step 2: Create Filter**

1. Admin -> Data Settings -> Data Filters
2. Click "Create Filter"
3. Configure:
   - Filter name: "Internal Traffic - Office"
   - Filter type: Internal Traffic
   - Filter state: Testing (initially)
4. Save

**Step 3: Test Filter**

1. Visit website from office IP
2. Check DebugView: events have `traffic_type = internal`
3. If correct, set filter to "Active"

### Filter States

| State | Behaviour |
|-------|-----------|
| Testing | Tags traffic, doesn't exclude |
| Active | Excludes from reports |
| Inactive | Disabled |

## User Management

**Path:** Admin -> Property Access Management

### Roles

| Role | Capabilities |
|------|--------------|
| Viewer | View reports, create Explorations |
| Analyst | + Create audiences, custom dimensions, annotations |
| Marketer | + Manage audiences, link Google Ads |
| Editor | + Modify property settings, create events |
| Administrator | Full access including user management |

### Adding Users

1. Property Access Management -> Add
2. Enter email address
3. Select role
4. Add optional message
5. Click "Add"

### Best Practices

- Principle of least privilege
- Regular access audits
- Remove users when leaving
- Use service accounts for integrations

## Property Settings

**Path:** Admin -> Property Settings

### Key Settings

| Setting | Description |
|---------|-------------|
| Property name | Descriptive name |
| Property ID | Read-only numeric ID |
| Reporting Time Zone | Day boundaries in reports |
| Currency | Default for revenue |
| Industry Category | Benchmarking |

### Timezone Considerations

- Affects FUTURE data only
- Historical data keeps old timezone
- Cannot change retroactively
- Plan carefully before changing

## Data Streams

**Path:** Admin -> Data Streams

### Managing Streams

Click stream name to access:

**Stream Details:**
- Stream name
- Stream URL
- Measurement ID
- Stream ID

**Enhanced Measurement:**
- Page views (always on)
- Scrolls
- Outbound clicks
- Site search
- Video engagement
- File downloads
- Form interactions

**Toggle individually** to enable/disable each event type.

### Measurement Protocol API Secrets

For server-side tracking:

1. Click stream -> Measurement Protocol API secrets
2. Click "Create"
3. Enter nickname
4. Copy secret (shown once)
5. Store securely

## Events Settings

**Path:** Admin -> Events

### Viewing Events

- List of all collected events
- Event count over time
- Parameter details

### Create Event (Modify Existing)

Create new events by modifying existing:

1. Click "Create Event"
2. Event name: New event name
3. Matching conditions: Based on existing event
4. Modifications: Add/change parameters
5. Save

**Example:**
```
Create: important_page_view
When: event_name = page_view AND page_path = /pricing
```

### Mark as Key Event

1. Find event in list
2. Toggle "Mark as key event"
3. Event appears in conversion reports

**Limits:** Maximum 30 key events per property

## Key Events (Conversions)

**Path:** Admin -> Key Events

### Purpose

- Track important user actions
- Import to Google Ads for optimisation
- Appear in conversion reports

### Default Key Events

- purchase (ecommerce)
- first_visit
- session_start (if enabled)

### Marking Events

1. Event must have fired at least once
2. Toggle "Mark as key event"
3. Affects future data immediately

## Custom Definitions

**Path:** Admin -> Data Display -> Custom Definitions

### Custom Dimensions

1. Click "Create custom dimension"
2. Configure:
   - Dimension name: Display name
   - Scope: Event, User, or Item
   - Event/User parameter: Exact parameter name
3. Save
4. Wait 24-48 hours for data

### Custom Metrics

1. Click "Create custom metric"
2. Configure:
   - Metric name: Display name
   - Scope: Event
   - Event parameter: Numeric parameter
   - Unit: Standard, Currency, Distance, Time
3. Save

### Limits

| Type | Standard | 360 |
|------|----------|-----|
| Event-scoped dimensions | 50 | 125 |
| User-scoped dimensions | 25 | 100 |
| Item-scoped dimensions | 10 | 25 |
| Custom metrics | 50 | 125 |

## Product Links

**Path:** Admin -> Product Links

### Available Links

| Link | Purpose |
|------|---------|
| Google Ads Links | Remarketing, conversions |
| Search Ads 360 | SA360 integration |
| Display & Video 360 | DV360 integration |
| BigQuery Links | Raw data export |
| AdSense Links | AdSense revenue |

### Linking Google Ads

1. Google Ads Links -> Link
2. Choose Ads account
3. Enable options:
   - Personalised advertising
   - Auto-tagging
4. Confirm link

## DebugView

**Path:** Admin -> DebugView

### Purpose

- Real-time event debugging
- View events from debug-enabled devices
- Check parameters and user properties

### Enable Debug Mode

- Browser extension: Google Analytics Debugger
- URL parameter: ?debug_mode=true
- gtag config: debug_mode: true
- GTM: Add debug_mode parameter

## Channel Groups

**Path:** Admin -> Data Display -> Channel Groups

### Default Channel Groups

Pre-defined groupings for traffic sources:
- Direct
- Organic Search
- Paid Search
- Display
- Social
- Email
- Referral

### Custom Channel Groups

Create custom groupings:

1. Click "Create new channel group"
2. Add channels with rules
3. Define conditions (source, medium, campaign)
4. Prioritise channels
5. Save

## Calculated Metrics

**Path:** Admin -> Data Display -> Custom Definitions

Create derived metrics:

**Examples:**
- Revenue per User = revenue / users
- Conversion Rate = conversions / sessions * 100
- Average Order Value = revenue / purchases

**Process:**
1. Create custom metric
2. Type: Calculated
3. Enter formula
4. Save (no processing delay)

## Attribution Settings

**Path:** Admin -> Attribution Settings

### Reporting Attribution Model

Choose default model:
- Data-driven (recommended)
- Last click
- First click
- Linear
- Time decay
- Position-based

### Lookback Window

- Acquisition: 30 days
- Other conversions: 30/60/90 days

## Quick Reference

### Data Retention

- Default: 2 months
- Max: 14 months
- For longer: Export to BigQuery

### User Roles

- Viewer: View only
- Analyst: View + create
- Marketer: View + create + Ads
- Editor: All except user management
- Administrator: Full access

### Custom Definitions Limits

- Event dimensions: 50
- User dimensions: 25
- Item dimensions: 10
- Custom metrics: 50

### Key Events Limit

- Maximum: 30 per property

### Data Filter States

- Testing: Tags but doesn't exclude
- Active: Excludes from reports
- Inactive: Disabled
