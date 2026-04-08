import { http } from './http'
import type { Service } from '@/types/service'

export const getServices = (masterId: number) => {
  return http.get<Service[]>(`/api/services/by-master/${masterId}`)
}