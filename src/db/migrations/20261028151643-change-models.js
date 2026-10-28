'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.sequelize.query(`
    CREATE TYPE "enum_requests_type" AS ENUM ('inspection', 'repair');
  `);
  await queryInterface.sequelize.query(`
    CREATE TYPE "enum_requests_priority" AS ENUM ('low', 'normal', 'high');
  `);
  await queryInterface.sequelize.query(`
    CREATE TYPE "enum_requests_status" AS ENUM ('new', 'in_progress', 'waiting_parts', 'done');
  `);
  await queryInterface.sequelize.query(`
    ALTER TABLE "requests"
      ALTER COLUMN "priority" DROP DEFAULT,
      ALTER COLUMN "status" DROP DEFAULT;
  `);
  await queryInterface.sequelize.query(`
    ALTER TABLE "requests"
      ALTER COLUMN "type" TYPE "enum_requests_type"
        USING "type"::text::"enum_requests_type",
      ALTER COLUMN "priority" TYPE "enum_requests_priority"
        USING "priority"::text::"enum_requests_priority",
      ALTER COLUMN "status" TYPE "enum_requests_status"
        USING "status"::text::"enum_requests_status";
  `);
  await queryInterface.sequelize.query(`
    ALTER TABLE "requests"
      ALTER COLUMN "priority" SET DEFAULT 'normal',
      ALTER COLUMN "status" SET DEFAULT 'new';
  `);
  await queryInterface.addColumn('requests', 'user_id', {
    type: Sequelize.UUID,
    allowNull: true,
    references: { model: 'Users', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  });
  await queryInterface.removeColumn('requests', 'assignee');
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.addColumn('requests', 'assignee', {
    type: Sequelize.STRING(150),
    allowNull: true,
  });
  await queryInterface.removeColumn('requests', 'user_id');
  await queryInterface.sequelize.query(`
    ALTER TABLE "requests"
      ALTER COLUMN "priority" DROP DEFAULT,
      ALTER COLUMN "status" DROP DEFAULT;
  `);
  await queryInterface.sequelize.query(`
    ALTER TABLE "requests"
      ALTER COLUMN "type" TYPE VARCHAR(20) USING "type"::text,
      ALTER COLUMN "priority" TYPE VARCHAR(20) USING "priority"::text,
      ALTER COLUMN "status" TYPE VARCHAR(30) USING "status"::text;
  `);
  await queryInterface.sequelize.query(`
    ALTER TABLE "requests"
      ALTER COLUMN "priority" SET DEFAULT 'normal',
      ALTER COLUMN "status" SET DEFAULT 'new';
  `);
  await queryInterface.sequelize.query('DROP TYPE "enum_requests_status";');
  await queryInterface.sequelize.query('DROP TYPE "enum_requests_priority";');
  await queryInterface.sequelize.query('DROP TYPE "enum_requests_type";');
}
