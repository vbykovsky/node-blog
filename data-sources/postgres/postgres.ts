import { Sequelize } from "sequelize";

export const postgresSequelize = new Sequelize("blog", "postgres", "postgres", {
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
});

