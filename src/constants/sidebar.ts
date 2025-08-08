import {
  MdDashboard,
  MdPolicy,
  MdAssignmentReturned,
  MdSettings,
  MdPeople,
  MdNote,
} from "react-icons/md";
import { BsPeopleFill, BsTools, BsFileBarGraph } from "react-icons/bs";
import { FaUsersCog } from "react-icons/fa";

const sideBarDetails = [
  { title: "Dashboard", icon: MdDashboard, key: "/dashboard" },
  {
    title: "Prospects",
    icon: MdPeople,
    key: "/prospects",
  },
  {
    title: "Customers",
    icon: BsPeopleFill,
    key: "/customers",
  },
  {
    title: "Policies",
    icon: MdPolicy,
    key: "/policies",
  },
  {
    title: "Notes",
    icon: MdNote,
    key: "/notes",
  },
  {
    title: "Claims Management",
    icon: MdAssignmentReturned,
    key: "/claims",
  },
  {
    title: "Staff",
    icon: FaUsersCog,
    key: "/staff",
  },
  {
    title: "Technical",
    icon: BsTools,
    key: "tech",
    subMenu: [
      { title: "Business Class", key: "/business" },
      { title: "Products", key: "/products" },
      { title: "Underwriters", key: "/underwriters" },
    ],
  },
  {
    title: "Reports",
    icon: BsFileBarGraph,
    key: "/reports",
    subMenu: [
      { title: "Accounting", key: "/reports/" },
      { title: "NAICOM", key: "/reports/" },
    ],
  },
  {
    title: "Configurations",
    icon: MdSettings,
    key: "config",
    subMenu: [{ title: "Roles", key: "/roles" }],
  },
];

export default sideBarDetails;
