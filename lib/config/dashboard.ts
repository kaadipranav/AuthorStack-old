import type { NavItem } from "@/types/navigation";

export const dashboardNav: NavItem[] = [
  {
    title: "Overview",
    href: "/dashboard",
    intent: "primary",
  },
  {
    title: "Books",
    href: "/dashboard/books",
    intent: "primary",
  },
  {
    title: "Launch Checklists",
    href: "/dashboard/checklists",
    intent: "primary",
  },
  {
    title: "Platform Connections",
    href: "/dashboard/connections",
    intent: "primary",
  },
  {
    title: "Ingestion Jobs",
    href: "/dashboard/ingestion",
    intent: "primary",
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    intent: "secondary",
  },
];

