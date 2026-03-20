import AppPage from "@/components/features/AppPage";

export default function AssignmentsPage() {
  return (
    <AppPage
      eyebrow="Assignments"
      title="Track work that still needs attention"
      description="See what is due next, what is already submitted, and where you need feedback from instructors."
      stats={[
        { label: "Due This Week", value: "4" },
        { label: "Submitted", value: "11" },
        { label: "Awaiting Grade", value: "3" },
      ]}
      primaryTitle="Pending tasks"
      primaryItems={[
        {
          title: "Landing Page Prototype",
          description: "Finish the responsive layout and submit the final screen set.",
          meta: "Due tomorrow",
        },
        {
          title: "SQL Query Worksheet",
          description: "Complete the report and include screenshots of query output.",
          meta: "Due Thursday",
        },
        {
          title: "Testing Checklist",
          description: "Document the edge cases from the latest feature review.",
          meta: "In review",
        },
      ]}
      secondaryTitle="Submission notes"
      secondaryItems={[
        {
          title: "Format required",
          description: "Upload PDF or ZIP only for project-based assignments.",
          meta: "Rule",
        },
        {
          title: "Late policy",
          description: "Late submissions lose 10% after the first 24 hours.",
          meta: "Important",
        },
      ]}
    />
  );
}
