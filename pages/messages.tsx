import MessageConversation from "@/components/features/messages/MessageConversation";
import MessageThreadList from "@/components/features/messages/MessageThreadList";
import SButton from "@/components/ui/SButton";
import SInput from "@/components/ui/SInput";
import SModal from "@/components/ui/SModal";
import useMessages from "@/hooks/useMessages";
import { ArrowLeftRight } from "lucide-react";
import { Empty, Form, Select, Skeleton, Typography } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function MessagesPage() {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState("");
  const [mobilePane, setMobilePane] = useState<"threads" | "messages">("threads");
  const {
    canCreateThread,
    canSendMessage,
    confirmDeleteMessage,
    currentUserId,
    forwardTargetMessage,
    form,
    handleCloseModal,
    isLoading,
    isLoadingOlderMessages,
    isCreatingThread,
    isModalVisible,
    isSendingMessage,
    memberOptions,
    messageContent,
    pendingDeleteMessageId,
    onCreateThread,
    onDeleteMessage,
    onForwardMessage,
    onLoadOlderMessages,
    onSelectMessageFiles,
    onSendMessage,
    replyTargetMessage,
    removeSelectedAttachment,
    selectedAttachments,
    selectedAttachmentAccept,
    selectedThread,
    selectedThreadId,
    setForwardTargetMessage,
    setIsModalVisible,
    setMessageContent,
    setPendingDeleteMessageId,
    setReplyTargetMessage,
    setSelectedThreadId,
    threads,
  } = useMessages();

  const filteredThreads = threads.filter((thread) => {
    const keyword = searchValue.trim().toLowerCase();

    if (!keyword) {
      return true;
    }

    return [
      thread.title,
      thread.subtitle,
      thread.teacherName,
      thread.studentName,
      thread.className,
      thread.lastMessagePreview,
    ].some((value) => value.toLowerCase().includes(keyword));
  });

  const handleSelectThread = (threadId: string) => {
    setSelectedThreadId(threadId);
    setMobilePane("messages");
  };

  return (
    <>
      <section
        className="page-body flex h-[calc(100vh-6.5rem)] min-h-0 flex-col gap-4 md:h-auto"
      >
        <div
          className={[
            "shrink-0 rounded-md border border-black/10 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5",
            mobilePane === "messages" ? "hidden md:block" : "block",
          ].join(" ")}
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-lg font-semibold text-slate-950 dark:text-slate-50">{t("messages.title")}</h1>
              <Typography.Text className="!text-xs text-slate-500 dark:!text-slate-400">
                {t("messages.subtitle")}
              </Typography.Text>
            </div>

            <div className="flex flex-col gap-2 sm:min-w-72 sm:flex-row">
              <SInput
                placeholder={t("messages.searchPlaceholder")}
                value={searchValue}
                onChange={(value) => setSearchValue(String(value))}
              />
              {canCreateThread ? (
                <SButton type="button" color="primary" onClick={() => setIsModalVisible(true)}>
                  {t("messages.newChat")}
                </SButton>
              ) : null}
            </div>
          </div>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 md:flex-none md:grid-cols-[280px_minmax(0,1fr)] lg:grid-cols-[320px_minmax(0,1fr)]">
          <section
            className={[
              "min-h-0 overflow-hidden rounded-md border border-black/10 bg-white/80 dark:border-white/10 dark:bg-white/5 h-full md:h-[40rem]",
              mobilePane === "messages" ? "hidden md:block" : "block",
            ].join(" ")}
          >
            <div className="border-b border-black/10 px-4 py-3 dark:border-white/10">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-slate-950 dark:text-slate-50">{t("messages.chats")}</h2>
                  <Typography.Text className="!text-xs text-slate-500 dark:!text-slate-400">
                    {t("messages.conversationsCount", { filtered: filteredThreads.length, total: threads.length, count: threads.length })}
                  </Typography.Text>
                </div>
                {selectedThread ? (
                  <button
                    type="button"
                    onClick={() => setMobilePane("messages")}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-black/[0.03] text-slate-600 transition-transform duration-300 hover:rotate-180 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 md:hidden"
                    aria-label={t("messages.showMessagePane")}
                  >
                    <ArrowLeftRight className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
            </div>

            <div className="h-[calc(100%-4.5rem)] overflow-y-auto p-2">
              {isLoading ? (
                <Skeleton active paragraph={{ rows: 8 }} />
              ) : filteredThreads.length === 0 ? (
                <Empty description={threads.length === 0 ? t("messages.noConversationsYet") : t("messages.noConversationsMatch")} />
              ) : (
                <MessageThreadList
                  selectedThreadId={selectedThreadId}
                  threads={filteredThreads}
                  onSelectThread={handleSelectThread}
                />
              )}
            </div>
          </section>

          <section
            className={[
              "min-h-0 overflow-hidden rounded-md border border-black/10 bg-white/80 dark:border-white/10 dark:bg-white/5 h-full md:h-[40rem]",
              mobilePane === "threads" ? "hidden md:block" : "block",
            ].join(" ")}
          >
            {isLoading ? (
              <div className="p-5">
                <Skeleton active paragraph={{ rows: 12 }} />
              </div>
            ) : (
              <MessageConversation
                currentUserId={currentUserId}
                thread={selectedThread}
                autoScrollKey={`${selectedThreadId ?? "none"}:${mobilePane}:${isLoading ? "loading" : "ready"}`}
                isVisible={mobilePane === "messages"}
                canSendMessage={canSendMessage}
                isSendingMessage={isSendingMessage}
                isLoadingOlderMessages={isLoadingOlderMessages}
                messageContent={messageContent}
                replyTargetMessage={replyTargetMessage}
                selectedAttachments={selectedAttachments}
                selectedAttachmentAccept={selectedAttachmentAccept}
                onChangeMessageContent={setMessageContent}
                onReplyToMessage={setReplyTargetMessage}
                onForwardMessage={setForwardTargetMessage}
                onDeleteMessage={onDeleteMessage}
                onLoadOlderMessages={onLoadOlderMessages}
                onCancelReply={() => setReplyTargetMessage(null)}
                onRemoveSelectedAttachment={removeSelectedAttachment}
                onSelectMessageFiles={onSelectMessageFiles}
                onSendMessage={onSendMessage}
                onBackToThreads={() => setMobilePane("threads")}
              />
            )}
          </section>
        </div>
      </section>

      <SModal isOpen={isModalVisible} onClose={handleCloseModal} title={t("messages.startConversation")}>
        <Form form={form} layout="vertical">
          <Form.Item
            label={t("messages.schoolMember")}
            name="recipientUserId"
            rules={[{ required: true, message: t("messages.selectMember") }]}
          >
            <Select
              showSearch
              placeholder={t("messages.memberSearchPlaceholder")}
              optionFilterProp="label"
              options={memberOptions.map((member) => ({
                value: member.value,
                label: `${member.label} (${member.username || member.email})`,
              }))}
            />
          </Form.Item>
        </Form>
        <div className="flex justify-end gap-2">
          <SButton type="button" color="secondary" onClick={handleCloseModal}>
            {t("common.cancel")}
          </SButton>
          <SButton type="button" color="primary" onClick={onCreateThread} loading={isCreatingThread}>
            {t("messages.startChat")}
          </SButton>
        </div>
      </SModal>

      <SModal
        isOpen={Boolean(pendingDeleteMessageId)}
        onClose={() => setPendingDeleteMessageId(null)}
        title={t("messages.deleteMessageTitle")}
      >
        <div className="rounded-[1rem] border border-rose-200 bg-rose-50/80 px-4 py-3 dark:border-rose-500/20 dark:bg-rose-500/10">
          <p className="text-[13px] leading-6 text-slate-700 dark:text-slate-200">
            {t("messages.deleteMessageWarning")}
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <SButton type="button" color="secondary" onClick={() => setPendingDeleteMessageId(null)}>
            {t("common.cancel")}
          </SButton>
          <SButton type="button" color="danger" onClick={() => void confirmDeleteMessage()} loading={isSendingMessage}>
            {t("common.delete")}
          </SButton>
        </div>
      </SModal>

      <SModal
        isOpen={Boolean(forwardTargetMessage)}
        onClose={() => setForwardTargetMessage(null)}
        title={t("messages.forwardMessage")}
      >
        <div className="space-y-4">
          {forwardTargetMessage ? (
            <div className="rounded-[1rem] border border-black/10 bg-black/[0.03] px-3 py-2 dark:border-white/10 dark:bg-white/[0.04]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500 dark:text-slate-400">
                {t("messages.from")} {forwardTargetMessage.senderName}
              </p>
              <p className="mt-1 line-clamp-3 break-words text-[13px] text-slate-700 dark:text-slate-200">
                {forwardTargetMessage.content || (forwardTargetMessage.attachments.length > 0
                  ? t("messages.attachmentsCount", { count: forwardTargetMessage.attachments.length })
                  : t("messages.message"))}
              </p>
            </div>
          ) : null}
          <div className="grid gap-2">
            {threads
              .filter((thread) => thread.id !== selectedThreadId)
              .map((thread) => (
                <button
                  key={thread.id}
                  type="button"
                  onClick={() => void onForwardMessage(thread.id)}
                  className="w-full rounded-[1rem] border border-black/10 bg-white/80 px-3 py-3 text-left transition hover:border-sky-300 hover:bg-sky-50/70 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-sky-500/40 dark:hover:bg-sky-500/10"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-semibold text-slate-900 dark:text-slate-50">
                        {thread.title}
                      </p>
                      <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                        {thread.subtitle}
                      </p>
                    </div>
                    <span className="shrink-0 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                      Forward
                    </span>
                  </div>
                </button>
              ))}
            {threads.filter((thread) => thread.id !== selectedThreadId).length === 0 ? (
              <Typography.Text className="!text-sm text-slate-500 dark:!text-slate-400">
                No other conversation available for forwarding.
              </Typography.Text>
            ) : null}
          </div>
        </div>
      </SModal>
    </>
  );
}
