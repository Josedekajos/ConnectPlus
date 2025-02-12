# ConnectPlus API Documentation

## Authentication

All API endpoints require authentication. Include the user's session token in the `Authorization` header of each request.

## Endpoints

### News Feed

#### GET /api/news-feed

Retrieves the user's news feed.

**Response**

```json
[
  {
    "id": "string",
    "content": "string",
    "createdAt": "string",
    "author": {
      "id": "string",
      "name": "string",
      "image": "string"
    },
    "likes": [
      {
        "id": "string"
      }
    ],
    "comments": [
      {
        "id": "string",
        "content": "string",
        "author": {
          "id": "string",
          "name": "string",
          "image": "string"
        }
      }
    ]
  }
]

