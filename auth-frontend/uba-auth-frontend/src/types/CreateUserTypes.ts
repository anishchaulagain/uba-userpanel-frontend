export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface CreatedUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  id: number;
  createdAt: string;
}

export interface SuccessResponse {
  message: "User registered successfully";
  user: CreatedUser;
}

export interface ErrorResponse {
  message: "Error creating user";
  error: string;
}

export type ApiResponse = SuccessResponse | ErrorResponse;

export interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  general?: string;
}

export interface FormTouched {
  firstName: boolean;
  lastName: boolean;
  email: boolean;
  password: boolean;
}
