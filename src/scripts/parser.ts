import * as XLSX from "xlsx";
import { Equipment } from "../modules/equipment/domains/equipment.model";
import { EquipmentRepository } from "../modules/equipment/equipment.repository";
import { connectDatabase, sequelize } from "../db";

const workbook = XLSX.readFile("./src/files/equipments_task.xlsx", {
  cellDates: true,
});

async function parseEquipments() {
  const sheet = workbook.Sheets["Объекты ремонта"];
  const data = XLSX.utils.sheet_to_json<TParserEquipments>(sheet);

  const equipments = [];

  data.forEach((row) => {
    const equipmentId = row["Идентификатор для загрузки"];

    if (equipmentId) {
      const equipmentName = row["Наименование оборудования"];
      const typeObjReg = row["Типовой ОР"];
      const dateCommissioned = row["Дата ввода в эксплуатацию"];
      const dateBuild = row["Дата выпуска (постройки)"];
      const workSchedule = row["График работы"];
      const usefulLifeMonths = row["Срок полезного использования. Месяцев"];
      const inventoryNumber = row["Инвентарный №"];

      const equipment = {
        equipmentId,
        equipmentName,
        typeObjReg,
        dateCommissioned,
        dateBuild,
        workSchedule,
        usefulLifeMonths,
        inventoryNumber,
      };

      equipments.push(equipment);
    }
  });

  await connectDatabase();

  try {
    const equipmentRepo = new EquipmentRepository();
    await equipmentRepo.createEquipments(equipments);
  } finally {
    await sequelize.close();
  }
}

function parseHistory() {
  const sheet = workbook.Sheets["Ввод начальных данных"];

  const data = XLSX.utils.sheet_to_json<TParserHistory>(sheet, {
    raw: true,
  });

  data.forEach((row) => {
    const rowId = row["Идентификатор загрузки"];

    if (rowId) {
      const status = row["Текущее состояние"];
      const completeWorks = row["Выполненные ремонтные работы"];
      const finishDate = row["Дата окончания ремеонта"];
    }
  });
}

parseEquipments();
// parseHistory();
