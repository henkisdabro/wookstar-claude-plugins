# GTM Trigger Configuration

**Sources**:

- <https://support.google.com/tagmanager/topic/7679108>
- <https://developers.google.com/tag-platform/tag-manager/web>

**Last Updated**: 2025-01-09

## Overview

Triggers define when and how tags fire in Google Tag Manager. Understanding trigger types, configurations, and conditions is essential for accurate tracking. This guide covers all trigger types and their use cases.

## Trigger Fundamentals

### How Triggers Work

1. User performs action on website
2. GTM detects the action via built-in listeners
3. Trigger conditions are evaluated
4. If conditions match, associated tags fire

### Trigger Components

**Trigger Type**: The event category (click, pageview, etc.)
**Filter Conditions**: When within that type to fire
**Built-in Variables**: Data available for conditions

## Page View Triggers

### Page View

Fires as soon as the GTM snippet loads on the page.

```
Trigger Type: Page View
Fires on: All Page Views
```

**Use Cases**:

- GA4 Configuration tag
- Essential tracking pixels
- Data layer initialisation tags

### DOM Ready

Fires when the DOM is fully parsed (but images/resources may still be loading).

```
Trigger Type: Page View - DOM Ready
Fires on: All DOM Ready Events
```

**Use Cases**:

- Tags that need to access DOM elements
- Click listeners that need elements to exist
- Form tracking initialisation

### Window Loaded

Fires when the page and all resources (images, scripts, etc.) have fully loaded.

```
Trigger Type: Page View - Window Loaded
Fires on: All Window Loaded Events
```

**Use Cases**:

- Performance measurement
- Tags that depend on all content being loaded
- Scroll depth initialisation

### Conditional Page View

Fire on specific pages only:

```
Trigger Type: Page View
Fires on: Some Page Views
Conditions:
  Page Path contains /products/
```

**Common Conditions**:

- `Page Path` equals `/checkout/`
- `Page URL` contains `utm_source=`
- `Page Hostname` equals `www.example.com`
- `Referrer` contains `google.com`

## Click Triggers

### All Elements Click

Fires on any click, regardless of element type.

```
Trigger Type: Click - All Elements
Fires on: Some Clicks
Conditions:
  Click Classes contains cta-button
```

**Available Variables**:

- Click Element (DOM element)
- Click Classes
- Click ID
- Click Target
- Click URL (for links)
- Click Text

### Just Links Click

Fires only on link (`<a>`) element clicks.

```
Trigger Type: Click - Just Links
Fires on: Some Link Clicks
Conditions:
  Click URL contains /external/
```

**Additional Options**:

- **Wait for Tags**: Pause navigation until tags fire (max 2000ms)
- **Check Validation**: Only fire if link click would navigate

**Use Cases**:

- Outbound link tracking
- File download tracking
- Internal navigation tracking

### Click Trigger Patterns

**Button Clicks by ID**:

```
Click - All Elements
Click ID equals submit-button
```

**Navigation Menu Clicks**:

```
Click - Just Links
Click Element matches CSS selector nav a
```

**CTA Button Clicks**:

```
Click - All Elements
Click Classes contains cta-button
OR Click Text equals Get Started
```

## Form Triggers

### Form Submission

Fires when a form is submitted.

```
Trigger Type: Form Submission
Fires on: Some Forms
Conditions:
  Form ID equals contact-form
```

**Available Variables**:

- Form Element
- Form Classes
- Form ID
- Form Target
- Form URL
- Form Text

**Options**:

- **Wait for Tags**: Pause submission until tags fire
- **Check Validation**: Only fire if form passes HTML5 validation

### Form Trigger Patterns

**All Form Submissions**:

```
Form Submission
Fires on: All Forms
```

**Specific Form by ID**:

```
Form Submission
Form ID equals newsletter-signup
```

**Forms with Specific Class**:

```
Form Submission
Form Classes contains tracking-form
```

## Custom Event Triggers

### Custom Event

Fires when a specific event is pushed to the data layer.

```
Trigger Type: Custom Event
Event Name: purchase
```

**Data Layer Push**:

```javascript
dataLayer.push({
  'event': 'purchase',
  'transactionId': 'T12345',
  'transactionTotal': 99.99
});
```

### Custom Event with Conditions

```
Trigger Type: Custom Event
Event Name: form_submit
Conditions:
  DL - Form Name equals Contact Form
```

### Regex Event Matching

Match multiple events with one trigger:

```
Event Name: ^(add_to_cart|remove_from_cart|view_cart)$
Use regex matching: Yes
```

## History Change Triggers

### History Change

Fires when the URL fragment or History API state changes (essential for SPAs).

```
Trigger Type: History Change
Fires on: All History Changes
```

**Available Variables**:

- New History Fragment
- Old History Fragment
- New History State
- Old History State
- History Source (pushState, replaceState, popstate, hashchange)

### SPA Virtual Pageviews

```
Trigger Type: History Change
Fires on: All History Changes
```

Use with GA4 Event tag:

```
Event Name: page_view
Parameters:
  page_location: {{Page URL}}
  page_title: {{Page Title}}
```

## Timer Triggers

### Timer

Fires at specified intervals.

```
Trigger Type: Timer
Event Name: timer_30sec
Interval: 30000 (milliseconds)
Limit: 1 (fire once)
Conditions:
  Page Path equals /article/
```

**Use Cases**:

- Time on page tracking
- Engaged user detection
- Periodic data collection

### Timer Configuration

**Interval**: Milliseconds between fires
**Limit**: Maximum number of times to fire (blank = unlimited)
**Conditions**: When the timer should be active

## Scroll Depth Triggers

### Scroll Depth

Fires when user scrolls to specified depths.

```
Trigger Type: Scroll Depth
Vertical Scroll Depths:
  Percentages: 25, 50, 75, 90
Fires on: Some Scroll Depths
Conditions:
  Page Path matches RegEx ^/blog/
```

**Available Variables**:

- Scroll Depth Threshold (percentage or pixels)
- Scroll Depth Units (percent or pixels)
- Scroll Direction (vertical or horizontal)

### Scroll Tracking Patterns

**Article Engagement**:

```
Scroll Depth
Vertical: 25, 50, 75, 100 percent
Page Path contains /blog/
```

**Product Page Scroll**:

```
Scroll Depth
Vertical: 50, 100 percent
Page Path matches RegEx ^/products/
```

## YouTube Video Triggers

### YouTube Video

Fires based on YouTube embed interactions.

```
Trigger Type: YouTube Video
Capture: Start, Complete, Pause, Seeking, Progress
Progress: 10%, 25%, 50%, 75%, 90%
```

**Available Variables**:

- Video Title
- Video URL
- Video Provider (youtube)
- Video Status (start, complete, pause, etc.)
- Video Percent (for progress events)
- Video Duration
- Video Current Time
- Video Visible (boolean)

### YouTube Tracking Patterns

**All YouTube Interactions**:

```
YouTube Video
Capture: Start, Complete, Pause, Progress
Progress: 25%, 50%, 75%
```

**Completion Only**:

```
YouTube Video
Capture: Complete
```

## Element Visibility Triggers

### Element Visibility

Fires when specific elements become visible in the viewport.

```
Trigger Type: Element Visibility
Selection Method: CSS Selector
Element Selector: #product-reviews
When to fire: Once per page
Minimum Percent Visible: 50
```

**Options**:

- **Once per page**: Fire once when element first becomes visible
- **Once per element**: Fire once per matching element
- **Every time**: Fire every time element enters viewport

**Use Cases**:

- Lazy-loaded content tracking
- Ad viewability
- Section engagement tracking

## Trigger Groups

### Combining Triggers

Trigger groups allow "AND" logic between multiple triggers.

```
Trigger Group Name: Engaged User on Product Page
Triggers:
  - Timer - 30 seconds
  - Scroll Depth - 50%
```

**Use Cases**:

- Engaged user definition
- Complex conversion criteria
- Multi-step funnel tracking

## Trigger Conditions

### Condition Operators

- **equals**: Exact match
- **contains**: Substring match
- **starts with**: Prefix match
- **ends with**: Suffix match
- **matches RegEx**: Regular expression match
- **does not equal**: Negative exact match
- **does not contain**: Negative substring match
- **less than / greater than**: Numeric comparison

### Multiple Conditions

**AND Logic**: All conditions in a trigger must match
**OR Logic**: Use multiple triggers on the same tag

### Common Condition Patterns

**Exclude Internal Traffic**:

```
Page URL does not contain ?internal=true
```

**Specific Page Types**:

```
DL - Page Type equals product
```

**URL Parameter Present**:

```
Page URL matches RegEx [?&]utm_source=
```

## Blocking Triggers (Exceptions)

### How Exception Triggers Work

Exception triggers prevent a tag from firing even when firing triggers match.

```
Tag: GA4 - Pageview
Firing Triggers: All Pages
Exception Triggers: Internal Traffic
```

### Common Exception Patterns

**Block Internal Traffic**:

```
Exception Trigger: Internal Traffic
Condition: Page URL contains ?internal=true
```

**Block During Testing**:

```
Exception Trigger: Preview Mode
Condition: Debug Mode equals true
```

## Trigger Naming Conventions

### Recommended Format

```
[Event Type] - [Description]
```

### Examples

- `Pageview - All Pages`
- `Pageview - Product Pages`
- `Click - CTA Buttons`
- `Click - Outbound Links`
- `Form - Contact Form`
- `Custom Event - Purchase`
- `Scroll - 50% Blog Posts`
- `Timer - 30 Seconds`

## Debugging Triggers

### Preview Mode Analysis

1. Enable Preview mode
2. Perform the action
3. Check Summary panel for event
4. Click event to see fired/not fired triggers
5. Review Variables panel for condition values

### Common Issues

**Trigger Not Firing**:

- Variable values don't match conditions
- Element not present when listener initialised
- Event not being pushed to data layer

**Trigger Fires Too Often**:

- Conditions too broad
- Missing exception trigger
- History Change firing on initial page load

## Resources

- [GTM Trigger Types](https://support.google.com/tagmanager/topic/7679108)
- [Built-in Variables](https://support.google.com/tagmanager/answer/7182738)
- [Regular Expressions in GTM](https://support.google.com/tagmanager/answer/7679316)
