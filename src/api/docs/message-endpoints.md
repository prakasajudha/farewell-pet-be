# Message API Endpoints

## Overview
This document describes the message-related API endpoints and their response formats.

## Endpoints

### 1. Get Non-Private Messages
**GET** `/v1/message/not-private`

**Description**: Retrieves all non-private (public) messages

**Headers**:
```
Authorization: Bearer <token>
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "message": "Message content",
      "is_private": false,
      "is_favorited": false,
      "version": 1,
      "created_by": "sender_nickname",
      "created_at": "2025-01-15T10:30:00.000Z",
      "sender": {
      },
      "recipient": {
        "name": "Recipient Name"
      }
    }
  ],
  "message": "Non-private messages retrieved successfully"
}
```

### 2. Get User Messages
**GET** `/v1/message/my-messages`

**Description**: Retrieves all messages received by the authenticated user

**Headers**:
```
Authorization: Bearer <token>
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "message": "Message content",
      "is_private": true,
      "is_favorited": false,
      "version": 1,
      "created_by": "sender_nickname",
      "created_at": "2025-01-15T10:30:00.000Z",
      "sender": {
      },
      "recipient": {
        "name": "Recipient Name"
      }
    }
  ],
  "message": "User messages retrieved successfully"
}
```

### 3. Get Favorited Messages
**GET** `/v1/message/favorites`

**Description**: Retrieves all favorited messages

**Headers**:
```
Authorization: Bearer <token>
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "message": "Message content",
      "is_private": false,
      "is_favorited": true,
      "version": 1,
      "created_by": "sender_nickname",
      "created_at": "2025-01-15T10:30:00.000Z",
      "sender": {
      },
      "recipient": {
        "name": "Recipient Name"
      }
    }
  ],
  "message": "Favorited messages retrieved successfully"
}
```

### 4. Create Message
**POST** `/v1/message/create`

**Description**: Creates a new message

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "recipient_to": "recipient_user_id",
  "is_private": true,
  "message": "Message content"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "message": "Message content",
    "is_private": true,
    "is_favorited": false,
    "version": 1,
    "created_by": "sender_nickname",
    "created_at": "2025-01-15T10:30:00.000Z",
    "sender": {
      "nickname": "sender_nickname"
    },
    "recipient": {
      "name": "Recipient Name"
    }
  },
  "message": "Message created successfully"
}
```

### 5. Toggle Favorite
**POST** `/v1/message/toggle-favorite`

**Description**: Toggles the favorite status of a message

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "message_id": "message_uuid"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "is_favorited": true,
    "message": "Message content",
    "version": 1,
    "created_by": "sender_nickname",
    "created_at": "2025-01-15T10:30:00.000Z"
  },
  "message": "Message favorited successfully"
}
```

## Response Fields

### Message Object
| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique message identifier (UUID) |
| `message` | string | Message content |
| `is_private` | boolean | Whether the message is private |
| `is_favorited` | boolean | Whether the message is favorited |
| `version` | number | Message version (currently 1) |
| `created_by` | string | Nickname of the user who created the message |
| `created_at` | string | ISO timestamp when message was created |
| `sender` | object | Sender information |
| `recipient` | object | Recipient information |

### Sender Object
| Field | Type | Description |
|-------|------|-------------|
| *(empty)* | - | Sender information is now available in `created_by` field |

### Recipient Object
| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Recipient's full name |

## Notes

- All message endpoints require authentication
- The `created_by` field now contains the sender's nickname instead of UUID
- The `version` field is included for future message format compatibility
- Sensitive information (user IDs, emails) is hidden in responses
- All timestamps are in ISO 8601 format
