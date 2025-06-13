// Generic API response type
export interface ApiResponse<T = any> {
    message: string;
    data?: T;
    error?: string;
  }
  
  // API error type
  export interface ApiError {
    message: string;
    status: number;
    errors?: Record<string, string[]>;
  }
  
  // HTTP methods
  export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  
  // Request configuration
  export interface RequestConfig {
    method: HttpMethod;
    headers?: Record<string, string>;
    body?: any;
  }