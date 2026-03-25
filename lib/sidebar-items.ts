import { AppRole, APP_ROLES } from "./role-access";
import type { ComponentType } from "react";
import {
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Users,
  Video,
  User
} from "lucide-react";

type SidebarItem = {
  labelKey: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  roles: AppRole[];
};

export const sidebarItems: SidebarItem[] = [
  { labelKey: "sidebar.home", href: "/", icon: LayoutDashboard, roles: [APP_ROLES.ADMIN, APP_ROLES.TEACHER] },
  { labelKey: "sidebar.members", href: "/members", icon: Users, roles: [APP_ROLES.ADMIN] },
  { labelKey: "sidebar.courses", href: "/courses", icon: BookOpen, roles: [APP_ROLES.ADMIN, APP_ROLES.STUDENT] },
  { labelKey: "sidebar.liveClasses", href: "/live-classes", icon: Video, roles: [APP_ROLES.ADMIN, APP_ROLES.STUDENT, APP_ROLES.TEACHER] },
  { labelKey: "sidebar.schedule", href: "/schedule", icon: CalendarDays, roles: [APP_ROLES.ADMIN, APP_ROLES.STUDENT, APP_ROLES.TEACHER] },
  { labelKey: "sidebar.assignments", href: "/assignments", icon: ClipboardCheck, roles: [APP_ROLES.ADMIN, APP_ROLES.STUDENT, APP_ROLES.TEACHER] },
  { labelKey: "sidebar.messages", href: "/messages", icon: MessageSquare, roles: [APP_ROLES.ADMIN, APP_ROLES.STUDENT, APP_ROLES.TEACHER] },
  { labelKey: "sidebar.settings", href: "/settings", icon: Settings, roles: [APP_ROLES.ADMIN] },
  { labelKey: "sidebar.profile", href: "/profile", icon: User, roles: [APP_ROLES.ADMIN, APP_ROLES.STUDENT, APP_ROLES.TEACHER] },
];
