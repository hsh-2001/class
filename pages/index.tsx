import AppPage from "@/components/features/AppPage";

export default function Home() {
  return (
    <AppPage
      eyebrow="Dashboard"
      title="Welcome back to your online class system"
      description="Track today’s classes, pending assignments, and important updates without leaving the dashboard."
      stats={[
        { label: "Classes Today", value: "4" },
        { label: "Pending Work", value: "3 tasks" },
        { label: "Unread Messages", value: "12" },
      ]}
      primaryTitle="Today at a glance"
      primaryItems={[
        {
          title: "Frontend Engineering",
          description: "Live session starts at 09:00 AM with screen-sharing enabled.",
          meta: "In 25 min",
        },
        {
          title: "Database Systems",
          description: "Review the normalization worksheet before the afternoon class.",
          meta: "1 file",
        },
        {
          title: "UI Design Critique",
          description: "Prepare your latest layout draft for peer feedback.",
          meta: "2:00 PM",
        },
      ]}
      secondaryTitle="Recent updates"
      secondaryItems={[
        {
          title: "Teacher note",
          description: "Upload your attendance by the end of the day.",
          meta: "Class admin",
        },
        {
          title: "System notice",
          description: "Video rooms are stable and available for all courses.",
          meta: "Platform",
        },
      ]}
    />
  );
}
