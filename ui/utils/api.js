import axios from 'axios'

const comHeader = {
  headers: {
    Authorization: 'Bearer'
  }
}
const comBase = process.env.COMPANY_API_ENDPOINT

export function setComAuth (auth) {
  comHeader.headers.Authorization = `Bearer ${auth}`
}

export function getComEndpoint (path) {
  return axios.get(`${comBase}${path}`, comHeader)
}

export function postComEndpoint (path, payload) {
  return axios.post(`${comBase}${path}`, payload, comHeader)
}
