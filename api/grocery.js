const axios = require('axios')
const qs = require('querystring')
const Sentry = require('@sentry/node')

const ENDPOINT = {
  GS1: 'https://www.gs1tw.org/twct/web/codesearch_send.jsp',
  RONNY: 'http://company.g0v.ronny.tw/api/search'
}

async function getGs1 (barcode) {

  // we only accept TW barcode
  if (barcode.length !== 13 || !barcode.startsWith('471')) {
    return false
  }
  const params = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }

  const resp = await axios.post(
    ENDPOINT.GS1,
    qs.stringify({ MCANNO: barcode }),
    params
  )

  if (!resp.data) {
    return false
  }

  const resultFrom = resp.data.indexOf('此條碼之公司前置碼')

  if (resultFrom < 0) {
    return false
  }

  const tailStr = resp.data.slice(resultFrom)
  const resultTo = tailStr.indexOf('</font>')

  if (resultTo < 0) {
    return false
  }

  const result = tailStr.slice(0, resultTo)
  const isValid = result.indexOf('為有效 GS1 Taiwan 公司前置碼') >= 0
  const name = result.replace(/.*登記公司名稱為(.+)<P>.*/, '$1')

  if (!isValid) {
    console.error(`Invalid barcode: ${barcode}`)
    return false
  }

  return name.trim()
}

function getCompanyState (company) {
  return company.現況 || company.公司狀況
}

function getCompanyName (company) {
  const name = company.公司名稱 || company.商業名稱 || company.名稱
  if (Array.isArray(name)) {
    return name[0]
  }
  return name
}

function getCompanyAsset (company) {
  const keys = ['資本總額(元)', '資本額(元)']
  let ans = 0
  keys.some(key => {
    if (company[key]) {
      ans = Number(company[key].replace(/,/g, ''))
      return true
    }
  })
  return ans
}

function packCompany (company) {
  return {
    id: company.統一編號,
    name: getCompanyName(company)
  }
}

async function getCompanyId (targetName) {
  const query = qs.stringify({
    q: targetName
  })
  const resp = await axios.get(`${ENDPOINT.RONNY}?${query}`)
  if (!resp.data || !resp.data.data) {
    return false
  }
  const result = resp.data

  if (result.found === 1) {
    return packCompany(result.data[0])
  }

  if (result.found < 1) {
    return false
  }

  // find only currently active company
  const activeCompanies = result.data.filter(company => {
    return getCompanyState(company) === '核准設立'
  })

  // find the one exactly match query, if not, find largest one
  let exactMatch = null
  let largest = null

  activeCompanies.forEach(company => {
    const thisName = getCompanyName(company)
    if (thisName === targetName) {
      exactMatch = company
    }
    company.asset = getCompanyAsset(company)
    if (!largest || largest.asset < company.asset) {
      largest = company
    }
  })

  if (exactMatch) {
    return packCompany(exactMatch)
  }
  return packCompany(largest)
}

module.exports = async function (req, res) {
  const ret = {
    success: false
  }
  const barcode = req.params.barcode
  const companyName = await getGs1(barcode)

  if (!companyName) {
    ret.reason = 'Invalid barcode'
    res.json(ret)
    return
  }

  const company = await getCompanyId(companyName)

  if (!company) {
    ret.reason = `Company ${companyName} not found`
    res.json(ret)
    return
  }

  if (company.name !== companyName) {
    Sentry.captureMessage(`Name collision on barcode ${barcode}, GS1 = ${companyName}, Ronny = ${company.name}`)
  }

  res.json({
    success: true,
    data: {
      ...company,
      rawName: companyName
    }
  })
}
