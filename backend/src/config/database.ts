import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { CreateInitialTables1710000000000 } from '../migrations/1710000000000-CreateInitialTables';
import { UserSubscriber } from '../subscribers/UserSubscriber';
import { PartSubscriber } from '../subscribers/PartSubscriber';

// Load environment variables
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'parthub',
  synchronize: process.env.NODE_ENV === 'development', // Only in development
  logging: process.env.NODE_ENV === 'development',
  entities: ['src/entities/**/*.ts'],
  migrations: [CreateInitialTables1710000000000],
  subscribers: [UserSubscriber, PartSubscriber],
  migrationsRun: true, // Run migrations automatically
});

// Initialize database connection
export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connection established successfully');
    
    // Run migrations if not using synchronize
    if (!AppDataSource.options.synchronize) {
      console.log('Running migrations...');
      await AppDataSource.runMigrations();
      console.log('Migrations completed successfully');
    }
  } catch (error) {
    console.error('Error during database initialization:', error);
    throw error;
  }
}; 