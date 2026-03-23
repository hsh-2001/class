import SButton from "@/components/ui/SButton";
import SModal from "@/components/ui/SModal";
import i18n from "@/lib/i18n";
import { IMessageAttachment, IMessageReplyPreview } from "@/types/message";
import { Copy, CornerUpLeft, FileText, Forward, Paperclip, Trash2, X } from "lucide-react";
import { Avatar, Input, Popover, Typography, message as antMessage } from "antd";
import Image from "next/image";
import { createPortal } from "react-dom";
import { RefObject, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export type DraftMessageAttachment = IMessageAttachment & {
    localId: string;
    previewUrl?: string;
};

export type MessageRenderGroup = {
    id: string;
    senderUserId: string;
    senderName: string;
    senderUsername: string;
    senderEmail: string;
    senderProfileUrl?: string;
    content: string;
    imageAttachments: IMessageAttachment[];
    fileAttachments: IMessageAttachment[];
    isForwarded?: boolean;
    replyToMessage?: IMessageReplyPreview;
    latestCreatedAt: string;
};

const getReplyPreviewText = (replyToMessage?: IMessageReplyPreview) => {
    if (!replyToMessage) {
        return "";
    }

    if (replyToMessage.content.trim()) {
        return replyToMessage.content;
    }

    if (replyToMessage.attachments.length === 1) {
        return replyToMessage.attachments[0]?.kind === "IMAGE"
            ? i18n.t("messagesParts.photo")
            : `${i18n.t("messagesParts.filePrefix")}: ${replyToMessage.attachments[0]?.name ?? i18n.t("messagesParts.attachment")}`;
    }

    if (replyToMessage.attachments.length > 1) {
        return i18n.t("messages.attachmentsCount", { count: replyToMessage.attachments.length });
    }

    return i18n.t("messages.message");
};

function ReplyPreviewCard({
    replyToMessage,
    isOwnMessage,
    onClick,
}: {
    replyToMessage: IMessageReplyPreview;
    isOwnMessage: boolean;
    onClick?: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "mb-2 block min-w-0 w-full overflow-hidden rounded-[1rem] border-l-4 px-3 py-2 text-left transition-colors",
                isOwnMessage
                    ? "border-l-amber-300 border-r-white/10 border-y-white/10 bg-white/10 text-white/90 hover:bg-white/[0.16] dark:border-r-white/10 dark:border-y-white/10 dark:bg-white/[0.08] dark:hover:bg-white/[0.14]"
                    : "border-l-sky-500 border-r-black/8 border-y-black/8 bg-black/[0.03] text-slate-700 hover:bg-black/[0.06] dark:border-r-white/8 dark:border-y-white/8 dark:bg-white/[0.05] dark:text-slate-200 dark:hover:bg-white/[0.09]",
            ].join(" ")}
        >
            <p className="truncate text-[11px] font-semibold tracking-[0.03em]">
                {replyToMessage.senderName}
            </p>
            <p className="mt-1 line-clamp-2 break-words text-[12px] leading-5 opacity-80">
                {getReplyPreviewText(replyToMessage)}
            </p>
        </button>
    );
}

export const formatAttachmentSize = (size: number) => {
    if (size >= 1024 * 1024) {
        return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }

    if (size >= 1024) {
        return `${Math.round(size / 1024)} KB`;
    }

    return `${size} B`;
};

function AlbumPreviewCard({
    attachments,
    isOwnMessage,
    onOpen,
}: {
    attachments: IMessageAttachment[];
    isOwnMessage: boolean;
    onOpen: () => void;
}) {
    const { t } = useTranslation();
    const previewAttachments = attachments.slice(0, 3);
    const textTone = isOwnMessage ? "text-white/80 dark:text-slate-300" : "text-slate-500 dark:text-slate-400";

    return (
        <button
            type="button"
            onClick={onOpen}
            className={[
                "mb-2 block w-full rounded-[1.35rem] border p-2 text-left shadow-[0_12px_30px_-18px_rgba(15,23,42,0.45)] backdrop-blur-xl transition-transform hover:scale-[1.01]",
                isOwnMessage
                    ? "border-white/12 bg-white/10 dark:border-white/8 dark:bg-white/[0.08]"
                    : "border-black/8 bg-white/72 dark:border-white/8 dark:bg-slate-900/72",
            ].join(" ")}
        >
            <div className="relative h-40 w-full overflow-hidden rounded-[1.15rem]">
                {previewAttachments.map((attachment, index) => {
                    const rotationClass = index === 0 ? "-rotate-[7deg]" : index === 1 ? "rotate-0" : "rotate-[7deg]";
                    const offsetClass = index === 0 ? "left-2 top-4" : index === 1 ? "left-1/2 top-2 -translate-x-1/2" : "right-2 top-4";

                    return (
                        <div
                            key={attachment.url}
                            className={`absolute ${offsetClass} ${rotationClass} h-32 w-24 overflow-hidden rounded-[1rem] border border-white/30 shadow-lg shadow-black/10 sm:h-36 sm:w-28`}
                        >
                            <Image
                                src={attachment.url}
                                alt={attachment.name}
                                fill
                                sizes="160px"
                                className="object-cover"
                            />
                        </div>
                    );
                })}
            </div>
            <div className="mt-1 flex items-center justify-between gap-2 px-1">
                <div>
                    <p className="text-[12px] font-semibold tracking-[0.01em]">{attachments.length} photos</p>
                    <p className={`text-[11px] ${textTone}`}>
                        {t("messagesParts.tapToViewAlbum")}
                    </p>
                </div>
            </div>
        </button>
    );
}

export function MessageBubbleList({
    currentUserId,
    isGroupThread,
    messageGroups,
    highlightedMessageId,
    onJumpToMessage,
    onReplyToMessage,
    onForwardMessage,
    onDeleteMessage,
    onOpenAlbum,
}: {
    currentUserId: string;
    isGroupThread: boolean;
    messageGroups: MessageRenderGroup[];
    highlightedMessageId?: string | null;
    onJumpToMessage: (messageId: string) => void;
    onReplyToMessage: (message: IMessageReplyPreview) => void;
    onForwardMessage: (message: IMessageReplyPreview) => void;
    onDeleteMessage: (messageId: string) => void;
    onOpenAlbum: (attachments: IMessageAttachment[]) => void;
}) {
    const { t } = useTranslation();
    const [menuState, setMenuState] = useState<{
        messageId: string;
        left: number;
        top: number;
    } | null>(null);
    const longPressTimerRef = useRef<number | null>(null);

    useEffect(() => {
        const closeMenu = () => setMenuState(null);
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                closeMenu();
            }
        };
        window.addEventListener("click", closeMenu);
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("scroll", closeMenu, true);
        window.addEventListener("resize", closeMenu);

        return () => {
            window.removeEventListener("click", closeMenu);
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("scroll", closeMenu, true);
            window.removeEventListener("resize", closeMenu);
            if (longPressTimerRef.current) {
                window.clearTimeout(longPressTimerRef.current);
            }
        };
    }, []);

    const openReplyMenu = (
        messageId: string,
        horizontalPlacement: "left" | "right",
        bubbleElement: HTMLDivElement | null,
    ) => {
        if (!bubbleElement) {
            return;
        }

        const bubbleRect = bubbleElement.getBoundingClientRect();
        const estimatedMenuHeight = 192;
        const estimatedMenuWidth = 176;
        const spaceBelow = window.innerHeight - bubbleRect.bottom;
        const verticalPlacement = spaceBelow < estimatedMenuHeight ? "top" : "bottom";
        const left = horizontalPlacement === "right"
            ? Math.max(12, bubbleRect.right - estimatedMenuWidth)
            : Math.min(window.innerWidth - estimatedMenuWidth - 12, bubbleRect.left);
        const top = verticalPlacement === "top"
            ? Math.max(12, bubbleRect.top - estimatedMenuHeight - 8)
            : Math.min(window.innerHeight - estimatedMenuHeight - 12, bubbleRect.bottom + 8);

        setMenuState({ messageId, left, top });
    };

    const clearLongPressTimer = () => {
        if (longPressTimerRef.current) {
            window.clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
        }
    };

    return (
        <>
            {messageGroups.map((messageGroup, index) => {
                const isOwnMessage = messageGroup.senderUserId === currentUserId;
                const showSenderMeta = isGroupThread && !isOwnMessage;
                const nextMessageGroup = messageGroups[index + 1];
                const showsAvatarOnThisRow = showSenderMeta
                    && nextMessageGroup?.senderUserId !== messageGroup.senderUserId;
                const initials = messageGroup.senderName
                    .split(" ")
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((part) => part[0]?.toUpperCase() ?? "")
                    .join("");
                const replyPreview: IMessageReplyPreview = {
                    id: messageGroup.id,
                    senderUserId: messageGroup.senderUserId,
                    senderName: messageGroup.senderName,
                    content: messageGroup.content,
                    attachments: [...messageGroup.imageAttachments, ...messageGroup.fileAttachments],
                };

                return (
                    <div
                        key={messageGroup.id}
                        id={`message-${messageGroup.id}`}
                        className={isOwnMessage ? "flex justify-end pl-10" : "flex justify-start pr-10"}
                    >
                        <div className={`flex max-w-[82%] gap-2 ${isOwnMessage ? "flex-row-reverse" : "flex-row"}`}>
                            {showsAvatarOnThisRow ? (
                                <Popover
                                    trigger="hover"
                                    placement="topLeft"
                                    content={(
                                        <div className="min-w-52 space-y-2 rounded-[0.9rem] border border-black/10 bg-white/95 p-3 text-slate-900 dark:border-white/10 dark:bg-slate-950/95 dark:text-slate-100">
                                            <div>
                                                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">
                                                    {t("profile.username")}
                                                </p>
                                                <p className="text-[13px] font-medium text-slate-900 dark:text-slate-100">
                                                    {messageGroup.senderUsername || "-"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">
                                                    {t("profile.email")}
                                                </p>
                                                <p className="break-all text-[13px] font-medium text-slate-900 dark:text-slate-100">
                                                    {messageGroup.senderEmail}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                >
                                    <Avatar
                                        size={32}
                                        src={messageGroup.senderProfileUrl}
                                        className="mt-auto shrink-0 cursor-pointer bg-slate-900 text-[11px] font-semibold text-white dark:bg-white dark:text-black"
                                        >
                                        {initials || t("messagesParts.userInitial")}
                                    </Avatar>
                                </Popover>
                            ) : showSenderMeta ? (
                                <div className="w-8 shrink-0" />
                            ) : null}
                            <div className="relative min-w-0 flex-1">
                                <div
                                    className={[
                                        "mt-1 min-w-0 overflow-hidden rounded-[1.35rem] border p-2 shadow-[0_16px_40px_-24px_rgba(15,23,42,0.4)] backdrop-blur-xl transition-all duration-500",
                                        highlightedMessageId === messageGroup.id
                                            ? "ring-2 ring-amber-400/90 ring-offset-2 ring-offset-transparent"
                                            : "",
                                        isOwnMessage
                                            ? "rounded-br-[0.45rem] border-black/10 bg-black/72 text-white dark:border-white/10 dark:bg-white/[0.12] dark:text-slate-50"
                                            : "rounded-bl-[0.45rem] border-black/8 bg-white/82 text-slate-900 dark:border-white/8 dark:bg-slate-900/78 dark:text-slate-100",
                                    ].join(" ")}
                                    onContextMenu={(event) => {
                                        event.preventDefault();
                                        openReplyMenu(messageGroup.id, isOwnMessage ? "right" : "left", event.currentTarget);
                                    }}
                                    onTouchStart={(event) => {
                                        const touch = event.touches[0];
                                        if (!touch) {
                                            return;
                                        }

                                        const bubbleElement = event.currentTarget;

                                        clearLongPressTimer();
                                        longPressTimerRef.current = window.setTimeout(() => {
                                            openReplyMenu(messageGroup.id, isOwnMessage ? "right" : "left", bubbleElement);
                                        }, 450);
                                    }}
                                    onTouchEnd={clearLongPressTimer}
                                    onTouchMove={clearLongPressTimer}
                                    onTouchCancel={clearLongPressTimer}
                                >
                                    {messageGroup.replyToMessage ? (
                                        <ReplyPreviewCard
                                            replyToMessage={messageGroup.replyToMessage}
                                            isOwnMessage={isOwnMessage}
                                            onClick={() => onJumpToMessage(messageGroup.replyToMessage!.id)}
                                        />
                                    ) : null}
                                    {messageGroup.isForwarded ? (
                                        <div className={`mb-2 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${isOwnMessage
                                            ? "bg-white/12 text-white/80 dark:bg-white/[0.12] dark:text-slate-200"
                                            : "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300"
                                            }`}>
                                            <Forward className="h-3.5 w-3.5" />
                                            {t("messagesParts.forwarded")}
                                        </div>
                                    ) : null}
                                    {messageGroup.imageAttachments.length > 1 ? (
                                        <AlbumPreviewCard
                                            attachments={messageGroup.imageAttachments}
                                            isOwnMessage={isOwnMessage}
                                            onOpen={() => onOpenAlbum(messageGroup.imageAttachments)}
                                        />
                                    ) : messageGroup.imageAttachments.length === 1 ? (
                                        <div className="mb-2 max-w-md">
                                            <button
                                                type="button"
                                                onClick={() => onOpenAlbum(messageGroup.imageAttachments)}
                                                className="block overflow-hidden rounded-[1.15rem] border border-white/10 bg-black/5 shadow-sm dark:border-white/10 dark:bg-white/5"
                                            >
                                                <Image
                                                    src={messageGroup.imageAttachments[0].url}
                                                    alt={messageGroup.imageAttachments[0].name}
                                                    width={280}
                                                    height={220}
                                                    className="h-auto max-h-72 w-full object-cover"
                                                />
                                            </button>
                                        </div>
                                    ) : null}
                                    {messageGroup.fileAttachments.length > 0 ? (
                                        <div className="mb-2 grid gap-2">
                                            {messageGroup.fileAttachments.map((attachment) => (
                                                <a
                                                    key={attachment.url}
                                                    href={attachment.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className={[
                                                        "flex items-start gap-2 rounded-[1.1rem] border p-2 text-[12px] backdrop-blur-md",
                                                        isOwnMessage
                                                            ? "border-white/10 bg-white/10 text-white dark:border-white/10 dark:bg-white/[0.07] dark:text-slate-100"
                                                            : "border-black/8 bg-black/[0.03] text-slate-700 dark:border-white/8 dark:bg-white/[0.05] dark:text-slate-200",
                                                    ].join(" ")}
                                                >
                                                    <span className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${isOwnMessage ? "bg-white/10 dark:bg-black/10" : "bg-black/[0.05] dark:bg-white/[0.06]"}`}>
                                                        <FileText className="h-4 w-4" />
                                                    </span>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="overflow-hidden break-all text-[12px] font-medium leading-4">
                                                            {attachment.name}
                                                        </p>
                                                        <p className="mt-1 text-[11px] opacity-70">
                                                            {formatAttachmentSize(attachment.size)}
                                                        </p>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    ) : null}
                                    {messageGroup.content ? (
                                        <p className="break-words text-[13px] leading-[1.55] tracking-[0.01em]">
                                            {messageGroup.content}
                                        </p>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                        {menuState?.messageId === messageGroup.id && typeof document !== "undefined"
                            ? createPortal(
                                <div
                                    className="fixed z-[80] min-w-40 rounded-[1rem] border border-black/10 bg-white/95 p-1.5 shadow-xl backdrop-blur dark:border-white/10 dark:bg-slate-950/95"
                                    style={{ left: menuState.left, top: menuState.top }}
                                >
                                    <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">
                                        {t("messagesParts.messageActions")}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onReplyToMessage(replyPreview);
                                            setMenuState(null);
                                        }}
                                        className="flex w-full items-center gap-2 rounded-[0.8rem] px-3 py-2 text-left text-[13px] font-medium text-slate-800 transition-colors hover:bg-black/[0.05] dark:text-slate-100 dark:hover:bg-white/[0.06]"
                                    >
                                        <CornerUpLeft className="h-4 w-4" />
                                        {t("messagesParts.reply")}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onForwardMessage(replyPreview);
                                            setMenuState(null);
                                        }}
                                        className="flex w-full items-center gap-2 rounded-[0.8rem] px-3 py-2 text-left text-[13px] font-medium text-slate-800 transition-colors hover:bg-black/[0.05] dark:text-slate-100 dark:hover:bg-white/[0.06]"
                                    >
                                        <Forward className="h-4 w-4" />
                                        {t("messagesParts.forward")}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            try {
                                                await navigator.clipboard.writeText(messageGroup.content || getReplyPreviewText(replyPreview));
                                                void antMessage.success(t("messagesParts.messageCopied"));
                                            } catch {
                                                void antMessage.error(t("messagesParts.messageCopyFailed"));
                                            } finally {
                                                setMenuState(null);
                                            }
                                        }}
                                        className="flex w-full items-center gap-2 rounded-[0.8rem] px-3 py-2 text-left text-[13px] font-medium text-slate-800 transition-colors hover:bg-black/[0.05] dark:text-slate-100 dark:hover:bg-white/[0.06]"
                                    >
                                        <Copy className="h-4 w-4" />
                                        {t("messagesParts.copy")}
                                    </button>
                                    {isOwnMessage ? (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                onDeleteMessage(messageGroup.id);
                                                setMenuState(null);
                                            }}
                                            className="flex w-full items-center gap-2 rounded-[0.8rem] px-3 py-2 text-left text-[13px] font-medium text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-500/10"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            {t("common.delete")}
                                        </button>
                                    ) : null}
                                </div>,
                                document.body,
                            )
                            : null}
                    </div>
                );
            })}
        </>
    );
}

export function MessageComposer({
    canSendMessage,
    fileInputRef,
    isSendingMessage,
    messageContent,
    replyTargetMessage,
    onCancelReply,
    onChangeMessageContent,
    onRemoveSelectedAttachment,
    onSelectMessageFiles,
    onSendMessage,
    selectedAttachmentAccept,
    selectedAttachments,
}: {
    canSendMessage: boolean;
    fileInputRef: RefObject<HTMLInputElement | null>;
    isSendingMessage: boolean;
    messageContent: string;
    replyTargetMessage: IMessageReplyPreview | null;
    onCancelReply: () => void;
    onChangeMessageContent: (value: string) => void;
    onRemoveSelectedAttachment: (localId: string) => void;
    onSelectMessageFiles: (files: FileList | null) => void;
    onSendMessage: () => void;
    selectedAttachmentAccept: string;
    selectedAttachments: DraftMessageAttachment[];
}) {
    const { t } = useTranslation();

    if (!canSendMessage) {
        return null;
    }

    const selectedImageAttachments = selectedAttachments.filter((attachment) => attachment.kind === "IMAGE" && attachment.previewUrl);
    const selectedFileAttachments = selectedAttachments.filter((attachment) => attachment.kind === "FILE" || !attachment.previewUrl);

    return (
        <div className="border-t border-black/10 bg-white/80 px-3 py-3 dark:border-white/10 dark:bg-white/[0.03] sm:px-5">
            <div className="grid gap-2">
                {replyTargetMessage ? (
                    <div className="relative overflow-hidden rounded-[1.1rem] border border-black/10 bg-black/[0.03] px-3 py-2 dark:border-white/10 dark:bg-white/[0.04]">
                        <p className="pr-8 text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500 dark:text-slate-400">
                            {t("messagesParts.replyingTo")} {replyTargetMessage.senderName}
                        </p>
                        <p className="mt-1 line-clamp-2 pr-8 text-[12px] text-slate-700 dark:text-slate-200">
                            {getReplyPreviewText(replyTargetMessage)}
                        </p>
                        <button
                            type="button"
                            onClick={onCancelReply}
                            className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white"
                            aria-label={t("messagesParts.cancelReply")}
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ) : null}
                {selectedAttachments.length > 0 ? (
                    <div className="grid gap-2">
                        {selectedImageAttachments.length > 0 ? (
                            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
                                {selectedImageAttachments.map((attachment) => (
                                    <div
                                        key={attachment.localId}
                                        className="relative h-36 w-32 shrink-0 overflow-hidden rounded-[1.25rem] border border-black/10 bg-black/[0.03] dark:border-white/10 dark:bg-white/[0.04] sm:h-40 sm:w-36"
                                    >
                                        <Image
                                            src={attachment.previewUrl ?? ""}
                                            alt={attachment.name}
                                            width={320}
                                            height={320}
                                            className="h-full w-full object-cover"
                                        />
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent p-2">
                                            <p className="max-w-[85%] overflow-hidden text-ellipsis whitespace-nowrap text-[11px] font-medium text-white">
                                                {attachment.name}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => onRemoveSelectedAttachment(attachment.localId)}
                                            className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-sm"
                                            aria-label={t("messagesParts.removeAttachment", { name: attachment.name })}
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : null}
                        {selectedFileAttachments.length > 0 ? (
                            <div className="grid gap-2">
                                {selectedFileAttachments.map((attachment) => (
                                    <div
                                        key={attachment.localId}
                                        className="relative min-w-0 overflow-hidden rounded-[1.1rem] border border-black/10 bg-black/[0.03] p-2 dark:border-white/10 dark:bg-white/[0.04]"
                                    >
                                        <div className="flex items-start gap-2 pr-10">
                                            <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/80 dark:bg-slate-900/60">
                                                <Paperclip className="h-4 w-4 text-slate-500 dark:text-slate-300" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="overflow-hidden break-all text-[12px] font-medium leading-4 text-slate-800 dark:text-slate-100">
                                                    {attachment.name}
                                                </p>
                                                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                                                    {formatAttachmentSize(attachment.size)}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => onRemoveSelectedAttachment(attachment.localId)}
                                            className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white"
                                            aria-label={t("messagesParts.removeAttachment", { name: attachment.name })}
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : null}
                    </div>
                ) : null}
                <div className="flex items-end gap-2">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={selectedAttachmentAccept}
                        multiple
                        className="hidden"
                        onChange={(event) => {
                            onSelectMessageFiles(event.target.files);
                            event.target.value = "";
                        }}
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/10 bg-black/[0.03] text-slate-600 transition-colors hover:bg-black/[0.06] dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:bg-white/[0.08]"
                        aria-label={t("messagesParts.uploadFile")}
                    >
                        <FileText className="h-4 w-4" />
                    </button>
                    <div className="min-w-0 flex-1">
                        <Input.TextArea
                            autoSize={{ minRows: 1, maxRows: 4 }}
                            value={messageContent}
                            onChange={(event) => onChangeMessageContent(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter" && !event.shiftKey) {
                                    event.preventDefault();
                                    if (!isSendingMessage) {
                                        onSendMessage();
                                    }
                                }
                            }}
                            placeholder={t("messagesParts.writeMessage")}
                            className="rounded-[1.25rem]"
                        />
                    </div>
                    <div className="shrink-0">
                        <SButton type="button" color="primary" onClick={onSendMessage} loading={isSendingMessage}>
                            {t("messagesParts.send")}
                        </SButton>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function MessageAlbumModal({
    activeAlbum,
    activeAlbumIndex,
    onClose,
    onSelectImage,
}: {
    activeAlbum: IMessageAttachment[] | null;
    activeAlbumIndex: number;
    onClose: () => void;
    onSelectImage: (index: number) => void;
}) {
    const { t } = useTranslation();
    const modalTitle = (
        <div className="flex items-center justify-between gap-2">
            <span>{activeAlbum?.length === 1 ? t("messagesParts.image") : t("messagesParts.album")}</span>
            <button
                type="button"
                onClick={onClose}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-black/[0.03] text-slate-700 transition-colors hover:bg-black/[0.06] dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.08]"
                aria-label={t("messagesParts.closeImageViewer")}
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );

    return (
        <SModal
            isOpen={Boolean(activeAlbum)}
            onClose={onClose}
            title={modalTitle}
        >
            {activeAlbum ? (
                <div className="space-y-2">
                    <div className="flex h-[22rem] items-center justify-center overflow-hidden rounded-[1.5rem] border border-black/10 bg-slate-100 p-2 dark:border-white/10 dark:bg-slate-900 sm:h-[28rem]">
                        <Image
                            src={activeAlbum[activeAlbumIndex].url}
                            alt={activeAlbum[activeAlbumIndex].name}
                            width={1200}
                            height={900}
                            className="max-h-full w-auto max-w-full object-contain"
                        />
                    </div>
                    {activeAlbum.length > 1 ? (
                        <>
                            <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                                {activeAlbum.map((attachment, index) => (
                                    <button
                                        key={attachment.url}
                                        type="button"
                                        onClick={() => onSelectImage(index)}
                                        className={[
                                            "relative aspect-square min-w-0 overflow-hidden rounded-[1rem] border-2",
                                            index === activeAlbumIndex
                                                ? "border-sky-500"
                                                : "border-transparent",
                                        ].join(" ")}
                                        aria-label={t("messagesParts.viewImage", { index: index + 1 })}
                                    >
                                        <Image
                                            src={attachment.url}
                                            alt={attachment.name}
                                            fill
                                            sizes="80px"
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                            <Typography.Text className="!text-xs text-slate-500 dark:!text-slate-400">
                                {t("messagesParts.albumPosition", { current: activeAlbumIndex + 1, total: activeAlbum.length })}
                            </Typography.Text>
                        </>
                    ) : null}
                </div>
            ) : null}
        </SModal>
    );
}
