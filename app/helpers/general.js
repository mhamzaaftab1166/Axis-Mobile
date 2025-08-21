import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

export function getStatusColor(status) {
  switch (status?.toLowerCase()) {
    case "pending":
      return { bg: "#FFF3CD", text: "#856404" }; // light yellow bg, brown text
    case "in progress":
      return { bg: "#D1ECF1", text: "#0C5460" }; // light blue bg, dark blue text
    case "completed":
      return { bg: "#D4EDDA", text: "#155724" }; // light green bg, green text
    case "terminated":
      return { bg: "#E0E0E0", text: "#333" }; // gray
    case "rejected":
      return { bg: "#F8D7DA", text: "#721C24" }; // light red bg, red text
    default:
      return { bg: "#EEE", text: "#000" }; // fallback
  }
}

export const getCardIcon = (type) => {
  switch (type.toLowerCase()) {
    case "visa":
      return <FontAwesome5 name="cc-visa" size={32} color="#1a1f71" />;
    case "mastercard":
      return <FontAwesome5 name="cc-mastercard" size={32} color="#eb001b" />;
    case "amex":
      return <FontAwesome5 name="cc-amex" size={32} color="#2e77bc" />;
    default:
      return (
        <MaterialCommunityIcons
          name="credit-card-outline"
          size={32}
          color="#888"
        />
      );
  }
};

export const formatDate = (date) => {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};
export const formatTime = (date) => {
  const d = new Date(date);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
};
export const parseDateToPicker = (dateString) => {
  if (!dateString) return new Date();
  const [yyyy, mm, dd] = dateString.split("-").map(Number);
  return new Date(yyyy, mm - 1, dd);
};
export const parseTimeToPicker = (timeString) => {
  if (!timeString) return new Date();
  const [hh, mm] = timeString.split(":").map(Number);
  const d = new Date();
  d.setHours(hh, mm, 0, 0);
  return d;
};

const UAE_OFFSET_MINUTES = 4 * 60;

function toUAEDate(date) {
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  return new Date(utc + UAE_OFFSET_MINUTES * 60000);
}

export function calculateTotalServiceDays(
  startDateStr,
  type = "all",
  selectedDays = [],
  repeatDuration = null
) {
  const dayMap = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };

  let startDate = toUAEDate(new Date(startDateStr));
  let endDate = new Date(startDate);

  if (!repeatDuration) {
    if (type === "all") return 7;
    return selectedDays.length || 0;
  }

  const amount = parseInt(repeatDuration);
  const unit = repeatDuration.slice(-1).toLowerCase();

  if (unit === "w") {
    endDate.setUTCDate(endDate.getUTCDate() + amount * 7 - 1);
  } else if (unit === "m") {
    endDate.setUTCMonth(endDate.getUTCMonth() + amount);
    endDate.setUTCDate(endDate.getUTCDate() - 1);
  } else if (unit === "y") {
    endDate.setUTCFullYear(endDate.getUTCFullYear() + amount);
    endDate.setUTCDate(endDate.getUTCDate() - 1);
  }

  // Count days
  let totalDays = 0;
  for (
    let d = new Date(startDate);
    d <= endDate;
    d.setUTCDate(d.getUTCDate() + 1)
  ) {
    if (type === "all") {
      totalDays++;
    } else if (type === "selected") {
      const dayStr = Object.keys(dayMap).find(
        (key) => dayMap[key] === d.getUTCDay()
      );
      if (selectedDays.includes(dayStr)) totalDays++;
    }
  }

  return totalDays;
}

// helpers/bookingHelpers.js
export const getScheduleText = (item) => {
  if (!item?.serviceTime) return "";

  if (item.serviceTime.mode === "oneTime") {
    return `${item.serviceTime.oneTimeDate} • ${item.serviceTime.oneTimeTime}`;
  }

  if (item.serviceTime.regular) {
    const { type, selectedDays, startDate, startTime } =
      item.serviceTime.regular;

    const daysText =
      type === "all"
        ? "Daily"
        : selectedDays
            ?.map((d) => d.charAt(0).toUpperCase() + d.slice(1))
            .join(", ");

    return `${daysText} • from ${startDate} ${startTime}`;
  }

  return "";
};

export const getAddressText = (item) => {
  if (!item?.address) return "";
  const { towerName, blockNo, floor, flatNo } = item.address;
  return `${towerName}, Block ${blockNo}, Floor ${floor}, Flat ${flatNo}`;
};

export const getScheduleTextDetail = (service) => {
  const st = service?.serviceTime;
  if (!st) return "";

  if (st.mode === "oneTime") {
    const date = st.oneTimeDate ?? "";
    const time = st.oneTimeTime ?? "";
    return `${date} @ ${time}`.trim();
  }

  const reg = st.regular;
  if (!reg) return "";

  const daysText =
    reg.type === "all"
      ? "Daily"
      : reg.selectedDays
          ?.map((d) => d[0].toUpperCase() + d.slice(1))
          .join(", ");

  const startDate = reg.startDate ?? "";
  const startTime = reg.startTime ?? "";

  let base = `${daysText} from ${startDate} ${startTime}`.trim();

  if (reg.repeat) {
    const dur = reg.repeatDuration
      ? ` • Repeats ${reg.repeatDuration}`
      : " • Repeats";
    base += dur;
  }

  return base;
};

export const getAddressTextDetail = (service) => {
  const a = service?.address;
  if (!a) return "";
  const { towerName, blockNo, floor, flatNo } = a;
  return `${towerName}, Block ${blockNo}, Floor ${floor}, Flat ${flatNo}`;
};
