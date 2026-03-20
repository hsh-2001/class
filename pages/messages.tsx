import AppPage from "@/components/features/AppPage";

export default function MessagesPage() {
  return (
    <AppPage
      eyebrow="Messages"
      title="Keep communication simple and organized"
      description="Check new messages from teachers, classmates, and system announcements in one stream."
      stats={[
        { label: "Unread", value: "12" },
        { label: "Teacher Threads", value: "5" },
        { label: "Class Groups", value: "3" },
      ]}
      primaryTitle="Recent conversations"
      primaryItems={[
        {
          title: "Frontend Engineering Group",
          description: "Classmates are sharing notes before the live review session.",
          meta: "6 new",
        },
        {
          title: "Database Instructor",
          description: "Feedback is ready for the schema assignment draft.",
          meta: "Reply needed",
        },
        {
          title: "System Support",
          description: "Your last login alert was confirmed as expected activity.",
          meta: "Resolved",
        },
      ]}
      secondaryTitle="Inbox tips"
      secondaryItems={[
        {
          title: "Priority replies",
          description: "Respond to teachers first to keep class tasks moving.",
          meta: "Suggested",
        },
        {
          title: "Quiet hours",
          description: "Mute non-urgent group threads during study sessions.",
          meta: "Productivity",
        },
      ]}
    />
  );
}
