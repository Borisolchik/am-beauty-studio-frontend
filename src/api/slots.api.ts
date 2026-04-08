import { http } from './http'

export const getSlots = (masterName: string, serviceName?: string) => {
  return http.get(`/api/slots/${encodeURIComponent(masterName)}`, {
    params: {
      service: serviceName,
    },
  })
}

export const bookSlot = (data: {
  masterName: string
  date: string
  time: string
  service: string
  client: string
  phone: string
}) => {
  return http.post('/api/slots', data)
}