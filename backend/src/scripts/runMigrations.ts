import { AppDataSource } from '../config/database';

/**
 * Script to run database migrations manually
 */
const runMigrations = async () => {
  try {
    // Initialize the data source
    await AppDataSource.initialize();
    console.log('Database connection established');

    // Run migrations
    console.log('Running migrations...');
    const migrations = await AppDataSource.runMigrations();
    
    if (migrations.length === 0) {
      console.log('No pending migrations to run');
    } else {
      console.log(`Successfully ran ${migrations.length} migrations`);
      migrations.forEach(migration => {
        console.log(`- ${migration.name}`);
      });
    }

    // Close the connection
    await AppDataSource.destroy();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
};

// Run the script
runMigrations(); 