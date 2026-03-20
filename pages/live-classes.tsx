import AppPage from "@/components/features/AppPage";

export default function LiveClassesPage() {
  return (
    <AppPage
      eyebrow="Live Classes"
      title="Join and manage live class sessions"
      description="See active rooms, upcoming meetings, and quick actions for entering the right class on time."
      stats={[
        { label: "Active Rooms", value: "2" },
        { label: "Next Session", value: "10:30 AM" },
        { label: "Attendance Ready", value: "98%" },
      ]}
      primaryTitle="Available sessions"
      primaryItems={[
        {
          title: "Computer Networks",
          description: "Room is open with chat and attendance tracking enabled.",
          meta: "Join now",
        },
        {
          title: "Software Testing",
          description: "Instructor will open the room 10 minutes before class starts.",
          meta: "Starts soon",
        },
        {
          title: "English for IT",
          description: "Recorded backup is available if students miss the live session.",
          meta: "Recording",
        },
      ]}
      secondaryTitle="Session reminders"
      secondaryItems={[
        {
          title: "Camera check",
          description: "Verify microphone and camera before joining your next class.",
          meta: "Before class",
        },
        {
          title: "Attendance policy",
          description: "Join within the first 15 minutes to avoid late attendance.",
          meta: "Policy",
        },
      ]}
    />
  );
}
