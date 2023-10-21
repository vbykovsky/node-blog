import { inMemorySequelize } from "./in-memory/in-memory";
import { postgresSequelize } from "./postgres/postgres";

export const sequelizeInstance = postgresSequelize;