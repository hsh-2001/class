import AppPage from "@/components/features/AppPage";

export default function SettingsPage() {
  return (
    <AppPage
      eyebrow="Settings"
      title="Adjust your account and class preferences"
      description="Manage the basics that affect how you study, receive updates, and use the platform every day."
      stats={[
        { label: "Theme", value: "Manual" },
        { label: "Notifications", value: "Enabled" },
        { label: "Account Status", value: "Active" },
      ]}
      primaryTitle="Account options"
      primaryItems={[
        {
          title: "Profile details",
          description: "Update your display name, student ID, and contact email.",
          meta: "Editable",
        },
        {
          title: "Notification rules",
          description: "Choose which assignment and message alerts should interrupt you.",
          meta: "Custom",
        },
        {
          title: "Theme mode",
          description: "Switch between light and dark mode from the header control.",
          meta: "Available",
        },
      ]}
      secondaryTitle="Security reminders"
      secondaryItems={[
        {
          title: "Password hygiene",
          description: "Rotate your password regularly and avoid reuse across apps.",
          meta: "Recommended",
        },
        {
          title: "Device access",
          description: "Review active sessions if you sign in from multiple devices.",
          meta: "Review monthly",
        },
      ]}
    />
  );
}
