import AppPage from "@/components/features/AppPage";

export default function SchedulePage() {
  return (
    <AppPage
      eyebrow="Schedule"
      title="Plan your classes for the week"
      description="Use your weekly schedule to stay ahead of live sessions, deadlines, and review periods."
      stats={[
        { label: "This Week", value: "18 sessions" },
        { label: "Free Blocks", value: "5" },
        { label: "Next Break", value: "Friday" },
      ]}
      primaryTitle="Upcoming timetable"
      primaryItems={[
        {
          title: "Monday 09:00 AM",
          description: "Frontend Engineering in Room A with live code review.",
          meta: "90 min",
        },
        {
          title: "Tuesday 01:30 PM",
          description: "Software Testing workshop and assignment briefing.",
          meta: "Lab",
        },
        {
          title: "Wednesday 10:00 AM",
          description: "Database Systems lecture with quiz preparation.",
          meta: "Lecture",
        },
      ]}
      secondaryTitle="Planning notes"
      secondaryItems={[
        {
          title: "Travel time",
          description: "Leave a 15 minute buffer between back-to-back sessions.",
          meta: "Reminder",
        },
        {
          title: "Review block",
          description: "Reserve Thursday evening for assignment catch-up.",
          meta: "Suggested",
        },
      ]}
    />
  );
}
