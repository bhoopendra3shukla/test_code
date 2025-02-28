import { DataSource } from "typeorm";
import "reflect-metadata";
import { Product, User } from "./entities";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",        
  port: 3306,             
  username: "root",         
  password: "root",             
  database: "test",        
  entities: [User, Product], 
  synchronize: true,        
  logging: true,
});
