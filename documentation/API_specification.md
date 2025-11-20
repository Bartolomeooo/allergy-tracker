# API Specification — Allergy Tracker

This document describes the frontend-to-backend REST API contract used by the Allergy Tracker application.

It defines all endpoints currently implemented in the frontend mock layer (MSW) and expected behavior for the real backend implementation.

---

## Endpoints Overview

| Method | Path                      | Description                     |
|:-------|:--------------------------|:--------------------------------|
| GET    | `/api/exposure-types`     | Returns available exposure (allergen) types |
| GET    | `/api/entries`            | Returns all user journal entries |
| GET    | `/api/exposure-types/:id` | Returns details of a specific exposure (allergen) type  |
| GET    | `/api/entries/:id`        | Returns details of a specific journal entry  |
| POST   | `/api/entries`            | Creates a new journal entry |
| POST   | `/api/exposure-types`     | Creates a new exposure (allergen) type |
| PUT    | `/api/entries/:id`        | Updates an existing journal entry |
| DELETE | `/api/entries/:id`        | Deletes a specific journal entry |
| POST   | `/auth/login`             | Logs in a user and returns an access token |
| POST   | `/auth/register`          | Registers a new user and returns an access token |
| POST   | `/auth/refresh`           | Issues a new access token based on refresh token |
| POST   | `/auth/logout`            | Logs out the user and clears the refresh cookie |
| GET    | `/me`                     | Returns the currently authenticated user |

---

## GET `/api/exposure-types`

### Description
Returns a list of allergen/exposure types that the user can select when adding a journal entry.

### Example Response — `200 OK`
```json
[
  {
    "id": 1,
    "name": "Truskawka",
    "description": "Owoc sezonowy, często powoduje reakcje alergiczne u dzieci."
  },
  {
    "id": 2,
    "name": "Brzoza",
    "description": "Pyłek brzozy jest jedną z najczęstszych przyczyn alergii wiosennych."
  },
  {
    "id": 3,
    "name": "Kurz",
    "description": "Zawiera roztocza kurzu domowego – typowy alergen całoroczny."
  },
  {
    "id": 4,
    "name": "Kot",
    "description": "Alergeny pochodzą głównie ze śliny i sierści kota."
  },
  {
    "id": 5,
    "name": "Pies",
    "description": "Podobnie jak koty, psy wydzielają alergeny w ślinie i naskórku."
  }
]

```
---

## GET `/api/entries`

### Description
Returns a list of all allergy journal entries previously saved by the user.  
Each entry represents one observation, including the date, recorded symptoms, and exposures.

### Example Response — `200 OK`
```json
[
  {
    "id": 1,
    "occurredOn": "2025-10-21T16:41:53.514Z",
    "upperRespiratory": 2,
    "lowerRespiratory": 5,
    "skin": 1,
    "eyes": 0,
    "total": 3,
    "exposures": ["Cat"],
    "note": "Visited friends who have a cat"
  },
  {
    "id": 2,
    "occurredOn": "2025-10-14T13:21:53.514Z",
    "upperRespiratory": 4,
    "lowerRespiratory": 1,
    "skin": 0,
    "eyes": 2,
    "total": 2,
    "exposures": ["Dust"],
    "note": "Cleaning the apartment"
  },
  {
    "id": 3,
    "occurredOn": "2025-11-26T22:48:53.514Z",
    "upperRespiratory": 3,
    "lowerRespiratory": 0,
    "skin": 2,
    "eyes": 4,
    "total": 6,
    "exposures": ["Birch", "Dog"],
    "note": "Symptoms after a walk in the forest"
  }
]
```
---

## GET `/api/exposure-types/:id`

### Description
Returns detailed information about a specific exposure (allergen) type identified by its unique id.
Used when the user clicks on an exposure in the interface to view its description or related details.

### Example Response — `200 OK`
```json
  {
    "id": 4,
    "name": "Cat",
    "description": "Allergens mainly come from cat saliva and dander (shed skin particles)."
  }
```
---

## GET `/api/entries/:id`

### Description
Returns detailed information about a specific allergy journal entry identified by its unique id.
Used when the user opens an entry for editing.

### Example Response — `200 OK`
```json
{
  "id": 3,
  "occurredOn": "2025-11-26T22:48:53.514Z",
  "upperRespiratory": 3,
  "lowerRespiratory": 0,
  "skin": 2,
  "eyes": 4,
  "total": 6,
  "exposures": ["Birch", "Dog"],
  "note": "Symptoms after a walk in the forest"
}
```
---

## POST `/api/entries`

### Description
Creates and stores a new allergy journal entry.  
Each entry contains the date and time of the event, symptom intensity scores, a list of exposures, and an optional user note.

The endpoint returns the created entry object with a generated `id`.

### Example Request
```json
{
  "occurredOn": "2025-10-21T16:41:53.514Z",
  "upperRespiratory": 2,
  "lowerRespiratory": 1,
  "skin": 0,
  "eyes": 1,
  "total": 4,
  "exposures": ["Birch"],
  "note": "Symptoms after a walk in the park"
}
```

---
## POST `/api/exposure-types`

### Description
Creates and stores a new exposure (allergen) type.  
Each exposure type contains a name and an optional description

The endpoint returns the created exposure type object with a generated `id`.

### Example Request
```json
{
  "name": "Grain",
  "description": "Pollen from grains can cause seasonal allergy symptoms."
}
```

---
## PUT `/api/entries:id`

### Description
Updates an existing allergy journal entry identified by its unique id.
All fields must be provided — the record is fully replaced with the provided data.

The endpoint returns the updated entry object.

### Example Request
```json
{
  "occurredOn": "2025-11-26T22:48:53.514Z",
  "upperRespiratory": 4,
  "lowerRespiratory": 1,
  "skin": 3,
  "eyes": 2,
  "total": 10,
  "exposures": ["Birch", "Dust"],
  "note": "Adjusted after checking symptoms again."
}
```

---
## DELETE `/api/entries/:id`

### Description
Deletes an existing allergy journal entry identified by its unique `id`.
Once deleted, the entry is permanently removed from the user’s journal.

---
## POST `/auth/register`

Registers a new user and logs them in.

### Example Request
```json
{
  "email": "user@example.com",
  "password": "example"
}
```

Successful Response — `201 Created`
```
{
  "accessToken": "<jwt-like-token>",
  "user": {
    "id": "7b2a6b39-2e5a-4e55-9ef4-09c1c4f59711",
    "email": "user@example.com"
  }
}
```
Error Responses

`400 Bad Request` — invalid payload

`409 Conflict` — email already in use

```
{
"message": "Email already in use"
}
```

---
## POST `/auth/login`

Logs in an existing user.

### Example Request
```json
{
  "email": "user@example.com",
  "password": "example"
}
```

Successful Response — `200 OK`
```
{
  "accessToken": "<jwt-like-token>",
  "user": {
    "id": "7b2a6b39-2e5a-4e55-9ef4-09c1c4f59711",
    "email": "user@example.com"
  }
}
```
Error Responses

`400 Bad Request` — invalid payload

`401 Unauthorized` — invalid credentials

```
{
  "message": "Invalid credentials"
}
```

---
## POST `/auth/refresh`

Issues a new access token based on the refresh token cookie.

Successful Response — `200 OK`
```
{
  "accessToken": "<jwt-like-token>",
  }
}
```
Error Responses

`401 Unauthorized` when:
- cookie is missing:
```
{ "message": "No refresh token" }
```

- cookie is invalid:
```
{ "message": "Invalid refresh" }
```

---
## POST `/auth/logout`

Logs out the current user.

Successful Response — `204 No Content`

---
## GET `/me`

Returns the currently authenticated user.

Successful Response — `200 OK`
```
{
  "user": {
    "id": "7b2a6b39-2e5a-4e55-9ef4-09c1c4f59711",
    "email": "user@example.com"
  }
}
```
Error Responses

`401 Unauthorized` — when token is missing/invalid

`404 Not Found` — when user from token does not exist

