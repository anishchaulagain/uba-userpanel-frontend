import { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Edit,
  Trash2,
  Plus,
  Eye,
  Shield,
  BookOpen
} from 'lucide-react';
import Navbar from '../_components/Navbar';
import { useNavigate } from 'react-router-dom';



const Dashboard = () => {
  const navigate = useNavigate()
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Get roles from localStorage when component loads
  useEffect(() => {
    try {
      const storedRoles = localStorage.getItem('roles');

      if (storedRoles) {
        // Parse the roles (assuming it's stored as JSON array)
        const rolesArray = JSON.parse(storedRoles);
        setUserRoles(rolesArray);
      } else {
        setUserRoles([]);
      }
    } catch (error) {
      console.error('Error reading roles from localStorage:', error);
      setUserRoles([]);
    }

    setLoading(false);
  }, []);

  const allServices = [
    // FOR USER MANAGEMENT
    {
      id: 'create-user',
      title: 'Create User',
      description: 'Add new users',
      icon: <UserPlus className="w-6 h-6" />,
      color: 'bg-green-500',
      allowedRoles: ['superadmin', 'admin'],
      path: '/create-user'
    },
    {
      id: 'update-user',
      title: 'Update User',
      description: 'Edit user info',
      icon: <Edit className="w-6 h-6" />,
      color: 'bg-yellow-500',
      allowedRoles: ['superadmin', 'admin'],
      path: '/update-user'
    },
    {
      id: 'delete-user',
      title: 'Delete User',
      description: 'Remove users',
      icon: <Trash2 className="w-6 h-6" />,
      color: 'bg-red-500',
      allowedRoles: ['superadmin'],
      path: '/superadmin/delete-user'
    },
    {
      id: 'read-users',
      title: 'View Users',
      description: 'See all users',
      icon: <Eye className="w-6 h-6" />,
      color: 'bg-indigo-500',
      allowedRoles: ['superadmin', 'admin', 'user'],
      path: '/view-user'
    },

    // FOR INTERNSHIP MANAGEMENT
    {
      id: 'create-internship',
      title: 'Create Internship',
      description: 'Add internships',
      icon: <Plus className="w-6 h-6" />,
      color: 'bg-blue-500',
      allowedRoles: ['superadmin', 'admin'],
      path: '/internships/create'
    },
    {
      id: 'update-internship',
      title: 'Update Internship',
      description: 'Edit internships',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'bg-orange-500',
      allowedRoles: ['superadmin', 'admin'],
      path: '/internships/update'
    },
    {
      id: 'delete-internship',
      title: 'Delete Internship',
      description: 'Remove internships',
      icon: <Trash2 className="w-6 h-6" />,
      color: 'bg-red-600',
      allowedRoles: ['superadmin'],
      path: '/internships/delete'
    },

    // FOR ROLE MANAGEMENT
    {
      id: 'roles-management',
      title: 'Roles Management',
      description: 'Manage user roles',
      icon: <Shield className="w-6 h-6" />,
      color: 'bg-purple-500',
      allowedRoles: ['superadmin'],
      path: '/superadmin/roles'
    }
  ];


  const getAvailableServices = () => {
    if (userRoles.length === 0) {
      return []; // No roles = no services
    }

    return allServices.filter(service => {
      // Checking if user has at least one role that can access this service
      return service.allowedRoles.some(allowedRole =>
        userRoles.includes(allowedRole)
      );
    });
  };

  const handleServiceClick = (path: string) => {
    navigate(path)
  };

  const availableServices = getAvailableServices();
  if (loading) {
    return (
      <>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 ">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-6">
        {userRoles.length > 0 ? (
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-gray-700 font-medium">Your roles:</span>
            {userRoles.map((role, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {role}
              </span>
            ))}
          </div>
        ) : (
          <div className="mb-6">
            <p className="text-red-600 font-medium">No roles assigned</p>
          </div>
        )}

        {userRoles.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">No Access</h2>
            <p className="text-gray-600">
              You don't have any roles assigned. Please contact your administrator.
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Available Services ({availableServices.length})
            </h2>

            {availableServices.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-600">No services available for your current roles.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableServices.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => handleServiceClick(service.path)}
                    className={`${service.color} text-white rounded-xl shadow hover:shadow-lg cursor-pointer transform hover:scale-[1.03] transition duration-200 ease-in-out`}
                  >
                    <div className="p-5 flex flex-col h-full justify-between">
                      <div className="mb-4">
                        <div className="w-10 h-10 flex items-center justify-center  bg-opacity-20 rounded-full mb-3">
                          {service.icon}
                        </div>
                        <h3 className="text-lg font-semibold">{service.title}</h3>
                        <p className="text-sm opacity-90 mt-1 bg">{service.description}</p>
                      </div>
                      <div className="text-xs bg-white bg-opacity-20 rounded px-2 py-1 inline-block self-start mt-auto">
                        Roles: {service.allowedRoles.join(', ')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>

  );
};

export default Dashboard;