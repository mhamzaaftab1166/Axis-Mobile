import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Linking } from "react-native";
import CryptoJS from "react-native-crypto-js";
import { SUB_SERVICES_STATUS_MAP } from "./contantData";

dayjs.extend(customParseFormat);

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

export function getStatusColor(status) {
  switch (status?.toLowerCase()) {
    case "pending":
      return { bg: "#FFF3CD", text: "#856404", label: "Pending" }; // light yellow bg, brown text
    case "inprogress":
      return { bg: "#D1ECF1", text: "#00d18bff", label: "In Progress" }; // light blue bg, dark blue text
    case "complete":
      return { bg: "#D4EDDA", text: "#155724", label: "Completed" }; // light green bg, green text
    case "terminated":
      return { bg: "#E0E0E0", text: "#333", label: "Terminated" }; // gray
    case "rejected":
      return { bg: "#F8D7DA", text: "#721C24", label: "Rejected" }; // light red bg, red text
    case "success":
      return { bg: "#B8DAFF", text: "#004085", label: "Success" };
    case "confirmed":
      return { bg: "#B8DAFF", text: "#00d18bff", label: "Confirmed" };
    case "paymentcancelled":
      return { bg: "#F8D7DA", text: "#721C24", label: "Payment Cancelled" }; // light red bg, red text
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
    return `${formatDateNew(item.serviceTime.oneTimeDate)} • ${
      item.serviceTime.oneTimeTime
    }`;
  }

  if (item.serviceTime.regular) {
    const { type, selectedDays, startDate, startTime } =
      item.serviceTime.regular;

    const daysText =
      type === "everyday"
        ? "Daily"
        : selectedDays
            ?.map((d) => d.charAt(0).toUpperCase() + d.slice(1))
            .join(", ");

    return `${daysText} • from ${formatDateNew(startDate)} ${startTime}`;
  }

  return "";
};

const formatDateNew = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
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
    const date = formatDateNew(st.oneTimeDate) ?? "";
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

  let base = `${daysText} from ${formatDateNew(startDate)} ${startTime}`.trim();

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

export const formatAddressLabel = (addr) => {
  if (!addr) return "No address selected";
  const prop = addr.towerId?.towerName ?? "";
  const parts = [];
  if (addr.blockId?.blockName) parts.push(addr.blockId.blockName);
  if (addr.floorId?.floorName) parts.push(addr.floorId.floorName);
  if (addr.unitId?.unitName)
    parts.push(`${addr.unitId.unitName} - ${addr.unitId.unitCapacity} BHK`);
  const meta = parts.join(" • ");
  return { main: prop, meta };
};

export const buildServiceOptions = (services) => {
  return Object.values(
    services.reduce((acc, service) => {
      const cat = service.category?.toLowerCase() || "unknown";

      if (!acc[cat]) {
        acc[cat] = {
          value: cat,
          label: cat.charAt(0).toUpperCase() + cat.slice(1),
          serviceCount: 0,
        };
      }

      acc[cat].serviceCount += 1;
      return acc;
    }, {})
  );
};

export const filterServices = (
  categories = [],
  services = [],
  searchText = ""
) => {
  if (!Array.isArray(services)) return [];

  const lowerCats = categories.map((c) => c.toLowerCase());
  const lowerSearch = searchText.trim().toLowerCase();

  return services.filter((service) => {
    const matchesCategory =
      lowerCats.length === 0 ||
      lowerCats.includes(service.category?.toLowerCase());

    const matchesSearch =
      lowerSearch === "" || service.name?.toLowerCase().includes(lowerSearch);

    return matchesCategory && matchesSearch;
  });
};

export const calculateTax = (amount, percentage) => {
  const num = Number(amount) || 0;
  const rate = Number(percentage) || 0;
  return num * (rate / 100);
};

// service payload
export const formatPayload = (values, selectedAddress, encryptionKey, serviceId, noOfDays = 1) => {
  const unitCapacity = selectedAddress?.unitId?.unitCapacity || 1;
  
  const { amount } = calculateTotals(
    values.selectedServices,
    unitCapacity
  );

  return {
    cvv: encryptCVV(values?.cvv, encryptionKey) || null,
    selectedCard: values?.selectedCard ? { id: values.selectedCard.id } : null,
    selectedServices: values.selectedServices?.map((s) => ({ id: s.id })) || [],
    serviceTime: values.serviceTime,
    amount,
    address: selectedAddress._id,
    serviceId,
    noOfDays,
    materialRequired: values?.materialRequired
  };
};

export const calculateTotals = (services, unitCapacity, taxRate = 5, noOfDays = 1) => {
  // Base amount from services
  const baseAmount = services.reduce((sum, service) => {
    return sum + getServicePrice(service, unitCapacity);
  }, 0);

  const amount = baseAmount * noOfDays;
  const tax = (amount * taxRate) / 100;
  const totalAmountAfterTax = amount + tax;

  return { amount, tax, totalAmountAfterTax };
};


function getServicePrice(service, unitCapacity = 1) {
  if (!service.price) return 0;
  return service.price[`${unitCapacity} BHK`];
}

export const encryptCVV = (cvv, SECRET_KEY) => {
  return CryptoJS.AES.encrypt(cvv, SECRET_KEY).toString();
};

// filter services based on status
export const filterBookings = (data, mode) => {
  const UPCOMING_STATUSES = [
    "inProgress",
    "processing",
    "requires_action",
    "pending",
    "confirmed",
    "success",
  ];

  const PREVIOUS_STATUSES = [
    "complete",
    "cancelled",
    "terminated",
    "rejected",
    "failed",
    "paymentCancelled",
  ];

  return data?.filter((item) => {
    if (mode === "upcoming") {
      return UPCOMING_STATUSES.includes(item.status);
    } else if (mode === "previous") {
      return PREVIOUS_STATUSES.includes(item.status);
    }
    return true;
  });
};

export const getSubServiceStatusConfig = (status) => {
  if (!status) return SUB_SERVICES_STATUS_MAP.default;
  return (
    SUB_SERVICES_STATUS_MAP[status.toLowerCase()] ||
    SUB_SERVICES_STATUS_MAP.default
  );
};

export const paymentHistoryStatusConfig = (st) => {
  const map = {
    requires_payment_method: {
      label: "Requires Payment Method",
      color: "#F59E0B",
      icon: "credit-card-outline",
    },
    requires_action: {
      label: "Requires Action",
      color: "#F97316",
      icon: "gesture-tap",
    },
    processing: {
      label: "Processing",
      color: "#0EA5E9",
      icon: "progress-clock",
    },
    succeeded: { label: "Succeeded", color: "#10B981", icon: "check-circle" },
    canceled: { label: "Canceled", color: "#6B7280", icon: "close-circle" },
    failed: { label: "Failed", color: "#EF4444", icon: "alert-circle" },
    paymentfailed: {
      label: "Failed",
      color: "#EF4444",
      icon: "alert-circle",
    },
  };
  return (
    map[(st || "").toLowerCase()] || {
      label: st || "Unknown",
      color: colors.placeholder,
      icon: "help-circle",
    }
  );
};

export const formatPaymentHistoryCurrency = (amt, currency = "AED") => {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    }).format(amt);
  } catch {
    return `${currency} ${amt}`;
  }
};

export const openPaymentHistoryReceipt = async (url) => {
  if (!url) return;
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) await Linking.openURL(url);
  } catch (e) {}
};

// get the next 6 days sub-services
export const getNextWeekServices = (supervisorServices) => {

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sixDaysLater = new Date();
  sixDaysLater.setDate(today.getDate() + 6);
  sixDaysLater.setHours(23, 59, 59, 999);

  return supervisorServices
    ?.map((service) => {
      const upcomingSubs = service.subServices
        .filter((sub) => {
          const subDate = new Date(sub.scheduledDate);
          return subDate >= today && subDate <= sixDaysLater && (sub.status === "Pending" || sub.status === "InProgress");
        })
        .map((sub) => ({
          ...sub,
          scheduledDate: new Date(sub.scheduledDate).toLocaleDateString(
            "en-GB",
            {
              day: "numeric",
              month: "long",
              year: "numeric",
            }
          ),
        }));

      if (upcomingSubs.length > 0) {
        return {
          ...service,
          subServices: upcomingSubs,
        };
      }
      return null;
    })
    .filter(Boolean);
};

export const filterByStatus = (supervisorServices, statusFilter = []) => {
  return supervisorServices
    ?.map((service) => {
      const filteredSubs = service.subServices
        .filter((sub) => statusFilter.includes(sub.status))
        .map((sub) => ({
          ...sub,
          scheduledDate: new Date(sub.scheduledDate).toLocaleDateString(
            "en-GB",
            {
              day: "numeric",
              month: "long",
              year: "numeric",
            }
          ),
        }));

      if (filteredSubs.length > 0) {
        return {
          ...service,
          startDate: new Date(service.startDate).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          subServices: filteredSubs,
        };
      }
      return null;
    })
    .filter(Boolean);
};


export const buildUpdatePayload = (serviceTime, newServices, bookingId, selectedAddress) => {
  // If serviceTime already has a `serviceTime` key, unwrap it
  const formattedServiceTime = serviceTime?.serviceTime || serviceTime;

  let noOfDays = 1;
  if(formattedServiceTime.mode === "regular"){
    const { startDate, type, selectedDays, repeatDuration } = formattedServiceTime.regular;
    noOfDays = calculateTotalServiceDays(startDate, type, selectedDays, repeatDuration );
  }

  return {
    bookingId, // the ID of the booking you are updating
    serviceTime: formattedServiceTime, // only keep one level
    selectedServices: newServices.map(s => s.id), // only send service IDs
    addressId: selectedAddress?.id,
    noOfDays
  };
};

export const getTimeDifference = (dateString) => {
  const now = dayjs();
  const parsedDate = dayjs(dateString, "M-D-YYYY h:mma");
  if (!parsedDate.isValid()) return "";

  const diffMinutes = now.diff(parsedDate, "minute");
  const diffHours = now.diff(parsedDate, "hour");
  const diffDays = now.diff(parsedDate, "day");

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;

  return `${diffDays}d ago`;
};