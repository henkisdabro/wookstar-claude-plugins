# GTM Custom Templates

**Sources**:

- <https://developers.google.com/tag-platform/tag-manager/templates>
- <https://developers.google.com/tag-platform/tag-manager/templates/api>

**Last Updated**: 2025-01-09

## Overview

Custom Templates allow you to build reusable tag and variable templates with a user interface and sandboxed JavaScript. They provide security, governance, and maintainability benefits over Custom HTML tags. This guide covers template creation, sandboxed JavaScript APIs, permissions, testing, and publishing.

## What Are Custom Templates?

Custom Templates encapsulate code into reusable, configurable components:

- **Tag Templates**: Create tags with UI controls instead of raw code
- **Variable Templates**: Create variables with configurable options
- **Client Templates**: Server-side GTM client endpoints

### Benefits

- **Security**: Sandboxed JavaScript with explicit permissions
- **Governance**: Control what code can access
- **Maintainability**: UI-based configuration
- **Shareability**: Export/import or publish to Community Gallery
- **No unsafe-eval**: Compiled at container build time

## Sandboxed JavaScript

### What Is Sandboxed JavaScript?

A restricted subset of JavaScript used in custom templates:

- No direct DOM access
- No window/document object
- No arbitrary HTTP requests
- Must use `require()` to import APIs
- All operations require explicit permissions

### Basic Template Structure

```javascript
// Import required APIs
const sendPixel = require('sendPixel');
const logToConsole = require('logToConsole');
const encodeUriComponent = require('encodeUriComponent');

// Access template configuration
const endpoint = data.endpoint;
const eventName = data.eventName;

// Execute template logic
const url = endpoint + '?event=' + encodeUriComponent(eventName);
sendPixel(url, data.gtmOnSuccess, data.gtmOnFailure);
```

### The `data` Object

Contains values from template fields:

```javascript
// If field is named "pixelId"
const pixelId = data.pixelId;

// If checkbox field is named "enableDebug"
const debug = data.enableDebug;  // true or false
```

### Success and Failure Callbacks

Tag templates must signal completion:

```javascript
// Success - tag executed correctly
data.gtmOnSuccess();

// Failure - tag encountered an error
data.gtmOnFailure();
```

## Common APIs

### Network APIs

```javascript
// Send pixel (GET request)
const sendPixel = require('sendPixel');
sendPixel(url, onSuccess, onFailure);

// HTTP request (GET, POST, etc.)
const sendHttpRequest = require('sendHttpRequest');
sendHttpRequest(url, options, body)
  .then(onSuccess)
  .catch(onFailure);

// Inject external script
const injectScript = require('injectScript');
injectScript(url, onSuccess, onFailure, cacheToken);
```

### Data Conversion

```javascript
const makeInteger = require('makeInteger');
const makeNumber = require('makeNumber');
const makeString = require('makeString');
const JSON = require('JSON');

const num = makeNumber('123.45');  // 123.45
const int = makeInteger('123.45'); // 123
const str = makeString(123);       // '123'
const obj = JSON.parse('{"key":"value"}');
const json = JSON.stringify({key: 'value'});
```

### URL and Encoding

```javascript
const encodeUri = require('encodeUri');
const encodeUriComponent = require('encodeUriComponent');
const decodeUri = require('decodeUri');
const decodeUriComponent = require('decodeUriComponent');
const getUrl = require('getUrl');
const parseUrl = require('parseUrl');

const encoded = encodeUriComponent('hello world');
const hostname = getUrl('hostname');
const urlParts = parseUrl('https://example.com/page?param=value');
```

### Storage APIs

```javascript
// Cookies
const getCookieValues = require('getCookieValues');
const setCookie = require('setCookie');

const cookies = getCookieValues('cookieName');
setCookie('name', 'value', {
  domain: 'example.com',
  path: '/',
  'max-age': 3600
});

// LocalStorage
const localStorage = require('localStorage');
const value = localStorage.getItem('key');
localStorage.setItem('key', 'value');
```

### Window Access

```javascript
// Call window function
const callInWindow = require('callInWindow');
callInWindow('functionName', arg1, arg2);

// Copy from window
const copyFromWindow = require('copyFromWindow');
const gaData = copyFromWindow('ga');

// Set in window
const setInWindow = require('setInWindow');
setInWindow('myVar', 'value', true);
```

### Data Layer

```javascript
const copyFromDataLayer = require('copyFromDataLayer');
const gtagSet = require('gtagSet');

const userId = copyFromDataLayer('userId');
gtagSet({'user_id': userId});
```

### Utility

```javascript
const logToConsole = require('logToConsole');
const getType = require('getType');
const queryPermission = require('queryPermission');
const getTimestampMillis = require('getTimestampMillis');
const generateRandom = require('generateRandom');
const Math = require('Math');

logToConsole('Debug message');
const type = getType(data.value);  // 'string', 'number', 'object', etc.
const canInject = queryPermission('inject_script', url);
const now = getTimestampMillis();
const random = generateRandom(1, 100);
```

## Building Tag Templates

### Tag Template Workflow

1. **Define Template Info**: Name, description, logo
2. **Configure Fields**: UI elements for user input
3. **Write Code**: Sandboxed JavaScript logic
4. **Set Permissions**: Define allowed operations
5. **Write Tests**: Validate functionality
6. **Preview and Test**: Test in template editor

### Simple Pixel Tag

```javascript
const sendPixel = require('sendPixel');
const encodeUriComponent = require('encodeUriComponent');

const pixelUrl = data.pixelUrl +
  '?id=' + encodeUriComponent(data.pixelId) +
  '&event=' + encodeUriComponent(data.eventName);

sendPixel(pixelUrl, data.gtmOnSuccess, data.gtmOnFailure);
```

### HTTP Request Tag

```javascript
const sendHttpRequest = require('sendHttpRequest');
const JSON = require('JSON');

const postBody = JSON.stringify({
  event: data.eventName,
  userId: data.userId
});

const options = {
  headers: {'Content-Type': 'application/json'},
  method: 'POST'
};

sendHttpRequest(data.endpoint, options, postBody)
  .then(data.gtmOnSuccess)
  .catch(data.gtmOnFailure);
```

### Script Injection Tag

```javascript
const injectScript = require('injectScript');
const queryPermission = require('queryPermission');

const url = data.scriptUrl;

if (queryPermission('inject_script', url)) {
  injectScript(url, data.gtmOnSuccess, data.gtmOnFailure);
} else {
  data.gtmOnFailure();
}
```

## Building Variable Templates

### Variable Template Basics

Variable templates return a value:

```javascript
const getCookieValues = require('getCookieValues');

const cookieName = data.cookieName;
const cookies = getCookieValues(cookieName);

if (cookies && cookies.length > 0) {
  return cookies[0];
}

return data.defaultValue || '';
```

### LocalStorage Variable

```javascript
const localStorage = require('localStorage');

const key = data.storageKey;
const value = localStorage.getItem(key);

return value || data.defaultValue;
```

### Lookup Variable

```javascript
const makeTableMap = require('makeTableMap');

const lookupTable = makeTableMap(data.table, 'key', 'value');
const inputValue = data.inputVariable;

return lookupTable[inputValue] || data.defaultValue;
```

## Field Configuration

### Common Field Types

**Text Input**:

```javascript
{
  "type": "TEXT",
  "name": "apiKey",
  "displayName": "API Key",
  "simpleValueType": true,
  "valueValidators": [
    {"type": "NON_EMPTY"},
    {"type": "REGEX", "args": ["^[a-zA-Z0-9]{32}$"]}
  ]
}
```

**Select Dropdown**:

```javascript
{
  "type": "SELECT",
  "name": "eventType",
  "displayName": "Event Type",
  "selectItems": [
    {"value": "pageview", "displayValue": "Pageview"},
    {"value": "event", "displayValue": "Event"}
  ],
  "simpleValueType": true
}
```

**Checkbox**:

```javascript
{
  "type": "CHECKBOX",
  "name": "enableDebug",
  "checkboxText": "Enable Debug Logging",
  "simpleValueType": true,
  "defaultValue": false
}
```

**Group**:

```javascript
{
  "type": "GROUP",
  "name": "advancedSettings",
  "displayName": "Advanced Settings",
  "groupStyle": "ZIPPY_CLOSED",
  "subParams": [
    // Nested fields here
  ]
}
```

## Permissions

### How Permissions Work

When you `require()` an API, permissions are automatically added. Configure them in the Permissions tab.

### sendPixel Permission

```json
{
  "allowedUrls": "specific",
  "urls": [
    "https://example.com/*"
  ]
}
```

### get_cookies Permission

```json
{
  "cookieAccess": "specific",
  "cookies": [
    "session_id",
    "user_*"
  ]
}
```

### Best Practice

Use the most restrictive permissions possible. Avoid "any" when you can specify exact URLs or cookie names.

## Template Testing

### Writing Tests

```javascript
// Test successful execution
scenarios:
- name: Tag fires successfully
  code: |-
    const mockData = {
      endpoint: 'https://example.com/api',
      eventName: 'test_event'
    };

    runCode(mockData);

    assertApi('gtmOnSuccess').wasCalled();
    assertApi('sendHttpRequest').wasCalledWith(
      'https://example.com/api',
      assertThat.objectContaining({method: 'POST'})
    );
```

### Test APIs

```javascript
// Run template code
runCode(mockData);

// Assert API called
assertApi('sendPixel').wasCalled();
assertApi('sendPixel').wasCalledWith(expectedUrl);

// Assert value
assertThat(result).isEqualTo('expected');
assertThat(result).isNotEqualTo('unexpected');

// Mock API
mock('getCookieValues', function(name) {
  if (name === 'session_id') {
    return ['abc123'];
  }
  return [];
});

// Fail test
fail('This should not happen');
```

### Test Patterns

**Test Success Path**:

```javascript
const mockData = {
  pixelUrl: 'https://example.com/pixel',
  eventName: 'purchase'
};

runCode(mockData);
assertApi('gtmOnSuccess').wasCalled();
```

**Test Failure Path**:

```javascript
mock('sendPixel', function(url, onSuccess, onFailure) {
  onFailure();
});

runCode(mockData);
assertApi('gtmOnFailure').wasCalled();
```

**Test Variable Return**:

```javascript
mock('getCookieValues', function() {
  return ['test_value'];
});

const result = runCode({cookieName: 'test'});
assertThat(result).isEqualTo('test_value');
```

## Error Handling

```javascript
const sendHttpRequest = require('sendHttpRequest');
const logToConsole = require('logToConsole');

sendHttpRequest(data.endpoint)
  .then(function(response) {
    logToConsole('Success:', response);
    data.gtmOnSuccess();
  })
  .catch(function(error) {
    logToConsole('Error:', error);
    data.gtmOnFailure();
  });
```

## Data Validation

```javascript
const makeNumber = require('makeNumber');
const getType = require('getType');
const logToConsole = require('logToConsole');

// Validate input exists
if (getType(data.value) === 'undefined') {
  logToConsole('Missing required value');
  data.gtmOnFailure();
  return;
}

// Convert and validate
var numValue = makeNumber(data.value);
if (numValue === undefined) {
  logToConsole('Invalid number');
  data.gtmOnFailure();
  return;
}

// Continue with valid data
data.gtmOnSuccess();
```

## Publishing to Community Gallery

### Preparation

1. **Complete Template Info**
   - Descriptive name and description
   - Appropriate categories
   - Brand information
   - Thumbnail image (optional)

2. **Comprehensive Tests**
   - Test all code paths
   - Test error handling
   - Test edge cases

3. **Documentation**
   - Clear field descriptions
   - Help text for complex fields
   - Notes section with usage instructions

### Submission

1. Export template from GTM
2. Submit to Community Template Gallery
3. Address reviewer feedback
4. Template becomes publicly available

## Converting Regular JS to Sandboxed JS

### Direct DOM Access

```javascript
// Regular JavaScript (won't work)
document.getElementById('element');

// Sandboxed JavaScript
// Not directly possible - use callInWindow or copyFromWindow
```

### Window Access

```javascript
// Regular JavaScript
window.dataLayer.push({});

// Sandboxed JavaScript
const callInWindow = require('callInWindow');
callInWindow('dataLayer.push', {event: 'custom'});
```

### HTTP Requests

```javascript
// Regular JavaScript
var xhr = new XMLHttpRequest();

// Sandboxed JavaScript
const sendHttpRequest = require('sendHttpRequest');
sendHttpRequest(url, {method: 'GET'})
  .then(data.gtmOnSuccess)
  .catch(data.gtmOnFailure);
```

## Quick Reference

| Task | API |
|------|-----|
| Send pixel | `sendPixel(url, onSuccess, onFailure)` |
| HTTP request | `sendHttpRequest(url, options, body)` |
| Inject script | `injectScript(url, onSuccess, onFailure)` |
| Read cookie | `getCookieValues(name)` |
| Set cookie | `setCookie(name, value, options)` |
| Read data layer | `copyFromDataLayer(key)` |
| Get URL | `getUrl(component)` |
| Parse URL | `parseUrl(url)` |
| Encode URL | `encodeUriComponent(str)` |
| Parse JSON | `JSON.parse(str)` |
| Stringify JSON | `JSON.stringify(obj)` |
| Log to console | `logToConsole(message)` |
| Check type | `getType(value)` |
| Query permission | `queryPermission(permission, arg)` |

## Resources

- [Custom Templates Guide](https://developers.google.com/tag-platform/tag-manager/templates)
- [Sandboxed JavaScript API](https://developers.google.com/tag-platform/tag-manager/templates/api)
- [Community Template Gallery](https://tagmanager.google.com/gallery/)
- [Template Testing](https://developers.google.com/tag-platform/tag-manager/templates/tests)
