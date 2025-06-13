import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL, authService } from "../../services/authService";
import Navbar from '../../_components/Navbar';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  roles: string[]; // <-- roles coming from backend now
}

const UserUpdateManager: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  // Get role from local storage
  const currentUserRoles = JSON.parse(localStorage.getItem('roles') || '[]');

  const isSuperAdmin = currentUserRoles.includes("superadmin");
  const isAdmin = currentUserRoles.includes("admin");

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

      // Filter users based on role
      let filteredUsers: User[] = [];

      if (isSuperAdmin) {
        filteredUsers = allUsers; // see all users
      } else if (isAdmin) {
        filteredUsers = allUsers.filter((user: User) =>
          user.roles.includes("user")
        );
      }

      setUsers(filteredUsers);
    } catch (err) {
      console.error(err);
      setMessage('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      const res = await axios.put(
        `${API_BASE_URL}/users/${selectedUser.id}`,
        formData,
        {
          headers: authService.getAuthHeaders(),
        }
      );

      setMessage(res.data.message || 'User updated successfully');
      setSelectedUser(null);
      fetchUsers();
    } catch (err: any) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Failed to update user');
    }
  };

  return (
    <>
      <div className="bg-gray-100 min-h-screen py-10 px-4">
        <Navbar />
        <div className="bg-gray-50 rounded-2xl shadow-xl p-8 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">User Update Manager</h2>

          {loading ? (
            <div className="text-center text-gray-500 py-10">
              Loading users...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-center border border-gray-300 rounded-md">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="p-3 border">ID</th>
                    <th className="p-3 border">Name</th>
                    <th className="p-3 border">Email</th>
                    <th className="p-3 border">Roles</th>
                    <th className="p-3 border">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-blue-50">
                      <td className="p-3 border">{user.id}</td>
                      <td className="p-3 border">{user.firstName} {user.lastName}</td>
                      <td className="p-3 border">{user.email}</td>
                      <td className="p-3 border">{user.roles.join(', ')}</td>
                      <td className="p-3 border">
                        <button
                          onClick={() => handleEditClick(user)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded shadow"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {selectedUser && (
            <div className="mt-10 bg-gray-50 p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">
                Update User: {selectedUser.firstName} {selectedUser.lastName}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleUpdateUser}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow"
                >
                  Update
                </button>

                <button
                  onClick={() => setSelectedUser(null)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded shadow"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {message && (
            <div className={`mt-6 p-4 rounded text-center 
              ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserUpdateManager;
