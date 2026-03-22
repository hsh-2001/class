import { getApiErrorMessage } from "@/lib/api-error";
import { callCreateMessageThread, callGetMessages, callSendMessage } from "@/lib/api-calling";
import { socketServerPath } from "@/lib/socket-shared";
import { uploadMany } from "@/lib/upload";
import {
    ICreateMessageThreadDTO,
    IMessageAttachment,
    IMessagePageData,
    IMessageSocketAck,
    ISendMessageDTO,
    MESSAGE_ATTACHMENT_ACCEPT,
    MESSAGE_ATTACHMENT_MAX_SIZE,
    MessageClientToServerEvents,
    MessageServerToClientEvents,
    MessageThreadResponse,
} from "@/types/message";
import { message as antMessage } from "antd";
import { useForm } from "antd/es/form/Form";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

type CreateThreadFormValues = {
    classId: string;
    studentId: string;
};

type DraftMessageAttachment = IMessageAttachment & {
    file: File;
    localId: string;
    previewUrl?: string;
};

const allowedMessageFileExtensions = [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt"];

const isAllowedMessageAttachment = (file: File) => {
    if (file.type.startsWith("image/")) {
        return true;
    }

    if (!file.name.includes(".")) {
        return false;
    }

    const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    return allowedMessageFileExtensions.includes(extension);
};

const revokeAttachmentPreviews = (attachments: DraftMessageAttachment[]) => {
    attachments.forEach((attachment) => {
        if (attachment.previewUrl?.startsWith("blob:")) {
            URL.revokeObjectURL(attachment.previewUrl);
        }
    });
};

const getOutgoingMessagePreview = (content: string, attachments: IMessageAttachment[]) => {
    const trimmedContent = content.trim();

    if (trimmedContent) {
        return trimmedContent;
    }

    if (attachments.length === 1) {
        return attachments[0]?.kind === "IMAGE"
            ? "Photo"
            : `File: ${attachments[0]?.name ?? "Attachment"}`;
    }

    if (attachments.length > 1) {
        return `${attachments.length} attachments`;
    }

    return "No messages yet.";
};

const uploadAttachments = async (path: string, attachments: DraftMessageAttachment[]) => {
    if (attachments.length === 0) {
        return [];
    }

    const batchUpload = await uploadMany(path, attachments.map((attachment) => attachment.file));
    const uploadedUrls = batchUpload?.data?.map((item) => item.download_url).filter(Boolean) ?? [];

    if (uploadedUrls.length !== attachments.length) {
        throw new Error("Failed to upload attachment.");
    }

    return uploadedUrls;
};

export default function useMessages() {
    const [form] = useForm<CreateThreadFormValues>();
    const socketRef = useRef<Socket<MessageServerToClientEvents, MessageClientToServerEvents> | null>(null);
    const selectedAttachmentsRef = useRef<DraftMessageAttachment[]>([]);
    const [threads, setThreads] = useState<MessageThreadResponse[]>([]);
    const [currentUserId, setCurrentUserId] = useState("");
    const [classOptions, setClassOptions] = useState<IMessagePageData["classOptions"]>([]);
    const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
    const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
    const [messageContent, setMessageContent] = useState("");
    const [selectedAttachments, setSelectedAttachments] = useState<DraftMessageAttachment[]>([]);
    const [canCreateThread, setCanCreateThread] = useState(false);
    const [canSendMessage, setCanSendMessage] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isCreatingThread, setIsCreatingThread] = useState(false);
    const [isSendingMessage, setIsSendingMessage] = useState(false);

    useEffect(() => {
        selectedAttachmentsRef.current = selectedAttachments;
    }, [selectedAttachments]);

    useEffect(() => {
        return () => {
            revokeAttachmentPreviews(selectedAttachmentsRef.current);
        };
    }, []);

    const syncPageData = useCallback((payload: IMessagePageData) => {
        const nextThreads = payload.threads.map((item) => new MessageThreadResponse(item));
        setThreads(nextThreads);
        setCurrentUserId(payload.currentUserId);
        setClassOptions(payload.classOptions);
        setCanCreateThread(payload.canCreateThread);
        setCanSendMessage(payload.canSendMessage);
        setSelectedThreadId((current) => {
            if (current && nextThreads.some((item) => item.id === current)) {
                return current;
            }
            return nextThreads[0]?.id ?? null;
        });
    }, []);

    const fetchMessages = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await callGetMessages();
            if (response.data.success) {
                syncPageData(response.data.data as IMessagePageData);
            }
        } catch (error: unknown) {
            console.error(getApiErrorMessage(error, "Failed to fetch messages."));
        } finally {
            setIsLoading(false);
        }
    }, [syncPageData]);

    const refreshMessages = useCallback(async () => {
        const response = await callGetMessages();
        if (response.data.success) {
            syncPageData(response.data.data as IMessagePageData);
        }
    }, [syncPageData]);

    useEffect(() => {
        void fetchMessages();
    }, [fetchMessages]);

    const connectMessageSocket = useCallback(async () => {
        if (typeof window === "undefined" || socketRef.current) {
            return;
        }

        const token = window.localStorage.getItem("token");
        if (!token) {
            return;
        }

        await fetch("/api/socket");

        const socket = io({
            path: socketServerPath,
            transports: ["websocket"],
            auth: {
                token,
            },
        });

        socket.on("message:page-data", () => {
            void refreshMessages();
        });

        socketRef.current = socket;
    }, [refreshMessages]);

    useEffect(() => {
        void connectMessageSocket();

        return () => {
            socketRef.current?.disconnect();
            socketRef.current = null;
        };
    }, [connectMessageSocket]);

    const selectedThread = useMemo(
        () => threads.find((item) => item.id === selectedThreadId) ?? null,
        [selectedThreadId, threads],
    );

    const selectedClassOption = classOptions.find((item) => item.value === selectedClassId);
    const studentOptions = selectedClassOption?.students ?? [];

    const emitSocketEvent = useCallback(
        async (
            eventName: "message:thread:create" | "message:send",
            payload: ICreateMessageThreadDTO | ISendMessageDTO,
        ) => {
            const socket = socketRef.current;
            if (!socket) {
                return null;
            }

            return await new Promise<IMessageSocketAck>((resolve) => {
                socket.emit(eventName, payload as never, (response) => {
                    resolve(response);
                });
            });
        },
        [],
    );

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedClassId(null);
        form.resetFields();
    };

    const onCreateThread = async () => {
        const values = form.getFieldsValue();
        setIsCreatingThread(true);

        try {
            const socketResponse = await emitSocketEvent("message:thread:create", values);
            if (socketResponse?.success && socketResponse.data) {
                syncPageData(socketResponse.data);
                handleCloseModal();
                return;
            }

            const response = await callCreateMessageThread(values);
            if (response.data.success) {
                syncPageData(response.data.data as IMessagePageData);
                handleCloseModal();
            }
        } catch (error: unknown) {
            console.error(getApiErrorMessage(error, "Failed to create conversation."));
        } finally {
            setIsCreatingThread(false);
        }
    };

    const clearSelectedAttachments = useCallback(() => {
        setSelectedAttachments((currentAttachments) => {
            revokeAttachmentPreviews(currentAttachments);
            return [];
        });
    }, []);

    const removeSelectedAttachment = useCallback((localId: string) => {
        setSelectedAttachments((currentAttachments) => {
            const attachment = currentAttachments.find((item) => item.localId === localId);
            if (attachment?.previewUrl?.startsWith("blob:")) {
                URL.revokeObjectURL(attachment.previewUrl);
            }

            return currentAttachments.filter((item) => item.localId !== localId);
        });
    }, []);

    const appendOutgoingMessage = useCallback((threadId: string, content: string, attachments: IMessageAttachment[]) => {
        const createdAt = new Date().toISOString();

        setThreads((currentThreads) => {
            const nextThreads = currentThreads.map((thread) => {
                if (thread.id !== threadId) {
                    return thread;
                }

                return new MessageThreadResponse({
                    ...thread,
                    updatedAt: createdAt,
                    lastMessagePreview: getOutgoingMessagePreview(content, attachments),
                    messages: [
                        ...thread.messages,
                        {
                            id: `local-${createdAt}`,
                            senderUserId: currentUserId,
                            senderName: "",
                            senderRole: canCreateThread ? "TEACHER" : "STUDENT",
                            content,
                            attachments,
                            createdAt,
                        },
                    ],
                });
            });

            nextThreads.sort((firstThread, secondThread) =>
                new Date(secondThread.updatedAt).getTime() - new Date(firstThread.updatedAt).getTime());

            return nextThreads;
        });
    }, [canCreateThread, currentUserId]);

    const onSelectMessageFiles = useCallback((files: FileList | null) => {
        if (!files?.length) {
            return;
        }

        const nextAttachments: DraftMessageAttachment[] = [];
        const rejectedFiles: string[] = [];

        Array.from(files).forEach((file) => {
            if (!isAllowedMessageAttachment(file)) {
                rejectedFiles.push(`${file.name}: unsupported file type.`);
                return;
            }

            if (file.size > MESSAGE_ATTACHMENT_MAX_SIZE) {
                rejectedFiles.push(`${file.name}: file size must be 3 MB or less.`);
                return;
            }

            nextAttachments.push({
                file,
                localId: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
                previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
                url: "",
                name: file.name,
                mimeType: file.type || "application/octet-stream",
                size: file.size,
                kind: file.type.startsWith("image/") ? "IMAGE" : "FILE",
            });
        });

        if (rejectedFiles.length > 0) {
            void antMessage.error(rejectedFiles[0]);
        }

        if (nextAttachments.length > 0) {
            setSelectedAttachments((currentAttachments) => [...currentAttachments, ...nextAttachments]);
        }
    }, []);

    const onSendMessage = async () => {
        if (!selectedThreadId || (!messageContent.trim() && selectedAttachments.length === 0)) {
            return;
        }

        setIsSendingMessage(true);

        try {
            const imageAttachments = selectedAttachments.filter((attachment) => attachment.kind === "IMAGE");
            const fileAttachments = selectedAttachments.filter((attachment) => attachment.kind === "FILE");
            const [uploadedImages, uploadedFiles] = await Promise.all([
                uploadAttachments("class/messages/images", imageAttachments),
                uploadAttachments("class/messages/files", fileAttachments),
            ]);
            const nextImageUrls = [...uploadedImages];
            const nextFileUrls = [...uploadedFiles];
            const uploadedAttachments: IMessageAttachment[] = selectedAttachments.map((attachment) => {
                const uploadedUrl = attachment.kind === "IMAGE" ? nextImageUrls.shift() : nextFileUrls.shift();

                if (!uploadedUrl) {
                    throw new Error("Failed to upload attachment.");
                }

                return {
                    url: uploadedUrl,
                    name: attachment.name,
                    mimeType: attachment.mimeType,
                    size: attachment.size,
                    kind: attachment.kind,
                };
            });

            const payload = {
                threadId: selectedThreadId,
                content: messageContent,
                attachments: uploadedAttachments,
            };
            const socketResponse = await emitSocketEvent("message:send", payload);
            if (socketResponse?.success && socketResponse.data) {
                appendOutgoingMessage(selectedThreadId, messageContent, uploadedAttachments);
                setMessageContent("");
                clearSelectedAttachments();
                void refreshMessages();
                return;
            }

            const response = await callSendMessage(payload);
            if (response.data.success) {
                appendOutgoingMessage(selectedThreadId, messageContent, uploadedAttachments);
                setMessageContent("");
                clearSelectedAttachments();
                void refreshMessages();
            }
        } catch (error: unknown) {
            console.error(getApiErrorMessage(error, "Failed to send message."));
            void antMessage.error(getApiErrorMessage(error, "Failed to send message."));
        } finally {
            setIsSendingMessage(false);
        }
    };

    return {
        canCreateThread,
        canSendMessage,
        classOptions,
        currentUserId,
        form,
        handleCloseModal,
        isCreatingThread,
        isLoading,
        isModalVisible,
        isSendingMessage,
        messageContent,
        clearSelectedAttachments,
        onSelectMessageFiles,
        onCreateThread,
        onSendMessage,
        removeSelectedAttachment,
        selectedAttachments,
        selectedAttachmentAccept: MESSAGE_ATTACHMENT_ACCEPT,
        selectedThread,
        selectedThreadId,
        selectedClassId,
        setSelectedClassId,
        setIsModalVisible,
        setMessageContent,
        setSelectedThreadId,
        studentOptions,
        threads,
    };
}
