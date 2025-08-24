import dotenv from "dotenv";
import "reflect-metadata";
dotenv.config();

import mysql2 from "mysql2";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "mysql",
  driver: mysql2,
  host: process.env.hostpc,
  database: process.env.databasepc,
  port: parseInt(process.env.portdbc!, 10),
  username: process.env.userpc,
  password: process.env.passwordpc,
  entities: [],
  synchronize: true,
  logging: false,
});
