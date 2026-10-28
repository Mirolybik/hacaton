import * as XLSX from "xlsx";

const workbook = XLSX.readFile("./src/files/equipments_task.xlsx", {
  cellDates: true,
});

function parseEquipments() {
  const sheet = workbook.Sheets["Объекты ремонта"];
  const data = XLSX.utils.sheet_to_json<TParserEquipments>(sheet);

  data.forEach((row) => {
    const equipmentId = row["Идентификатор для загрузки"];

    if (equipmentId) {
      const equipmentName = row["Наименование оборудования"];
      const typeObjReg = row["Типовой Ор"];
      const dateComEx = row["Дата ввода в эксплуатацию"];
      const dateBuild = row["Дата выпуска (постройки)"];
      const workShed = row["График работы"];
      const usefuleLife = row["Срок полезного использования. Месяцев"];
      const invNumber = row["Инвентарный №"];
    }
  });
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
