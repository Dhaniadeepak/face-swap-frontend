# FaceSwap Studio — Frontend

React + Vite frontend for the FaceSwap Studio asynchronous face-swap application.

## Overview

The frontend provides the user-facing workflow for:

- User signup and login
- Selecting a source face image
- Selecting a target image
- Creating a face-swap request
- Showing queued/processing/completed/failed states
- Polling the backend for job status
- Viewing swap history
- Retrying failed swaps
- Deleting swaps

The frontend does **not** perform the AI inference. It communicates with the Node/Express API and reacts to the asynchronous job lifecycle.

## Tech Stack

- React 18
- Vite 6
- React Router
- Axios
- React Hook Form
- React Toastify
- Lucide React
- Tailwind CSS

## Architecture

```text
React UI
  │
  ├── Auth state
  ├── Forms / validation
  ├── Upload UI
  ├── Swap history
  └── Status polling
        │
        ▼
   Axios API client
        │
        ▼
  Express REST API
```

## Environment

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_MAX_FILE_MB=8
```

For production, replace `VITE_API_URL` with the deployed API URL.

> Vite environment variables are exposed to the browser. Never put private secrets in `VITE_*` variables.

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Default Vite URL:

```text
http://localhost:5173
```

## Production Build

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Swap Flow

```text
User selects source + target
        ↓
Frontend builds FormData
        ↓
POST /api/swaps
        ↓
API returns 202 + swap
        ↓
Frontend polls GET /api/swaps/:id
        ↓
queued → processing → completed/failed
        ↓
Display result or retry option
```

The frontend polls approximately every 2 seconds while a swap is active.

## API Expectations

All protected requests include:

```http
Authorization: Bearer <JWT>
```

Main endpoints used by the frontend:

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/signup` | Create account |
| POST | `/auth/login` | Login |
| POST | `/swaps` | Queue a new swap |
| GET | `/swaps?page=&limit=` | Get user's swap history |
| GET | `/swaps/:id` | Get current swap status |
| POST | `/swaps/:id/retry` | Retry failed swap |
| DELETE | `/swaps/:id` | Delete swap |

## Important Frontend Design Decisions

### 1. Asynchronous UX

The frontend does not wait for the AI request to finish inside the upload request. It receives `202 Accepted`, stores the swap ID, and follows the job status.

### 2. API URL through environment configuration

No production API URL should be hard-coded into React source.

### 3. Clear job states

The UI should distinguish:

```text
queued
processing
completed
failed
```

This makes background processing understandable to users.

### 4. Error handling

API failures should produce readable feedback rather than exposing raw server errors.

## Deployment

Recommended:

- Netlify or Vercel
- Build command: `npm run build`
- Publish directory: `dist`
- Environment variable: `VITE_API_URL=https://YOUR-API/api`

After changing a Vite environment variable, trigger a new production build/deployment.

## Project Scripts

```bash
npm run dev
npm run build
npm run preview
```

## Notes

The frontend is provider-independent. Whether the backend uses the mock provider or a real Replicate face-swap model, the frontend follows the same API and job-state contract.
