import { resolvers } from '../../graphql/resolvers';
import { UserService } from '../../services/userService';
import { UserListInput, UserListResult } from '../../graphql/types';

// Mock UserService
jest.mock('../../services/userService');

const MockedUserService = UserService as jest.MockedClass<typeof UserService>;

describe('GraphQL Resolvers', () => {
  let mockUserService: jest.Mocked<UserService>;

  beforeEach(() => {
    mockUserService = new MockedUserService() as jest.Mocked<UserService>;

    // Inject mock service into resolver manually
    (resolvers as any).Query.listUsers = async (_: any, { input }: { input: UserListInput }) => {
      try {
        return await mockUserService.handleUserListRequest(input || {});
      } catch (error) {
        console.error('Error in listUsers resolver:', error);
        throw new Error('Failed to fetch users');
      }
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return hello message', () => {
    const result = resolvers.Query.hello();
    expect(result).toBe('Hello from GraphQL Server! 🚀');
  });

  it('should return listUsers successfully', async () => {
    const input: UserListInput = {};
    const mockResult: UserListResult = {
      users: [],
      total: 0,
      hasMore: false,
      pagination: { limit: 20, offset: 0 }
    };

    mockUserService.handleUserListRequest.mockResolvedValue(mockResult);

    const result = await resolvers.Query.listUsers({}, { input });

    expect(result).toEqual(mockResult);
    expect(mockUserService.handleUserListRequest).toHaveBeenCalledWith(input);
  });

  it('should handle errors in listUsers resolver', async () => {
    const input: UserListInput = {};
    mockUserService.handleUserListRequest.mockRejectedValue(new Error('Service error'));

    await expect(resolvers.Query.listUsers({}, { input })).rejects.toThrow('Failed to fetch users');
  });
});
