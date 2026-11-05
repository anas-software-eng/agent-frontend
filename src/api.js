import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3300/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const invoiceApi = {
  create: (invoice) => api.post('/invoices', invoice),
  list: () => api.get('/invoices'),
  downloadPdf: (invoiceId) => api.get(`/invoices/${invoiceId}/pdf`, { responseType: 'blob' }),
}

export default api
