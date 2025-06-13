export const typeDefs = `
  enum SortDirection {
    ASC
    DESC
  }

  input UserFilters {
    firstName: String
    lastName: String
    email: String
    createdAfter: String
    createdBefore: String
    mentorName: String
    isCertified: Boolean
  }

  input PaginationInput {
    limit: Int
    offset: Int
  }

  input SortingInput {
    field: String!
    direction: SortDirection!
  }

  input UserListInput {
    filters: UserFilters
    pagination: PaginationInput
    sorting: SortingInput
  }

  type UserInternship {
    id: ID!
    joinedDate: String!
    completionDate: String
    isCertified: Boolean!
    mentorName: String!
  }

  type UserListItem {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    createdAt: String!
    internships: [UserInternship!]!
    internshipCount: Int!
    certifiedCount: Int!
  }

  type UserListPagination {
    limit: Int!
    offset: Int!
  }

  type UserListResult {
    users: [UserListItem!]!
    total: Int!
    hasMore: Boolean!
    pagination: UserListPagination!
  }

  type Query {
    listUsers(input: UserListInput): UserListResult!
    hello: String!
  }
`;
