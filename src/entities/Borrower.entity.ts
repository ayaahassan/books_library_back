import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    BaseEntity
} from "typeorm";
import { Borrowing } from "./Borrowing.entity";

@Entity()
export class Borrower extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column({ type: "date" })
    registeredDate: Date;

    @OneToMany(() => Borrowing, borrowing => borrowing.borrower)
    borrowings: Borrowing[];
}
