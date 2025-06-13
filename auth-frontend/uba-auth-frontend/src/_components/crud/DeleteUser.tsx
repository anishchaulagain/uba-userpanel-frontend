import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL, authService } from '../../services/authService';


interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

const DeleteUser: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/users`, {
        headers: authService.getAuthHeaders(),
      });
      setUsers(response.data);
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Error fetching users.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (userId: number, firstName: string, lastName:string) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete user "${firstName} ${lastName}" (ID: ${userId})?`);
    if (!confirmDelete) return;

    try {
      setDeletingUserId(userId);
      setMessage('');

      const res = await axios.delete(`${API_BASE_URL}/users/${userId}`, {
        headers: authService.getAuthHeaders(),
      });

      setMessage(res.data.message || 'User deleted successfully.');
      setUsers(users.filter(user => user.id !== userId));
    } catch (error: any) {
      if (error.response?.status === 403) {
        setMessage('You do not have permission to delete users.');
      } else {
        setMessage(error.response?.data?.error || 'Error deleting user.');
      }
    } finally {
      setDeletingUserId(null);
    }
  };

  return (
    <>
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-5xl mx-auto mt-14 border border-gray-200">
     
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-gray-800">Delete Users - Super Admin Only</h2>
        <button
          onClick={fetchUsers}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 transition text-white font-medium px-5 py-2 rounded-lg disabled:opacity-50"
        >
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {message && (
        <div className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium border ${
          message.includes('successfully') 
            ? 'bg-green-50 text-green-700 border-green-300' 
            : 'bg-red-50 text-red-700 border-red-300'
        }`}>
          {message}
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-600"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading users...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-gray-400">
          <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
          </svg>
          <p className="text-lg font-medium">No users available.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm font-medium divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="py-3 px-6">{user.id}</td>
                  <td className="py-3 px-6">{user.firstName} {user.lastName}</td>
                  <td className="py-3 px-6">{user.email}</td>
                  <td className="py-3 px-6 text-center">
                    <button
                      onClick={() => handleDelete(user.id, user.firstName, user.lastName)}
                      disabled={deletingUserId === user.id}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition disabled:opacity-50"
                    >
                      {deletingUserId === user.id ? (
                        <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full mx-auto"></div>
                      ) : (
                        'Delete'
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </>
  );
};

export default DeleteUser;
