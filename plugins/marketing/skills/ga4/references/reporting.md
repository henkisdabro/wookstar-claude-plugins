# GA4 Reporting and Data Analysis

Comprehensive guide to GA4 standard reports, Explorations, and data analysis techniques.

## Overview

GA4 provides standard reports for common metrics and Explorations for advanced analysis. Standard reports offer quick insights while Explorations enable custom, flexible analysis with drag-and-drop interfaces.

## Standard Reports

### Accessing Reports

**Path:** Reports (left navigation)

### Report Categories

#### Realtime Reports

**Path:** Reports -> Realtime

| Data | Description |
|------|-------------|
| Active users | Users in last 30 minutes |
| Views by page | Current page activity |
| Events by name | Real-time event counts |
| Conversions | Recent conversions |
| User locations | Geographic map |

#### Life Cycle Reports

**Acquisition Reports:**
- User acquisition (first touch)
- Traffic acquisition (session level)
- Channels, sources, campaigns

**Engagement Reports:**
- Events (all event activity)
- Conversions (key events)
- Pages and screens
- Landing pages

**Monetisation Reports:**
- E-commerce purchases
- Publisher ads (AdSense)
- In-app purchases
- Revenue metrics

**Retention Reports:**
- User engagement over time
- Cohort analysis
- User retention
- Lifetime value

#### User Reports

**Demographics:**
- Age, gender (requires Google Signals)
- Country, city, language

**Tech:**
- Browser, device, OS
- Screen resolution
- App version

### Customising Standard Reports

**Add Secondary Dimension:**
1. Click "+" next to primary dimension
2. Select additional dimension
3. View combined breakdown

**Apply Filters:**
1. Click "Add filter +"
2. Choose dimension
3. Set condition (equals, contains, etc.)
4. Apply

**Change Date Range:**
1. Top-right date selector
2. Choose preset or custom range
3. Enable comparison if needed

## Explorations

### Accessing Explorations

**Path:** Explore (left navigation)

### Exploration Types

#### 1. Free Form Exploration

**Purpose:** Flexible custom reports with drag-and-drop interface

**Components:**
- Dimensions: User attributes
- Metrics: Quantitative measures
- Rows: Primary dimension
- Columns: Secondary dimension
- Values: Metrics to display
- Filters: Limit data shown
- Segments: Compare user groups

**Use Cases:**
- Custom traffic source reports
- Product performance analysis
- Custom conversion reports

#### 2. Funnel Exploration

**Purpose:** Analyse conversion funnels and drop-off points

**Setup:**
1. Add steps (events or page views)
2. Configure funnel type:
   - Closed: Must complete in order
   - Open: Can enter at any step
3. Analyse results

**Example Steps:**
1. page_view (homepage)
2. view_item
3. add_to_cart
4. begin_checkout
5. purchase

**Insights:**
- Completion rate per step
- Drop-off percentage
- Time between steps

#### 3. Path Exploration

**Purpose:** Visualise user journeys and navigation paths

**Types:**
- Starting point: Paths from specific event/page
- Ending point: Paths to specific event/page

**Visualisation:**
- Node size = traffic volume
- Arrows = path direction
- Numbers = user count

#### 4. Segment Overlap

**Purpose:** Compare and analyse audience overlap

**Setup:**
1. Add 2-3 segments
2. View Venn diagram
3. Analyse:
   - Unique users per segment
   - Overlapping users
   - Total reach

#### 5. Cohort Exploration

**Purpose:** Analyse user retention over time

**Setup:**
1. Cohort: User grouping (acquisition date)
2. Granularity: Daily, weekly, monthly
3. Metrics: Sessions, revenue, events
4. Time period: Days/weeks since cohort start

**Insights:**
- Week 1 retention rates
- Revenue per cohort
- Long-term engagement patterns

#### 6. User Exploration

**Purpose:** Analyse individual user behaviour

**Setup:**
1. Add user identifier
2. View user details:
   - All events
   - Event parameters
   - Device, location
   - Session timeline

**Use Cases:**
- Debug specific issues
- Understand power users
- Investigate anomalies

#### 7. User Lifetime

**Purpose:** Analyse user value over lifetime

**Dimensions:** Acquisition source, campaign
**Metrics:** Lifetime value, revenue, sessions
**Time period:** Lifetime duration

## Creating Segments

### Segment Types

| Type | Description |
|------|-------------|
| User segment | Users matching conditions |
| Session segment | Sessions matching conditions |
| Event segment | Events matching conditions |

### Building Segments

**Path:** Explorations -> Create new segment

**Conditions:**
- Demographics (country, age, gender)
- Technology (device, browser)
- Acquisition (source, medium, campaign)
- Behaviour (events, conversions)
- E-commerce (purchasers, revenue)
- Custom dimensions/metrics

### Segment Examples

**High-Value Purchasers:**
```
Users where:
- totalRevenue > 500
- purchaseCount >= 3
```

**Mobile Converters:**
```
Sessions where:
- deviceCategory = mobile
- keyEvent: purchase
```

**Engaged Users:**
```
Users where:
- sessionCount >= 5
- avgEngagementTime > 120 seconds
```

## Comparisons

### Creating Comparisons

1. In report, click "Add comparison"
2. Choose dimension or segment
3. Select values to compare

### Example Comparisons

- Desktop vs Mobile
- UK vs US traffic
- This month vs last month
- New vs returning users

### Visualisation

- Side-by-side metrics
- Colour-coded lines in charts
- Percentage differences

## Key Metrics Reference

### User Metrics

| Metric | Description |
|--------|-------------|
| Total Users | All users in period |
| New Users | First-time visitors |
| Active Users | Users with engagement |
| DAU/WAU/MAU | Daily/Weekly/Monthly active |

### Engagement Metrics

| Metric | Description |
|--------|-------------|
| Sessions | Session count |
| Average Engagement Time | Time actively engaged |
| Engagement Rate | % of engaged sessions |
| Events per Session | Average event count |

### Conversion Metrics

| Metric | Description |
|--------|-------------|
| Conversions | Key event count |
| Conversion Rate | % with conversion |
| Total Revenue | Sum of revenue |
| ARPPU | Revenue per paying user |

### E-commerce Metrics

| Metric | Description |
|--------|-------------|
| Purchase Revenue | Revenue from purchases |
| Transactions | Purchase count |
| Average Purchase Revenue | Revenue per transaction |
| Items Viewed/Added/Purchased | Item counts |

## Attribution

### Accessing Attribution

**Path:** Advertising -> Attribution

### Attribution Models

| Model | Description |
|-------|-------------|
| Data-driven | ML-based credit assignment |
| Last click | Full credit to last touch |
| First click | Full credit to first touch |
| Linear | Equal credit to all |
| Time decay | More credit to recent |
| Position-based | More to first and last |

### Comparing Models

- View conversions by channel per model
- Understand attribution impact
- Optimise marketing spend

## Analysis Best Practices

### Finding Insights

1. **Start broad:** Review standard reports
2. **Identify anomalies:** Look for unusual patterns
3. **Drill down:** Add dimensions, apply filters
4. **Use Explorations:** Build custom analyses
5. **Export and share:** Download or share links

### Common Analyses

**Conversion Funnel:**
- Identify drop-off points
- Optimise low-performing steps
- A/B test improvements

**Traffic Source Performance:**
- Which sources drive conversions?
- Cost per acquisition by channel
- ROI by campaign

**User Retention:**
- Return rate after first visit
- Active duration
- Best retention sources

**Product Performance:**
- Most viewed products
- Conversion rate by product
- Revenue by category

## Exporting Data

### Export Options

**From Reports:**
- Download as CSV/PDF
- Share report link

**From Explorations:**
- Export to Google Sheets
- Download as CSV/PDF

**To BigQuery:**
- Admin -> BigQuery Links
- Raw event data export

## Report Limits

| Limit | Value |
|-------|-------|
| Explorations per property | 200 |
| Shared Explorations per user | 50 |
| Segments per Exploration | 100 |
| Rows per Exploration | 1,000,000 |

## Quick Reference

### Exploration Types

- Free Form: Custom flexible reports
- Funnel: Conversion path analysis
- Path: User journey visualisation
- Segment Overlap: Audience comparison
- Cohort: Retention analysis
- User: Individual behaviour
- User Lifetime: LTV analysis

### Segment Scopes

- User: Users matching conditions
- Session: Sessions matching conditions
- Event: Events matching conditions
