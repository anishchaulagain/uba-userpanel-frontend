import { UserService } from '../services/userService';
import { UserListInput } from './types';

const userService = new UserService();

export const resolvers = {
  Query: {
    hello: () => 'Hello from GraphQL Server! 🚀',
    
    listUsers: async (_: any, { input }: { input: UserListInput }) => {
      try {
        return await userService.handleUserListRequest(input || {});
      } catch (error) {
        console.error('Error in listUsers resolver:', error);
        throw new Error('Failed to fetch users');
      }
    }
  }
};