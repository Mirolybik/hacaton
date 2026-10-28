export const ROLES = {
  duty: "дежурный",
  engineer: "инженер",
  director: "директор",
};

export const TYPES = {
  inspection: "осмотр",
  repair: "ремонт",
};

export const PRIOS = {
  low: "низкий",
  normal: "обычный",
  high: "высокий",
};

export const STATUSES = {
  new: "новая",
  in_progress: "в работе",
  waiting_parts: "ждёт запчасти",
  done: "выполнена",
};

export const NEXT = {
  new: ["in_progress"],
  in_progress: ["waiting_parts", "done"],
  waiting_parts: ["in_progress"],
  done: [],
};
