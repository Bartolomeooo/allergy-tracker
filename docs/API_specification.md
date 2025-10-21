# API Specification — Allergy Tracker

This document describes the frontend-to-backend REST API contract used by the Allergy Tracker application.

It defines all endpoints currently implemented in the frontend mock layer (MSW) and expected behavior for the real backend implementation.

---

## Endpoints Overview

| Method | Path                | Description                     |
|:-------|:--------------------|:--------------------------------|
| GET    | `/api/exposure-types` | Returns available exposure (allergen) types |
| GET    | `/api/entries`        | Returns all user journal entries |
| POST   | `/api/entries`        | Creates a new journal entry |

---

## GET `/api/exposure-types`

### Description
Returns a list of allergen/exposure types that the user can select when adding a journal entry.

### Example Response — `200 OK`
```json
[
  {"id": 1, "name": "Birch"},
  {"id": 2, "name": "Cat"},
  {"id": 3, "name": "Dust"},
  {"id": 4, "name": "Dog"},
  {"id": 5, "name": "Strawberry"}
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

