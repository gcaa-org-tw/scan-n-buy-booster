# Scan and Buy Booster

正式發行前的資料收集器

## Requirement

1. node 12+
2. auth0 account

## Dev Howto

### auth0

1. Create a auth0 application and setup related hook and URL
2. Add API key for META API server in auth0
3. Create related rule to retrieve the API key to client

### Backend

See api/README.md for related .env

```bash
cd api
npm install
npm run dev
```

### Frontend

See ui/README.md for related .env

```bash
cd ui
npm install
npm run dev
```

