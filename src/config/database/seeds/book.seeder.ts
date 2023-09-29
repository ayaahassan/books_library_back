import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { Book } from "../../../entities/Book.entity";

export default class BookSeeder implements Seeder {
    public async run(
      dataSource: DataSource,
      factoryManager: SeederFactoryManager
    ): Promise<any> {
  
     
      const bookFactory = await factoryManager.get(Book);
      await bookFactory.saveMany(50);
    }
  }