import AppPage from "@/components/features/AppPage";

export default function CoursesPage() {
  return (
    <AppPage
      eyebrow="Courses"
      title="Review course materials and progress"
      description="Keep each subject organized with lessons, resources, and instructor updates in one clear view."
      stats={[
        { label: "Enrolled Courses", value: "6" },
        { label: "Completed Modules", value: "18" },
        { label: "Shared Resources", value: "27 files" },
      ]}
      primaryTitle="Current courses"
      primaryItems={[
        {
          title: "Web Development",
          description: "Modern frontend workflows, layouts, and responsive interaction patterns.",
          meta: "82% progress",
        },
        {
          title: "Database Design",
          description: "Schema planning, query fundamentals, and migration practice.",
          meta: "65% progress",
        },
        {
          title: "Operating Systems",
          description: "Processes, memory, and system architecture foundations.",
          meta: "51% progress",
        },
      ]}
      secondaryTitle="Course notes"
      secondaryItems={[
        {
          title: "New material added",
          description: "A fresh lesson deck was uploaded for Web Development.",
          meta: "Today",
        },
        {
          title: "Revision week",
          description: "Database Design includes an extra review session on Friday.",
          meta: "Instructor update",
        },
      ]}
    />
  );
}
