import SButton from "@/components/ui/SButton";
import SInput from "@/components/ui/SInput";
import SModal from "@/components/ui/SModal";
import useCourse from "@/hooks/useCourse";
import { Form, Table } from "antd";
import { Edit } from "lucide-react";
import { useEffect } from "react";

export default function CoursesPage() {
  const {
    courseForm,
    courseList,
    isModalVisible,
    setIsModalVisible,
    handleCloseModal,
    onSubmit,
    onClickEdit,
    isEditing,
    onGetAllCourses,
  } = useCourse();

  useEffect(() => {
    onGetAllCourses();
  }, []);

  return (
    <>
      <section className="grid gap-6 page-body">
        <div className="rounded-xl border border-black/10 bg-white/80 p-6 backdrop-blur dark:border-white/10 dark:bg-white/5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                Course Management
              </p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-slate-50">
                Courses
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
                Create courses, update course details, and review the current course catalog.
              </p>
            </div>
            <SButton type="button" color="primary" onClick={() => setIsModalVisible(true)}>
              Add Course
            </SButton>
          </div>
        </div>

        <div className="rounded-xl border border-black/10 bg-white/75 p-6 dark:border-white/10 dark:bg-white/5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-950 dark:text-slate-50">Course List</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {courseList.length} course{courseList.length === 1 ? "" : "s"}
            </p>
          </div>

          <Table
            rowKey="id"
            pagination={false}
            dataSource={courseList}
            columns={[
              {
                title: "Name",
                dataIndex: "name",
                key: "name",
              },
              {
                title: "Code",
                dataIndex: "code",
                key: "code",
                width: 180,
              },
              {
                title: "Description",
                dataIndex: "description",
                key: "description",
              },
              {
                title: "Actions",
                key: "actions",
                width: 100,
                render: (_, record) => (
                  <button onClick={() => onClickEdit(record)}>
                    <Edit className="h-4 w-4 cursor-pointer text-black/90 dark:text-slate-50" />
                  </button>
                ),
              },
            ]}
          />
        </div>
      </section>

      <SModal
        isOpen={isModalVisible}
        onClose={handleCloseModal}
        title={isEditing ? "Update course" : "Add new course"}
      >
        <Form layout="vertical" form={courseForm} onSubmitCapture={onSubmit}>
          <div className="grid gap-4">
            <Form.Item
              name="name"
              label="Course Name"
              rules={[{ required: true, message: "Please enter the course name!" }]}
            >
              <SInput placeholder="Enter course name" />
            </Form.Item>

            <Form.Item
              name="code"
              label="Course Code"
              rules={[{ required: true, message: "Please enter the course code!" }]}
            >
              <SInput placeholder="Enter course code" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: "Please enter the course description!" }]}
            >
              <SInput placeholder="Enter course description" />
            </Form.Item>
          </div>

          <div className="flex justify-end gap-2">
            <SButton type="button" color="secondary" onClick={handleCloseModal}>
              Cancel
            </SButton>
            <SButton type="submit" color="primary">
              {isEditing ? "Update" : "Submit"}
            </SButton>
          </div>
        </Form>
      </SModal>
    </>
  );
}
