import type {
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    RegisterResponse
} from '../types/auth.types';
import type { ApiError } from '../types/api.types';

export const API_BASE_URL = 'http://localhost:3000'; 

class AuthService {
    private async makeRequest<T>(
        endpoint: string,
        options: RequestInit
    ): Promise<T> {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
                ...options,
            });

            const data = await response.json();

            if (!response.ok) {
                const error: ApiError = {
                    message: data.message || 'Request failed',
                    status: response.status,
                    errors: data.errors,
                };
                throw error;
            }

            return data;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Network error occurred');
        }
    }

    async register(userData: RegisterRequest): Promise<RegisterResponse> {
        return this.makeRequest<RegisterResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async login(loginData: LoginRequest): Promise<AuthResponse> {
        return this.makeRequest<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(loginData),
        });
    }

    // Helper method to get auth token for protected requests
    getToken(): string | null {
        return localStorage.getItem('token');
    }

    // Helper method to add auth header to requests
    getAuthHeaders(): Record<string, string> {
        const token = this.getToken();
        return token ? { Authorization: `Bearer ${token}` } : {};
    }

    getUserRoles(): string[] {
        const rolesString = localStorage.getItem('roles');
        if (!rolesString) return [];
        try {
          return JSON.parse(rolesString);
        } catch {
          return [];
        }
      }
}

export const authService = new AuthService();