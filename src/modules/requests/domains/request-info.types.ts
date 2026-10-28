export const REQUEST_TYPES = ["inspection", "repair"] as const;
export const REQUEST_PRIORITIES = ["low", "normal", "high"] as const;
export const REQUEST_STATUSES = [
  "new",
  "in_progress",
  "waiting_parts",
  "done",
] as const;

export type RequestType = (typeof REQUEST_TYPES)[number];
export type RequestPriority = (typeof REQUEST_PRIORITIES)[number];
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export const STATUS_TRANSITIONS: Record<RequestStatus, RequestStatus[]> = {
  new: ["in_progress"],
  in_progress: ["waiting_parts", "done"],
  waiting_parts: ["in_progress"],
  done: [],
};
