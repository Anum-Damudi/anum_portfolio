# Anum Portfolio Website

## Quick Start (Local Development)

### Option 1: Frontend only (static)
```bash
# From project root
npx serve frontend -l 5173
# or
cd frontend && python -m http.server 5173
```
Open http://localhost:5173

### Option 2: Frontend + Backend
**Terminal 1 - Backend:**
```bash
cd backend
npm install
cp .env.example .env  # Update with your values
npm run dev
```
Backend runs on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
npx serve frontend -l 5173
```
Frontend runs on http://localhost:5173

## Project Structure
```
Portfolio/
+-- frontend/
¦   +-- index.html
¦   +-- css/styles.css
¦   +-- js/
¦       +-- tailwind-config.js
¦       +-- main.js
¦       +-- enhancements.js
¦       +-- minigame.js
+-- backend/ (Node/Express API)
+-- package.json
```

## Deployment

### Vercel
- Root Directory: `frontend`
- Build Command: (leave empty)
- Output Directory: `.`

### Netlify
- Base directory: `frontend`
- Build command: (leave empty)
- Publish directory: `.`

### GitHub Pages
- Source: Deploy from branch
- Branch: main / master
- Folder: /frontend

## Troubleshooting
- **Index of / shown**: Make sure server is started from `frontend/` directory containing `index.html`
- **404 on CSS/JS**: Check paths in index.html are relative (css/styles.css, js/*.js)
- **CORS errors**: Ensure backend FRONTEND_ORIGIN matches your frontend URL
- **CV not downloading**: Backend must be running, CV file must exist in backend/assets/