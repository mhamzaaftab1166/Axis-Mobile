export const cities = [
  "Abu Dhabi",
  "Ajman",
  "Al Ain",
  "Dubai",
  "Fujairah",
  "Ras Al Khaimah",
  "Sharjah",
  "Umm Al Quwain",
];

export const serviceOptions = [
  { value: "cleaning", label: "Cleaning", serviceCount: 4 },
  { value: "repairing", label: "Repairing", serviceCount: 3 },
  { value: "moving", label: "Moving", serviceCount: 5 },
  { value: "painting", label: "Painting", serviceCount: 2 },
  { value: "plumbing", label: "Plumbing", serviceCount: 3 },
];

export const serviceTableColumns = [
  { title: "ID", key: "uniqueId" },
  { title: "Day", key: "scheduledDay" },
  { title: "Date", key: "scheduledDate" },
  { title: "Time", key: "scheduledTime" },
  { title: "Status", key: "status" },
];

export const SUB_SERVICES_STATUS_MAP = {
  pending: { color: "#F57C00", icon: "clock-outline", label: "Pending" },
  inprogress: {
    color: "#1565C0",
    icon: "progress-clock",
    label: "In Progress",
  },
  completed: {
    color: "#2E7D32",
    icon: "check-circle-outline",
    label: "Completed",
  },
  failed: { color: "#C62828", icon: "close-circle-outline", label: "Failed" },
  upcoming: { color: "#b4a90dff", icon: "close-circle-outline", label: "Upcoming" },
  missed: { color: "#C62828", icon: "close-circle-outline", label: "Missed" },
  cancelled: { color: "#9E9E9E", icon: "cancel", label: "Cancelled" },
  default: { color: "#616161", icon: "circle-outline", label: "Unknown" },
};

export const SUB_SERVICES_AVAILABLE_STATUSES = [
  "InProgress",
  "Pending",
  "Completed",
  "Missed",
  "Cancelled",
];

export const subServicesStatusGroups = {
  previous: ["Completed", "Missed", "Cancelled", "Failed"],
  assigned: ["Pending", "Upcoming", "InProgress"],
};


export const subServicesStatusGroupsInspection = {
  previous: ["completed", "missed", "cancelled", "failed"],
  assigned: ["pending", "upcoming", "inProgress","confirmed","ongoing"],
};