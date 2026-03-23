import AppPage from "@/components/features/AppPage";
import { useTranslation } from "react-i18next";

export default function SettingsPage() {
  const { t } = useTranslation();

  return (
    <AppPage
      eyebrow={t("settingsPage.eyebrow")}
      title={t("settingsPage.title")}
      description={t("settingsPage.description")}
      stats={[
        { label: t("settingsPage.stats.theme"), value: t("settingsPage.stats.manual") },
        { label: t("settingsPage.stats.notifications"), value: t("settingsPage.stats.enabled") },
        { label: t("settingsPage.stats.accountStatus"), value: t("settingsPage.stats.active") },
      ]}
      primaryTitle={t("settingsPage.primaryTitle")}
      primaryItems={[
        {
          title: t("settingsPage.primaryItems.profileTitle"),
          description: t("settingsPage.primaryItems.profileDescription"),
          meta: t("settingsPage.meta.editable"),
        },
        {
          title: t("settingsPage.primaryItems.notificationTitle"),
          description: t("settingsPage.primaryItems.notificationDescription"),
          meta: t("settingsPage.meta.custom"),
        },
        {
          title: t("settingsPage.primaryItems.themeTitle"),
          description: t("settingsPage.primaryItems.themeDescription"),
          meta: t("settingsPage.meta.available"),
        },
      ]}
      secondaryTitle={t("settingsPage.secondaryTitle")}
      secondaryItems={[
        {
          title: t("settingsPage.secondaryItems.passwordTitle"),
          description: t("settingsPage.secondaryItems.passwordDescription"),
          meta: t("settingsPage.meta.recommended"),
        },
        {
          title: t("settingsPage.secondaryItems.deviceTitle"),
          description: t("settingsPage.secondaryItems.deviceDescription"),
          meta: t("settingsPage.meta.reviewMonthly"),
        },
      ]}
    />
  );
}
