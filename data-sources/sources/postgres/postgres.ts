import { Sequelize } from "sequelize";

export const postgresSequelize = new Sequelize("blog", "postgres", "postgres", {
    logging: false,

    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
});

