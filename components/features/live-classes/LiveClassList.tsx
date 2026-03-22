import { LiveClassResponse } from "@/types/live-class";
import { Empty, Tag } from "antd";
import dayjs from "dayjs";
import { CalendarClock, CircleDot, GraduationCap, Radio, UserRound } from "lucide-react";

const statusColorMap = {
    LIVE: "red",
    UPCOMING: "blue",
    ENDED: "default",
} as const;

const statusLabelMap = {
    LIVE: "Live Now",
    UPCOMING: "Upcoming",
    ENDED: "Ended",
} as const;

const statusPanelMap = {
    LIVE: "border-red-200/80 bg-red-50/80 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300",
    UPCOMING: "border-sky-200/80 bg-sky-50/80 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300",
    ENDED: "border-slate-200/80 bg-slate-50/80 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300",
} as const;

export default function LiveClassList({ sessions }: { sessions: LiveClassResponse[] }) {
    if (sessions.length === 0) {
        return <Empty description="No live class sessions available yet." />;
    }

    return (
        <div className="grid gap-4 lg:grid-cols-2">
            {sessions.map((session) => (
                <article
                    key={session.id}
                    className="overflow-hidden rounded-[1.75rem] border border-black/10 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-slate-950/70"
                >
                    <div className="border-b border-black/5 bg-[linear-gradient(135deg,rgba(14,165,233,0.12),rgba(249,115,22,0.08),rgba(255,255,255,0.8))] p-5 dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(14,165,233,0.16),rgba(249,115,22,0.08),rgba(2,6,23,0.86))]">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                                    {session.courseCode}
                                </p>
                                <h3 className="mt-2 text-xl font-semibold text-slate-950 dark:text-slate-50">
                                    {session.className}
                                </h3>
                                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                                    {session.courseName}
                                </p>
                            </div>
                            <Tag color={statusColorMap[session.status]}>
                                {statusLabelMap[session.status]}
                            </Tag>
                        </div>
                    </div>

                    <div className="space-y-4 p-5">
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="rounded-2xl border border-black/10 bg-black/[0.03] p-4 dark:border-white/10 dark:bg-white/[0.03]">
                                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                                    <UserRound className="h-3.5 w-3.5" />
                                    Instructor
                                </div>
                                <p className="mt-3 text-sm font-medium text-slate-900 dark:text-slate-100">
                                    {session.teacherName}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-black/10 bg-black/[0.03] p-4 dark:border-white/10 dark:bg-white/[0.03]">
                                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                                    <GraduationCap className="h-3.5 w-3.5" />
                                    Session Type
                                </div>
                                <p className="mt-3 text-sm font-medium text-slate-900 dark:text-slate-100">
                                    {session.status === "LIVE" ? "Active teaching window" : session.status === "UPCOMING" ? "Scheduled class" : "Completed session"}
                                </p>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-slate-950">
                            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                                <CalendarClock className="h-3.5 w-3.5" />
                                Schedule
                            </div>
                            <div className="mt-4 space-y-2">
                                <div className="flex items-start gap-3">
                                    <CircleDot className="mt-0.5 h-4 w-4 text-sky-600 dark:text-sky-400" />
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Starts</p>
                                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                            {dayjs(session.startDate).format("MMM D, YYYY h:mm A")}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Radio className="mt-0.5 h-4 w-4 text-orange-500 dark:text-orange-300" />
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Ends</p>
                                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                            {session.endDate ? dayjs(session.endDate).format("MMM D, YYYY h:mm A") : "Not scheduled"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`rounded-2xl border px-4 py-3 text-sm ${statusPanelMap[session.status]}`}>
                            {session.status === "LIVE"
                                ? "Session is currently active. Students and teachers should prioritize this room now."
                                : session.status === "UPCOMING"
                                ? "Session is scheduled and will move into the live state automatically once the start time is reached."
                                : "Session has finished. Use the schedule details for follow-up or attendance review."}
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}
