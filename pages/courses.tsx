import CourseList from "@/components/features/courses/CourseList";
import SButton from "@/components/ui/SButton";
import SInput from "@/components/ui/SInput";
import SModal from "@/components/ui/SModal";
import useCourse from "@/hooks/useCourse";
import { Form } from "antd";
import Image from "next/image";
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
    handleFileChange,
    bannerPreview,
    isLoading,
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

          <CourseList courseList={courseList} onClickEdit={onClickEdit} />
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
            <Form.Item
              name="courseBanner"
              label="Course Banner"
              rules={[{ required: true, message: "Please enter the course banner!" }]}
            >
              <div className="relative w-full md:w-60">
                <input className="opacity-0 inset-0 z-10 absolute w-full h-full" type="file" onChange={handleFileChange} />
                <div className="border border-dashed z-0 border-gray-300 rounded-md p-4 min-h-60 flex flex-col items-center justify-center cursor-pointer w-full md:w-60">
                  {bannerPreview.length > 0
                  ? <Image src={bannerPreview} alt="Course Banner Preview" layout="fill" objectFit="contain" className="rounded-md" />
                  : courseForm.getFieldValue('courseBanner')
                  ? <Image src={courseForm.getFieldValue('courseBanner')} alt="Course Banner Preview" layout="fill" objectFit="contain" className="rounded-md" />
                  : <p className="text-sm text-slate-500 dark:text-slate-400">Click to upload a banner</p>}
                </div>
              </div>
            </Form.Item>
          </div>

          <div className="flex justify-end gap-2">
            <SButton type="button" color="secondary" onClick={handleCloseModal}>
              Cancel
            </SButton>
            <SButton type="submit" color="primary" loading={isLoading}>
              {isEditing ? "Update" : "Submit"}
            </SButton>
          </div>
        </Form>
      </SModal>
    </>
  );
}
