import {
    DraftMessageAttachment,
    MessageAlbumModal,
    MessageBubbleList,
    MessageComposer,
    MessageRenderGroup,
} from "@/components/features/messages/MessageConversationParts";
import { IMessageAttachment, MessageThreadResponse } from "@/types/message";
import { ArrowLeftRight } from "lucide-react";
import { Avatar, Empty } from "antd";
import { useEffect, useRef, useState } from "react";

interface MessageConversationProps {
    currentUserId: string;
    thread: MessageThreadResponse | null;
    canSendMessage: boolean;
    isSendingMessage: boolean;
    messageContent: string;
    selectedAttachments: DraftMessageAttachment[];
    selectedAttachmentAccept: string;
    onChangeMessageContent: (value: string) => void;
    onRemoveSelectedAttachment: (localId: string) => void;
    onSelectMessageFiles: (files: FileList | null) => void;
    onSendMessage: () => void;
    onBackToThreads?: () => void;
}

const MESSAGE_ALBUM_WINDOW_MS = 60 * 1000;

const buildMessageRenderGroups = (messages: MessageThreadResponse["messages"]): MessageRenderGroup[] => {
    const groups: MessageRenderGroup[] = [];

    messages.forEach((message) => {
        const attachments = Array.isArray(message.attachments) ? message.attachments : [];
        const content = message.content ?? "";
        const imageAttachments = attachments.filter((attachment) => attachment.kind === "IMAGE");
        const normalizedImageAttachments = imageAttachments.length > 0
            ? imageAttachments
            : typeof message.imageUrl === "string" && message.imageUrl.trim().length > 0
                ? [{
                    url: message.imageUrl,
                    name: "Photo",
                    mimeType: "image/*",
                    size: 0,
                    kind: "IMAGE" as const,
                }]
                : [];
        const fileAttachments = attachments.filter((attachment) => attachment.kind === "FILE");
        const isImageOnlyMessage = normalizedImageAttachments.length > 0 && fileAttachments.length === 0 && !content.trim();
        const previousGroup = groups[groups.length - 1];

        if (!isImageOnlyMessage || !previousGroup) {
            groups.push({
                id: message.id,
                senderUserId: message.senderUserId,
                content,
                imageAttachments: normalizedImageAttachments,
                fileAttachments,
                latestCreatedAt: message.createdAt,
            });
            return;
        }

        const createdAtDiff = Math.abs(
            new Date(message.createdAt).getTime() - new Date(previousGroup.latestCreatedAt).getTime(),
        );
        const canAppendToAlbum = previousGroup.senderUserId === message.senderUserId
            && previousGroup.fileAttachments.length === 0
            && !previousGroup.content.trim()
            && createdAtDiff <= MESSAGE_ALBUM_WINDOW_MS;

        if (!canAppendToAlbum) {
            groups.push({
                id: message.id,
                senderUserId: message.senderUserId,
                content,
                imageAttachments: normalizedImageAttachments,
                fileAttachments,
                latestCreatedAt: message.createdAt,
            });
            return;
        }

        previousGroup.imageAttachments.push(...normalizedImageAttachments);
        previousGroup.latestCreatedAt = message.createdAt;
    });

    return groups;
};

export default function MessageConversation({
    currentUserId,
    thread,
    canSendMessage,
    isSendingMessage,
    messageContent,
    selectedAttachments,
    selectedAttachmentAccept,
    onChangeMessageContent,
    onRemoveSelectedAttachment,
    onSelectMessageFiles,
    onSendMessage,
    onBackToThreads,
}: MessageConversationProps) {
    const bottomAnchorRef = useRef<HTMLDivElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [activeAlbum, setActiveAlbum] = useState<IMessageAttachment[] | null>(null);
    const [activeAlbumIndex, setActiveAlbumIndex] = useState(0);

    useEffect(() => {
        if (!thread) {
            return;
        }

        bottomAnchorRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
        });
    }, [thread]);

    if (!thread) {
        return (
            <div className="flex h-full items-center justify-center p-6">
                <Empty description="Select a conversation to read messages." />
            </div>
        );
    }

    const messageGroups = buildMessageRenderGroups(thread.messages);

    return (
        <div className="flex h-full min-h-0 flex-col">
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
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-black/3 text-slate-600 transition-transform duration-300 hover:-rotate-180 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 md:hidden"
                            aria-label="Show thread list"
                        >
                            <ArrowLeftRight className="h-4 w-4" />
                        </button>
                    ) : null}
                </div>
            </div>

            <div className="flex-1 min-h-0 space-y-3 overflow-y-auto bg-black/2 px-3 py-4 scroll-smooth dark:bg-white/2 sm:px-5">
                {thread.messages.length === 0 ? (
                    <Empty description="No messages in this conversation yet." />
                ) : (
                    <>
                        <MessageBubbleList
                            currentUserId={currentUserId}
                            messageGroups={messageGroups}
                            onOpenAlbum={(attachments) => {
                                setActiveAlbum(attachments);
                                setActiveAlbumIndex(0);
                            }}
                        />
                        <div ref={bottomAnchorRef} />
                    </>
                )}
            </div>

            <MessageComposer
                canSendMessage={canSendMessage}
                fileInputRef={fileInputRef}
                isSendingMessage={isSendingMessage}
                messageContent={messageContent}
                onChangeMessageContent={onChangeMessageContent}
                onRemoveSelectedAttachment={onRemoveSelectedAttachment}
                onSelectMessageFiles={onSelectMessageFiles}
                onSendMessage={onSendMessage}
                selectedAttachmentAccept={selectedAttachmentAccept}
                selectedAttachments={selectedAttachments}
            />

            <MessageAlbumModal
                activeAlbum={activeAlbum}
                activeAlbumIndex={activeAlbumIndex}
                onClose={() => {
                    setActiveAlbum(null);
                    setActiveAlbumIndex(0);
                }}
                onSelectImage={setActiveAlbumIndex}
            />
        </div>
    );
}
