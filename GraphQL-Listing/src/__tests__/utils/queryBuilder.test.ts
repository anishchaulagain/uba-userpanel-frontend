import { QueryBuilder, isDatabaseQuery, isElasticsearchQuery } from '../../utils/queryBuilder';
import { UserListInput, DatabaseQuery, ElasticsearchQuery } from '../../graphql/types';

describe('QueryBuilder', () => {

  describe('Database QueryBuilder', () => {
    beforeEach(() => {
      process.env.DATA_SOURCE = 'DATABASE';
    });

    it('should build database query with filters', () => {
      const input: UserListInput = {
        filters: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          createdAfter: '2023-01-01',
          createdBefore: '2023-12-31',
          mentorName: 'MentorA',
          isCertified: true
        },
        pagination: { limit: 10, offset: 5 },
        sorting: { field: 'createdAt', direction: 'ASC' }
      };

      const query = QueryBuilder.createFilter<DatabaseQuery>(input);

      expect(query.relations).toContain('internships');
      expect(query.take).toBe(10);
      expect(query.skip).toBe(5);
      expect(query.order).toEqual({ createdAt: 'ASC' });
      expect(query.where.firstName).toBeDefined();
      expect(query.where.internships).toEqual(expect.objectContaining({
        mentorName: expect.any(Object),
        isCertified: true
      }));
    });

    it('should apply default pagination & sorting', () => {
      const input: UserListInput = {};
      const query = QueryBuilder.createFilter<DatabaseQuery>(input);

      expect(query.take).toBe(20);
      expect(query.skip).toBe(0);
      expect(query.order).toEqual({ createdAt: 'DESC' });
    });
  });

  describe('Elasticsearch QueryBuilder', () => {
    beforeEach(() => {
      process.env.DATA_SOURCE = 'ELASTIC_SEARCH';
    });

    it('should build elasticsearch query with filters', () => {
      const input: UserListInput = {
        filters: {
          firstName: 'John',
          createdAfter: '2023-01-01',
        },
        pagination: { limit: 5, offset: 0 },
        sorting: { field: 'createdAt', direction: 'DESC' }
      };

      const query = QueryBuilder.createFilter<ElasticsearchQuery>(input);

      expect(query.query.bool.must).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            wildcard: { firstName: '*John*' }
          })
        ])
      );

      expect(query.size).toBe(5);
      expect(query.sort).toEqual([{ createdAt: { order: 'desc' } }]);
    });

    it('should apply match_all when no filters provided', () => {
      const input: UserListInput = {};
      const query = QueryBuilder.createFilter<ElasticsearchQuery>(input);

      expect(query.query.bool.must).toEqual([{ match_all: {} }]);
    });
  });

  describe('Error case', () => {
    beforeEach(() => {
      process.env.DATA_SOURCE = 'INVALID_SOURCE';
    });

    it('should throw error for invalid data source', () => {
      const input: UserListInput = {};

      expect(() => QueryBuilder.createFilter(input)).toThrow('Unsupported data source: INVALID_SOURCE');
    });
  });
});

describe('Type Guards', () => {
  it('isDatabaseQuery should return true for DatabaseQuery', () => {
    const query: DatabaseQuery = { where: {}, relations: ['internships'], order: {}, take: 10, skip: 0 };
    expect(isDatabaseQuery(query)).toBe(true);
  });

  it('isDatabaseQuery should return false for non-database query', () => {
    const query = { foo: 'bar' };
    expect(isDatabaseQuery(query)).toBe(false);
  });

  it('isElasticsearchQuery should return true for ElasticsearchQuery', () => {
    const query: ElasticsearchQuery = { query: { bool: { must: [] } }, size: 10, from: 0, sort: [] };
    expect(isElasticsearchQuery(query)).toBe(true);
  });

  it('isElasticsearchQuery should return false for non-elasticsearch query', () => {
    const query = { bar: 'baz' };
    expect(isElasticsearchQuery(query)).toBe(false);
  });
});
