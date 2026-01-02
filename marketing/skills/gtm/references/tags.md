# GTM Tag Configuration

**Sources**:

- <https://support.google.com/tagmanager/answer/6106716>
- <https://developers.google.com/tag-platform/tag-manager/web>

**Last Updated**: 2025-01-09

## Overview

Tags are snippets of code that execute on your website when triggered. They send data to third-party platforms like Google Analytics, Google Ads, Facebook, and other marketing and analytics tools. This guide covers tag configuration, types, and best practices.

## Tag Fundamentals

### What Tags Do

Tags perform actions such as:

- Sending pageview data to analytics platforms
- Firing conversion pixels for advertising
- Loading third-party scripts
- Setting cookies
- Sending custom events

### Tag Structure

Every tag has three components:

1. **Tag Type**: The template or custom code
2. **Configuration**: Settings specific to the tag
3. **Trigger(s)**: When the tag should fire

## Built-in Tag Templates

### Google Analytics 4 (GA4)

#### GA4 Configuration Tag

Sets up the GA4 measurement and should fire on all pages:

```
Tag Type: Google Analytics: GA4 Configuration
Measurement ID: G-XXXXXXXXXX
Trigger: All Pages
```

**Common Settings**:

- Send page view: Yes (default)
- Debug mode: Enable for testing
- User properties: Set user-scoped dimensions

#### GA4 Event Tag

Sends custom events to GA4:

```
Tag Type: Google Analytics: GA4 Event
Configuration Tag: {{GA4 Configuration}}
Event Name: button_click
Event Parameters:
  - button_text: {{Click Text}}
  - button_id: {{Click ID}}
Trigger: Button Click
```

**Event Naming Best Practices**:

- Use snake_case (e.g., `form_submit`, `video_play`)
- Be descriptive but concise
- Follow GA4 recommended events where applicable

### Google Ads

#### Google Ads Conversion Tracking

Track conversions for Google Ads campaigns:

```
Tag Type: Google Ads Conversion Tracking
Conversion ID: AW-123456789
Conversion Label: AbCdEfGhIjKlMnOp
Conversion Value: {{Transaction Total}}
Currency Code: AUD
Transaction ID: {{Transaction ID}}
Trigger: Purchase Confirmation
```

#### Google Ads Remarketing

Build remarketing audiences:

```
Tag Type: Google Ads Remarketing
Conversion ID: AW-123456789
Custom Parameters:
  - ecomm_prodid: {{Product ID}}
  - ecomm_pagetype: {{Page Type}}
  - ecomm_totalvalue: {{Cart Value}}
Trigger: All Pages
```

### Facebook Pixel

#### Facebook Pixel Base Code

```
Tag Type: Custom HTML
HTML:
<!-- Facebook Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '{{FB Pixel ID}}');
fbq('track', 'PageView');
</script>
Trigger: All Pages
```

**Note**: Consider using a Custom Template from the Community Gallery for better security and maintainability.

#### Facebook Conversion Event

```
Tag Type: Custom HTML
HTML:
<script>
fbq('track', 'Purchase', {
  value: {{Transaction Total}},
  currency: 'AUD',
  content_ids: {{Product IDs}},
  content_type: 'product'
});
</script>
Trigger: Purchase Confirmation
Tag Sequencing: Fire after Facebook Pixel Base Code
```

## Custom Tags

### Custom HTML Tag

For scripts not supported by built-in templates:

```html
<script>
  // Your custom JavaScript code here
  console.log('Custom tag fired');

  // Access data layer values
  var userId = {{DL - User ID}};

  // Send data to third-party service
  thirdPartyTracker.track('event', {
    userId: userId,
    page: {{Page Path}}
  });
</script>
```

**Best Practices**:

- Minimise Custom HTML usage - prefer templates
- Always use ES5 syntax (no const, let, arrow functions)
- Test thoroughly in Preview mode
- Document what the code does

### Custom Image Tag

For simple pixel tracking without JavaScript:

```
Tag Type: Custom Image
Image URL: https://tracking.example.com/pixel.gif?event=pageview&url={{Page URL}}
Trigger: All Pages
```

## Tag Configuration Options

### Tag Firing Options

**Once per event**: Tag fires once per trigger event (default)
**Once per page**: Tag fires maximum once per page load
**Unlimited**: Tag fires every time trigger conditions are met

### Tag Sequencing

Control the order tags fire:

**Setup Tag**: Fire a tag before the current tag
**Cleanup Tag**: Fire a tag after the current tag

Example use cases:

- Load vendor library before event tags
- Send data to multiple platforms in sequence
- Execute cleanup code after main tag

### Tag Priority

Higher priority tags fire first (default is 0):

```
Priority 100: Essential tags (consent, error tracking)
Priority 50: Analytics tags (GA4, Adobe)
Priority 25: Marketing tags (ads pixels)
Priority 0: Default
```

### Exception Triggers

Block a tag from firing even when trigger conditions are met:

```
Tag: GA4 - Pageview
Firing Triggers: All Pages
Exception Triggers: Internal Traffic
```

## Tag Templates from Community Gallery

### Accessing the Gallery

1. Click "Tag Configuration"
2. Scroll down to "Custom" section
3. Click "Discover more tag types in the Community Template Gallery"
4. Search and import templates

### Popular Templates

- **Consent Mode**: Google Consent Mode integration
- **LinkedIn Insight**: LinkedIn conversion tracking
- **Twitter Pixel**: Twitter/X conversion tracking
- **Pinterest Tag**: Pinterest conversion tracking
- **TikTok Pixel**: TikTok conversion tracking
- **Hotjar**: Session recording and heatmaps

### Template Benefits

- Pre-built and tested
- Sandboxed JavaScript for security
- Configurable through UI
- No Custom HTML security risks

## Advanced Tag Patterns

### Conditional Tag Firing

Use variables in tag configuration for conditional behaviour:

```
Tag: GA4 Event - Dynamic
Event Name: {{Event Name Variable}}
Event Parameters:
  - value: {{Event Value Variable}}
Trigger: Custom Event
```

### Data Layer Event Tags

React to data layer pushes:

```javascript
// Website code pushes event
dataLayer.push({
  'event': 'video_play',
  'videoTitle': 'Product Demo',
  'videoDuration': 120
});
```

```
GTM Tag:
Tag Type: GA4 Event
Event Name: video_play
Parameters:
  - video_title: {{DL - Video Title}}
  - video_duration: {{DL - Video Duration}}
Trigger: Custom Event - video_play
```

### E-commerce Tags

#### GA4 E-commerce Purchase

```
Tag Type: GA4 Event
Event Name: purchase
Parameters:
  - transaction_id: {{DL - Transaction ID}}
  - value: {{DL - Transaction Value}}
  - currency: {{DL - Currency}}
  - items: {{DL - E-commerce Items}}
Trigger: Purchase Event
```

## Tag Debugging

### Preview Mode Verification

1. Enable Preview mode
2. Navigate to pages where tag should fire
3. Check "Tags Fired" section
4. Verify tag configuration in tag details

### Common Issues

**Tag Not Firing**:

- Check trigger conditions
- Verify data layer values exist
- Look for blocking triggers

**Tag Fires Multiple Times**:

- Check for duplicate triggers
- Review History Change triggers on SPAs
- Verify tag firing options

**Data Not Reaching Platform**:

- Check Network tab for requests
- Verify platform credentials (IDs, keys)
- Test in platform's debug tools

## Tag Naming Conventions

### Recommended Format

```
[Platform] - [Type] - [Description]
```

### Examples

- `GA4 - Config - Main Property`
- `GA4 - Event - Form Submit`
- `Google Ads - Conversion - Purchase`
- `FB - Pixel - PageView`
- `LinkedIn - Insight - All Pages`
- `Custom - Hotjar - Initialisation`

## Performance Considerations

### Minimise Tag Load Impact

1. Use asynchronous loading (default for GTM)
2. Limit number of tags per page
3. Use built-in templates over Custom HTML
4. Defer non-essential tags
5. Use tag firing options appropriately

### Tag Audit Checklist

- [ ] Remove unused tags
- [ ] Consolidate duplicate tracking
- [ ] Review Custom HTML for efficiency
- [ ] Check tag sequencing necessity
- [ ] Verify all tags have appropriate triggers

## Resources

- [GTM Tag Types Reference](https://support.google.com/tagmanager/answer/6106716)
- [GA4 Event Reference](https://developers.google.com/analytics/devguides/collection/ga4/reference/events)
- [Community Template Gallery](https://tagmanager.google.com/gallery/)
