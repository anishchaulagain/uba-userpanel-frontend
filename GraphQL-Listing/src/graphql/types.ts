// Input Types
export interface UserFilters {
    firstName?: string;
    lastName?: string;
    email?: string;
    createdAfter?: string;
    createdBefore?: string;
    mentorName?: string;
    isCertified?: boolean;
  }
  
  export interface PaginationInput {
    limit?: number;
    offset?: number;
  }
  
  export interface SortingInput {
    field: string;
    direction: 'ASC' | 'DESC';
  }
  
  export interface UserListInput {
    filters?: UserFilters;
    pagination?: PaginationInput;
    sorting?: SortingInput;
  }
  
  // Output Types
  export interface UserInternship {
    id: number;
    joinedDate: string;
    completionDate?: string;
    isCertified: boolean;
    mentorName: string;
  }
  
  export interface UserListItem {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
    internships: UserInternship[];
    internshipCount: number;
    certifiedCount: number;
  }
  
  export interface UserListResult {
    users: UserListItem[];
    total: number;
    hasMore: boolean;
    pagination: {
      limit: number;
      offset: number;
    };
  }
  
  // Database Query Types
  export interface DatabaseQuery {
    where?: any;
    relations?: string[];
    order?: any;
    skip?: number;
    take?: number;
  }
  
  export interface ElasticsearchQuery {
    query: any;
    from?: number;
    size?: number;
    sort?: any[];
  }
  
  export type DataSourceQuery = DatabaseQuery | ElasticsearchQuery;