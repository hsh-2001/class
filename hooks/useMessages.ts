import { getApiErrorMessage } from "@/lib/api-error";
import { callCreateMessageThread, callGetMessages, callSendMessage } from "@/lib/api-calling";
import { IMessagePageData, MessageThreadResponse } from "@/types/message";
import { useForm } from "antd/es/form/Form";
import { useCallback, useEffect, useMemo, useState } from "react";

type CreateThreadFormValues = {
    classId: string;
    studentId: string;
};

export default function useMessages() {
    const [form] = useForm<CreateThreadFormValues>();
    const [threads, setThreads] = useState<MessageThreadResponse[]>([]);
    const [currentUserId, setCurrentUserId] = useState("");
    const [classOptions, setClassOptions] = useState<IMessagePageData["classOptions"]>([]);
    const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
    const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
    const [messageContent, setMessageContent] = useState("");
    const [canCreateThread, setCanCreateThread] = useState(false);
    const [canSendMessage, setCanSendMessage] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isCreatingThread, setIsCreatingThread] = useState(false);
    const [isSendingMessage, setIsSendingMessage] = useState(false);

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

    useEffect(() => {
        void fetchMessages();
    }, [fetchMessages]);

    const selectedThread = useMemo(
        () => threads.find((item) => item.id === selectedThreadId) ?? null,
        [selectedThreadId, threads],
    );

    const selectedClassOption = classOptions.find((item) => item.value === selectedClassId);
    const studentOptions = selectedClassOption?.students ?? [];

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedClassId(null);
        form.resetFields();
    };

    const onCreateThread = async () => {
        const values = form.getFieldsValue();
        setIsCreatingThread(true);

        try {
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

    const onSendMessage = async () => {
        if (!selectedThreadId || !messageContent.trim()) {
            return;
        }

        setIsSendingMessage(true);

        try {
            const response = await callSendMessage({
                threadId: selectedThreadId,
                content: messageContent,
            });
            if (response.data.success) {
                syncPageData(response.data.data as IMessagePageData);
                setMessageContent("");
            }
        } catch (error: unknown) {
            console.error(getApiErrorMessage(error, "Failed to send message."));
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
        onCreateThread,
        onSendMessage,
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
