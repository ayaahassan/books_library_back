import { DataSource } from 'typeorm'
import configurations from '../configurations'
import { dbOptions } from './database-options';
const config = configurations()

class DataBase {
  dataSource: DataSource;
  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }
  async ensureDatabaseExists() {
    const { database } = this.dataSource.options;
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      const databases = await queryRunner.query(`CREATE DATABASE IF NOT EXISTS ${database}`);
          } catch (error) {
      console.error('Error ensuring the database exists:', error);
    } finally {
      await queryRunner.release();
    }
}

  async connect() {
    try {
      // await this.ensureDatabaseExists();
      await this.dataSource.initialize();
      console.log('Connected to database');
    } catch (error) {
      console.log(
        'error',
        'Error connecting to database: ' + JSON.stringify(error)
      )
    }
  }
}
export const dataSource = new DataSource(dbOptions);
export const dataBase = new DataBase(dataSource);



