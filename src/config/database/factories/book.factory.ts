
import { setSeederFactory } from 'typeorm-extension';
import { Book } from '../../../entities/Book.entity';

export default setSeederFactory(Book, (faker) => {
    const book = new Book();
    book.title = faker.lorem.sentence(5);
    book.author = faker.person.fullName({ sex: 'male' });
    book.ISBN = faker.string.uuid(),
    book.quantity = faker.number.int({min:1,max:20});
    book.shelfLocation = `Shelf ${faker.number.int({min:1,max:10})}`;
    return book;
});
