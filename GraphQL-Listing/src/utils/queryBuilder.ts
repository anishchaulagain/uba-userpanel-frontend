import { UserListInput, DatabaseQuery, ElasticsearchQuery, DataSourceQuery } from '../graphql/types';
import { Like, Between } from 'typeorm';

export class QueryBuilder {
  
  static createFilter<T extends DataSourceQuery>(input: UserListInput): T {
    const dataSource = process.env.DATA_SOURCE || 'DATABASE';
    
    if (dataSource === 'DATABASE') {
      return QueryBuilder.buildDatabaseQuery(input) as T;
    } else if (dataSource === 'ELASTIC_SEARCH') {
      return QueryBuilder.buildElasticsearchQuery(input) as T;
    }
    
    throw new Error(`Unsupported data source: ${dataSource}`);
  }

  private static buildDatabaseQuery(input: UserListInput): DatabaseQuery {
    const { filters, pagination, sorting } = input;
    
    const query: DatabaseQuery = {
      relations: ['internships'],
      where: {},
      order: {},
      skip: pagination?.offset || 0,
      take: Math.min(pagination?.limit || 20, 100) // Max 100 items
    };

    // Build filters
    if (filters) {
      const whereConditions: any = {};

      if (filters.firstName) {
        whereConditions.firstName = Like(`%${filters.firstName}%`);
      }

      if (filters.lastName) {
        whereConditions.lastName = Like(`%${filters.lastName}%`);
      }

      if (filters.email) {
        whereConditions.email = Like(`%${filters.email}%`);
      }

      if (filters.createdAfter || filters.createdBefore) {
        const startDate = filters.createdAfter ? new Date(filters.createdAfter) : new Date('1900-01-01');
        const endDate = filters.createdBefore ? new Date(filters.createdBefore) : new Date();
        whereConditions.createdAt = Between(startDate, endDate);
      }

      // Filter by internship fields
      if (filters.mentorName) {
        whereConditions.internships = {
          mentorName: Like(`%${filters.mentorName}%`)
        };
      }

      if (filters.isCertified !== undefined) {
        whereConditions.internships = {
          ...whereConditions.internships,
          isCertified: filters.isCertified
        };
      }

      query.where = whereConditions;
    }

    // Build sorting
    if (sorting) {
      query.order = { [sorting.field]: sorting.direction };
    } else {
      query.order = { createdAt: 'DESC' };
    }

    return query;
  }

  private static buildElasticsearchQuery(input: UserListInput): ElasticsearchQuery {
    const { filters, pagination, sorting } = input;
    const mustClauses: any[] = [];

    if (filters) {
      if (filters.firstName) {
        mustClauses.push({ wildcard: { firstName: `*${filters.firstName}*` } });
      }
      if (filters.lastName) {
        mustClauses.push({ wildcard: { lastName: `*${filters.lastName}*` } });
      }
      if (filters.email) {
        mustClauses.push({ wildcard: { email: `*${filters.email}*` } });
      }
      if (filters.createdAfter || filters.createdBefore) {
        const dateRange: any = {};
        if (filters.createdAfter) dateRange.gte = filters.createdAfter;
        if (filters.createdBefore) dateRange.lte = filters.createdBefore;
        mustClauses.push({ range: { createdAt: dateRange } });
      }
    }

    const query: ElasticsearchQuery = {
      query: {
        bool: {
          must: mustClauses.length > 0 ? mustClauses : [{ match_all: {} }]
        }
      },
      from: pagination?.offset || 0,
      size: Math.min(pagination?.limit || 20, 100)
    };

    if (sorting) {
      query.sort = [{ [sorting.field]: { order: sorting.direction.toLowerCase() } }];
    } else {
      query.sort = [{ createdAt: { order: 'desc' } }];
    }

    return query;
  }
}

// Type Guards
export const isDatabaseQuery = (query: unknown): query is DatabaseQuery => {
  return typeof query === 'object' && query !== null && 
         ('where' in query || 'relations' in query);
};

export const isElasticsearchQuery = (query: unknown): query is ElasticsearchQuery => {
  return typeof query === 'object' && query !== null && 'query' in query;
};