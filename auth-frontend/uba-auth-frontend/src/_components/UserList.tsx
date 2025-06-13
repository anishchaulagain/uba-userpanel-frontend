import { Award, Briefcase, Mail } from "lucide-react";

export const PAGE_LIMIT = 5;

// User list component wrapped with Suspense
export const UserList = ({ users, currentPage }:any) => {
  const startIndex = currentPage * PAGE_LIMIT;
  const paginatedUsers = users.slice(startIndex, startIndex + PAGE_LIMIT);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {paginatedUsers.map((user:any) => (
        <div key={user.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {user.firstName} {user.lastName}
                </h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <Mail className="h-4 w-4 mr-2" />
                  <span className="text-sm">{user.email}</span>
                </div>
              </div>
              {user.certifiedCount > 0 && (
                <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  <Award className="h-4 w-4" />
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600">
                  <Briefcase className="h-4 w-4 mr-2" />
                  <span className="text-sm">Internships</span>
                </div>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                  {user.internshipCount || 0}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600">
                  <Award className="h-4 w-4 mr-2" />
                  <span className="text-sm">Certifications</span>
                </div>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                  {user.certifiedCount || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};