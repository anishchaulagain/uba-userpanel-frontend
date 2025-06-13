import { gql } from '@apollo/client';

export function buildListUsersQuery({
  firstName,
  isCertified,
  mentorName,
  limit = 5,
  offset = 0,
  sortField = "firstName",
  sortDirection = "ASC",
}: {
  firstName?: string;
  isCertified?: boolean;
  mentorName?: string;
  limit?: number;
  offset?: number;
  sortField?: string;
  sortDirection?: 'ASC' | 'DESC';
}) {
  let filters = '';

  if (firstName) filters += `firstName: "${firstName}", `;
  if (isCertified !== undefined) filters += `isCertified: ${isCertified}, `;
  if (mentorName) filters += `mentorName: "${mentorName}", `;

  const filterSection = filters ? `filters: { ${filters} },` : '';

  const queryString = `
    query {
      listUsers(input: {
        ${filterSection}
        pagination: { limit: ${limit}, offset: ${offset} },
        sorting: { field: "${sortField}", direction: ${sortDirection} }
      }) {
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

  return gql`${queryString}`;
}
