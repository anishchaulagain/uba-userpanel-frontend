import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL, authService } from '../services/authService';
import Navbar from '../_components/Navbar';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  createdAt?: string;
}

interface RoleActionPayload {
  userId: number;
  roleName: 'admin' | 'user';
}

const AdminRoleManager: React.FC = () => {
  const [usersWithRoles, setUsersWithRoles] = useState<User[]>([]);
  const [usersWithoutRoles, setUsersWithoutRoles] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' }>({ text: '', type: 'success' });
  const [selectedRoles, setSelectedRoles] = useState<Record<number, string>>({});
  const [processingUserId, setProcessingUserId] = useState<number | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/users`, {
        headers: authService.getAuthHeaders(),
      });

      const allUsers = res.data;
      
      // Separate users with and without roles
      const withRoles = allUsers.filter((user: User) => user.roles.length > 0);
      const withoutRoles = allUsers.filter((user: User) => user.roles.length === 0);
      
      setUsersWithRoles(withRoles);
      setUsersWithoutRoles(withoutRoles);
      setMessage({ text: '', type: 'success' });
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Failed to fetch users', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (userId: number, roleName: string) => {
    setSelectedRoles(prev => ({ ...prev, [userId]: roleName }));
  };

  const handleRoleAction = (userId: number, type: 'assign' | 'remove') => async () => {
    const roleName = selectedRoles[userId];
    if (!roleName) {
      setMessage({ text: 'Please select a role', type: 'error' });
      return;
    }

    const user = [...usersWithRoles, ...usersWithoutRoles].find(u => u.id === userId);
    const confirmMessage = type === 'assign' 
      ? `Assign "${roleName}" role to ${user?.firstName} ${user?.lastName}?`
      : `Remove "${roleName}" role from ${user?.firstName} ${user?.lastName}?`;
    
    if (!window.confirm(confirmMessage)) return;

    const payload: RoleActionPayload = {
      userId: userId,
      roleName: roleName as RoleActionPayload['roleName'],
    };

    try {
      setProcessingUserId(userId);
      const res = await axios.post(`${API_BASE_URL}/roles/${type}`, payload, {
        headers: authService.getAuthHeaders(),
      });

      setMessage({ text: res.data.message || `Role ${type}ed successfully.`, type: 'success' });
      fetchUsers(); // Refresh after update
      setSelectedRoles(prev => ({ ...prev, [userId]: '' })); // Clear selection
    } catch (error: any) {
      if (error.response?.status === 403) {
        setMessage({ text: 'Access denied: Superadmin role required.', type: 'error' });
      } else {
        setMessage({ 
          text: error.response?.data?.message || `Error trying to ${type} role.`, 
          type: 'error' 
        });
      }
    } finally {
      setProcessingUserId(null);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    const user = usersWithoutRoles.find(u => u.id === userId);
    if (!window.confirm(`Are you sure you want to delete user "${user?.firstName} ${user?.lastName}"?`)) {
      return;
    }

    try {
      setProcessingUserId(userId);
      const res = await axios.delete(`${API_BASE_URL}/users/${userId}`, {
        headers: authService.getAuthHeaders(),
      });

      setMessage({ text: res.data.message || 'User deleted successfully.', type: 'success' });
      fetchUsers(); // Refresh after deletion
    } catch (error: any) {
      if (error.response?.status === 403) {
        setMessage({ text: 'You do not have permission to delete users.', type: 'error' });
      } else {
        setMessage({ 
          text: error.response?.data?.error || 'Error deleting user.', 
          type: 'error' 
        });
      }
    } finally {
      setProcessingUserId(null);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'user':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const UserTable = ({ 
    users, 
    title, 
    showDeleteOption = false 
  }: { 
    users: User[], 
    title: string, 
    showDeleteOption?: boolean 
  }) => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
          {showDeleteOption ? '🆕' : '👥'} {title}
          <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
            {users.length}
          </span>
        </h3>
      </div>
      
      {users.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <div className="text-gray-400 text-4xl mb-2">📋</div>
          <p className="text-gray-500">No users found in this category</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Roles
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role Selection
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-indigo-700">
                              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          <div className="text-xs text-gray-400">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.roles.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {user.roles.map((role, index) => (
                            <span
                              key={index}
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(role)}`}
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                          No roles assigned
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={selectedRoles[user.id] || ''}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        disabled={processingUserId === user.id}
                      >
                        <option value="">Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={handleRoleAction(user.id, 'assign')}
                          disabled={!selectedRoles[user.id] || processingUserId === user.id}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {processingUserId === user.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                          ) : (
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          )}
                          Assign
                        </button>
                        
                        {user.roles.length > 0 && (
                          <button
                            onClick={handleRoleAction(user.id, 'remove')}
                            disabled={!selectedRoles[user.id] || processingUserId === user.id}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {processingUserId === user.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                            ) : (
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            )}
                            Remove
                          </button>
                        )}
                        
                        {showDeleteOption && (
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={processingUserId === user.id}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {processingUserId === user.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                            ) : (
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            )}
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Navbar/>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Role Manager</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage user roles 
            </p>
          </div>
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Message Display */}
      {message.text && (
        <div className={`rounded-lg p-4 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {message.type === 'success' ? (
                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{message.text}</p>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-lg text-gray-600">Loading users...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Recently Added Users (No Roles) */}
          <UserTable 
            users={usersWithoutRoles} 
            title="Recently Added Users (No Roles Assigned)"
            showDeleteOption={true}
          />

          {/* Users with Roles */}
          <UserTable 
            users={usersWithRoles} 
            title="Users with Assigned Roles"
            showDeleteOption={false}
          />
        </>
      )}
    </div>
  );
};

export default AdminRoleManager;