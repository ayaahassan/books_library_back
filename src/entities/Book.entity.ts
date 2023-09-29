import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    BaseEntity
} from "typeorm";
import { Borrowing } from "./Borrowing.entity";

@Entity()
export class Book  extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    author: string;

    @Column()
    ISBN: string;

    @Column()
    quantity: number;

    @Column()
    shelfLocation: string;

    @OneToMany(() => Borrowing, borrowing => borrowing.book)
    borrowings: Borrowing[];
}
