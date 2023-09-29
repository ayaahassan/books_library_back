import {  DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { Admin } from "../../../entities/admin.entity";
import { password } from "../../util/Password";

export default class AdminSeeder implements Seeder {
    public async run(
      dataSource: DataSource,
      factoryManager: SeederFactoryManager
    ): Promise<any> {
  
        const admin = await Admin.create({
            email: 'admin@mail.com',
            password: password.hash('123456'),
          
          }).save();
       
         }
  }