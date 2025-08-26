import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
import "reflect-metadata";
import { User_Privileges } from "../enums/privileges.js";
import { IsEmail, Length } from "class-validator";

@Entity({ name: "users", schema: "public" })
export class User {
  @PrimaryGeneratedColumn({ name: "Id_user" })
  id: number;

  @Column({
    name: "Name",
    nullable: false,
    type: "varchar",
    length: 150,
  })
  @Length(3, 150)
  name: string;

  @Column({
    name: "Email",
    nullable: false,
    type: "varchar",
  })
  @IsEmail()
  email: string;

  @Column({
    name: "Phone_number",
    type: "varchar",
    nullable: true
  })
  phoneNumber: string;

 @Column({
    name: "Password",
    type: "varchar",
    length: 255,
    nullable: false,
    select: false,
  })
  password: string;


  @Column({
    name: "Privilege",
    nullable: false,
    type: "int",
    default: User_Privileges.Mango,
  })
  privilege: User_Privileges;

}
