import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { Borrowing } from "../../../entities/Borrowing.entity";
import { Book } from "../../../entities/Book.entity";
import { Borrower } from "../../../entities/Borrower.entity";

export default class BorrowingSeeder implements Seeder {
    public async run(
      dataSource: DataSource,
      factoryManager: SeederFactoryManager
    ): Promise<any> {

      const bookRepository = dataSource.getRepository(Book);
      const borrowerRepository = dataSource.getRepository(Borrower);

      const books = await bookRepository.find();
      const borrowers = await borrowerRepository.find();

      if (!books.length || !borrowers.length) {
          console.error("Books or Borrowers haven't been seeded yet.");
          return;
      }

      const borrowings: Borrowing[] = [];

      for (let i = 0; i < 20; i++) {
          const borrowing = new Borrowing();
          
          borrowing.book = books[Math.floor(Math.random() * books.length)];
          borrowing.borrower = borrowers[Math.floor(Math.random() * borrowers.length)]; // Randomly pick a borrower
          borrowing.borrowedOn = new Date(); 
          borrowing.dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); 

          borrowings.push(borrowing);
      }

      const borrowingRepository = dataSource.getRepository(Borrowing);
      await borrowingRepository.save(borrowings);
    }
}
