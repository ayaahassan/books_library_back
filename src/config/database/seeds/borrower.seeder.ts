import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { Borrower } from "../../../entities/Borrower.entity";

export default class BorrowerSeeder implements Seeder {
    public async run(
      dataSource: DataSource,
      factoryManager: SeederFactoryManager
    ): Promise<any> {
  
     
      const borrowerFactory = await factoryManager.get(Borrower);
      await borrowerFactory.saveMany(20);
    }
  }