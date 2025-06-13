import { Repository } from 'typeorm';
import { User } from '../database/entities/User';
import { UserListInput, UserListResult, UserListItem, DataSourceQuery } from '../graphql/types';
import { QueryBuilder, isDatabaseQuery, isElasticsearchQuery } from '../utils/queryBuilder';
import { AppDataSource } from '../database/connection';

export class UserService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  async handleUserListRequest(input: UserListInput): Promise<UserListResult> {
    // Step 1: Transform GraphQL input to database query
    const dataSourceQuery = QueryBuilder.createFilter<DataSourceQuery>(input);
    
    // Step 2: Execute query based on data source type
    const result = await this.executeQuery(dataSourceQuery);
    
    // Step 3: Return transformed result
    return result;
  }

  private async executeQuery(query: DataSourceQuery): Promise<UserListResult> {
    if (isDatabaseQuery(query)) {
      return this.executeDatabaseQuery(query);
    }
    
    if (isElasticsearchQuery(query)) {
      return this.executeElasticsearchQuery(query);
    }
    
    throw new Error('Invalid query type');
  }

  private async executeDatabaseQuery(query: any): Promise<UserListResult> {
    try {
      const [users, total] = await this.userRepository.findAndCount(query);
      
      const transformedUsers: UserListItem[] = users.map(user => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
        internships: user.internships?.map(internship => ({
          id: internship.id,
          joinedDate: internship.joinedDate.toISOString(),
          completionDate: internship.completionDate?.toISOString(),
          isCertified: internship.isCertified,
          mentorName: internship.mentorName
        })) || [],
        internshipCount: user.internships?.length || 0,
        certifiedCount: user.internships?.filter(i => i.isCertified).length || 0
      }));

      return {
        users: transformedUsers,
        total,
        hasMore: (query.skip || 0) + transformedUsers.length < total,
        pagination: {
          limit: query.take || 20,
          offset: query.skip || 0
        }
      };
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Failed to fetch users from database');
    }
  }

  private async executeElasticsearchQuery(query: any): Promise<UserListResult> {
   
    throw new Error('Elasticsearch integration not yet implemented');
  }
}
