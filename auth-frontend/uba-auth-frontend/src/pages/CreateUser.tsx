import React, { useState } from 'react';
import { UserPlus, AlertCircle, CheckCircle, Eye, EyeOff, Save, X, Mail, User, Lock } from 'lucide-react';
import Navbar from '../_components/Navbar';
import type { ApiResponse, CreatedUser, CreateUserRequest, ErrorResponse, FormErrors, FormTouched, SuccessResponse } from '../types/CreateUserTypes';

// Type definitions

const CreateUser: React.FC = () => {
  // Form state
  const [formData, setFormData] = useState<CreateUserRequest>({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  // UI state
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({
    firstName: false,
    lastName: false,
    email: false,
    password: false
  });
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [createdUser, setCreatedUser] = useState<CreatedUser | null>(null);

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 4; // Minimum 4 characters as per your example
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 4 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear field error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }

    // Clear success message when form is modified
    if (successMessage) {
      setSuccessMessage('');
      setCreatedUser(null);
    }
  };

  // Handle input blur (for touched state)
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true
    });

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const token: string | null = localStorage.getItem('token');

      if (!token) {
        setErrors({ general: 'No authentication token found. Please login as admin.' });
        return;
      }

      const response: Response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data: ApiResponse = await response.json();

      if (response.ok && data.message === "User registered successfully") {
        const successData = data as SuccessResponse;
        setSuccessMessage('User registered successfully');
        setCreatedUser(successData.user);

        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: ''
        });
        setTouched({
          firstName: false,
          lastName: false,
          email: false,
          password: false
        });
      } else {
        // Handle API errors
        const errorData = data as ErrorResponse;
        if (errorData.error?.toLowerCase().includes('email already exists')) {
          setErrors({ email: 'User with this email already exists' });
        } else {
          setErrors({ general: errorData.error || 'Failed to create user' });
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Network error occurred';
      setErrors({ general: `Failed to create user: ${errorMessage}` });
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const handleReset = (): void => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    });
    setErrors({});
    setTouched({
      firstName: false,
      lastName: false,
      email: false,
      password: false
    });
    setSuccessMessage('');
    setCreatedUser(null);
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>

      <div className="min-h-screen bg-gray-50">
        <div className='mt-5'> <Navbar /></div>


        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 mt-5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center space-x-3">
                <UserPlus className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Create New User</h1>
                  <p className="text-sm text-gray-600">Add a new user to the system</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">User Information</h2>
                <p className="text-sm text-gray-600">Fill in the details to create a new user account</p>
              </div>

              <div className="p-6 space-y-6">
                {/* General Error */}
                {errors.general && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                      <p className="text-sm text-red-700">{errors.general}</p>
                    </div>
                  </div>
                )}

                {/* Success Message */}
                {successMessage && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <p className="text-sm text-green-700">{successMessage}</p>
                    </div>
                  </div>
                )}

                {/* First Name */}
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${errors.firstName && touched.firstName
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                        }`}
                      placeholder="Enter first name"
                    />
                  </div>
                  {errors.firstName && touched.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${errors.lastName && touched.lastName
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                        }`}
                      placeholder="Enter last name"
                    />
                  </div>
                  {errors.lastName && touched.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${errors.email && touched.email
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                        }`}
                      placeholder="Enter email address"
                    />
                  </div>
                  {errors.email && touched.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      className={`block w-full pl-10 pr-10 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${errors.password && touched.password
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                        }`}
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {errors.password && touched.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleSubmit(e as any)}
                    disabled={loading}
                    className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    {loading ? 'Creating...' : 'Create User'}
                  </button>
                </div>
              </div>
            </div>

            {/* Preview/Success Section */}
            <div className="space-y-6">
              {/* Form Preview */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
                  <p className="text-sm text-gray-600">Review the information before creating</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-medium text-blue-600">
                        {formData.firstName[0] || '?'}{formData.lastName[0] || '?'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {formData.firstName || 'First'} {formData.lastName || 'Last'}
                      </p>
                      <p className="text-sm text-gray-500">{formData.email || 'email@example.com'}</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Success Details */}
              {createdUser && (
                <div className="bg-green-50 rounded-lg border border-green-200">
                  <div className="px-6 py-4 border-b border-green-200">
                    <h3 className="text-lg font-semibold text-green-900">User Created Successfully!</h3>
                  </div>
                  <div className="p-6 space-y-3">
                    <div>
                      <span className="text-sm font-medium text-green-900">User ID:</span>
                      <span className="ml-2 text-sm text-green-700">{createdUser.id}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-green-900">Name:</span>
                      <span className="ml-2 text-sm text-green-700">
                        {createdUser.firstName} {createdUser.lastName}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-green-900">Email:</span>
                      <span className="ml-2 text-sm text-green-700">{createdUser.email}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-green-900">Generated Password:</span>
                      <span className="ml-2 text-sm text-green-700 font-mono bg-green-100 px-2 py-1 rounded">
                        {createdUser.password}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-green-900">Created:</span>
                      <span className="ml-2 text-sm text-green-700">{formatDate(createdUser.createdAt)}</span>
                    </div>
                  </div>
                </div>
              )}



            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateUser;