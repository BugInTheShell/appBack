import dotenv from "dotenv";
import "reflect-metadata";
dotenv.config();

import mysql2 from "mysql2";
import { DataSource } from "typeorm";

import {
  User,
  UserFilePrivilege
} from "../src/models/index.ts"

export const AppDataSource = new DataSource({
  type: "mysql",
  driver: mysql2,
  host: process.env.hostpc,
  database: process.env.databasepc,
  port: 3306,
  username: process.env.userpc,
  password: process.env.passwordpc,
  entities: [
    User,
    UserFilePrivilege
  ],
  synchronize: true,
  logging: false,
});
