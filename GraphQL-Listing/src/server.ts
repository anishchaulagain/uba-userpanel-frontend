import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import dotenv from 'dotenv';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import { initializeDatabase } from './database/connection';

// Load environment variables
dotenv.config();

async function startServer() {
  try {
    // Initialize database connection
    await initializeDatabase();

    // Create Express app
    const app = express();



    // Enable CORS
    app.use(cors());

    // Create Apollo Server
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      introspection: true, // Enable GraphQL Playground in production
    });

    // Start the server
    await server.start();

    // Apply GraphQL middleware
    server.applyMiddleware({ app, path: '/graphql' });

    const PORT = process.env.GRAPHQL_PORT || 4000;

    // Start HTTP server
    app.listen(PORT, () => {
      console.log(`🚀 GraphQL Server ready at http://localhost:${PORT}${server.graphqlPath}`);
      console.log(`📊 GraphQL Playground available at http://localhost:${PORT}${server.graphqlPath}`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down GraphQL server...');
  process.exit(0);
});

// Start the server
startServer();