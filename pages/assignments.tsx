import AssignmentList from "@/components/features/assignments/AssignmentList";
import SButton from "@/components/ui/SButton";
import SInput from "@/components/ui/SInput";
import SModal from "@/components/ui/SModal";
import useAssignments from "@/hooks/useAssignments";
import { DatePicker, Empty, Form, Select, Skeleton } from "antd";

export default function AssignmentsPage() {
  const {
    assignments,
    canManage,
    classOptions,
    disabledPastDate,
    form,
    handleCloseModal,
    isLoading,
    isModalVisible,
    isSubmitting,
    isUserReady,
    onSubmit,
    setIsModalVisible,
  } = useAssignments();

  return (
    <>
      <div className="grid gap-6 page-body h-full overflow-auto w-full">
        <div>
          <div className="rounded-xl border border-black/10 bg-white/80 p-6 backdrop-blur dark:border-white/10 dark:bg-white/5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                  Assignment Workspace
                </p>
                <h1 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-slate-50">
                  Assignments
                </h1>
                {/* <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
                  {canManage
                    ? "Create assignments for active classes and monitor upcoming due dates."
                    : "Review assignments from the classes you are currently enrolled in."}
                </p> */}
              </div>

              {canManage ? (
                <SButton type="button" color="primary" onClick={() => setIsModalVisible(true)}>
                  Add Assignment
                </SButton>
              ) : null}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-black/10 bg-white/75 p-6 dark:border-white/10 dark:bg-white/5">
          {!isUserReady || isLoading ? (
            <Skeleton active paragraph={{ rows: 6 }} />
          ) : assignments.length === 0 ? (
            <Empty
              description={canManage ? "No assignments created yet." : "No assignments available for your enrolled classes."}
            />
          ) : (
            <div className="flex flex-col overflow-auto gap-6">
              {/* <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-950 dark:text-slate-50">Assignment List</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {assignments.length} assignment{assignments.length === 1 ? "" : "s"}
                </p>
              </div> */}

              <AssignmentList assignments={assignments} />
            </div>
          )}
        </div>
      </div>

      {canManage ? (
        <SModal
          isOpen={isModalVisible}
          onClose={handleCloseModal}
          title="Add new assignment"
        >
          <Form layout="vertical" form={form} onSubmitCapture={onSubmit}>
            <div className="grid gap-4">
              <Form.Item
                name="title"
                label="Assignment Title"
                rules={[{ required: true, message: "Please enter the assignment title!" }]}
              >
                <SInput placeholder="Midterm project" />
              </Form.Item>

              <Form.Item
                name="classId"
                label="Class"
                rules={[{ required: true, message: "Please select a class!" }]}
              >
                <Select
                  placeholder="Select class"
                  options={classOptions}
                />
              </Form.Item>

              <Form.Item
                name="dueDate"
                label="Due Date"
                rules={[{ required: true, message: "Please choose a due date!" }]}
              >
                <DatePicker
                  showTime
                  className="w-full"
                  format="MMM D, YYYY h:mm A"
                  disabledDate={disabledPastDate}
                />
              </Form.Item>
            </div>

            <div className="flex justify-end gap-2">
              <SButton type="button" color="secondary" onClick={handleCloseModal}>
                Cancel
              </SButton>
              <SButton type="submit" color="primary" loading={isSubmitting}>
                Create Assignment
              </SButton>
            </div>
          </Form>
        </SModal>
      ) : null}
    </>
  );
}
