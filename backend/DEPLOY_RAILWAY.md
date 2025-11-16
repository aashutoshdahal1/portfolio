# Deploying the backend to Railway

This document walks through deploying the Express + MongoDB backend to Railway. It covers required environment variables, connecting a MongoDB database, running the app, and post-deploy verification (including creating the initial admin user).

## Prerequisites

- A Railway account (https://railway.app/) and access to the Railway dashboard.
- The project checked into a Git repository (GitHub is easiest for Railway's Git integration).
- A MongoDB connection string. You can use MongoDB Atlas or Railway's managed MongoDB plugin (if available in your Railway account).
- Local development tools (optional): Node.js and the Railway CLI if you want to run one-off commands from your terminal.

## What this service expects (env vars)

Set the following environment variables in Railway (Project > Settings > Variables or during the setup flow):

- `MONGODB_URI` — MongoDB connection string (e.g. `mongodb+srv://user:pass@cluster.mongodb.net/dbname?retryWrites=true&w=majority`).
- `JWT_SECRET` — a long, random string used to sign JWT tokens (keep this secret).
- `PORT` — optional. Railway will provide a port automatically; server defaults to `process.env.PORT || 3001`.
- `CORS_ORIGIN` — optional. If set, it will be included as an allowed origin in the CORS whitelist. Example: `https://aashutoshdahal.vercel.app`.

Notes:
- Make sure `MONGODB_URI` points to a database accessible from Railway. If you create the DB in MongoDB Atlas, allow connections from Railway IPs (or configure network access appropriately).
- Use a strong `JWT_SECRET` (32+ characters random string). Treat it like any secret.

## Deploying via Railway (UI)

1. Log in to Railway and create a new project.
2. Choose **Deploy from GitHub** and connect your repository (the repo that contains the `backend/` folder). If your backend is inside a monorepo, choose the repository and set the root to `/backend` when prompted.
3. Railway will detect a Node.js app. Ensure the `start` script in `backend/package.json` is set to `node server.js` (this project already has that).
4. Add environment variables listed above in the Railway project's settings (MONGODB_URI, JWT_SECRET, CORS_ORIGIN).
5. Trigger a deploy. Railway will install dependencies and run `npm start` (as defined in `package.json`).

## Deploying via Railway CLI (optional)

If you prefer CLI-based deployment, install the Railway CLI and link your project. Example commands (Railway CLI commands may change; refer to Railway docs if anything differs):

```bash
# login once
railway login

# from your repo root
railway init    # creates/links a Railway project
railway up      # builds & deploys
```

After linking, add environment variables in the Railway dashboard or use `railway variables set` (see the CLI docs).

## One-off tasks: creating the admin user

Your repository includes `createAdmin.js` which creates an admin user in the MongoDB database. You have two simple options to run it:

1. Locally (recommended during setup):

   - Set `MONGODB_URI` in your local `.env` (or export it in your shell) to the same connection string Railway is using for the deployed DB.
   - Run:

     ```bash
     cd backend
     node createAdmin.js
     ```

   This will connect to the same MongoDB instance and create the admin user. The script prints the username/password it created.

2. One-off run on Railway (if you prefer):

   - Use Railway's one-off run feature (Railway UI or CLI) to execute `node createAdmin.js` within the deployed environment, for example via `railway run "node createAdmin.js"`.
   - Make sure `MONGODB_URI` is configured in the Railway project before running the script.

Security note: After creating the admin user, rotate or overwrite the password as needed and keep that credential safe.

## Verifying the deployment

1. Confirm Railway reported a successful deployment.
2. Visit `https://your-railway-deployment-url/api/health` — you should see a JSON response:

```json
{ "status": "OK", "message": "Server is running" }
```

3. Test the content endpoints (replace the base URL with your Railway app URL):

```bash
curl https://<your-railway-app>.up.railway.app/api/content
```

4. Log in from the frontend (set your frontend `VITE_API_URL` to the deployed backend URL, e.g. `https://<your-railway-app>.up.railway.app/api`) and confirm admin login works.

## CORS and frontend integration

- The backend allows origins set via `CORS_ORIGIN` (environment variable) and defaults to `https://aashutoshdahal.vercel.app` and `http://localhost:5173`. If your production frontend URL is different, set `CORS_ORIGIN` in Railway to your production domain.

## Environment variables summary (example)

| Name | Example | Purpose |
|---|---|---|
| MONGODB_URI | mongodb+srv://user:pass@cluster.mongodb.net/portfolio | DB connection |
| JWT_SECRET | <long-random-string> | JWT signing secret |
| PORT | 3001 | Optional; Railway provides a port automatically |
| CORS_ORIGIN | https://aashutoshdahal.vercel.app | Add your frontend domain |

## Post-deploy checklist

- Test `/api/health` and `/api/content`.
- Create an admin user (see above).
- Verify admin login and that updates persist to the database.
- Configure backups for MongoDB (if using Atlas, enable backups; if using Railway-managed MongoDB check Railway docs).
- Rotate `JWT_SECRET` if it may have been exposed.
- Remove or secure any admin creation endpoints (do not keep an open endpoint to create admin accounts).

## Troubleshooting

- CORS errors: check `CORS_ORIGIN` and Railway deployment URL; add the correct origin(s).
- DB connection errors: make sure `MONGODB_URI` is correct and that the database allows connections from Railway.
- Logs: use Railway's logs to inspect errors during startup — they show stdout/stderr from `node server.js`.

## Security notes

- Use a secure `JWT_SECRET` and store it only in Railway environment variables.
- Do not commit secrets to Git.
- Use strong passwords for admin accounts and consider 2FA on your frontend admin if you add it later.

---

If you'd like, I can also:

- Add a small `Procfile` (not necessary for Railway, but sometimes useful): `web: node server.js`.
- Add a README `backend/README.md` with a shortened version of this guide.
- Create a Railway `deploy` template or GitHub Action workflow for automatic deploys on push to main.

Which of these would you like me to add next?
