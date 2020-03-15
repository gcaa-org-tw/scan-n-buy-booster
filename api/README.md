# Scan and Buy Booster API


## Environment Variables

- Required:
  - `AUTH0_DOMAIN` & `AUTH0_AUDIENCE`, for authentication
  - `CLIENT_ORIGIN`, for cors
  - `BACKUP_ENDPOINT`: backup endpoint for multiple company support
- Optional:
  - `SENTRY_DSN`: Sentry DSN

## Dev Howto

See `db-init.sql` for DB schema.

```bash
npm install
npm run dev
```

API will be served at `http://localhost:3001`
