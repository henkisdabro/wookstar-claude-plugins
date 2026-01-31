# GTM API Automation

**Sources**:

- <https://developers.google.com/tag-platform/tag-manager/api/v2>
- <https://developers.google.com/tag-platform/tag-manager/api/v2/devguide>

**Last Updated**: 2025-01-09

## Overview

The Google Tag Manager API provides programmatic access to GTM configuration data. With this API, you can automate tag management tasks, including creating containers, managing tags, triggers, variables, and publishing container versions. This guide covers authentication, common operations, and automation patterns.

## Why Use the GTM API?

**Benefits**:

- **Automation**: Automate repetitive tasks
- **Scalability**: Manage multiple containers programmatically
- **Integration**: Integrate GTM with existing workflows and CI/CD
- **Version Control**: Implement custom deployment workflows
- **Bulk Operations**: Create, update, or delete resources in bulk

**Common Use Cases**:

- Deploy standard configurations across multiple containers
- Implement custom approval workflows
- Sync GTM configurations with external systems
- Create automated testing for tag configurations
- Build custom GTM management interfaces
- Backup and restore container configurations

## API Resource Hierarchy

```
Account (accounts/123456)
  +-- Container (accounts/123456/containers/7890)
      +-- Workspace (accounts/123456/containers/7890/workspaces/1)
      |   +-- Tags
      |   +-- Triggers
      |   +-- Variables
      |   +-- Folders
      +-- Versions
      +-- Environments
```

## Authentication

### OAuth 2.0 Scopes

```
https://www.googleapis.com/auth/tagmanager.readonly
Read-only access to all GTM data

https://www.googleapis.com/auth/tagmanager.edit.containers
Edit access to container configurations

https://www.googleapis.com/auth/tagmanager.delete.containers
Permission to delete containers

https://www.googleapis.com/auth/tagmanager.edit.containerversions
Create and modify container versions

https://www.googleapis.com/auth/tagmanager.publish
Publish container versions

https://www.googleapis.com/auth/tagmanager.manage.users
Manage user permissions

https://www.googleapis.com/auth/tagmanager.manage.accounts
Full account access
```

### Setup Steps

1. Create a Project in Google Cloud Console
2. Enable the GTM API for your project
3. Create OAuth 2.0 Credentials:
   - For web apps: OAuth 2.0 Client ID
   - For server apps: Service Account
4. Download credentials JSON file
5. Implement OAuth flow in your application

### Python Setup

```python
from google.oauth2 import service_account
from googleapiclient.discovery import build

SCOPES = ['https://www.googleapis.com/auth/tagmanager.edit.containers']
SERVICE_ACCOUNT_FILE = 'service-account-key.json'

credentials = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE, scopes=SCOPES)

service = build('tagmanager', 'v2', credentials=credentials)
```

### Node.js Setup

```javascript
const {google} = require('googleapis');

const auth = new google.auth.GoogleAuth({
  keyFile: 'service-account-key.json',
  scopes: ['https://www.googleapis.com/auth/tagmanager.edit.containers']
});

const tagmanager = google.tagmanager({version: 'v2', auth});
```

## Common Operations

### List Accounts

```python
accounts = service.accounts().list().execute()

for account in accounts.get('account', []):
    print(f"Account: {account['name']} ({account['accountId']})")
```

### List Containers

```python
account_path = 'accounts/123456'
containers = service.accounts().containers().list(
    parent=account_path
).execute()

for container in containers.get('container', []):
    print(f"Container: {container['name']} ({container['containerId']})")
```

### Create Workspace

```python
container_path = 'accounts/123456/containers/7890'
workspace = service.accounts().containers().workspaces().create(
    parent=container_path,
    body={'name': 'API Workspace', 'description': 'Created via API'}
).execute()

workspace_path = workspace['path']
```

### Create Trigger

```python
trigger_body = {
    'name': 'All Pages',
    'type': 'PAGEVIEW'
}

trigger = service.accounts().containers().workspaces().triggers().create(
    parent=workspace_path,
    body=trigger_body
).execute()
```

### Create Tag

```python
tag_body = {
    'name': 'GA4 Config',
    'type': 'gaawe',
    'parameter': [
        {'key': 'measurementId', 'type': 'template', 'value': 'G-XXXXXXXXXX'}
    ],
    'firingTriggerId': [trigger['triggerId']]
}

tag = service.accounts().containers().workspaces().tags().create(
    parent=workspace_path,
    body=tag_body
).execute()
```

### Create Variable

```python
variable_body = {
    'name': 'DL - User ID',
    'type': 'v',  # Data Layer Variable
    'parameter': [
        {'key': 'name', 'type': 'template', 'value': 'userId'},
        {'key': 'dataLayerVersion', 'type': 'integer', 'value': '2'}
    ]
}

variable = service.accounts().containers().workspaces().variables().create(
    parent=workspace_path,
    body=variable_body
).execute()
```

### Create and Publish Version

```python
# Create version
version = service.accounts().containers().workspaces().create_version(
    path=workspace_path,
    body={'name': 'API Version', 'notes': 'Auto-deployed via API'}
).execute()

# Publish version
published = service.accounts().containers().versions().publish(
    path=version['containerVersion']['path']
).execute()

print(f"Published version: {published['containerVersion']['containerVersionId']}")
```

## Automation Patterns

### Backup Container

```python
import json

def backup_container(service, workspace_path, output_file):
    # Get all resources
    tags = service.accounts().containers().workspaces().tags().list(
        parent=workspace_path
    ).execute()

    triggers = service.accounts().containers().workspaces().triggers().list(
        parent=workspace_path
    ).execute()

    variables = service.accounts().containers().workspaces().variables().list(
        parent=workspace_path
    ).execute()

    # Save to file
    backup = {
        'tags': tags.get('tag', []),
        'triggers': triggers.get('trigger', []),
        'variables': variables.get('variable', []),
        'backup_date': datetime.now().isoformat()
    }

    with open(output_file, 'w') as f:
        json.dump(backup, f, indent=2)

    print(f"Backup saved to {output_file}")
```

### Bulk Tag Operations

```python
def disable_all_tags(service, workspace_path):
    """Pause all tags in a workspace."""
    tags = service.accounts().containers().workspaces().tags().list(
        parent=workspace_path
    ).execute()

    for tag in tags.get('tag', []):
        tag['paused'] = True
        service.accounts().containers().workspaces().tags().update(
            path=tag['path'],
            body=tag
        ).execute()
        print(f"Paused: {tag['name']}")


def enable_tags_by_prefix(service, workspace_path, prefix):
    """Enable tags matching a prefix."""
    tags = service.accounts().containers().workspaces().tags().list(
        parent=workspace_path
    ).execute()

    for tag in tags.get('tag', []):
        if tag['name'].startswith(prefix):
            tag['paused'] = False
            service.accounts().containers().workspaces().tags().update(
                path=tag['path'],
                body=tag
            ).execute()
            print(f"Enabled: {tag['name']}")
```

### Clone Tags Between Containers

```python
def clone_tags(service, source_workspace, target_workspace, tag_prefix):
    """Clone tags from one workspace to another."""
    # Get source tags
    source_tags = service.accounts().containers().workspaces().tags().list(
        parent=source_workspace
    ).execute()

    for tag in source_tags.get('tag', []):
        if tag['name'].startswith(tag_prefix):
            # Remove source-specific fields
            new_tag = {
                'name': tag['name'],
                'type': tag['type'],
                'parameter': tag.get('parameter', []),
                'firingTriggerId': tag.get('firingTriggerId', [])
            }

            # Create in target
            service.accounts().containers().workspaces().tags().create(
                parent=target_workspace,
                body=new_tag
            ).execute()
            print(f"Cloned: {tag['name']}")
```

### Automated Deployment

```python
def deploy_container(service, workspace_path, version_name, version_notes):
    """Create and publish a new container version."""
    # Create version
    version = service.accounts().containers().workspaces().create_version(
        path=workspace_path,
        body={
            'name': version_name,
            'notes': version_notes
        }
    ).execute()

    version_path = version['containerVersion']['path']

    # Publish
    published = service.accounts().containers().versions().publish(
        path=version_path
    ).execute()

    return published['containerVersion']
```

## Error Handling

```python
from googleapiclient.errors import HttpError

try:
    tag = service.accounts().containers().workspaces().tags().create(
        parent=workspace_path,
        body=tag_body
    ).execute()
except HttpError as error:
    if error.resp.status == 404:
        print("Resource not found")
    elif error.resp.status == 403:
        print("Permission denied")
    elif error.resp.status == 409:
        print("Resource already exists")
    elif error.resp.status == 429:
        print("Rate limit exceeded - retry later")
    else:
        print(f"An error occurred: {error}")
```

### Rate Limiting with Retry

```python
import time
from googleapiclient.errors import HttpError

def api_call_with_retry(func, max_retries=5):
    """Execute API call with exponential backoff."""
    for attempt in range(max_retries):
        try:
            return func()
        except HttpError as error:
            if error.resp.status == 429:  # Rate limit
                wait_time = 2 ** attempt
                print(f"Rate limited. Waiting {wait_time}s...")
                time.sleep(wait_time)
            else:
                raise

    raise Exception("Max retries exceeded")

# Usage
result = api_call_with_retry(
    lambda: service.accounts().containers().list(parent=account_path).execute()
)
```

## API Quotas

Default quotas:

- **Queries per day**: 1,000 (can be increased)
- **Queries per 100 seconds**: 100

Request quota increase via Google Cloud Console if needed.

## Resource Paths

All API operations use resource paths:

```
Account:    accounts/{account_id}
Container:  accounts/{account_id}/containers/{container_id}
Workspace:  accounts/{account_id}/containers/{container_id}/workspaces/{workspace_id}
Tag:        accounts/{account_id}/containers/{container_id}/workspaces/{workspace_id}/tags/{tag_id}
Trigger:    accounts/{account_id}/containers/{container_id}/workspaces/{workspace_id}/triggers/{trigger_id}
Variable:   accounts/{account_id}/containers/{container_id}/workspaces/{workspace_id}/variables/{variable_id}
Version:    accounts/{account_id}/containers/{container_id}/versions/{version_id}
```

Use paths from API responses rather than constructing them manually.

## Best Practices

### Use Workspaces

Always work within a workspace:

1. Create a new workspace for API changes
2. Make changes in the workspace
3. Create and publish a version when ready
4. Don't modify the default workspace

### Test Before Production

```python
# Create test workspace
test_workspace = service.accounts().containers().workspaces().create(
    parent=container_path,
    body={'name': 'API Test', 'description': 'Testing API changes'}
).execute()

# Make changes and test

# Delete if not needed
service.accounts().containers().workspaces().delete(
    path=test_workspace['path']
).execute()
```

### Version Everything

Always create versions with meaningful notes:

```python
version = service.accounts().containers().workspaces().create_version(
    path=workspace_path,
    body={
        'name': 'Release 2.3.0',
        'notes': 'Added GA4 ecommerce tracking\n- Purchase event\n- Product views'
    }
).execute()
```

### Batch Requests

For multiple operations, use batch requests:

```python
from googleapiclient.http import BatchHttpRequest

def callback(request_id, response, exception):
    if exception:
        print(f"Error: {exception}")
    else:
        print(f"Created: {response['name']}")

batch = service.new_batch_http_request(callback=callback)

for tag_data in tags_to_create:
    batch.add(service.accounts().containers().workspaces().tags().create(
        parent=workspace_path,
        body=tag_data
    ))

batch.execute()
```

## Complete Workflow Example

```python
from google.oauth2 import service_account
from googleapiclient.discovery import build

# Setup
SCOPES = ['https://www.googleapis.com/auth/tagmanager.edit.containers',
          'https://www.googleapis.com/auth/tagmanager.publish']
credentials = service_account.Credentials.from_service_account_file(
    'service-account.json', scopes=SCOPES)
service = build('tagmanager', 'v2', credentials=credentials)

# 1. Find container
account_path = 'accounts/123456'
containers = service.accounts().containers().list(parent=account_path).execute()
container = next(c for c in containers['container'] if c['name'] == 'My Site')
container_path = container['path']

# 2. Create workspace
workspace = service.accounts().containers().workspaces().create(
    parent=container_path,
    body={'name': 'API Changes', 'description': 'Automated setup'}
).execute()
workspace_path = workspace['path']

# 3. Create trigger
trigger = service.accounts().containers().workspaces().triggers().create(
    parent=workspace_path,
    body={'name': 'All Pages', 'type': 'PAGEVIEW'}
).execute()

# 4. Create tag
tag = service.accounts().containers().workspaces().tags().create(
    parent=workspace_path,
    body={
        'name': 'GA4 Config',
        'type': 'gaawe',
        'parameter': [
            {'key': 'measurementId', 'type': 'template', 'value': 'G-XXXXXX'}
        ],
        'firingTriggerId': [trigger['triggerId']]
    }
).execute()

# 5. Create and publish version
version = service.accounts().containers().workspaces().create_version(
    path=workspace_path,
    body={'name': 'API Setup', 'notes': 'Automated GA4 configuration'}
).execute()

published = service.accounts().containers().versions().publish(
    path=version['containerVersion']['path']
).execute()

print(f"Published version: {published['containerVersion']['containerVersionId']}")
```

## Quick Reference

| Operation | Method |
|-----------|--------|
| List | `.list(parent=parent_path)` |
| Get | `.get(path=resource_path)` |
| Create | `.create(parent=parent_path, body=resource_body)` |
| Update | `.update(path=resource_path, body=resource_body)` |
| Delete | `.delete(path=resource_path)` |
| Publish | `.create_version()` then `.publish()` |

## Installation

```bash
# Python
pip install google-api-python-client google-auth-oauthlib

# Node.js
npm install googleapis
```

## Resources

- [GTM API Reference](https://developers.google.com/tag-platform/tag-manager/api/v2/reference)
- [GTM API Developer Guide](https://developers.google.com/tag-platform/tag-manager/api/v2/devguide)
- [OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Python Client Library](https://github.com/googleapis/google-api-python-client)
- [Tag Dictionary Reference](https://developers.google.com/tag-platform/tag-manager/api/v2/tag-dictionary-reference)
