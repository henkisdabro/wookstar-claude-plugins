# GA4 Measurement Protocol

Complete guide to GA4 Measurement Protocol for server-side event tracking.

## Overview

The GA4 Measurement Protocol allows server-side event collection, enabling data transmission to GA4 from any HTTP-capable environment including backend servers, mobile app backends, kiosks, and IoT devices.

## When to Use Measurement Protocol

| Use Case | Description |
|----------|-------------|
| Server-side tracking | Events from backend systems |
| Offline conversions | Import CRM/POS data |
| Payment processing | Track post-checkout events |
| Subscription renewals | Server-initiated events |
| Lead enrichment | Enhance leads from backend |
| IoT devices | Non-browser environments |
| Headless architectures | API-first systems |

## API Endpoints

### Production Endpoint

```
POST https://www.google-analytics.com/mp/collect
```

### Debug Endpoint

```
POST https://www.google-analytics.com/debug/mp/collect
```

**Key Difference:** Debug returns validation messages without storing data.

## Authentication

### Required Credentials

1. **Measurement ID** (G-XXXXXXXXXX)
   - Location: GA4 Admin -> Data Streams -> Web Stream

2. **API Secret**
   - Location: Data Streams -> Measurement Protocol API secrets

### Generating API Secret

1. GA4 Admin -> Data Streams
2. Click your data stream
3. Scroll to "Measurement Protocol API secrets"
4. Click "Create"
5. Enter nickname (e.g., "Server-side tracking")
6. Click "Create"
7. **Copy secret immediately** (shown once only)
8. Store securely

## Request Structure

### URL Format

```
https://www.google-analytics.com/mp/collect?measurement_id={MEASUREMENT_ID}&api_secret={API_SECRET}
```

### Headers

```
Content-Type: application/json
```

### Request Body (JSON)

```json
{
  "client_id": "unique_client_identifier",
  "user_id": "optional_user_id",
  "timestamp_micros": "1234567890123456",
  "user_properties": {
    "property_name": {
      "value": "property_value"
    }
  },
  "consent": {
    "ad_storage": "granted",
    "analytics_storage": "granted"
  },
  "events": [
    {
      "name": "event_name",
      "params": {
        "parameter_name": "parameter_value",
        "value": 123.45,
        "currency": "USD"
      }
    }
  ]
}
```

## Required and Optional Fields

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| client_id | string | Unique client identifier (UUID recommended) |
| events | array | Array of event objects (max 25) |
| events[].name | string | Event name (max 40 chars) |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| user_id | string | User ID for cross-device |
| timestamp_micros | integer | Event timestamp (microseconds) |
| user_properties | object | User-level properties |
| consent | object | Consent status |
| non_personalized_ads | boolean | Disable ad personalisation |

## Common Event Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| session_id | string | Session identifier |
| engagement_time_msec | integer | Engagement time (ms) |
| page_location | string | Full URL |
| page_title | string | Page title |
| value | number | Monetary value |
| currency | string | ISO 4217 code |
| transaction_id | string | Unique transaction ID |
| items | array | E-commerce items |

## Implementation Examples

### Python Implementation

**Using Requests Library:**

```python
import requests
import json
import uuid

MEASUREMENT_ID = "G-XXXXXXXXXX"
API_SECRET = "your_api_secret"
ENDPOINT = f"https://www.google-analytics.com/mp/collect?measurement_id={MEASUREMENT_ID}&api_secret={API_SECRET}"

def send_event(client_id, event_name, params=None):
    payload = {
        "client_id": client_id,
        "events": [{
            "name": event_name,
            "params": params or {}
        }]
    }

    response = requests.post(
        ENDPOINT,
        headers={"Content-Type": "application/json"},
        data=json.dumps(payload)
    )

    return response.status_code == 204

# Send page view
send_event(
    client_id="user_123.session_456",
    event_name="page_view",
    params={
        "page_location": "https://example.com/page",
        "page_title": "Example Page"
    }
)

# Send purchase
send_event(
    client_id="user_123.session_456",
    event_name="purchase",
    params={
        "transaction_id": "T_12345",
        "value": 99.99,
        "currency": "USD",
        "items": [{
            "item_id": "SKU_123",
            "item_name": "Product Name",
            "price": 99.99,
            "quantity": 1
        }]
    }
)
```

**Using ga4mp Library:**

```python
# Install: pip install ga4mp
from ga4mp import GtagMP

ga = GtagMP(
    measurement_id="G-XXXXXXXXXX",
    api_secret="your_api_secret",
    client_id="unique_client_id"
)

# Send event
ga.send_event(
    event_name="purchase",
    event_parameters={
        "transaction_id": "T_12345",
        "value": 99.99,
        "currency": "USD",
        "items": [{
            "item_id": "SKU_123",
            "item_name": "Product Name",
            "price": 99.99,
            "quantity": 1
        }]
    }
)
```

### Node.js Implementation

```javascript
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const MEASUREMENT_ID = 'G-XXXXXXXXXX';
const API_SECRET = 'your_api_secret';
const ENDPOINT = `https://www.google-analytics.com/mp/collect?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`;

async function sendEvent(clientId, eventName, params = {}) {
  const payload = {
    client_id: clientId,
    events: [{
      name: eventName,
      params: params
    }]
  };

  try {
    const response = await axios.post(ENDPOINT, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.status === 204;
  } catch (error) {
    console.error('Error sending event:', error);
    return false;
  }
}

// Send purchase event
sendEvent('client_123', 'purchase', {
  transaction_id: 'T_12345',
  value: 99.99,
  currency: 'USD',
  items: [{
    item_id: 'SKU_123',
    item_name: 'Product',
    price: 99.99,
    quantity: 1
  }]
});
```

### PHP Implementation

```php
<?php
// Using php-GA4-Measurement-Protocol library
// Install: composer require br33f/php-ga4-measurement-protocol

use Br33f\Ga4\MeasurementProtocol\Dto\Event\PurchaseEvent;
use Br33f\Ga4\MeasurementProtocol\Dto\Request\MeasurementRequest;
use Br33f\Ga4\MeasurementProtocol\Service;

$measurementId = 'G-XXXXXXXXXX';
$apiSecret = 'your_api_secret';

$service = new Service($apiSecret, $measurementId);

$event = new PurchaseEvent();
$event->setTransactionId('T_12345')
      ->setValue(99.99)
      ->setCurrency('USD');

$request = new MeasurementRequest();
$request->setClientId('unique_client_id')
        ->addEvent($event);

$service->send($request);
?>
```

### cURL Example

```bash
curl -X POST "https://www.google-analytics.com/mp/collect?measurement_id=G-XXXXXXXXXX&api_secret=YOUR_SECRET" \
-H "Content-Type: application/json" \
-d '{
  "client_id": "client_123",
  "events": [{
    "name": "purchase",
    "params": {
      "transaction_id": "T_12345",
      "value": 99.99,
      "currency": "USD"
    }
  }]
}'
```

## Validation with Debug Endpoint

### Send to Debug Endpoint

```bash
curl -X POST "https://www.google-analytics.com/debug/mp/collect?measurement_id=G-XXXXXXXXXX&api_secret=YOUR_SECRET" \
-H "Content-Type: application/json" \
-d '{
  "client_id": "test_client",
  "events": [{
    "name": "test_event",
    "params": {
      "test_param": "test_value"
    }
  }]
}'
```

### Response Format

```json
{
  "validationMessages": [
    {
      "fieldPath": "events[0].name",
      "description": "Event name must be 40 characters or fewer",
      "validationCode": "NAME_INVALID"
    }
  ]
}
```

### Empty Response = Valid

- No validationMessages = payload valid
- Status 200 = request processed
- Production returns 204 (no content)

## Validation Codes

| Code | Description | Fix |
|------|-------------|-----|
| NAME_INVALID | Invalid event/parameter name | snake_case, max 40 chars |
| NAME_RESERVED | Reserved name used | Check reserved names |
| VALUE_INVALID | Invalid parameter value | Check data type |
| VALUE_REQUIRED | Required value missing | Add required parameter |
| VALUE_OUT_OF_BOUNDS | Value exceeds limits | Check numeric ranges |
| EXCEEDED_MAX_ENTITIES | Too many events | Max 25 per request |

## Best Practices

### 1. Always Validate First

```python
DEBUG_ENDPOINT = f"https://www.google-analytics.com/debug/mp/collect?measurement_id={MEASUREMENT_ID}&api_secret={API_SECRET}"

def validate_event(payload):
    response = requests.post(
        DEBUG_ENDPOINT,
        headers={"Content-Type": "application/json"},
        data=json.dumps(payload)
    )
    return response.json()
```

### 2. Use Consistent client_id

- Same user = same client_id across sessions
- Store in database for logged-in users
- Use UUID format for anonymity

### 3. Include session_id

- Maintain session continuity
- Generate unique session ID
- Keep consistent within session

### 4. Batch Events

```python
payload = {
    "client_id": "client_123",
    "events": [
        {"name": "event_1", "params": {}},
        {"name": "event_2", "params": {}},
        {"name": "event_3", "params": {}}
    ]  # Up to 25 events per request
}
```

### 5. Handle Errors Gracefully

```python
def send_with_retry(payload, max_retries=3):
    for attempt in range(max_retries):
        try:
            response = requests.post(ENDPOINT, json=payload)
            if response.status_code == 204:
                return True
        except Exception as e:
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)  # Exponential backoff
            else:
                log_error(e, payload)
    return False
```

### 6. Set Proper Timestamps

```python
import time

# For historical data (max 3 days past)
timestamp_micros = int(time.time() * 1_000_000)

payload = {
    "client_id": "client_123",
    "timestamp_micros": str(timestamp_micros),
    "events": [...]
}
```

### 7. Respect Consent

```python
payload = {
    "client_id": "client_123",
    "consent": {
        "ad_storage": "denied",
        "analytics_storage": "granted"
    },
    "events": [...]
}
```

## Limits

| Limit | Value |
|-------|-------|
| Events per request | 25 |
| Event name length | 40 characters |
| Parameter name length | 40 characters |
| Parameter value length | 100 characters |
| Parameters per event | 25 |
| User properties per request | 25 |
| Timestamp range | 3 days past, 72 hours future |

## Common Issues

### Events Not Appearing

**Causes:**
- Wrong Measurement ID
- Invalid API secret
- Validation errors
- Consent blocking

**Solutions:**
1. Validate with debug endpoint
2. Verify credentials
3. Check consent parameters

### Duplicate Events

**Causes:**
- Same request sent multiple times
- Missing deduplication logic

**Solutions:**
1. Implement idempotency
2. Track sent events
3. Use unique transaction IDs

### Missing User Association

**Cause:** Different client_id values

**Solution:** Store and reuse client_id from frontend

## Quick Reference

### Endpoint

```
Production: /mp/collect
Debug: /debug/mp/collect
```

### Required Fields

- client_id (UUID recommended)
- events array
- event name

### Max Limits

- 25 events per request
- 40 characters per event name
- 25 parameters per event
- 25 user properties per request

### Validation

- Send to debug endpoint
- Empty response = valid
- Check validationMessages array
