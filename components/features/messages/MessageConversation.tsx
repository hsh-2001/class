import {
    DraftMessageAttachment,
    MessageAlbumModal,
    MessageBubbleList,
    MessageComposer,
    MessageRenderGroup,
} from "@/components/features/messages/MessageConversationParts";
import { IMessageAttachment, IMessageReplyPreview, MessageThreadResponse } from "@/types/message";
import { ArrowLeftRight } from "lucide-react";
import { Avatar, Empty } from "antd";
import { useEffect, useRef, useState } from "react";

interface MessageConversationProps {
    currentUserId: string;
    thread: MessageThreadResponse | null;
    autoScrollKey?: string;
    isVisible?: boolean;
    canSendMessage: boolean;
    isSendingMessage: boolean;
    messageContent: string;
    replyTargetMessage: IMessageReplyPreview | null;
    selectedAttachments: DraftMessageAttachment[];
    selectedAttachmentAccept: string;
    onChangeMessageContent: (value: string) => void;
    onReplyToMessage: (message: IMessageReplyPreview) => void;
    onForwardMessage: (message: IMessageReplyPreview) => void;
    onDeleteMessage: (messageId: string) => void;
    onCancelReply: () => void;
    onRemoveSelectedAttachment: (localId: string) => void;
    onSelectMessageFiles: (files: FileList | null) => void;
    onSendMessage: () => void;
    onBackToThreads?: () => void;
}

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
        groups.push({
            id: message.id,
            senderUserId: message.senderUserId,
            senderName: message.senderName,
            senderUsername: message.senderUsername,
            senderEmail: message.senderEmail,
            senderProfileUrl: message.senderProfileUrl,
            content,
            imageAttachments: normalizedImageAttachments,
            fileAttachments,
            isForwarded: message.isForwarded,
            replyToMessage: message.replyToMessage,
            latestCreatedAt: message.createdAt,
        });
    });

    return groups;
};

export default function MessageConversation({
    currentUserId,
    thread,
    autoScrollKey,
    isVisible = true,
    canSendMessage,
    isSendingMessage,
    messageContent,
    replyTargetMessage,
    selectedAttachments,
    selectedAttachmentAccept,
    onChangeMessageContent,
    onReplyToMessage,
    onForwardMessage,
    onDeleteMessage,
    onCancelReply,
    onRemoveSelectedAttachment,
    onSelectMessageFiles,
    onSendMessage,
    onBackToThreads,
}: MessageConversationProps) {
    const bottomAnchorRef = useRef<HTMLDivElement | null>(null);
    const messageContainerRef = useRef<HTMLDivElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [activeAlbum, setActiveAlbum] = useState<IMessageAttachment[] | null>(null);
    const [activeAlbumIndex, setActiveAlbumIndex] = useState(0);
    const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);

    useEffect(() => {
        const isDesktopViewport = typeof window !== "undefined"
            ? window.matchMedia("(min-width: 768px)").matches
            : true;

        if (!thread || (!isVisible && !isDesktopViewport)) {
            return;
        }

        const container = messageContainerRef.current;
        if (!container) {
            return;
        }

        const scrollToBottom = () => {
            container.scrollTop = container.scrollHeight;
        };

        scrollToBottom();
        const frameId = window.requestAnimationFrame(scrollToBottom);
        const secondFrameId = window.requestAnimationFrame(() => {
            window.requestAnimationFrame(scrollToBottom);
        });
        const timeoutId = window.setTimeout(scrollToBottom, 180);

        return () => {
            window.cancelAnimationFrame(frameId);
            window.cancelAnimationFrame(secondFrameId);
            window.clearTimeout(timeoutId);
        };
    }, [autoScrollKey, isVisible, thread]);

    useEffect(() => {
        if (!highlightedMessageId) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            setHighlightedMessageId((current) => current === highlightedMessageId ? null : current);
        }, 1800);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [highlightedMessageId]);

    const handleJumpToMessage = (messageId: string) => {
        const container = messageContainerRef.current;
        const target = document.getElementById(`message-${messageId}`);

        if (!container || !target) {
            return;
        }

        target.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
        setHighlightedMessageId(messageId);
    };

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
                        <Avatar
                            size={40}
                            src={thread.avatarUrl}
                            className="bg-slate-900 text-sm text-white dark:bg-white dark:text-black"
                        >
                            {thread.avatarLabel}
                        </Avatar>
                        <div className="min-w-0">
                            <h2 className="truncate text-[15px] font-semibold text-slate-950 dark:text-slate-50">
                                {thread.title}
                            </h2>
                            <p className="truncate text-[12px] text-slate-500 dark:text-slate-400">
                                {thread.subtitle}
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

            <div
                ref={messageContainerRef}
                className="flex-1 min-h-0 space-y-2 overflow-y-auto bg-black/2 px-3 py-4 dark:bg-white/2 sm:px-5"
            >
                {thread.messages.length === 0 ? (
                    <Empty description="No messages in this conversation yet." />
                ) : (
                    <div>
                        <MessageBubbleList
                            currentUserId={currentUserId}
                            isGroupThread={thread.isGroup}
                            messageGroups={messageGroups}
                            highlightedMessageId={highlightedMessageId}
                            onJumpToMessage={handleJumpToMessage}
                            onReplyToMessage={onReplyToMessage}
                            onForwardMessage={onForwardMessage}
                            onDeleteMessage={onDeleteMessage}
                            onOpenAlbum={(attachments) => {
                                setActiveAlbum(attachments);
                                setActiveAlbumIndex(0);
                            }}
                        />
                        <div ref={bottomAnchorRef} />
                    </div>
                )}
            </div>

            <MessageComposer
                canSendMessage={canSendMessage}
                fileInputRef={fileInputRef}
                isSendingMessage={isSendingMessage}
                messageContent={messageContent}
                replyTargetMessage={replyTargetMessage}
                onCancelReply={onCancelReply}
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
