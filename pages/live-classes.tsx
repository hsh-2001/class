import LiveClassList from "@/components/features/live-classes/LiveClassList";
import useLiveClasses from "@/hooks/useLiveClasses";
import dayjs from "dayjs";
import { Skeleton } from "antd";
import { CalendarRange, Clock3, RadioTower, ShieldCheck } from "lucide-react";

export default function LiveClassesPage() {
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
      <div className="overflow-hidden rounded-[2rem] border border-black/10 bg-[linear-gradient(135deg,rgba(14,165,233,0.16),rgba(249,115,22,0.08),rgba(255,255,255,0.92))] p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(14,165,233,0.18),rgba(249,115,22,0.08),rgba(2,6,23,0.94))]">
        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-600 dark:text-slate-300">
              Live Classes
            </p>
            <h1 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight text-slate-950 dark:text-slate-50 sm:text-4xl">
              {canManage ? "Track the teaching pulse across live sessions" : "See the sessions that matter right now"}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-700 dark:text-slate-300">
              {canManage
                ? "Monitor active classrooms, check what is starting next, and keep instructors aligned with the teaching schedule."
                : "Follow your class schedule with a clearer view of what is live now, what starts next, and which sessions are already complete."}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="rounded-full border border-red-200/80 bg-red-50/90 px-4 py-2 text-sm font-medium text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
                {liveCount} live now
              </div>
              <div className="rounded-full border border-sky-200/80 bg-sky-50/90 px-4 py-2 text-sm font-medium text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300">
                {upcomingCount} upcoming
              </div>
              <div className="rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                {endedCount} completed
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <article className="rounded-[1.5rem] border border-black/10 bg-white/80 p-5 dark:border-white/10 dark:bg-slate-950/70">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                <RadioTower className="h-4 w-4" />
                Live Window
              </div>
              <p className="mt-4 text-3xl font-semibold text-slate-950 dark:text-slate-50">{liveCount}</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Sessions currently within their active teaching time.
              </p>
            </article>

            <article className="rounded-[1.5rem] border border-black/10 bg-white/80 p-5 dark:border-white/10 dark:bg-slate-950/70">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                <Clock3 className="h-4 w-4" />
                Next Start
              </div>
              <p className="mt-4 text-xl font-semibold text-slate-950 dark:text-slate-50">
                {nextSession ? dayjs(nextSession.startDate).format("MMM D, h:mm A") : "No queued session"}
              </p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {nextSession ? `${nextSession.className} will be next on the calendar.` : "Nothing is scheduled after the current queue."}
              </p>
            </article>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <section className="rounded-[1.75rem] border border-black/10 bg-white/80 p-6 dark:border-white/10 dark:bg-white/5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950 dark:text-slate-50">Session Board</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {sessions.length} tracked session{sessions.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          {isLoading ? <Skeleton active paragraph={{ rows: 8 }} /> : <LiveClassList sessions={sessions} />}
        </section>

        <section className="grid gap-4">
          <article className="rounded-[1.75rem] border border-black/10 bg-white/80 p-6 dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              <ShieldCheck className="h-4 w-4" />
              Live Priority
            </div>
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border border-red-200/80 bg-red-50/80 p-4 dark:border-red-500/30 dark:bg-red-500/10">
                <p className="text-sm font-semibold text-red-700 dark:text-red-300">Active now</p>
                <p className="mt-1 text-sm text-red-700/90 dark:text-red-200">
                  {liveSessions.length > 0
                    ? `${liveSessions.length} session${liveSessions.length === 1 ? "" : "s"} require immediate attention.`
                    : "No classes are currently live."}
                </p>
              </div>
              <div className="rounded-2xl border border-sky-200/80 bg-sky-50/80 p-4 dark:border-sky-500/30 dark:bg-sky-500/10">
                <p className="text-sm font-semibold text-sky-700 dark:text-sky-300">Queued next</p>
                <p className="mt-1 text-sm text-sky-700/90 dark:text-sky-200">
                  {queuedSessions.length > 0
                    ? `${queuedSessions.length} upcoming session${queuedSessions.length === 1 ? "" : "s"} are waiting in the schedule.`
                    : "There are no upcoming sessions in queue."}
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-black/10 bg-white/80 p-6 dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              <CalendarRange className="h-4 w-4" />
              Session Notes
            </div>
            <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <p className="rounded-2xl border border-black/10 bg-black/[0.03] p-4 dark:border-white/10 dark:bg-white/[0.03]">
                The current live-course view uses real class schedule data and automatically marks each session as live, upcoming, or ended.
              </p>
              <p className="rounded-2xl border border-black/10 bg-black/[0.03] p-4 dark:border-white/10 dark:bg-white/[0.03]">
                Meeting links and streaming controls are not in the schema yet. If you want join buttons, the next step is adding room metadata to class records.
              </p>
            </div>
          </article>
        </section>
      </div>
    </section>
  );
}
