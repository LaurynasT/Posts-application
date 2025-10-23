import axios from 'axios'
import { getToken } from '@/components/auth/authentication'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export const fetchData = async <T>(
  endpoint: string,
  pathParam?: number | string,
  queryParams?: Record<string, any>,
): Promise<{ data: T; totalCount: number }> => {
  const url = pathParam ? `${endpoint}/${pathParam}` : endpoint
  const response = await axiosInstance.get<T>(url, { params: queryParams })
  const totalCount = parseInt(response.headers['x-total-count'] || '0', 10)
  return { data: response.data, totalCount }
}

export const postData = async <T>(endpoint: string, params: object): Promise<T> => {
  const response = await axiosInstance.post<T>(endpoint, params)
  return response.data
}

export const patchData = async <T>(endpoint: string, params: object): Promise<T> => {
  const response = await axiosInstance.patch<T>(endpoint, params)
  return response.data
}

export const deleteData = async (endpoint: string) => {
  const response = await axiosInstance.delete(endpoint)
  return response.data
}
