import { http } from './http'

export const getSlots = (
  masterName: string,
  serviceName: string,
  slotsRequired: number
) => {
  return http.get(`/api/slots/${encodeURIComponent(masterName)}`, {
    params: {
      service: serviceName,
      slotsRequired
    }
  })
}

export const bookSlot = (data: {
  masterName: string
  date: string
  time: string
  service: string
  client: string
  phone: string
  slotsRequired: number
}) => {
  return http.post('/api/slots', data)
}