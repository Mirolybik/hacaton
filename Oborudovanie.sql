-- Таблица "Оборудование" --
CREATE TABLE equipment(
--Идентификатор--
equipment_ID varchar(100) primary key,
--Наименование--
equipment_Name varchar(255) not null,
--Уровни --
level_0 varchar(100),
level_1 varchar(100),
level_2 varchar(100),
level_3 varchar(100),
level_4 varchar(100),
level_5 varchar(100),
level_6 varchar(100),

--Типовой ОР--
type_obj_reg varchar(100),
--Дата ввода в эксплуатацию--
date_com_ex timestamp,
--Дата постройки --
date_build timestamp,
--График работы--
work_shed varchar(100),
--Срок полезного использования (месяцы)--
usrful_life integer,
--Инвентарный номер--
inv_number varchar(255),
--Комментарий--
comment TEXT
)