# 📦 MyDrive — Frontend

A Google Drive–style file system built with React. Users can browse, create, rename, recolor, and delete folders and files — all organized in a nested folder tree. Search works across the user's own storage, and falls back to a global database of suggested items when nothing is found locally.

> **Status:** Frontend complete with mock data. Awaiting real API from backend team.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Features](#features)
- [Architecture Overview](#architecture-overview)
- [Mock API Layer](#mock-api-layer)
- [Switching to Real APIs](#switching-to-real-apis)
- [Redux State Shape](#redux-state-shape)
- [Routing](#routing)
- [Contributing](#contributing)
- [Branch Naming & Commit Convention](#branch-naming--commit-convention)
- [Known Limitations](#known-limitations)

---

## Tech Stack

| Library          | Version | Purpose                          |
| ---------------- | ------- | -------------------------------- |
| React            | 19      | UI framework                     |
| Redux Toolkit    | 2.x     | Global state management          |
| React Redux      | 9.x     | React bindings for Redux         |
| React Router DOM | 7.x     | Client-side routing              |
| Tailwind CSS     | 4.x     | Utility-first styling            |
| Axios            | 1.x     | HTTP client (ready for real API) |
| Vite             | 8.x     | Dev server and bundler           |

---

## Project Structure

```
src/
├── app/
│   └── store.js                  # Redux store — combines all slices
│
├── features/                     # Redux slices (state + async actions)
│   ├── auth/
│   │   └── authSlice.js          # login, logout, current user
│   ├── files/
│   │   └── fileSlice.js          # load, add, edit, remove files
│   ├── folders/
│   │   └── folderSlice.js        # load, add, edit, remove folders
│   └── search/
│       └── searchSlice.js        # search query, results, suggestions
│
├── services/
│   ├── api/                      # API layer — swap mock ↔ real here
│   │   ├── authApi.js
│   │   ├── client.js             # Axios instance with base URL
│   │   ├── fileApi.js
│   │   ├── folderApi.js
│   │   └── searchApi.js
│   └── mock/                     # Mock implementations of every API
│       ├── authMock.js
│       ├── fakeData.js           # In-memory "database"
│       ├── fileMock.js
│       ├── folderMock.js
│       └── searchMock.js
│
├── components/                   # Reusable UI components
│   ├── Breadcrumb.jsx
│   ├── FileItem.jsx
│   ├── FolderItem.jsx
│   └── SearchBar.jsx
│
├── pages/
│   ├── Dashboard.jsx             # Main file browser view
│   └── Login.jsx
│
├── routes/
│   └── AppRoutes.jsx             # Route definitions + ProtectedRoute
│
├── utils/
│   └── pathUtils.js              # URL path → folder ID helpers
│
└── constants/
    ├── colors.js                 # Folder color options
    └── fileIcons.js              # File icon options
```

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm v9 or higher

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/your-org/mydrive-frontend.git
cd mydrive-frontend

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

The app will be running at `http://localhost:5173`

### Test Credentials (mock mode)

| Email             | Password |
| ----------------- | -------- |
| alice@example.com | alice123 |
| bob@example.com   | bob123   |

---

## Environment Variables

Create a `.env` file at the root of the project. Currently only needed when switching to real APIs:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

In `src/services/api/client.js`, the base URL is read like this:

```js
const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});
```

> While `USE_MOCK = true` in all API files, this env variable has no effect. It only matters after switching to real APIs.

---

## Features

| #   | Feature                                            | Status              |
| --- | -------------------------------------------------- | ------------------- |
| 1   | Browse nested folders                              | ✅ Done             |
| 2   | Create / rename / recolor / delete folders         | ✅ Done             |
| 3   | Create / rename / change icon / delete files       | ✅ Done             |
| 4   | Breadcrumb navigation                              | ✅ Done             |
| 5   | Authentication (login / logout / protected routes) | ✅ Done             |
| 6   | Search within user's own storage                   | ✅ Done             |
| 7   | Global DB suggestions when search has no results   | ✅ Done             |
| 8   | Add suggested item to current folder               | ✅ Done             |
| 9   | Real API integration                               | ⏳ Awaiting backend |

---

## Architecture Overview

### How data flows

```
User interaction (click, type)
        │
        ▼
Component dispatches an action
   e.g. dispatch(loadFolders({ parentId, ownerId }))
        │
        ▼
Redux Thunk runs the async function
   → calls the API layer (mock or real)
        │
   ┌────┴────┐
pending    fulfilled / rejected
   │              │
loading=true   list = payload
               loading = false
        │
        ▼
useSelector picks up the change
        │
        ▼
Component re-renders automatically
```

### Three-layer separation

```
Component  →  API file  →  Mock (now) / Real HTTP (later)
                ↑
           Only this layer changes when backend is ready.
           Slices and components are untouched.
```

---

## Mock API Layer

All API files have a `USE_MOCK` flag at the top:

```js
// src/services/api/folderApi.js
const USE_MOCK = true;

export const fetchFolders = async (parentId, ownerId) => {
  if (USE_MOCK) return getFoldersMock(parentId, ownerId);
  return client.get(`/folders?parentId=${parentId}`).then((r) => r.data);
};
```

Mock data lives in `src/services/mock/fakeData.js`. It acts as the in-memory database during development. All CRUD operations (create, update, delete) mutate these arrays in memory — changes persist for the lifetime of the browser tab but reset on page refresh.

**Adding more test data:** just add entries to `fakeData.js`. Make sure `ownerId` matches a user in the `users` array and `parentId` matches an existing folder's `id`.

---

## Switching to Real APIs

When the backend team delivers the APIs, here is exactly what to change:

### Step 1 — Update the base URL

```js
// src/services/api/client.js
const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // set in .env
});
```

### Step 2 — Add the auth token interceptor

```js
// src/services/api/client.js
client.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on token expiry
client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      store.dispatch(logoutUser());
    }
    return Promise.reject(err);
  },
);
```

### Step 3 — Flip the flag and uncomment the real call

Do this one file at a time as each endpoint becomes available:

```js
// Before
const USE_MOCK = true;

// After
const USE_MOCK = false;
```

### Step 4 — Unwrap the response if needed

If the backend wraps responses like `{ data: [...], status: 200 }`, unwrap in the API file so slices always receive clean data:

```js
export const fetchFolders = async (parentId, ownerId) => {
  const res = await client.get(`/folders?parentId=${parentId}`);
  return res.data.data; // unwrap here only — slice is untouched
};
```

> **Nothing in the slices, components, or store needs to change.**

---

## Redux State Shape

```js
store = {
  auth: {
    user:    { id, name, email } | null,
    token:   "mock-token-u1"    | null,
    loading: false,
    error:   null,
  },

  folders: {
    list:    [ { id, name, parentId, ownerId, color, createdAt }, ... ],
    loading: false,
    error:   null,
  },

  files: {
    list:    [ { id, name, parentId, ownerId, type, size, icon, color, createdAt }, ... ],
    loading: false,
    error:   null,
  },

  search: {
    query:              "",
    results:            { folders: [], files: [] },
    suggestions:        [],
    loading:            false,
    suggestionsLoading: false,
    error:              null,
    isOpen:             false,
  },
}
```

### Available dispatch actions

**Auth**

```js
dispatch(loginUser({ email, password }));
dispatch(logoutUser());
dispatch(clearError());
```

**Folders**

```js
dispatch(loadFolders({ parentId, ownerId }))
dispatch(addFolder({ name, parentId, ownerId, color }))
dispatch(editFolder({ id, data: { name?, color? } }))
dispatch(removeFolder(id))
```

**Files**

```js
dispatch(loadFiles({ parentId, ownerId }))
dispatch(addFile({ name, parentId, ownerId, type, icon }))
dispatch(editFile({ id, data: { name?, icon? } }))
dispatch(removeFile(id))
```

**Search**

```js
dispatch(setQuery("resume"));
dispatch(searchUserItems({ query, ownerId }));
dispatch(loadSuggestions(query));
dispatch(clearSearch());
```

---

## Routing

| Path                           | Component       | Protected |
| ------------------------------ | --------------- | --------- |
| `/login`                       | `Login.jsx`     | No        |
| `/`                            | `Dashboard.jsx` | Yes       |
| `/root`                        | `Dashboard.jsx` | Yes       |
| `/root/:folder`                | `Dashboard.jsx` | Yes       |
| `/root/:folder/:subfolder/...` | `Dashboard.jsx` | Yes       |

All routes under `/*` except `/login` are wrapped in `ProtectedRoute`, which redirects to `/login` if no token exists in Redux state.

The folder path in the URL is decoded to a folder ID by walking `fakeData.folders` in `pathUtils.js → getFolderIdFromPath()`.

---

## Contributing

### Setup

Follow the [Getting Started](#getting-started) steps above. All development is done with mock data — you do not need the backend running.

### Where to make changes

| Task                            | Where                                                       |
| ------------------------------- | ----------------------------------------------------------- |
| UI change to how folders look   | `src/components/FolderItem.jsx`                             |
| UI change to how files look     | `src/components/FileItem.jsx`                               |
| Change search dropdown UI       | `src/components/SearchBar.jsx`                              |
| Add a new page                  | `src/pages/` + register in `AppRoutes.jsx`                  |
| Add a new API endpoint          | `src/services/api/` + matching mock in `src/services/mock/` |
| Change state logic              | `src/features/<slice>/`                                     |
| Add more test data              | `src/services/mock/fakeData.js`                             |
| Add folder colors or file icons | `src/constants/`                                            |

### What NOT to touch

- `src/app/store.js` — only edit when adding a brand new slice
- `src/services/mock/fakeData.js` — only add data, don't change the shape without updating the relevant slice and mock
- `src/utils/pathUtils.js` — URL logic is shared across Breadcrumb and Dashboard; test both if you change it

---

## Branch Naming & Commit Convention

### Branch names

```
feature/<short-description>     # new UI feature
fix/<short-description>         # bug fix
chore/<short-description>       # config, refactor, cleanup
```

Examples:

```
feature/folder-modal
fix/search-dropdown-close
chore/extract-color-constants
```

### Commit messages

Use the format: `type: short description`

```
feat: add create folder modal
fix: close context menu on outside click
chore: move color constants to constants/colors.js
style: improve empty state UI on dashboard
refactor: memoize path calculation in Dashboard
```

### Pull Request checklist

Before opening a PR, make sure:

- [ ] The app starts with `npm run dev` without errors
- [ ] You tested login with both test accounts
- [ ] You tested the feature you changed in at least 2 nested folders
- [ ] No hardcoded user IDs or folder IDs in component code
- [ ] No `console.log` statements left in
- [ ] `USE_MOCK` is still `true` in all API files

---

## Known Limitations

These are intentional — they will be resolved once the backend API is ready:

- **Folder rename doesn't update the URL.** If you rename "Docs" to "Documents" while inside it, the URL still says `/root/docs`. The breadcrumb will break. This is fixed when we switch to ID-based URLs with the real API.
- **Deleting a folder doesn't delete its children.** The mock only removes the top-level folder. Child folders and files remain in `fakeData` with an orphaned `parentId`. The backend will handle cascade delete.
- **Mock data resets on page refresh.** Any folders or files you create during a session are lost on refresh since they live in memory only.
- **No file upload.** Files are metadata-only right now (name, type, icon). Actual file upload is a backend concern.
- **Search matches on name only.** Full-text search, file type filtering, and date filtering will be added once the search API spec is confirmed.
