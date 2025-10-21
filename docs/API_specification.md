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
| POST   | `/api/exposure-types`  | Creates a new exposure (allergen) type |

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
    "description": "Owoc sezonowy, często powoduje reakcje alergiczne u dzieci.",
    "imageUrl": "https://images.unsplash.com/photo-1497048679117-1a29644559c9?w=800"
  },
  {
    "id": 2,
    "name": "Brzoza",
    "description": "Pyłek brzozy jest jedną z najczęstszych przyczyn alergii wiosennych.",
    "imageUrl": "https://images.unsplash.com/photo-1582034986517-7c1b5631a88d?w=800"
  },
  {
    "id": 3,
    "name": "Kurz",
    "description": "Zawiera roztocza kurzu domowego – typowy alergen całoroczny.",
    "imageUrl": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"
  },
  {
    "id": 4,
    "name": "Kot",
    "description": "Alergeny pochodzą głównie ze śliny i sierści kota.",
    "imageUrl": "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=800"
  },
  {
    "id": 5,
    "name": "Pies",
    "description": "Podobnie jak koty, psy wydzielają alergeny w ślinie i naskórku.",
    "imageUrl": "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800"
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
Each exposure type contains a name, an optional description, and an optional image URL (for example, from Unsplash).

The endpoint returns the created exposure type object with a generated `id`.

### Example Request
```json
{
  "name": "Grain",
  "description": "Pollen from grains can cause seasonal allergy symptoms.",
  "imageUrl": "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=800"
}
```


