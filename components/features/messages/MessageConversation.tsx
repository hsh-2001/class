import SButton from "@/components/ui/SButton";
import { MessageThreadResponse } from "@/types/message";
import { ArrowLeftRight } from "lucide-react";
import { Avatar, Empty, Input, Typography } from "antd";

interface MessageConversationProps {
    currentUserId: string;
    thread: MessageThreadResponse | null;
    canSendMessage: boolean;
    isSendingMessage: boolean;
    messageContent: string;
    onChangeMessageContent: (value: string) => void;
    onSendMessage: () => void;
    onBackToThreads?: () => void;
}

export default function MessageConversation({
    currentUserId,
    thread,
    canSendMessage,
    isSendingMessage,
    messageContent,
    onChangeMessageContent,
    onSendMessage,
    onBackToThreads,
}: MessageConversationProps) {
    if (!thread) {
        return (
            <div className="flex h-full items-center justify-center p-6">
                <Empty description="Select a conversation to read messages." />
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col">
            <div className="border-b border-black/10 px-4 py-3 dark:border-white/10 sm:px-5">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                        <Avatar size={40} className="bg-slate-900 text-sm text-white dark:bg-white dark:text-black">
                            {`${thread.teacherName[0] ?? ""}${thread.studentName[0] ?? ""}`.toUpperCase()}
                        </Avatar>
                        <div className="min-w-0">
                            <h2 className="truncate text-[15px] font-semibold text-slate-950 dark:text-slate-50">
                                {thread.studentName}
                            </h2>
                            <p className="truncate text-[12px] text-slate-500 dark:text-slate-400">
                                {thread.teacherName} • {thread.className} • {thread.courseCode}
                            </p>
                        </div>
                    </div>
                    {onBackToThreads ? (
                        <button
                            type="button"
                            onClick={onBackToThreads}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-black/[0.03] text-slate-600 transition-transform duration-300 hover:-rotate-180 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 md:hidden"
                            aria-label="Show thread list"
                        >
                            <ArrowLeftRight className="h-4 w-4" />
                        </button>
                    ) : null}
                </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto bg-black/[0.02] px-3 py-4 dark:bg-white/[0.02] sm:px-5">
                {thread.messages.length === 0 ? (
                    <Empty description="No messages in this conversation yet." />
                ) : (
                    thread.messages.map((message) => {
                        const isOwnMessage = message.senderUserId === currentUserId;

                        return (
                            <div
                                key={message.id}
                                className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={[
                                        "max-w-[82%] rounded-[1.2rem] px-3.5 py-2.5 shadow-sm",
                                        isOwnMessage
                                            ? "rounded-br-md bg-sky-500 text-white dark:bg-sky-400 dark:text-slate-950"
                                            : "rounded-bl-md border border-black/10 bg-white text-slate-900 dark:border-white/10 dark:bg-slate-950 dark:text-slate-100",
                                    ].join(" ")}
                                >
                                    <p className="text-[13px] leading-5.5">{message.content}</p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {canSendMessage ? (
                <div className="border-t border-black/10 bg-white/80 px-3 py-3 dark:border-white/10 dark:bg-white/[0.03] sm:px-5">
                    <div className="grid gap-2">
                        <div className="flex items-end gap-2">
                            <div className="flex-1">
                                <Input.TextArea
                                    autoSize={{ minRows: 1, maxRows: 4 }}
                                    value={messageContent}
                                    onChange={(event) => onChangeMessageContent(event.target.value)}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter" && !event.shiftKey) {
                                            event.preventDefault();
                                            onSendMessage();
                                        }
                                    }}
                                    placeholder="Write a message"
                                    className="rounded-[1.25rem]"
                                />
                            </div>
                            <SButton type="button" color="primary" onClick={onSendMessage} loading={isSendingMessage}>
                                Send
                            </SButton>
                        </div>
                        <Typography.Text className="!text-[11px] text-slate-500 dark:!text-slate-400">
                                Press Enter to send, Shift+Enter for a new line.
                        </Typography.Text>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
