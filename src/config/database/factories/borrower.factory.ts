import { setSeederFactory } from "typeorm-extension";
import { Borrower } from "../../../entities/Borrower.entity";

export default setSeederFactory(Borrower, (faker) => {
    const borrower = new Borrower();
    borrower.name = faker.person.fullName({ sex: 'male' });
    borrower.email = faker.internet.email();
    borrower.registeredDate=faker.date.past();

    return borrower;
});