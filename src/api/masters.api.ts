import { http } from './http'
import type { Master } from '@/types/master'

export const getMasters = () => {
  return http.get<Master[]>('/api/masters')
}