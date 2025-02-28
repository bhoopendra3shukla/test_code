"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
require("reflect-metadata");
const entities_1 = require("./entities");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: "localhost", // Ensure MySQL is running on localhost and the port is correct.
    port: 3306, // Default MySQL port
    username: "root", // Make sure this is the correct username for your MySQL user
    password: "root", // Update with your MySQL password if necessary
    database: "users", // Ensure that the "users" database exists in MySQL
    entities: [entities_1.User, entities_1.Product], // Ensure these entities are correctly defined
    synchronize: true, // For auto-syncing the schema (be careful with this in production)
    logging: true, // Enable logging to see queries and potential issues
});
