import { MessageThreadResponse } from "@/types/message";
import { Avatar, Empty } from "antd";
import dayjs from "dayjs";

interface MessageThreadListProps {
    selectedThreadId: string | null;
    threads: MessageThreadResponse[];
    onSelectThread: (threadId: string) => void;
}

export default function MessageThreadList({
    selectedThreadId,
    threads,
    onSelectThread,
}: MessageThreadListProps) {
    if (threads.length === 0) {
        return <Empty description="No conversations yet." />;
    }

    return (
        <div className="space-y-1.5">
            {threads.map((thread) => {
                const isActive = thread.id === selectedThreadId;
                const initials = `${thread.teacherName[0] ?? ""}${thread.studentName[0] ?? ""}`.toUpperCase();

                return (
                    <button
                        key={thread.id}
                        type="button"
                        onClick={() => onSelectThread(thread.id)}
                        className={[
                            "w-full rounded-[1.1rem] border px-3 py-2.5 text-left transition",
                            isActive
                                ? "border-sky-300 bg-sky-50/80 shadow-sm dark:border-sky-500/40 dark:bg-sky-500/10"
                                : "border-transparent bg-transparent hover:border-black/10 hover:bg-black/[0.03] dark:hover:border-white/10 dark:hover:bg-white/[0.05]",
                        ].join(" ")}
                    >
                        <div className="flex items-start gap-3">
                            <Avatar size={40} className="mt-0.5 shrink-0 bg-slate-900 text-sm text-white dark:bg-white dark:text-black">
                                {initials}
                            </Avatar>

                            <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <h3 className="truncate text-[13px] font-semibold text-slate-950 dark:text-slate-50">
                                            {thread.studentName}
                                        </h3>
                                        <p className="mt-0.5 truncate text-[11px] text-slate-500 dark:text-slate-400">
                                            {thread.teacherName} • {thread.courseCode}
                                        </p>
                                    </div>
                                    <span className="shrink-0 text-[11px] text-slate-400 dark:text-slate-500">
                                        {dayjs(thread.updatedAt).format("h:mm A")}
                                    </span>
                                </div>

                                <div className="mt-2 flex items-center justify-between gap-3">
                                    <p className="truncate text-[13px] text-slate-600 dark:text-slate-300">
                                        {thread.lastMessagePreview}
                                    </p>
                                    {isActive ? (
                                        <span className="h-2 w-2 shrink-0 rounded-full bg-sky-500" />
                                    ) : null}
                                </div>

                                <p className="mt-1.5 truncate text-[10px] font-medium uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                                    {thread.className}
                                </p>
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
