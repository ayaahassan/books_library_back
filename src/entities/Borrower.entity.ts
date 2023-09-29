import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    BaseEntity
} from "typeorm";
import { Borrowing } from "./Borrowing.entity";

@Entity()
export class Borrower {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP"
    })
    registeredDate: Date;

    @OneToMany(() => Borrowing, borrowing => borrowing.borrower)
    borrowings: Borrowing[];
}
