import {
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Users,
  Video,
} from "lucide-react";

export const sidebarItems = [
  { label: "Home", href: "/", icon: LayoutDashboard },
  { label: "Members", href: "/members", icon: Users },
  { label: "Live Classes", href: "/live-classes", icon: Video },
  { label: "Courses", href: "/courses", icon: BookOpen },
  { label: "Schedule", href: "/schedule", icon: CalendarDays },
  { label: "Assignments", href: "/assignments", icon: ClipboardCheck },
  { label: "Messages", href: "/messages", icon: MessageSquare },
  { label: "Settings", href: "/settings", icon: Settings },
] as const;
