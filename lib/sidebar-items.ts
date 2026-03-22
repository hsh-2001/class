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
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  roles: AppRole[];
};

export const sidebarItems: SidebarItem[] = [
  { label: "Home", href: "/", icon: LayoutDashboard, roles: [APP_ROLES.ADMIN, APP_ROLES.STUDENT, APP_ROLES.TEACHER] },
  { label: "Members", href: "/members", icon: Users, roles: [APP_ROLES.ADMIN] },
  { label: "Courses", href: "/courses", icon: BookOpen, roles: [APP_ROLES.ADMIN, APP_ROLES.STUDENT] },
  { label: "Live Classes", href: "/live-classes", icon: Video, roles: [APP_ROLES.ADMIN, APP_ROLES.STUDENT, APP_ROLES.TEACHER] },
  { label: "Schedule", href: "/schedule", icon: CalendarDays, roles: [APP_ROLES.ADMIN, APP_ROLES.STUDENT, APP_ROLES.TEACHER] },
  { label: "Assignments", href: "/assignments", icon: ClipboardCheck, roles: [APP_ROLES.ADMIN, APP_ROLES.STUDENT, APP_ROLES.TEACHER] },
  { label: "Messages", href: "/messages", icon: MessageSquare, roles: [APP_ROLES.ADMIN, APP_ROLES.STUDENT, APP_ROLES.TEACHER] },
  { label: "Settings", href: "/settings", icon: Settings, roles: [APP_ROLES.ADMIN, APP_ROLES.STUDENT, APP_ROLES.TEACHER] },
  { label: "Profile", href: "/profile", icon: User, roles: [APP_ROLES.ADMIN, APP_ROLES.STUDENT, APP_ROLES.TEACHER] },
];
