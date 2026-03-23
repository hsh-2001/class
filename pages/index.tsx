import AppPage from "@/components/features/AppPage";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();

  return (
    <AppPage
      eyebrow={t("dashboard.eyebrow")}
      title={t("dashboard.title")}
      description={t("dashboard.description")}
      stats={[
        { label: t("dashboard.stats.classesToday"), value: "4" },
        { label: t("dashboard.stats.pendingWork"), value: t("dashboard.meta.threeTasks") },
        { label: t("dashboard.stats.unreadMessages"), value: "12" },
      ]}
      primaryTitle={t("dashboard.primaryTitle")}
      primaryItems={[
        {
          title: t("dashboard.primaryItems.frontendTitle"),
          description: t("dashboard.primaryItems.frontendDescription"),
          meta: t("dashboard.meta.in25Min"),
        },
        {
          title: t("dashboard.primaryItems.databaseTitle"),
          description: t("dashboard.primaryItems.databaseDescription"),
          meta: t("dashboard.meta.oneFile"),
        },
        {
          title: t("dashboard.primaryItems.designTitle"),
          description: t("dashboard.primaryItems.designDescription"),
          meta: t("dashboard.meta.twoPm"),
        },
      ]}
      secondaryTitle={t("dashboard.secondaryTitle")}
      secondaryItems={[
        {
          title: t("dashboard.secondaryItems.noteTitle"),
          description: t("dashboard.secondaryItems.noteDescription"),
          meta: t("dashboard.meta.classAdmin"),
        },
        {
          title: t("dashboard.secondaryItems.noticeTitle"),
          description: t("dashboard.secondaryItems.noticeDescription"),
          meta: t("dashboard.meta.platform"),
        },
      ]}
    />
  );
}
