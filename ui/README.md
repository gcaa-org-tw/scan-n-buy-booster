# Scan and Buy Booster UI

## Environment Variables

- Required:
  - `AUTH0_DOMAIN` & `AUTH0_CLIENT_ID`, for authentication
  - `COMPANY_API_ENDPOINT`, endpoint of barcode => company info API server
  - `META_API_ENDPOINT`, endpoint of barcode => meta data API server
  - `META_API_KEY`, key for meta API server
- Optional:
  - `SENTRY_DSN`: Sentry DSN

## Build Setup

``` bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
