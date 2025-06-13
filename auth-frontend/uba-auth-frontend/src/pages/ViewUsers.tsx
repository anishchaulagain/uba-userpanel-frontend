import  { useState, useEffect, useMemo, Suspense } from 'react';
import { useQuery } from '@apollo/client';
import { buildListUsersQuery } from '../graphql/queries';
import { Search, Filter, Users, ChevronLeft, ChevronRight, RefreshCw, Loader2 } from 'lucide-react';
import Navbar from '../_components/Navbar';
import { SearchLoading } from '../_components/SearchLoading';
import { PAGE_LIMIT, UserList } from '../_components/UserList';

const ViewUsers = () => {
  const [page, setPage] = useState(0);
  const [firstNameFilter, setFirstNameFilter] = useState('');
  const [isCertifiedFilter, setIsCertifiedFilter] = useState<boolean | undefined>(undefined);
  const [mentorNameFilter, setMentorNameFilter] = useState('');
  const [sortField, setSortField] = useState('firstName');
  const [sortDirection, setSortDirection] = useState('ASC');
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Fetch all users once (no filters in query)
  const query = buildListUsersQuery({
    limit: 1000, // Fetch all users for frontend filtering
    offset: 0,
    sortField: 'firstName',
    sortDirection: 'ASC',
  });

  const { data, loading, error, refetch } = useQuery(query);

  // Debounced search effect
  useEffect(() => {
    if (firstNameFilter || mentorNameFilter) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setIsSearching(false);
        setPage(0); // Reset to first page when searching
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setIsSearching(false);
    }
  }, [firstNameFilter, mentorNameFilter]);

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [isCertifiedFilter, sortField, sortDirection]);

  // Frontend filtering and sorting
  const filteredUsers = useMemo(() => {
    if (!data?.listUsers?.users) return [];

    let filtered = [...data.listUsers.users];

    // Apply filters
    if (firstNameFilter) {
      filtered = filtered.filter(user => 
        user.firstName.toLowerCase().includes(firstNameFilter.toLowerCase()) ||
        user.lastName.toLowerCase().includes(firstNameFilter.toLowerCase()) ||
        user.email.toLowerCase().includes(firstNameFilter.toLowerCase())
      );
    }

    if (isCertifiedFilter !== undefined) {
      filtered = filtered.filter(user => 
        isCertifiedFilter ? user.certifiedCount > 0 : user.certifiedCount === 0
      );
    }

    if (mentorNameFilter) {
      filtered = filtered.filter(user => 
        user.mentorName && user.mentorName.toLowerCase().includes(mentorNameFilter.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortField] || '';
      let bValue = b[sortField] || '';
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortDirection === 'ASC') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [data?.listUsers?.users, firstNameFilter, isCertifiedFilter, mentorNameFilter, sortField, sortDirection]);

  const clearFilters = () => {
    setFirstNameFilter('');
    setIsCertifiedFilter(undefined);
    setMentorNameFilter('');
    setPage(0);
  };

  const totalPages = Math.ceil(filteredUsers.length / PAGE_LIMIT);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600 font-medium">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="flex items-center space-x-3 text-red-600 mb-4">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 font-bold">!</span>
            </div>
            <h3 className="text-lg font-semibold">Error Loading Users</h3>
          </div>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button
            onClick={() => refetch()}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className='pb-10'> 
          <Navbar/>
        </div>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Users className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          </div>
          <p className="text-gray-600">Manage and view all registered users in the system</p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <h3 className="text-lg font-medium text-gray-900">Filters</h3>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {showFilters ? 'Hide' : 'Show'} Filters
              </button>
            </div>
          </div>
          
          {showFilters && (
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Users
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={firstNameFilter}
                      onChange={(e) => setFirstNameFilter(e.target.value)}
                      placeholder="Search by name or email..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {isSearching && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Certification Status
                  </label>
                  <select
                    value={isCertifiedFilter === undefined ? '' : isCertifiedFilter.toString()}
                    onChange={(e) => setIsCertifiedFilter(e.target.value === '' ? undefined : e.target.value === 'true')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Users</option>
                    <option value="true">Certified Only</option>
                    <option value="false">Not Certified</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mentor Name
                  </label>
                  <input
                    type="text"
                    value={mentorNameFilter}
                    onChange={(e) => setMentorNameFilter(e.target.value)}
                    placeholder="Search by mentor..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
                <button
                  onClick={clearFilters}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-600">
            Showing {Math.min(PAGE_LIMIT, filteredUsers.length - (page * PAGE_LIMIT))} of {filteredUsers.length} users
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Sort by:</label>
            <select
              value={`${sortField}-${sortDirection}`}
              onChange={(e) => {
                const [field, direction] = e.target.value.split('-');
                setSortField(field);
                setSortDirection(direction);
              }}
              className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="firstName-ASC">First Name (A-Z)</option>
              <option value="firstName-DESC">First Name (Z-A)</option>
              <option value="lastName-ASC">Last Name (A-Z)</option>
              <option value="lastName-DESC">Last Name (Z-A)</option>
              <option value="email-ASC">Email (A-Z)</option>
              <option value="email-DESC">Email (Z-A)</option>
            </select>
          </div>
        </div>

        {/* Users Grid with Suspense */}
        <Suspense fallback={<SearchLoading />}>
          {isSearching ? (
            <SearchLoading />
          ) : (
            <UserList users={filteredUsers} currentPage={page} />
          )}
        </Suspense>

        {/* Empty State */}
        {!isSearching && filteredUsers.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters or search criteria</p>
            <button
              onClick={clearFilters}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {!isSearching && totalPages > 1 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Page {page + 1} of {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>
                
                {/* Simple page numbers */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                    const pageNum = Math.max(0, Math.min(totalPages - 3, page - 1)) + i;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                          page === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum + 1}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                  disabled={page >= totalPages - 1}
                  className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewUsers;