"use client";

import { BarChart, Compass, Layout, List } from "lucide-react";
import SidebarItem from "./sidebar-item";
import router from "next/router";
import { usePathname } from "next/navigation";
const guestRoutes = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: Compass,
    label: "Browse",
    href: "/search",
  },
];

const teacherRoutes = [
  {
    icon: List,
    label: "Courses",
    href: "/teacher/courses",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/teacher/analytics",
  },
];
export const SidebarRoutes = () => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.includes("/teacher");
  const routes = isTeacherPage ? teacherRoutes : guestRoutes;

  return (
    <div className="flex flex-col w-full">
      {routes.map((router) => (
        <SidebarItem
          key={router.href}
          icon={router.icon}
          label={router.label}
          href={router.href}
        />
      ))}
    </div>
  );
};
