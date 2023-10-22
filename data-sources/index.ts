import { postgresSequelize } from "./postgres/postgres";
import { inMemorySequelize } from "./in-memory/in-memory";
import { filesystemSequelize } from "./filesystem/filesystem";

export const sequelizeInstance = filesystemSequelize;