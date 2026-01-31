# GTM Variable Configuration

**Sources**:

- <https://support.google.com/tagmanager/topic/9125128>
- <https://developers.google.com/tag-platform/tag-manager/web>

**Last Updated**: 2025-01-09

## Overview

Variables in Google Tag Manager store and provide dynamic values for use in tags, triggers, and other variables. They capture information from the page, data layer, cookies, URLs, and more. This guide covers all variable types and configuration patterns.

## Variable Fundamentals

### How Variables Work

Variables capture values that can be:

- Used in tag configurations (e.g., event parameters)
- Used in trigger conditions (e.g., fire when X equals Y)
- Referenced by other variables
- Displayed in Preview mode for debugging

### Variable Syntax

Reference variables using double curly braces:

```
{{Variable Name}}
```

Example in tag configuration:

```
Event Name: {{Event Name Variable}}
User ID: {{DL - User ID}}
```

## Built-in Variables

### Enabling Built-in Variables

1. Go to Variables
2. Click "Configure" in Built-in Variables section
3. Enable required variables

### Page Variables

| Variable | Description |
|----------|-------------|
| Page URL | Full URL including query string |
| Page Hostname | Domain name only |
| Page Path | Path without domain or query |
| Referrer | Previous page URL |

### Click Variables

| Variable | Description |
|----------|-------------|
| Click Element | DOM element that was clicked |
| Click Classes | Class attribute of clicked element |
| Click ID | ID attribute of clicked element |
| Click Target | Target attribute (for links) |
| Click URL | href attribute (for links) |
| Click Text | Text content of clicked element |

### Form Variables

| Variable | Description |
|----------|-------------|
| Form Element | DOM form element |
| Form Classes | Form class attribute |
| Form ID | Form ID attribute |
| Form Target | Form target attribute |
| Form URL | Form action attribute |
| Form Text | Form text content |

### History Variables

| Variable | Description |
|----------|-------------|
| New History Fragment | New URL hash fragment |
| Old History Fragment | Previous URL hash fragment |
| New History State | New History API state object |
| Old History State | Previous History API state object |
| History Source | What triggered the change |

### Utility Variables

| Variable | Description |
|----------|-------------|
| Event | Current data layer event name |
| Environment Name | Current GTM environment |
| Container ID | GTM container ID |
| Container Version | Current container version |
| Debug Mode | True if in Preview mode |
| Random Number | Random number 0-2147483647 |
| HTML ID | Unique HTML element ID |

### Video Variables

| Variable | Description |
|----------|-------------|
| Video Provider | e.g., "youtube" |
| Video Status | start, complete, pause, etc. |
| Video URL | Video source URL |
| Video Title | Video title |
| Video Duration | Total duration in seconds |
| Video Current Time | Current playback position |
| Video Percent | Percentage of video watched |
| Video Visible | Whether video is in viewport |

### Scroll Variables

| Variable | Description |
|----------|-------------|
| Scroll Depth Threshold | Depth value that triggered |
| Scroll Depth Units | "percent" or "pixels" |
| Scroll Direction | "vertical" or "horizontal" |

### Visibility Variables

| Variable | Description |
|----------|-------------|
| Percent Visible | Percentage of element visible |
| On-Screen Duration | Time element has been visible |

## User-Defined Variables

### Data Layer Variable

Access values from the data layer:

```
Variable Type: Data Layer Variable
Data Layer Variable Name: userId
Data Layer Version: Version 2
```

**Accessing Nested Values**:

```
Data Layer Variable Name: ecommerce.items.0.item_name
```

**Data Layer Push**:

```javascript
dataLayer.push({
  'userId': 'USER123',
  'ecommerce': {
    'items': [{
      'item_name': 'Blue Widget'
    }]
  }
});
```

### 1st Party Cookie

Read cookie values:

```
Variable Type: 1st Party Cookie
Cookie Name: _ga
```

**Use Cases**:

- Read GA client ID
- Check session cookies
- Access custom cookies

### URL Variable

Parse URL components:

```
Variable Type: URL
Component Type: Query
Query Key: utm_source
```

**Component Types**:

- **Full URL**: Complete URL
- **Protocol**: http or https
- **Host Name**: Domain name
- **Port**: Port number
- **Path**: URL path
- **Query**: Query string or specific parameter
- **Fragment**: URL hash/anchor

### JavaScript Variable

Access global JavaScript variables:

```
Variable Type: JavaScript Variable
Global Variable Name: document.title
```

**Examples**:

- `document.title` - Page title
- `navigator.userAgent` - User agent string
- `window.innerWidth` - Viewport width

### Custom JavaScript

Execute JavaScript to return a value:

```
Variable Type: Custom JavaScript
Custom JavaScript:
function() {
  var path = {{Page Path}};
  return path.split('/')[1] || 'home';
}
```

**Important**: Use ES5 syntax only (no const, let, arrow functions)

**Pattern Examples**:

```javascript
// Get first path segment
function() {
  var path = {{Page Path}};
  var segments = path.split('/').filter(function(s) { return s; });
  return segments[0] || 'home';
}
```

```javascript
// Format currency
function() {
  var value = {{DL - Transaction Total}};
  if (typeof value === 'number') {
    return value.toFixed(2);
  }
  return '0.00';
}
```

```javascript
// Check if user is logged in
function() {
  var userId = {{DL - User ID}};
  return userId ? 'logged_in' : 'guest';
}
```

### Constant

Store static values:

```
Variable Type: Constant
Value: G-XXXXXXXXXX
```

**Use Cases**:

- GA4 Measurement IDs
- Pixel IDs
- API keys (non-sensitive)
- Environment-specific values

### Lookup Table

Map input values to output values:

```
Variable Type: Lookup Table
Input Variable: {{Page Path}}
Lookup Table:
  /                   -> home
  /products           -> products
  /about              -> about
  /contact            -> contact
Default Value: other
```

### Regex Table

Map regex patterns to values:

```
Variable Type: Regex Table
Input Variable: {{Page Path}}
Regex Table:
  ^/$                 -> home
  ^/products/         -> product_detail
  ^/category/         -> category
  ^/blog/             -> blog_post
Default Value: other
```

**Pattern Matching Tips**:

- Patterns are matched in order, first match wins
- Use `^` for start anchor, `$` for end anchor
- Enable "Ignore Case" if needed
- Enable "Full Matches Only" for stricter matching

### Auto-Event Variable

Access data from built-in event listeners:

```
Variable Type: Auto-Event Variable
Variable Type: Element Attribute
Attribute Name: data-product-id
```

**Variable Types**:

- **Element**: The DOM element
- **Element Classes**: Class attribute
- **Element ID**: ID attribute
- **Element Target**: Target attribute
- **Element Text**: Text content
- **Element URL**: href attribute
- **Element Attribute**: Custom attribute
- **History Source**: History change source
- **History New/Old State**: State objects
- **History New/Old Fragment**: URL fragments

### DOM Element

Read content from DOM elements:

```
Variable Type: DOM Element
Selection Method: CSS Selector
Element Selector: h1.product-title
Attribute Name: (leave blank for text content)
```

**Use Cases**:

- Read page title from H1
- Extract product name from element
- Read meta tag content

### Element Visibility

Check if element is visible:

```
Variable Type: Element Visibility
Selection Method: ID
Element ID: product-reviews
Output Type: Boolean
```

### Google Analytics Settings (Legacy)

Store shared GA Universal settings:

```
Variable Type: Google Analytics Settings
Tracking ID: UA-XXXXXX-X
Fields to Set:
  - anonymizeIp: true
Custom Dimensions:
  - index: 1, dimension value: {{User Type}}
```

**Note**: For GA4, use GA4 Configuration tags instead.

## Variable Scoping and Persistence

### Variable Evaluation

Variables are evaluated:

- When referenced in tags (at tag fire time)
- When used in trigger conditions (at event time)
- When referenced by other variables

### Data Layer Persistence

Data layer values persist until:

- Overwritten by a new push
- Page reloads
- Explicitly cleared (using undefined or reset)

```javascript
// Clear a value
dataLayer.push({
  'previousValue': undefined
});
```

## Advanced Variable Patterns

### Chained Variables

Variables can reference other variables:

```
Variable: Full Event Name
Type: Custom JavaScript
function() {
  return {{Event Category}} + ' - ' + {{Event Action}};
}
```

### Conditional Values

Return different values based on conditions:

```javascript
function() {
  var pageType = {{DL - Page Type}};
  if (pageType === 'product') {
    return {{DL - Product ID}};
  } else if (pageType === 'category') {
    return {{DL - Category ID}};
  }
  return 'none';
}
```

### Array/Object Handling

Work with complex data structures:

```javascript
// Get first item from array
function() {
  var items = {{DL - Ecommerce Items}};
  if (items && items.length > 0) {
    return items[0].item_name;
  }
  return '';
}
```

```javascript
// Convert array to comma-separated string
function() {
  var items = {{DL - Ecommerce Items}};
  if (!items) return '';
  return items.map(function(item) {
    return item.item_id;
  }).join(',');
}
```

### URL Parameter Extraction

Parse multiple URL parameters:

```javascript
function() {
  var url = {{Page URL}};
  var params = {};
  var queryString = url.split('?')[1];
  if (queryString) {
    queryString.split('&').forEach(function(pair) {
      var parts = pair.split('=');
      params[parts[0]] = decodeURIComponent(parts[1] || '');
    });
  }
  return params;
}
```

## Variable Naming Conventions

### Recommended Format

```
[Type] - [Description]
```

### Type Prefixes

- **DL**: Data Layer Variable
- **CJS**: Custom JavaScript
- **URL**: URL Variable
- **Cookie**: Cookie Variable
- **Const**: Constant
- **Lookup**: Lookup Table
- **Regex**: Regex Table
- **DOM**: DOM Element
- **JS**: JavaScript Variable

### Examples

- `DL - User ID`
- `DL - Product Name`
- `DL - Transaction Total`
- `CJS - Page Category`
- `CJS - Formatted Price`
- `URL - UTM Source`
- `URL - UTM Campaign`
- `Const - GA4 Measurement ID`
- `Const - FB Pixel ID`
- `Lookup - Page Type`
- `Cookie - Session ID`

## Debugging Variables

### Preview Mode

1. Enable Preview mode
2. Click on any event in Summary
3. Open Variables tab
4. View all variable values at that event

### Undefined Values

If a variable returns undefined:

- Check data layer has the value
- Verify variable name/path spelling
- Check timing (value pushed after tag fires)
- Verify data layer version setting

### Common Issues

**Data Layer Variable Not Found**:

- Check exact path (case-sensitive)
- Verify value exists in data layer
- Check Data Layer Version setting

**Custom JavaScript Errors**:

- Check browser console for errors
- Verify ES5 syntax (no const, let, arrow functions)
- Test function logic separately

**Lookup/Regex Table Not Matching**:

- Check input variable value in Preview
- Verify pattern syntax
- Check pattern order (first match wins)

## Resources

- [GTM Variable Types](https://support.google.com/tagmanager/topic/9125128)
- [Built-in Variables Reference](https://support.google.com/tagmanager/answer/7182738)
- [Data Layer Developer Guide](https://developers.google.com/tag-platform/tag-manager/datalayer)
