import 'reflect-metadata';
import { AppDataSource } from './database/data-source'; 
import app from './app';
import { seedRoles } from './database/seeds/RoleSeeder';
import { seedAdminUser } from './database/seeds/AdminUserSeeder';
import { seedPermissions } from './database/seeds/PermissionSeeder';

AppDataSource.initialize().then(async () => {
  console.log('DB connected');
 try {
    //Initially Seed default roles
    await seedRoles(AppDataSource);
    
    //Initially Seed admin user
    await seedAdminUser(AppDataSource);

    await seedPermissions(AppDataSource);
    
    app.listen(3000, () => {
      console.log('Server is running at http://localhost:3000');
    });
  } catch (error) {
    console.error('Error during seeding:', error);
  }
}).catch((err) => {
  console.error('DB connection failed ❌', err);
});
