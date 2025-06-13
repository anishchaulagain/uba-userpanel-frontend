import { DataSource } from "typeorm";
import { User } from "./entities/User"; 
import { Internship } from "./entities/Internship"; 
import * as dotenv from "dotenv";
import { Role } from "./entities/Role";
import { Permission } from "./entities/Permission";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  migrations: ["src/migrations/*.ts"],
  entities: [User, Internship, Role, Permission],
  logging: true,
});
