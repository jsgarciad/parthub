import { AppDataSource } from '../config/database';

/**
 * Script to revert the last migration
 */
const revertLastMigration = async () => {
  try {
    // Initialize the data source
    await AppDataSource.initialize();
    console.log('Database connection established');

    // Revert the last migration
    console.log('Reverting last migration...');
    await AppDataSource.undoLastMigration();
    console.log('Successfully reverted the last migration');

    // Close the connection
    await AppDataSource.destroy();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error reverting migration:', error);
    process.exit(1);
  }
};

// Run the script
revertLastMigration(); 