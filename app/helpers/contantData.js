import ResidentialIcon from "../../assets/images/home/property-section/house.png";
import CommercialIcon from "../../assets/images/home/property-section/office.png";

export const propertyTypeOptions = [
  {
    label: "Residential",
    value: "Residential",
    icon: ResidentialIcon,
  },
  {
    label: "Commercial",
    value: "Commercial",
    icon: CommercialIcon,
  },
];

export const commercialCategories = ["Office", "Warehouse", "Retail"];
export const residentialCategories = [
  "Apartment",
  "Villa",
  "Townhouse",
  "Duplex",
];

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

export const serviceType = [
  "Deep Cleaning",
  "Regular Cleaning",
  "Permanent Staff",
];

export const specialServicesForOthers = [
  "Ironing",
  "Washing",
  "Wardrobe",
  "Sanitization",
  "Sofa Shampooing",
  "Carpet Shampooing",
  "Refrigerator",
  "Floor Scrubbing",
  "Pet Specialized Cleaning",
  "Internal Glass Cleaning",
  "External Glass Cleaning",
];
export const specialServicesForDeep = [
  "Wardrobe",
  "Sanitization",
  "Sofa Shampooing",
  "Carpet Shampooing",
  "Refrigerator",
  "Floor Scrubbing",
  "Pet Specialized Cleaning",
  "Internal Glass Cleaning",
  "External Glass Cleaning",
];

export const serviceTableColumns = [
  { title: "Property", key: "property" },
  { title: "Date", key: "date" },
  { title: "Time", key: "time" },
  { title: "Status", key: "status" },
];

//dummy
export const bookedServices = [
  {
    id: "srv1",
    status: "Rejected",
    propertyForService: [
      {
        id: "p2",
        location: "Palm Jumeirah",
        name: "Palm Jumeirah Residence",
      },
    ],
    propertyType: [{ label: "Residential", value: "Residential" }],
    service: { details: null, type: "Deep Cleaning" },
    serviceTime: {
      mode: "oneTime",
      oneTimeDate: "2025-07-01",
      oneTimeTime: "09:00",
      regular: null,
    },
    materialRequired: true,
    specialServicesSection: {
      specialServices: ["Sofa Shampooing"],
      specialServicesSwitch: true,
    },
  },
  {
    id: "srv2",
    status: "in progress",
    propertyForService: [
      {
        id: "p3",
        location: "Downtown Dubai",
        name: "Downtown Penthouse",
      },
    ],
    propertyType: [{ label: "Residential", value: "Residential" }],
    service: { details: null, type: "Regular Cleaning" },
    serviceTime: {
      mode: "regular",
      oneTimeDate: null,
      oneTimeTime: null,
      regular: {
        type: "all",
        startDate: "2025-07-01",
        startTime: "10:00",
        selectedDays: null,
        repeat: false,
        repeatDuration: null,
      },
    },
    materialRequired: true,
    specialServicesSection: {
      specialServices: [],
      specialServicesSwitch: false,
    },
  },
  {
    id: "srv3",
    status: "In Progress",
    propertyForService: [
      {
        id: "p3",
        location: "Downtown Dubai",
        name: "Downtown Penthouse",
      },
      {
        id: "p2",
        location: "Palm Jumeirah",
        name: "Palm Jumeirah Residence",
      },
    ],
    propertyType: [{ label: "Commercial", value: "Commercial" }],
    service: {
      details: {
        anyQty: "20",
        femaleQty: "",
        femaleRequired: false,
        genderOption: "any",
        hours: "8h",
        maleQty: "",
        maleRequired: false,
      },
      type: "Permanent Staff",
    },
    serviceTime: {
      mode: "regular",
      oneTimeDate: null,
      oneTimeTime: null,
      regular: {
        type: "selected",
        startDate: "2025-07-01",
        startTime: "14:00",
        selectedDays: ["mon", "wed", "fri"],
        repeat: true,
        repeatDuration: "2w",
      },
    },
    materialRequired: true,
    specialServicesSection: {
      specialServices: [],
      specialServicesSwitch: false,
    },
  },
  {
    id: "srv4",
    status: "Terminated",
    propertyForService: [
      {
        id: "p3",
        location: "Downtown Dubai",
        name: "Downtown Penthouse",
      },
    ],
    propertyType: [{ label: "Commercial", value: "Commercial" }],
    service: {
      details: {
        anyQty: "",
        femaleQty: "2",
        femaleRequired: true,
        genderOption: "select",
        hours: "12h",
        maleQty: "5",
        maleRequired: true,
      },
      type: "Permanent Staff",
    },
    serviceTime: {
      mode: "regular",
      oneTimeDate: null,
      oneTimeTime: null,
      regular: {
        type: "selected",
        startDate: "2025-07-01",
        startTime: "14:00",
        selectedDays: ["mon", "wed", "fri"],
        repeat: true,
        repeatDuration: "2w",
      },
    },
    materialRequired: true,
    specialServicesSection: {
      specialServices: [],
      specialServicesSwitch: false,
    },
  },
];
//dummy
export const staticServiceData = [
  {
    id: "1",
    property: "Sunset Villa",
    materialRequired: true,
    date: "2025-08-05",
    time: "09:00",
    status: "Pending",
    serviceType: "Deep",
  },
  {
    id: "2",
    property: "Palm Residency",
    materialRequired: false,
    date: "2025-08-06",
    time: "14:30",
    status: "Success",
    serviceType: "Cleaning",
  },
  {
    id: "3",
    property: "Blue Lagoon",
    materialRequired: true,
    date: "2025-08-08",
    time: "12:00",
    status: "Failed",
    serviceType: "Maintenance",
  },
  {
    id: "4",
    property: "Ocean Heights",
    materialRequired: false,
    date: "2025-08-10",
    time: "16:00",
    status: "Pending",
    serviceType: "Pest Control",
  },
  {
    id: "5",
    property: "Ocean Heights",
    materialRequired: false,
    date: "2025-08-10",
    time: "16:00",
    status: "Pending",
    serviceType: "Pest Control",
  },
];
