// User type definition
export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt?: string;
    updatedAt?: string;
  }
  
  // Authentication request types
  export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }
  
  // Authentication response types
  export interface AuthResponse {
    message: string;
    user: User;
    token?: string;
    roles?: string;
  }
  
  export interface RegisterResponse {
    message: string;
    user: User;
  }
  
  // Authentication context type
  export interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<AuthResult>;
    register: (firstName: string, lastName: string, email: string, password: string) => Promise<AuthResult>;
    logout: () => void;
    isAuthenticated: boolean;
  }
  
  // Authentication result type
  export interface AuthResult {
    success: boolean;
    message: string;
  }
  
  // Form data types
  export interface LoginFormData {
    email: string;
    password: string;
  }
  
  export interface RegisterFormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }