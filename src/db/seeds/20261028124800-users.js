'use strict';
import bcrypt from "bcrypt"

if (process.env.NODE_ENV !== "production") {
  process.loadEnvFile(".env");
}

export async function up(queryInterface) {
  return queryInterface.bulkInsert("Users", [
    {
      id: "7f64fa92-d51f-4853-abbf-0848e6fccd69",
      email: process.env.DUTY_EMAIL,
      password: bcrypt.hashSync(process.env.DUTY_PASSWORD, Number(process.env.SALT_ROUNDS) || 10),
      lastName: "Иванов",
      firstName: "Дежурный",
      role: "duty",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "cfeb6e7f-d408-4a3b-9ccb-b54295bfa181",
      email: process.env.ENGINEER_EMAIL,
      password: bcrypt.hashSync(process.env.ENGINEER_PASSWORD, Number(process.env.SALT_ROUNDS) || 10),
      lastName: "Петров",
      firstName: "Инженер",
      role: "engineer",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "ba95423a-0f34-4a3f-92b6-d7068cbf9ccd",
      email: process.env.DIRECTOR_EMAIL,
      password: bcrypt.hashSync(process.env.DIRECTOR_PASSWORD, Number(process.env.SALT_ROUNDS) || 10),
      lastName: "Сергеев",
      firstName: "Директор",
      role: "director",
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ])
}
export async function down(queryInterface, Sequelize) {
  return queryInterface.bulkDelete("Users", null, {})
}
