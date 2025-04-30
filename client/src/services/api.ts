import axios from 'axios'
import type { AxiosResponse } from 'axios'

// Define base URL for API
const API_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://project.localhost:8443/api'

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true // for CORS with credentials
})

// Define response interfaces
interface HealthResponse {
  status: string
  timestamp: string
  database: {
    connected: boolean
  }
  environment: {
    php_version: string
    symfony_version: string
    server: {
      software: string
      protocol: string
    }
  }
  message: string
}

// API service
export default {
  // Health check endpoint
  checkHealth(): Promise<AxiosResponse<HealthResponse>> {
    return apiClient.get('/v1/health')
  }
}
