# GA4 Audiences and Segmentation

Expert guidance for creating and managing audiences for analysis, remarketing, and personalisation.

## Overview

Audiences in GA4 allow creation of user segments for analysis, remarketing, and personalisation based on dimensions, metrics, and events. Audiences can be exported to Google Ads for targeting and used in GA4 reports for analysis.

## Accessing Audiences

**Path:** Admin -> Audiences

**Available Actions:**
- View all audiences
- Create new audiences
- Edit existing audiences
- View audience membership

## Predefined Audiences

GA4 includes template audiences:

| Audience | Description |
|----------|-------------|
| All Users | All users in selected timeframe |
| Purchasers | Users who completed purchase (30 days) |
| New Users | First-time visitors |
| Returning Users | Repeat visitors |
| Recent Users | Active in last 7 days |

### Activating Predefined Audiences

1. Admin -> Audiences -> Create Audience
2. Select suggested template
3. Customise conditions if needed
4. Save audience

## Creating Custom Audiences

### Basic Process

1. Admin -> Audiences -> New Audience
2. Choose method:
   - Start from scratch
   - Use suggested template
   - Create predictive audience
3. Configure audience:
   - Name: Descriptive (e.g., "High-Value Shoppers")
   - Description: Optional notes
   - Membership duration: 1-540 days
4. Add conditions
5. Preview size
6. Save

### Condition Types

#### Dimension Filters

Filter by user or event attributes:

```
country == "United States"
device_category == "mobile"
platform == "web"
```

**Available Dimensions:**
- User: city, country, device_category, platform
- Event: event_name, page_location, item_id
- Custom: Any registered custom dimensions

#### Metric Filters

Filter by quantitative measures:

```
totalRevenue > 100
sessionCount >= 3
engagementTime > 60
```

**Available Metrics:**
- Event count
- Session count
- Revenue
- Engagement time
- Conversion count

#### Event Conditions

Include/exclude based on events:

**Include users who:**
- Have triggered specific event
- Have NOT triggered event
- Triggered event with specific parameters

**Example:** Users who triggered `purchase` with `value > 50`

#### Sequence Conditions

Build audiences based on event order:

**Example:** Users who:
1. Viewed product (view_item)
2. Added to cart (add_to_cart)
3. Did NOT complete purchase (within 7 days)

### Membership Duration

| Duration | Use Case |
|----------|----------|
| 1-7 days | Short campaigns |
| 30-90 days | Remarketing |
| 540 days | Lifetime segments |

**How it works:**
- User enters when conditions met
- Stays for duration period
- Exits after duration (unless conditions still met)

## Audience Examples

### High-Value Customers

```
Conditions:
- totalRevenue > 500 (lifetime)
- purchaseCount >= 3

Membership: 540 days
```

### Cart Abandoners

```
Sequence:
1. add_to_cart (within last 7 days)
2. Did NOT: purchase

Membership: 7 days
```

### Engaged Mobile Users

```
Conditions:
- deviceCategory == "mobile"
- sessionCount >= 5 (last 30 days)
- avgEngagementTime > 60 seconds

Membership: 30 days
```

### Product Category Viewers

```
Event Condition:
- view_item (last 30 days)
- item_category == "Electronics"

Membership: 30 days
```

### Geographic Segment

```
Conditions:
- country == "United States"
- region == "California"

Membership: 90 days
```

### Newsletter Subscribers

```
Event Condition:
- sign_up (any time)
- method == "newsletter"

Membership: 540 days
```

## Predictive Audiences

GA4 can create audiences based on predicted user behaviour.

### Available Predictions

| Prediction | Description |
|------------|-------------|
| Purchase probability | Likelihood to purchase (7 days) |
| Churn probability | Likelihood to not return (7 days) |
| Revenue prediction | Expected 28-day revenue |

### Requirements

- 1,000+ users triggering target event (28 days)
- Sufficient historical data
- Model quality threshold met

### Creating Predictive Audience

1. Create New Audience
2. Choose "Predictive"
3. Select metric (purchase probability, etc.)
4. Set threshold (e.g., > 50% purchase probability)
5. Save

### Use Cases

- Target likely purchasers with ads
- Re-engage likely-to-churn users
- Focus on high-revenue potential users

## Audience Triggers

### What are Triggers

Actions that fire when user enters audience.

### Supported Actions

- Send event to GA4
- Create Google Ads remarketing list
- Send to Google Ads for targeting

### Setup

1. Create audience
2. In settings, add trigger
3. Configure action (event name, Ads account)
4. Save

### Use Cases

- Track when users become high-value
- Send conversion events to Ads
- Real-time remarketing lists

## Exporting to Google Ads

### Prerequisites

- Google Ads account linked
- Admin -> Product Links -> Google Ads Links
- Minimum audience size met

### Minimum Sizes

| Region | Minimum Users |
|--------|---------------|
| Standard | 100 active |
| EEA/UK | 1,000 active |

### Setup

1. Link Google Ads account
2. In audience, enable "Ads Personalisation"
3. Audience appears in Ads within 24-48 hours

### Export Destinations

- Google Ads (remarketing, targeting)
- Display & Video 360
- Search Ads 360

## Analysing Audiences

### Viewing Audience Data

**Reports -> Realtime:**
- Active users in audience

**Reports -> User Acquisition:**
- How audience members acquired

**Explorations -> Segment Overlap:**
- Compare audiences

**Explorations -> User Lifetime:**
- LTV of audience members

### Audience Metrics

| Metric | Description |
|--------|-------------|
| Total Users | Current members |
| New Users (7/30 days) | Recent additions |
| User Growth | Trend over time |

## Using Audiences in Explorations

### As Segments

1. Open Exploration
2. Click "+" in Segments
3. Select audience
4. Apply to analysis

### Comparing Audiences

1. Add multiple audiences as segments
2. View side-by-side comparison
3. Analyse differences

## Limits and Quotas

| Limit | Standard | 360 |
|-------|----------|-----|
| Audiences per property | 100 | 400 |
| Conditions per audience | 10 | 10 |
| Membership duration max | 540 days | 540 days |

## Common Issues

### Audience Size Too Small

**Causes:**
- Conditions too restrictive
- Low traffic volume
- Date range too narrow

**Solutions:**
1. Broaden conditions
2. Increase membership duration
3. Wait for more traffic

### Audience Not in Google Ads

**Causes:**
- Below minimum size
- Link not configured
- Ads personalisation disabled

**Solutions:**
1. Check audience size
2. Verify Google Ads link
3. Enable Ads Personalisation

### Stale Audience Data

**Cause:** Audiences update with delay

**Solution:** Wait 24-48 hours for updates

## Best Practices

### Naming Conventions

Use clear, descriptive names:
- "High-Value Customers - $500+"
- "Cart Abandoners - Last 7 Days"
- "Newsletter Subscribers"

### Documentation

Document each audience:
- Purpose
- Conditions used
- Expected size
- Use cases

### Regular Review

- Audit audiences quarterly
- Remove unused audiences
- Update conditions as needed

## Quick Reference

### Audience Limits

- Maximum: 100 audiences (standard)
- Membership: 1-540 days
- Export minimum: 100 users (1,000 EEA/UK)

### Export Destinations

- Google Ads
- Display & Video 360
- Search Ads 360

### Predictive Options

- Purchase probability
- Churn probability
- Revenue prediction
