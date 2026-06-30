# MyFiles2

Electron frontend with a Python backend.

## Structure

- `electron/` — Electron desktop application
- `backend/` — Python backend service
- `shared/` — Shared configuration and schemas
- `docs/` — Project documentation

## Getting started

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### Electron

```bash
cd electron
npm install
npm start
```
