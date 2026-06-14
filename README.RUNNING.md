Run the whole app (backend + frontend)

1) From repo root, install dependencies for both:

```bash
npm run install-all
```

2) Install `concurrently` at root (if not already installed by package managers):

```bash
npm install
```
```

3) Start both dev servers with a single command:

```bash
npm run dev
```

Notes:
- `dev` runs `npm run dev` in `backend` and `frontend` folders (uses `--prefix`).
- For production start, use `npm run start` (this runs `npm start` in both subfolders).
- Make sure environment variables (e.g., MongoDB connection string) are set for backend before starting.
