# GTM Container Setup and Installation

**Sources**:

- <https://support.google.com/tagmanager/answer/6103696>
- <https://developers.google.com/tag-platform/tag-manager/web>

**Last Updated**: 2025-01-09

## Overview

This guide covers the complete process of setting up a Google Tag Manager container, including account creation, container configuration, and snippet installation. Proper setup is essential for reliable tag management.

## Creating a GTM Account

### Step 1: Access Tag Manager

1. Go to [tagmanager.google.com](https://tagmanager.google.com)
2. Sign in with your Google account
3. Click "Create Account"

### Step 2: Configure Account Settings

**Account Name**: Use your company or organisation name
**Country**: Select your primary country

### Step 3: Create Container

**Container Name**: Use your website domain (e.g., www.example.com)
**Target Platform**:

- **Web**: For websites and web applications
- **iOS**: For iOS mobile apps
- **Android**: For Android mobile apps
- **AMP**: For Accelerated Mobile Pages
- **Server**: For server-side tagging

## Container Installation

### Web Container Snippet

After creating your container, you receive two code snippets:

#### Head Snippet (Required)

Place this code as high in the `<head>` as possible:

```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXX');</script>
<!-- End Google Tag Manager -->
```

Replace `GTM-XXXXXX` with your container ID.

#### Body Snippet (Recommended)

Place this code immediately after the opening `<body>` tag:

```html
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXX"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
```

The noscript fallback ensures basic tracking for users with JavaScript disabled.

### Snippet Placement Best Practices

**Head Snippet Placement:**

- Place after any charset or viewport meta tags
- Place before any other scripts
- Place before CSS stylesheets if possible
- Do NOT place in the footer

**Body Snippet Placement:**

- Immediately after opening `<body>` tag
- Before any visible content

### Installation Verification

#### Method 1: GTM Preview Mode

1. In GTM, click "Preview" button
2. Enter your website URL
3. Verify "Container Loaded" event appears

#### Method 2: Browser Developer Tools

1. Open Developer Tools (F12)
2. Go to Network tab
3. Filter for "gtm.js"
4. Verify request to googletagmanager.com

#### Method 3: Tag Assistant Extension

1. Install Google Tag Assistant extension
2. Navigate to your website
3. Check for green GTM icon

### Common Installation Issues

#### Container Not Loading

**Symptoms**: No GTM events in Preview mode

**Causes and Solutions**:

- Snippet not on page - Verify snippet is present in page source
- Incorrect container ID - Check GTM-XXXXXX matches your container
- JavaScript error before GTM - Check console for errors
- Content Security Policy blocking - Add googletagmanager.com to CSP

#### Duplicate Container

**Symptoms**: Tags fire multiple times

**Solutions**:

- Search page source for multiple GTM snippets
- Check for GTM in both theme and plugins
- Remove duplicate installations

## Data Layer Initialisation

### Proper Data Layer Setup

Initialise the data layer BEFORE the GTM snippet:

```html
<script>
  window.dataLayer = window.dataLayer || [];
  dataLayer.push({
    'pageType': 'product',
    'productId': 'SKU123',
    'userId': 'USER456'
  });
</script>
<!-- Google Tag Manager -->
<script>...</script>
```

### Why Initialise Before GTM?

- Ensures data is available when Container Loaded fires
- Prevents race conditions
- Enables Page View triggers to access initial data

## Container Settings

### Container Information

Access via Admin > Container Settings:

- **Container ID**: Your GTM-XXXXXX identifier
- **Container Name**: Editable display name
- **Container Type**: Web, iOS, Android, AMP, or Server

### Container Sharing

Share container access via Admin > User Management:

**Permission Levels**:

- **Read**: View container contents
- **Edit**: Modify tags, triggers, variables
- **Approve**: Approve workspace changes
- **Publish**: Publish container versions

### Environments

Configure environments via Admin > Environments:

**Default Environments**:

- **Live**: Production container
- **Latest**: Most recent version (published or not)

**Custom Environments**:

- Create staging, development, or testing environments
- Each has unique snippet with environment parameters
- Control which version serves to each environment

## Server-Side Container Setup

### When to Use Server-Side Tagging

- Enhanced data privacy and control
- Reduced client-side JavaScript
- Better data quality (server validation)
- Cross-platform data collection

### Setup Steps

1. Create Server container in GTM
2. Choose hosting option (Google Cloud or custom)
3. Configure server-side client(s)
4. Update web container to send data to server container

## Multi-Container Setup

### When to Use Multiple Containers

- Different teams managing different sections
- Acquisition scenarios (separate brand tracking)
- Agency management with client isolation
- Testing new configurations safely

### Considerations

- Both containers share the same data layer
- Coordinate to avoid duplicate tracking
- Consider performance impact
- Document which container owns which tags

## CMS-Specific Installation

### WordPress

**Method 1: Theme Files**

- Edit header.php to add head snippet
- Edit header.php to add body snippet after `<body>` tag

**Method 2: Plugin**

- Use GTM plugins (e.g., Google Site Kit, GTM4WP)
- Configure container ID in plugin settings

### Shopify

1. Go to Online Store > Themes
2. Edit code
3. Add head snippet to theme.liquid in `<head>`
4. Add body snippet after `<body>` in theme.liquid

## Verification Checklist

Before going live:

- [ ] GTM snippet in `<head>` on all pages
- [ ] Noscript fallback after `<body>` tag
- [ ] Container ID is correct
- [ ] Data layer initialised before GTM snippet
- [ ] Preview mode shows Container Loaded event
- [ ] No JavaScript errors in console
- [ ] Tags fire as expected in Preview mode
- [ ] Verified data reaches analytics platforms

## Resources

- [GTM Help Center - Install Guide](https://support.google.com/tagmanager/answer/6103696)
- [GTM Developer Guide](https://developers.google.com/tag-platform/tag-manager/web)
- [Server-Side Tagging](https://developers.google.com/tag-platform/tag-manager/server-side)
