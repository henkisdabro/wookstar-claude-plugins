# GA4 Custom Events

Expert guidance for creating business-specific custom events beyond Google's recommended events.

## Overview

Custom events enable measurement of unique business goals, industry-specific actions, and contextual behaviours not covered by Google's recommended events. This reference covers event naming conventions, parameter design strategies, and implementation across all platforms.

## When to Use Custom Events

Create custom events when:

- Business action not covered by recommended events
- Industry-specific tracking requirements
- Unique user interactions to measure
- Business-specific conversion points
- Detailed behavioural analysis needs

## Event Naming Conventions

### Format and Constraints

| Constraint | Value |
|------------|-------|
| Case | snake_case (lowercase with underscores) |
| Maximum length | 40 characters |
| Starting character | Letter |
| Allowed characters | Letters, numbers, underscores |

### Naming Framework

```
[action]_[object]_[context]
```

**Examples:**
- product_comparison_viewed
- pricing_calculator_used
- whitepaper_downloaded
- trial_signup_completed
- support_ticket_created

### Good Event Names

| Event Name | Description |
|------------|-------------|
| demo_requested | User requested product demo |
| feature_trial_started | User started feature trial |
| integration_configured | User set up integration |
| report_exported | User exported report |
| team_member_invited | User invited team member |

### Anti-Patterns (Avoid)

| Bad Name | Problem | Better Name |
|----------|---------|-------------|
| click | Too generic | button_click |
| event1 | Not descriptive | form_submit |
| MyEvent | Wrong case | my_event |
| trackAction | Camel case | track_action |
| data | Meaningless | data_exported |

## Event Parameter Design

### Parameter Strategy

For each custom event, identify:

1. **What is the action?** The user behaviour being measured
2. **What context is needed?** Information to analyse the action
3. **What parameters provide context?** Data points to collect
4. **What are the constraints?** Length limits, data types

### Parameter Limits

| Limit | Value |
|-------|-------|
| Parameters per event | 25 |
| Parameter name length | 40 characters |
| Parameter value length | 100 characters |
| Data types | String, Integer, Float |

### Parameter Examples

**demo_requested Event:**
```javascript
gtag('event', 'demo_requested', {
  'demo_type': 'product_walkthrough',
  'industry': 'technology',
  'company_size': 'enterprise',
  'lead_source': 'organic_search',
  'product_interest': 'analytics_suite'
});
```

**course_enrollment Event:**
```javascript
gtag('event', 'course_enrollment', {
  'course_id': 'COURSE_101',
  'course_name': 'Advanced GA4',
  'instructor': 'Jane Smith',
  'price': 99.99,
  'currency': 'USD',
  'level': 'advanced',
  'duration_hours': 8
});
```

**support_ticket_created Event:**
```javascript
gtag('event', 'support_ticket_created', {
  'ticket_type': 'bug_report',
  'product': 'mobile_app',
  'severity': 'high',
  'department': 'engineering',
  'resolution_time_expected': 24
});
```

## Industry-Specific Patterns

### SaaS Events

| Event | Parameters |
|-------|------------|
| trial_started | plan_type, trial_duration, feature_count |
| trial_ended | conversion_status, days_active, features_used |
| upgrade_initiated | from_plan, to_plan, estimated_value |
| plan_downgraded | from_plan, to_plan, reason_category |
| feature_activated | feature_name, activation_method |
| integration_connected | integration_name, connection_type |
| api_key_generated | key_purpose, environment |
| workspace_created | workspace_type, team_size |

### Education Events

| Event | Parameters |
|-------|------------|
| lesson_completed | course_id, lesson_id, completion_time |
| quiz_submitted | quiz_id, score_percentage, attempts |
| certificate_earned | course_id, grade, completion_date |
| course_enrolled | course_id, enrollment_type, price |
| instructor_contacted | inquiry_type, response_time |
| resource_downloaded | resource_type, file_format |
| discussion_posted | topic_category, word_count |
| peer_review_submitted | assignment_id, rating_given |

### Media Events

| Event | Parameters |
|-------|------------|
| article_shared | article_id, share_platform, category |
| video_watched | video_id, duration, engagement_percent |
| podcast_completed | episode_id, listen_duration, completion |
| newsletter_subscribed | newsletter_type, source |
| content_bookmarked | content_id, content_type |
| author_followed | author_id, follow_source |
| comment_posted | content_id, word_count |
| paywall_reached | content_type, view_count_prior |

### E-commerce (Beyond Recommended)

| Event | Parameters |
|-------|------------|
| product_compared | products_compared, category |
| review_submitted | product_id, star_rating, has_photo |
| wishlist_shared | item_count, share_method |
| size_guide_viewed | product_category, size_selected |
| store_locator_used | postcode, results_count |
| gift_wrap_selected | wrap_type, price |
| loyalty_redeemed | points_redeemed, reward_type |
| back_in_stock_signup | product_id, notification_preference |

## Implementation Examples

### gtag.js Implementation

```javascript
// Simple event
gtag('event', 'demo_requested', {
  'demo_type': 'product_walkthrough',
  'industry': 'technology'
});

// Event with multiple parameters
gtag('event', 'subscription_changed', {
  'change_type': 'upgrade',
  'from_plan': 'basic',
  'to_plan': 'professional',
  'price_difference': 50,
  'currency': 'USD',
  'billing_cycle': 'monthly'
});
```

### GTM Data Layer Implementation

```javascript
// Push event to data layer
dataLayer.push({
  'event': 'demo_requested',
  'demo_type': 'product_walkthrough',
  'industry': 'technology',
  'company_size': 'enterprise'
});

// In GTM:
// 1. Create Data Layer Variables for each parameter
// 2. Create Custom Event trigger for 'demo_requested'
// 3. Create GA4 Event tag with mapped parameters
```

### Measurement Protocol (Server-Side)

```python
import requests
import json

MEASUREMENT_ID = "G-XXXXXXXXXX"
API_SECRET = "your_api_secret"

def send_custom_event(client_id, event_name, params):
    url = f"https://www.google-analytics.com/mp/collect?measurement_id={MEASUREMENT_ID}&api_secret={API_SECRET}"

    payload = {
        "client_id": client_id,
        "events": [{
            "name": event_name,
            "params": params
        }]
    }

    response = requests.post(
        url,
        headers={"Content-Type": "application/json"},
        data=json.dumps(payload)
    )

    return response.status_code == 204

# Example usage
send_custom_event(
    client_id="123.456",
    event_name="subscription_renewed",
    params={
        "plan_type": "professional",
        "renewal_value": 299.00,
        "currency": "USD",
        "renewal_count": 3
    }
)
```

## Registering Custom Dimensions

Custom parameters won't appear in GA4 reports until registered as custom dimensions.

### Registration Process

1. **Send parameter in event** (any platform)
2. **Verify in DebugView** (Admin -> DebugView)
3. **Register dimension:**
   - Admin -> Data Display -> Custom Definitions
   - Create Custom Dimension
   - Dimension Name: Human-friendly (e.g., "Demo Type")
   - Scope: Event, User, or Item
   - Event Parameter: Exact name from code (e.g., "demo_type")
4. **Wait 24-48 hours** for data to populate
5. **Use in reports** (Explorations, Standard Reports)

### Scope Selection

| Scope | Use For | Example |
|-------|---------|---------|
| Event | Single event data | demo_type, button_name |
| User | User attributes | subscription_tier, customer_segment |
| Item | Product data | item_color, item_size |

## Testing Custom Events

### DebugView Workflow

1. Enable debug mode:
   - Chrome extension: Google Analytics Debugger
   - URL parameter: `?debug_mode=true`
   - gtag config: `debug_mode: true`

2. Trigger custom event

3. Check DebugView:
   - Event appears with correct name
   - All parameters present
   - Parameter values correct
   - No errors or warnings

### Validation Checklist

- [ ] Event name follows snake_case
- [ ] Event name under 40 characters
- [ ] All parameters present
- [ ] Parameter names under 40 characters
- [ ] Parameter values under 100 characters
- [ ] Correct data types (string vs number)
- [ ] No PII in parameters

## Common Issues

### Event Not Appearing

**Causes:**
- Debug mode not enabled
- Wrong Measurement ID
- JavaScript error before gtag call
- Ad blocker blocking

**Solutions:**
1. Enable Google Analytics Debugger extension
2. Verify Measurement ID
3. Check browser console for errors
4. Test in incognito mode

### Parameters Missing

**Causes:**
- Parameter name typo
- Value is undefined/null
- Data layer variable not populated

**Solutions:**
1. Check exact parameter name
2. Validate value before sending
3. Debug data layer in GTM Preview

### Wrong Data Type

**Causes:**
- Sending string instead of number
- Array where string expected

**Solutions:**
1. Validate data type before sending
2. Convert values appropriately
3. Test with DebugView

## Best Practices

### Design Guidelines

1. **Be consistent** - Same event name everywhere
2. **Be descriptive** - Clear, action-oriented names
3. **Be specific** - Avoid generic catch-all events
4. **Plan parameters** - Document required vs optional
5. **Validate values** - Check before sending

### Documentation

Document each custom event:

```markdown
## Event: demo_requested

**Description:** User requested a product demonstration

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| demo_type | string | Yes | Type of demo requested |
| industry | string | No | User's industry |
| company_size | string | No | Size category |

**Example:**
gtag('event', 'demo_requested', {
  'demo_type': 'product_walkthrough',
  'industry': 'technology'
});
```

### Version Control

Track event changes:
- Document when events added/modified
- Include in code review process
- Update documentation on changes
