import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    BaseEntity
} from "typeorm";
import { Borrowing } from "./Borrowing.entity";

@Entity()
export class Admin extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
   
    @Column()
    email: string;

    @Column()
    password: string;
   
   
}
