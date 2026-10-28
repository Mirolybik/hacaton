import { Sequelize } from "sequelize";
import { env } from "../config/env";
import { logger } from "../lib/logger";

export const sequelize = new Sequelize(
  env.DB_NAME,
  env.DB_USER,
  env.DB_PASSWORD,
  {
    host: env.DB_HOST,
    port: env.DB_PORT,
    dialect: "postgres",
    logging:
      env.NODE_ENV === "development"
        ? (message) => logger.debug(message)
        : false,
  },
);

export async function connectDatabase(): Promise<void> {
  await sequelize.authenticate();
  logger.info("database connected");
}
