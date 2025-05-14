// This file ensures Vue Query context is properly provided throughout the application

import { QueryClient } from '@tanstack/vue-query'

// Export reusable client to ensure consistent configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: process.env.NODE_ENV === 'production',
      refetchOnReconnect: true,
    },
  },
})
