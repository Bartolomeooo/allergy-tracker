# API Specification — Allergy Tracker

This document describes the frontend-to-backend REST API contract used by the Allergy Tracker application.

It defines all endpoints currently implemented in the frontend mock layer (MSW) and expected behavior for the real backend implementation.

---

## Endpoints Overview

| Method | Path                    | Description                     |
|:-------|:------------------------|:--------------------------------|
| GET    | `/api/exposure-types`   | Returns available exposure (allergen) types |
| GET    | `/api/entries`          | Returns all user journal entries |
| GET    | `/api/exposure-types/2' | Returns details of a specific exposure (allergen) type  |
| POST   | `/api/entries`          | Creates a new journal entry |
| POST   | `/api/exposure-types`   | Creates a new exposure (allergen) type |
| DELETE | `/api/entries/:id`      | Deletes a specific journal entry |

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
## DELETE `/api/entries/:id`

### Description
Deletes an existing allergy journal entry identified by its unique `id`.
Once deleted, the entry is permanently removed from the user’s journal.



