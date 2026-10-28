--История работы с оборудованием--
create table equipment_history(
--ID записи (автогенерация)--
hist_id SERIAl primary key,

--ID оборудования, внеш. ID удален - этот ID null--
equipment_ID varchar(100) references equipment(equipment_ID) on delete set null,

--текущее состояние--
cur_state varchar(100),
--Причина простоя--
reason_down TEXT,
--Выполненный ремонт--
complete_repair TEXT,
--Дата начала работы--
date_work_begin timestamp,
--Дата окончания работы--
date_work_end timestamp,
--Дата окончания ремонта--
date_rep_end timestamp,
--Побочные данные в JSON--
sec_data JSONB
)