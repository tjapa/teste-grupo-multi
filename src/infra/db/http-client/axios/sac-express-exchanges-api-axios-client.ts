import axios from 'axios'

export const sacExpressExchangesClient = axios.create({
  baseURL: 'https://sac-express-exchanges.wiremockapi.cloud',
})
