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

// utils/getInitialPropertyData.js
export const getInitialPropertyData = (parsed) => {
  return parsed
    ? {
        propertyType: parsed.propertyType || [],
        property_name: parsed.property_name || "",
        property_category: parsed.property_category || "",
        bhk: parsed.bhk != null ? parsed.bhk : null,
        flat_villa_shop_no: parsed?.address?.flat_villa_shop_no || "",
        tower_villa_shop_name: parsed?.address?.tower_villa_shop_name || "",
        floor: parsed?.address?.floor || "",
        city: parsed?.address?.city || "",
        full_address: parsed.address?.full_address || "",
        pinLink: parsed.pinLink || "",
        area: parsed.area || { exact: true, unit: "Sq Mt", value: "" },
      }
    : {
        propertyType: [],
        property_name: "",
        property_category: "",
        bhk: null,
        flat_villa_shop_no: "",
        tower_villa_shop_name: "",
        floor: "",
        city: "",
        full_address: "",
        pinLink: "",
        area: { exact: true, unit: "Sq Mt", value: "" },
      };
};

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
