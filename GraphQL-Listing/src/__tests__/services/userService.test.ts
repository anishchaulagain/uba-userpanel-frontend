import { UserService } from '../../services/userService'; 
import { UserListInput, DataSourceQuery, UserListResult } from '../../graphql/types' 
import { QueryBuilder } from '../../utils/queryBuilder'; 
import { AppDataSource } from '../../database/connection'; 
import { User } from '../../database/entities/User'; 
import { Repository } from 'typeorm';
import * as queryGuards from '../../utils/queryBuilder';

// Mocks
jest.mock('../../database/connection');
jest.mock('../../utils/queryBuilder');

// Helper: create mock user
const mockUser = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  createdAt: new Date(),
  internships: []
} as unknown as User;

describe('UserService - handleUserListRequest', () => {
  let userService: UserService;
  let mockRepository: jest.Mocked<Repository<User>>;

  beforeEach(() => {
    // Mock the repository
    mockRepository = {
      findAndCount: jest.fn()
    } as any;

    // Mock AppDataSource.getRepository to return mockRepository
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);

    userService = new UserService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return user list from database query', async () => {
    const input: UserListInput = {};
    const mockQuery: DataSourceQuery = { where: {}, take: 10, skip: 0 };

    // Mock QueryBuilder
    (QueryBuilder.createFilter as jest.Mock).mockReturnValue(mockQuery);

    // Mock Type Guards
    jest.spyOn(queryGuards, 'isDatabaseQuery').mockReturnValue(true);
    jest.spyOn(queryGuards, 'isElasticsearchQuery').mockReturnValue(false);

    // Mock findAndCount result
    mockRepository.findAndCount.mockResolvedValue([[mockUser], 1]);

    const result: UserListResult = await userService.handleUserListRequest(input);

    expect(QueryBuilder.createFilter).toHaveBeenCalledWith(input);
    expect(mockRepository.findAndCount).toHaveBeenCalledWith(mockQuery);
    expect(result.users[0].firstName).toBe('John');
    expect(result.total).toBe(1);
  });

  it('should throw error when invalid query type', async () => {
    const input: UserListInput = {};
    const mockQuery: DataSourceQuery = { where: {}, take: 10, skip: 0 };

    (QueryBuilder.createFilter as jest.Mock).mockReturnValue(mockQuery);
    jest.spyOn(queryGuards, 'isDatabaseQuery').mockReturnValue(false);
    jest.spyOn(queryGuards, 'isElasticsearchQuery').mockReturnValue(false);

    await expect(userService.handleUserListRequest(input)).rejects.toThrow('Invalid query type');
  });

  it('should handle database query errors properly', async () => {
    const input: UserListInput = {};
    const mockQuery: DataSourceQuery = { where: {}, take: 10, skip: 0 };
  
    // Mock QueryBuilder and Type Guards
    (QueryBuilder.createFilter as jest.Mock).mockReturnValue(mockQuery);
    jest.spyOn(queryGuards, 'isDatabaseQuery').mockReturnValue(true);
    jest.spyOn(queryGuards, 'isElasticsearchQuery').mockReturnValue(false);
  
    // Mock findAndCount to throw an error
    mockRepository.findAndCount.mockRejectedValue(new Error('DB connection failed'));
  
    await expect(userService.handleUserListRequest(input))
      .rejects
      .toThrow('Failed to fetch users from database');
  
    expect(mockRepository.findAndCount).toHaveBeenCalledWith(mockQuery);
  });
  
});
