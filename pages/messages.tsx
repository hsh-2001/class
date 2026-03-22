import MessageConversation from "@/components/features/messages/MessageConversation";
import MessageThreadList from "@/components/features/messages/MessageThreadList";
import SButton from "@/components/ui/SButton";
import SInput from "@/components/ui/SInput";
import SModal from "@/components/ui/SModal";
import useMessages from "@/hooks/useMessages";
import { ArrowLeftRight } from "lucide-react";
import { Empty, Form, Select, Skeleton, Typography } from "antd";
import { useState } from "react";

export default function MessagesPage() {
  const [searchValue, setSearchValue] = useState("");
  const [mobilePane, setMobilePane] = useState<"threads" | "messages">("threads");
  const {
    canCreateThread,
    canSendMessage,
    currentUserId,
    form,
    handleCloseModal,
    isLoading,
    isCreatingThread,
    isModalVisible,
    isSendingMessage,
    memberOptions,
    messageContent,
    onCreateThread,
    onSelectMessageFiles,
    onSendMessage,
    replyTargetMessage,
    removeSelectedAttachment,
    selectedAttachments,
    selectedAttachmentAccept,
    selectedThread,
    selectedThreadId,
    setIsModalVisible,
    setMessageContent,
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
      <section className="grid gap-4 page-body">
        <div className="rounded-md border border-black/10 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-lg font-semibold text-slate-950 dark:text-slate-50">Messages</h1>
              <Typography.Text className="!text-xs text-slate-500 dark:!text-slate-400">
                Realtime class conversation
              </Typography.Text>
            </div>

            <div className="flex flex-col gap-2 sm:min-w-72 sm:flex-row">
              <SInput
                placeholder="Search conversations"
                value={searchValue}
                onChange={(value) => setSearchValue(String(value))}
              />
              {canCreateThread ? (
                <SButton type="button" color="primary" onClick={() => setIsModalVisible(true)}>
                  New chat
                </SButton>
              ) : null}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-[280px_minmax(0,1fr)] lg:grid-cols-[320px_minmax(0,1fr)]">
          <section
            className={[
              "overflow-hidden rounded-md border border-black/10 bg-white/80 dark:border-white/10 dark:bg-white/5",
              mobilePane === "messages" ? "hidden md:block" : "block",
            ].join(" ")}
          >
            <div className="border-b border-black/10 px-4 py-3 dark:border-white/10">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-slate-950 dark:text-slate-50">Chats</h2>
                  <Typography.Text className="!text-xs text-slate-500 dark:!text-slate-400">
                    {filteredThreads.length} of {threads.length} conversation{threads.length === 1 ? "" : "s"}
                  </Typography.Text>
                </div>
                {selectedThread ? (
                  <button
                    type="button"
                    onClick={() => setMobilePane("messages")}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-black/[0.03] text-slate-600 transition-transform duration-300 hover:rotate-180 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 md:hidden"
                    aria-label="Show message pane"
                  >
                    <ArrowLeftRight className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
            </div>

            <div className="max-h-[40rem] overflow-y-auto p-2">
              {isLoading ? (
                <Skeleton active paragraph={{ rows: 8 }} />
              ) : filteredThreads.length === 0 ? (
                <Empty description={threads.length === 0 ? "No conversations yet." : "No conversations match your search."} />
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
              "h-[40rem] min-h-0 overflow-hidden rounded-md border border-black/10 bg-white/80 dark:border-white/10 dark:bg-white/5",
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
                messageContent={messageContent}
                replyTargetMessage={replyTargetMessage}
                selectedAttachments={selectedAttachments}
                selectedAttachmentAccept={selectedAttachmentAccept}
                onChangeMessageContent={setMessageContent}
                onReplyToMessage={setReplyTargetMessage}
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

      <SModal isOpen={isModalVisible} onClose={handleCloseModal} title="Start a Conversation">
        <Form form={form} layout="vertical">
          <Form.Item
            label="School Member"
            name="recipientUserId"
            rules={[{ required: true, message: "Please select a member." }]}
          >
            <Select
              showSearch
              placeholder="Search by name, username, or email"
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
            Cancel
          </SButton>
          <SButton type="button" color="primary" onClick={onCreateThread} loading={isCreatingThread}>
            Start chat
          </SButton>
        </div>
      </SModal>
    </>
  );
}
