import {
  ClipboardList,
  LayoutDashboard,
  Plus,
  type LucideIcon,
} from "lucide-react";
import { ROUTES } from "@/lib/constants";

export type DashboardNavItem = {
  href: string;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
};

export const DASHBOARD_NAV: DashboardNavItem[] = [
  {
    href: ROUTES.dashboard,
    label: "Leads",
    shortLabel: "Leads",
    icon: LayoutDashboard,
  },
  {
    href: ROUTES.dashboardInteresses,
    label: "Interesses",
    shortLabel: "Interesses",
    icon: ClipboardList,
  },
  {
    href: ROUTES.interno,
    label: "Nova Lead",
    shortLabel: "Nova",
    icon: Plus,
  },
];
