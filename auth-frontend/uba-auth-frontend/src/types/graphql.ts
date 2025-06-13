// src/types/graphql.ts

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  internshipCount: number;
  certifiedCount: number;
}

export interface ListUsersInput {
  filters?: {
    firstName?: string;
    isCertified?: boolean;
    mentorName?: string;
  };
  pagination?: {
    limit: number;
    offset: number;
  };
  sorting?: {
    field: string;
    direction: 'ASC' | 'DESC';
  };
}

export interface ListUsersResponse {
  listUsers: {
    users: User[];
    total: number;
    hasMore?: boolean;
    pagination?: {
      limit: number;
      offset: number;
    };
  };
}
