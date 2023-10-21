import { Sequelize } from "sequelize";

export const inMemorySequelize = new Sequelize("sqlite::memory:");