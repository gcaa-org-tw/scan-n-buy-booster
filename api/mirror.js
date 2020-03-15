const axios = require('axios')
const qs = require('querystring')
const pgp = require('pg-promise')()
const Sentry = require('@sentry/node')

const BASE_EMAIL = '**it_would_never_be_a_valid_email**'

const db = pgp({
  connectionString: process.env.DATABASE_URL,
  ssl: true
})

db.connect()

async function counter (req, res) {
  let sum = 0
  try {
    const result = await db.any('SELECT sum(counter) from mirror;')
    if (result.length) {
      sum = result[0].sum
    }
  } catch (err) {
    Sentry.captureException(err)
  }
  res.json({
    success: true,
    counter: Number(sum)
  })
}

async function stats (req, res) {
  const query = 'select counter, count(*) as n from mirror where email != $1 group by counter order by counter;'
  const rows = await db.any(query, [BASE_EMAIL])
  res.json({
    success: true,
    stats: rows
  })
}

async function ping (req, res) {
  const data = req.body
  if (data.barcode && data.origName && data.id && data.name) {
    backup(data)
  }
  const email = req.user.email
  let counter = 0
  let sum = 0
  try {
    const queryResult = await db.any('select counter from mirror where email = $1;', [email])
    if (queryResult.length < 1) {
      counter += 1
      await db.any('insert into mirror (email, counter) values ($1, $2);', [email, counter])
    } else {
      counter = (queryResult[0].counter || 0) + 1
      await db.any('update mirror set counter = $1 where email = $2;', [counter, email])
    }
    const sumResult = await db.any('SELECT sum(counter) from mirror;')
    if (sumResult.length) {
      sum = sumResult[0].sum
    }
  } catch (err) {
    Sentry.captureException(err)
  }
  res.json({
    success: true,
    counter,
    sum
  })
}

async function backup (data) {
  const payload = {
    // barcode
    'entry.315625535': data.barcode,
    // orig name
    'entry.1903667587': data.origName,
    // orig id
    'entry.62931594': data.id,
    // new name
    'entry.1476091419': data.name
  }
  const endpoint = process.env.BACKUP_ENDPOINT
  const params = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  await axios.post(
    endpoint,
    qs.stringify(payload),
    params
  )
}

module.exports = {
  ping,
  counter,
  stats
}