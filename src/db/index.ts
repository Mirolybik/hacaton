import { Sequelize } from "sequelize-typescript";
import { env } from "../config/env";
import { logger } from "../lib/logger";
import cls from "cls-hooked";
import { modelsList } from "./models";

export const namespace = cls.createNamespace("app-transactions");
Sequelize.useCLS(namespace);

export const sequelize = new Sequelize({
  dialect: "postgres",
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  dialectOptions: {
    connectTimeout: 5000,
    statement_timeout: 10000,
    query_timeout: 10000,
  },
  logging: false,
  models: [...modelsList],
});

export async function connectDatabase(): Promise<void> {
  await sequelize.authenticate();
  logger.info("database connected");
}
