import React, { useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';

// Define types
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  internshipCount: number;
  certifiedCount: number;
}

interface Pagination {
  limit: number;
  offset: number;
}

interface Sorting {
  field: string;
  direction: 'ASC' | 'DESC';
}

interface Filters {
  firstName?: string;
  isCertified?: boolean;
  mentorName?: string;
}

interface ListUsersInput {
  pagination?: Pagination;
  sorting?: Sorting;
  filters?: Filters;
}

interface ListUsersResponse {
  listUsers: {
    users: User[];
    total: number;
  };
}

const LIST_USERS = gql`
  query listUsers($input: ListUsersInput) {
    listUsers(input: $input) {
      users {
        id
        firstName
        lastName
        email
        internshipCount
        certifiedCount
      }
      total
    }
  }
`;

const UserList: React.FC = () => {
  const [limit] = useState<number>(5);
  const [offset, setOffset] = useState<number>(0);
  const [sortField, setSortField] = useState<string>('firstName');
  const [sortDir, setSortDir] = useState<'ASC' | 'DESC'>('ASC');
  const [filterName, setFilterName] = useState<string>('');

  const { loading, error, data, refetch } = useQuery<ListUsersResponse, { input: ListUsersInput }>(LIST_USERS, {
    variables: {
      input: {
        pagination: { limit, offset },
        sorting: { field: sortField, direction: sortDir },
        filters: filterName ? { firstName: filterName } : {},
      },
    },
  });

  useEffect(() => {
    refetch();
  }, [limit, offset, sortField, sortDir, filterName, refetch]);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { users, total } = data!.listUsers;

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex space-x-2">
        <input
          className="border p-2 rounded"
          placeholder="Filter by First Name"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => refetch()}
        >
          Search
        </button>
      </div>

      {/* Sorting */}
      <div className="flex space-x-2">
        <select
          className="border p-2 rounded"
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
        >
          <option value="firstName">First Name</option>
          <option value="createdAt">Created At</option>
        </select>

        <select
          className="border p-2 rounded"
          value={sortDir}
          onChange={(e) => setSortDir(e.target.value as 'ASC' | 'DESC')}
        >
          <option value="ASC">Ascending</option>
          <option value="DESC">Descending</option>
        </select>
      </div>

      {/* Table */}
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">First Name</th>
            <th className="border p-2">Last Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Internship Count</th>
            <th className="border p-2">Certified Count</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border p-2">{user.id}</td>
              <td className="border p-2">{user.firstName}</td>
              <td className="border p-2">{user.lastName}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">{user.internshipCount}</td>
              <td className="border p-2">{user.certifiedCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded"
          disabled={offset === 0}
          onClick={() => setOffset(offset - limit)}
        >
          Previous
        </button>

        <span>Page: {(offset / limit) + 1}</span>

        <button
          className="bg-gray-500 text-white px-4 py-2 rounded"
          disabled={offset + limit >= total}
          onClick={() => setOffset(offset + limit)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserList;
