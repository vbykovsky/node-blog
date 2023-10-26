import path from "path";
import SQLite from "sqlite3";
import { Sequelize } from "sequelize";

export const filesystemSequelize = new Sequelize("blog", "dev", "dev", {
  logging: false,

  dialect: 'sqlite',
  storage: path.resolve(__dirname, "..", "..", "..", "db.sqlite3"),
  dialectOptions: {
    mode: SQLite.OPEN_READWRITE | SQLite.OPEN_CREATE | SQLite.OPEN_FULLMUTEX,
  },
});