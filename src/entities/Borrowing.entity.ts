import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Column,
    BaseEntity
} from "typeorm";
import { Book } from "./Book.entity";
import { Borrower } from "./Borrower.entity";

@Entity()
export class Borrowing extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Book, book => book.borrowings)
    book: Book;

    @ManyToOne(() => Borrower, borrower => borrower.borrowings)
    borrower: Borrower;

    @Column({ type: "date" })
    borrowedOn: Date;

    @Column({ type: "date" })
    dueDate: Date;

    @Column({ type: "date", nullable: true,default:null })
    returnedOn: Date | null;
}
