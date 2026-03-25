import LiveClassList from "@/components/features/live-classes/LiveClassList";
import useLiveClasses from "@/hooks/useLiveClasses";
import dayjs from "dayjs";
import { Skeleton } from "antd";
import { CalendarRange, Clock3, RadioTower, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function LiveClassesPage() {
  const { t } = useTranslation();
  const {
    canManage,
    endedCount,
    isLoading,
    liveCount,
    nextSession,
    sessions,
    upcomingCount,
  } = useLiveClasses();

  const liveSessions = sessions.filter((session) => session.status === "LIVE");
  const queuedSessions = sessions.filter((session) => session.status === "UPCOMING");

  return (
    <section className="grid gap-6 page-body">
      <div className="overflow-hidden rounded-4xl border border-black/10 bg-[linear-gradient(135deg,rgba(14,165,233,0.16),rgba(249,115,22,0.08),rgba(255,255,255,0.92))] p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(14,165,233,0.18),rgba(249,115,22,0.08),rgba(2,6,23,0.94))]">
        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-600 dark:text-slate-300">
              {t("liveClasses.eyebrow")}
            </p>
            <h1 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight text-slate-950 dark:text-slate-50 sm:text-4xl">
              {canManage ? t("liveClasses.manageTitle") : t("liveClasses.studentTitle")}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-700 dark:text-slate-300">
              {canManage
                ? t("liveClasses.manageDescription")
                : t("liveClasses.studentDescription")}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="rounded-full border border-red-200/80 bg-red-50/90 px-4 py-2 text-sm font-medium text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
                {t("liveClasses.liveNow", { count: liveCount })}
              </div>
              <div className="rounded-full border border-sky-200/80 bg-sky-50/90 px-4 py-2 text-sm font-medium text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300">
                {t("liveClasses.upcoming", { count: upcomingCount })}
              </div>
              <div className="rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                {t("liveClasses.completed", { count: endedCount })}
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <article className="rounded-[1.5rem] border border-black/10 bg-white/80 p-5 dark:border-white/10 dark:bg-slate-950/70">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                <RadioTower className="h-4 w-4" />
                {t("liveClasses.liveWindow")}
              </div>
              <p className="mt-4 text-3xl font-semibold text-slate-950 dark:text-slate-50">{liveCount}</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {t("liveClasses.liveWindowDescription")}
              </p>
            </article>

            <article className="rounded-[1.5rem] border border-black/10 bg-white/80 p-5 dark:border-white/10 dark:bg-slate-950/70">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                <Clock3 className="h-4 w-4" />
                {t("liveClasses.nextStart")}
              </div>
              <p className="mt-4 text-xl font-semibold text-slate-950 dark:text-slate-50">
                {nextSession ? dayjs(nextSession.startDate).format("MMM D, h:mm A") : t("liveClasses.noQueuedSession")}
              </p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {nextSession
                  ? t("liveClasses.nextSessionDescription", { className: nextSession.className })
                  : t("liveClasses.noNextSessionDescription")}
              </p>
            </article>
          </div>
        </div>
      </div>

      <div className="grid">
        <section className="rounded-[1.75rem] border border-black/10 bg-white/80 p-6 dark:border-white/10 dark:bg-white/5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950 dark:text-slate-50">{t("liveClasses.sessionBoard")}</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {t("liveClasses.trackedSessions", { count: sessions.length })}
              </p>
            </div>
          </div>
          {isLoading ? <Skeleton active paragraph={{ rows: 8 }} /> : <LiveClassList sessions={sessions} />}
        </section>
      </div>
    </section>
  );
}
