import dummy from "../../assets/dummy.jpg";
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

//dummy
export const bookedServices = [
  {
    id: "srv4",
    status: "Terminated",
    address: {
      towerName: "Downtown Penthouse",
      blockNo: "C",
      floor: 16,
      flatNo: 1604,
    },
    services: [
      {
        id: "svc4",
        name: "Glass Cleaning",
        image: dummy,
        rating: 4.0,
        price: 60,
        badge: null,
        description: "Exterior and interior glass/window cleaning.",
      },
      {
        id: "svc5",
        name: "Floor Cleaning",
        image: dummy,
        rating: 4.1,
        price: 90,
        badge: null,
        description: "Deep floor cleaning including scrubbing and polishing.",
      },
    ],
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
  },
  {
    id: "srv1",
    status: "Rejected",
    address: {
      towerName: "Palm Jumeirah Residence",
      blockNo: "B",
      floor: 5,
      flatNo: 502,
    },
    services: [
      {
        id: "svc1",
        name: "Electrical Work",
        image: dummy,
        rating: 4.8,
        price: 200,
        badge: "Top Rated",
        description:
          "Professional electrical services for repairs, installations, and maintenance work.",
      },
    ],
    serviceTime: {
      mode: "oneTime",
      oneTimeDate: "2025-07-01",
      oneTimeTime: "09:00",
      regular: null,
    },
    materialRequired: true,
  },
  {
    id: "srv2",
    status: "In Progress",
    address: {
      towerName: "Downtown Penthouse",
      blockNo: "A",
      floor: 12,
      flatNo: 1203,
    },
    services: [
      {
        id: "svc2",
        name: "Regular Cleaning",
        image: dummy,
        rating: 4.5,
        price: 120,
        badge: "Popular",
        description:
          "Thorough cleaning for your entire home, including living areas, kitchen, and bathrooms.",
      },
    ],
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
  },
];

export const serviceTableColumns = [
  { title: "Date", key: "date" },
  { title: "Time", key: "time" },
  { title: "Status", key: "status" },
];

export const staticServiceData = [
  {
    id: "2",
    date: "2025-08-06",
    time: "14:30",
    status: "Success",
  },
  {
    id: "3",
    date: "2025-08-08",
    time: "12:00",
    status: "Failed",
  },
  {
    id: "4",
    date: "2025-08-10",
    time: "16:00",
    status: "Upcoming",
  },
  {
    id: "5",
    date: "2025-08-10",
    time: "16:00",
    status: "Pending",
  },
  {
    id: "1",
    date: "2025-08-05",
    time: "09:00",
    status: "Pending",
  },
];
