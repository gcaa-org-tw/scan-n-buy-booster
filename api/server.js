const express = require('express');
const app = express();
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const cors = require('cors');

require('dotenv').config();

const requiredEnv = [
  'AUTH0_AUDIENCE',
  'AUTH0_DOMAIN',
  'CLIENT_ORIGIN'
];

if (requiredEnv.some(key => !process.env[key])) {
  throw 'Make sure you have all required variable in your .env file';
}

const corsOptions =  {
  origin: process.env.CLIENT_ORIGIN
};

app.use(cors(corsOptions));

const checkJwt = jwt({
  // Dynamically provide a signing key based on the [Key ID](https://tools.ietf.org/html/rfc7515#section-4.1.4) header parameter ("kid") and the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});

app.get('/health', function(req, res) {
  res.json({
    success: true
  })
})

app.get('/grocery/:barcode', checkJwt, function(req, res) {
  res.json({
    success: true,
    data: {
      barcode: req.params.barcode
    }
  });
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  return res.status(err.status).json({ message: err.message });
});

const port = Number(process.env.PORT) || 3001
app.listen(port);
console.log(`Listening on http://localhost:${port}`);
