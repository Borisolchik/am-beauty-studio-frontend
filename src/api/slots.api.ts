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

export interface BookSlotResponse {
  message: string
  cancelCode: string
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
  return http.post<BookSlotResponse>('/api/slots', data)
}

export const findBooking = (data: {
  phone: string
  cancelCode: string
}) => {
  return http.post('/api/slots/find', data)
}

export function cancelBooking(data: {
  masterName: string
  date: string
  time: string
  phone: string
  cancelCode: string
}) {
  return http.post('/api/slots/cancel', data)
}