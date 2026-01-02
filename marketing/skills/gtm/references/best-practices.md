# GTM Best Practices

**Sources**:

- <https://developers.google.com/tag-platform/tag-manager>
- <https://support.google.com/tagmanager>

**Last Updated**: 2025-01-09

## Overview

This guide covers best practices for Google Tag Manager including naming conventions, performance optimisation, security, privacy compliance, and deployment strategies. Following these practices ensures maintainable, secure, and efficient GTM implementations.

## Technical Constraints

### JavaScript (ES5 Requirement)

**Critical**: GTM Custom JavaScript Variables and Custom HTML Tags require ECMAScript 5 (ES5) syntax.

#### ES6 Features NOT Supported

```javascript
// WILL FAIL - ES6 syntax
const myVar = 'value';
let count = 0;
const arrow = () => console.log('test');
const template = `Hello ${name}`;

// CORRECT - ES5 syntax
var myVar = 'value';
var count = 0;
var regularFunc = function() { console.log('test'); };
var concatenated = 'Hello ' + name;
```

#### Custom Templates Exception

Custom Templates (sandboxed JavaScript) support some ES6 features:

- `const` and `let` declarations
- Template literals
- Limited modern JavaScript features

#### Workarounds

**Option 1: Transpilation (Recommended)**

Use BabelJS to transpile ES6+ to ES5 before pasting into GTM.

**Option 2: text/gtmscript Tag**

Bypass GTM's syntax checking (use with caution):

```html
<script type="text/gtmscript">
  // Modern JavaScript here - no syntax validation in GTM UI
  const myModernCode = () => {
    // ...
  };
</script>
```

**Caveats**:

- No syntax highlighting in GTM interface
- No error checking until runtime
- Harder to debug

### Regular Expressions (RE2 Format)

**Critical**: GTM uses RE2 (GoLang regex), NOT standard JavaScript/PCRE regex.

#### Not Supported in RE2

- Backreferences: `\1`, `\2`
- Lookahead: `(?=...)`, `(?!...)`
- Lookbehind: `(?<=...)`, `(?<!...)`
- Conditional expressions
- Possessive quantifiers

#### Supported in RE2

- Character classes: `[abc]`, `[^abc]`, `[a-z]`
- Quantifiers: `*`, `+`, `?`, `{n,m}`
- Anchors: `^`, `$`, `\A`, `\z`
- Perl character classes: `\d`, `\w`, `\s`
- Groups: `(...)`, `(?:...)` (non-capturing)
- Named groups: `(?P<name>...)`
- Alternation: `|`
- Case-insensitive flag: `(?i)`

#### Common RE2 Patterns

```regex
# Match product pages
^/products/[^/]+$

# Category with ID
^/category/\d+

# Case-insensitive matching
(?i)^/checkout

# Multiple domains
^https://(www\.)?example\.(com|net)
```

## Naming Conventions

### Tags

Format: `[Platform] - [Type] - [Description]`

**Examples**:

- `GA4 - Config - Main Property`
- `GA4 - Event - Form Submit`
- `GA4 - Event - Purchase Complete`
- `Google Ads - Conversion - Form Submit`
- `Google Ads - Remarketing - All Pages`
- `FB - Pixel - Page View`
- `LinkedIn - Insight - All Pages`
- `Custom - Hotjar - Initialisation`

### Triggers

Format: `[Event Type] - [Description]`

**Examples**:

- `Pageview - All Pages`
- `Pageview - Product Pages`
- `Click - CTA Buttons`
- `Click - Outbound Links`
- `Form - Contact Form`
- `Custom Event - Purchase`
- `Scroll - 50% Blog Posts`
- `Timer - 30 Seconds`
- `History Change - All`

### Variables

Format: `[Type] - [Description]`

**Prefixes**:

- `DL` - Data Layer Variable
- `CJS` - Custom JavaScript
- `JS` - JavaScript Variable
- `Const` - Constant
- `Lookup` - Lookup Table
- `Regex` - Regex Table
- `URL` - URL Variable
- `Cookie` - First Party Cookie
- `DOM` - DOM Element

**Examples**:

- `DL - User ID`
- `DL - Transaction Total`
- `DL - Product Name`
- `CJS - Page Category`
- `CJS - Formatted Price`
- `Const - GA4 Measurement ID`
- `Const - FB Pixel ID`
- `URL - UTM Source`
- `Cookie - Session ID`
- `Lookup - Page Type`

### Folders

Organise by platform or purpose:

```
Analytics/
  GA4 Tags
  GA4 Triggers
  GA4 Variables
Advertising/
  Google Ads
  Facebook
  LinkedIn
Utilities/
  Error Tracking
  Performance Monitoring
Testing/
  Development Tags
```

## Container Organisation

### Workspace Management

**Development Workflow**:

1. Create workspace for each feature/change
2. Name workspace descriptively: `Add GA4 Ecommerce Tracking`
3. Work in isolation
4. Test thoroughly in Preview mode
5. Submit for review
6. Merge and publish

**Best Practices**:

- One feature per workspace
- Regular cleanup of abandoned workspaces
- Clear workspace descriptions
- Resolve conflicts promptly

### Version Control

**Version Naming**:

```
v[Major].[Minor] - [Description]
```

**Examples**:

- `v1.0 - Initial GTM Setup`
- `v1.1 - Add GA4 Ecommerce`
- `v2.0 - Major Restructure`
- `v2.1 - Fix Checkout Tracking`

**Version Notes Template**:

```
Changes:
- Added GA4 purchase event tracking
- Updated data layer structure for checkout
- Fixed duplicate page view issue

Testing:
- Verified in dev environment
- Tested all checkout flows
- Confirmed data in GA4 DebugView

Tags Added:
- GA4 - Event - Purchase Complete

Tags Modified:
- GA4 - Event - Add to Cart (updated parameters)
```

### User Permissions

**Permission Levels**:

- **No Access**: External users
- **Read**: Stakeholders, analysts (view only)
- **Edit**: Developers, marketers
- **Approve**: Senior developers, managers
- **Publish**: Select trusted users only

## Performance Optimisation

### Tag Load Order

Use tag firing priority (higher numbers fire first):

```
100 - Critical tags (error tracking, consent)
50  - Analytics tags (GA4, Adobe)
25  - Marketing tags (ads pixels)
10  - Third-party tags
0   - Default
```

### Minimise Custom HTML

**Prefer** (in order):

1. Built-in tags (GA4, Google Ads)
2. Community Gallery templates
3. Custom templates
4. Custom HTML (last resort)

**Why**:

- Built-in tags are optimised
- Less maintenance
- Better performance
- Reduced security risk

### Tag Timeout

Configure timeout in Admin > Container Settings > Tag Settings:

- Default: 2000ms (2 seconds)
- Recommended: 3000-5000ms for complex tags

**Prevents**:

- Tags blocking page indefinitely
- Poor user experience
- False abandonment metrics

### Container Size

Keep container lean:

- Remove unused tags, triggers, variables
- Consolidate duplicate functionality
- Audit quarterly
- Monitor container size

## Security Best Practices

### Custom HTML Security

**Security Checklist**:

- [ ] No dangerous functions with user input
- [ ] No document.write() with external sources
- [ ] Validate all external script sources
- [ ] Review third-party tag code
- [ ] Use CSP (Content Security Policy) headers

### Data Layer Security

**Never Push PII**:

```javascript
// NEVER DO THIS
dataLayer.push({
  'email': 'user@example.com',
  'phone': '+1234567890'
});

// HASH OR PSEUDONYMISE
dataLayer.push({
  'userIdHash': sha256('user@example.com'),
  'hasPhone': true
});
```

### Template Permissions

Review custom template permissions:

- Access to APIs
- Access to global variables
- Access to local storage
- Network requests

Grant minimum necessary permissions.

## Quality Assurance

### Testing Checklist

**Before Publishing**:

- [ ] Preview mode testing completed
- [ ] All triggers fire correctly
- [ ] Data layer variables populate
- [ ] Tags send expected data
- [ ] No console errors
- [ ] Cross-browser testing
- [ ] Mobile testing
- [ ] Edge case scenarios tested

### Debug Workflow

1. Enable Preview Mode
2. Navigate to test page
3. Verify in Debug Panel:
   - Tags Fired
   - Tags Not Fired
   - Data Layer
   - Variables
4. Check receiving platform (GA4, Google Ads, etc.)
5. Test edge cases

## Deployment Best Practices

### Publishing Workflow

1. **Development**: Test in development workspace
2. **Staging**: Test in staging environment
3. **Preview**: Final check in preview mode
4. **Publish**: Publish to live container
5. **Monitor**: Watch for errors/issues

### Emergency Rollback

**Quick Rollback**:

Versions > Previous Version > Actions > Publish

**Keep**:

- Last 3 working versions readily accessible
- Emergency contact list
- Rollback documentation

### Production Deployment Checklist

- [ ] Workspace approved by team lead
- [ ] All tests passing
- [ ] Change documented in version notes
- [ ] Stakeholders notified
- [ ] Monitoring in place
- [ ] Rollback plan ready

## Maintenance

### Regular Audits

**Quarterly Review**:

- Remove unused tags/triggers/variables
- Update deprecated features
- Review tag performance
- Check for duplicate tracking
- Verify naming consistency

### Performance Monitoring

**Monitor**:

- Page load time impact
- Tag load time
- Failed tags
- Timeout events
- Error rates

**Tools**:

- Google Tag Assistant
- Chrome DevTools
- GTM Debug Panel
- GA4 DebugView

### Version Cleanup

**Retention Policy**:

- Keep last 10-15 versions
- Archive old versions
- Document reason for major changes
- Maintain change history

## Documentation

### External Documentation

**Maintain**:

1. **GTM Implementation Guide**
   - Container architecture
   - Tag inventory
   - Trigger mapping
   - Variable dictionary
   - Data layer specification

2. **Change Log**
   - Date of change
   - Description
   - Who made the change
   - Reason for change

3. **Troubleshooting Guide**
   - Common issues
   - Solutions
   - Contact information

## Resources

- [GTM Developer Documentation](https://developers.google.com/tag-platform/tag-manager)
- [GTM Help Center](https://support.google.com/tagmanager)
- [GTM Community](https://support.google.com/tagmanager/community)
- [RE2 Regex Syntax](https://github.com/google/re2/wiki/Syntax)
