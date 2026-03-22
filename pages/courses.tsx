import ClassList from "@/components/features/courses/ClassList";
import CourseList from "@/components/features/courses/CourseList";
import StudentCourseEnrollmentList from "@/components/features/courses/StudentCourseEnrollmentList";
import SButton from "@/components/ui/SButton";
import SInput from "@/components/ui/SInput";
import SModal from "@/components/ui/SModal";
import useCourse from "@/hooks/useCourse";
import { DatePicker, Form, Select, Skeleton } from "antd";
import Image from "next/image";

export default function CoursesPage() {
  const {
    bannerPreview,
    classForm,
    classList,
    courseForm,
    courseList,
    enrollingClassId,
    handleCloseClassModal,
    handleCloseCourseModal,
    handleFileChange,
    isClassModalVisible,
    isCourseModalVisible,
    isEditing,
    isPageLoading,
    isStudent,
    isSubmittingClass,
    isSubmittingCourse,
    isUserReady,
    onClickEdit,
    onEnrollCourse,
    onSubmitClass,
    onSubmitCourse,
    setIsClassModalVisible,
    setIsCourseModalVisible,
    studentCourseList,
    teacherList,
    disabledPastDate,
  } = useCourse();

  return (
    <>
      <section className="grid gap-6 page-body">
        <div className="rounded-xl border border-black/10 bg-white/80 p-6 backdrop-blur dark:border-white/10 dark:bg-white/5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                {isStudent ? "Course Enrollment" : "Course And Class Management"}
              </p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-slate-50">
                {isStudent ? "Enroll in Courses" : "Courses"}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
                {isStudent
                  ? "Browse available class offerings and enroll in the courses you want to join."
                  : "Create courses first, then open class offerings so students can enroll and start learning."}
              </p>
            </div>

            {!isStudent ? (
              <div className="flex gap-2">
                <SButton type="button" color="secondary" onClick={() => setIsClassModalVisible(true)}>
                  Add Class
                </SButton>
                <SButton type="button" color="primary" onClick={() => setIsCourseModalVisible(true)}>
                  Add Course
                </SButton>
              </div>
            ) : null}
          </div>
        </div>

        <div className="rounded-xl border border-black/10 bg-white/75 p-6 dark:border-white/10 dark:bg-white/5">
          {!isUserReady ? (
            <Skeleton active paragraph={{ rows: 6 }} />
          ) : isStudent ? (
            <>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-950 dark:text-slate-50">Available Courses</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {studentCourseList.length} option{studentCourseList.length === 1 ? "" : "s"}
                </p>
              </div>

              <StudentCourseEnrollmentList
                courses={studentCourseList}
                isLoading={isPageLoading}
                enrollingClassId={enrollingClassId}
                onEnroll={onEnrollCourse}
              />
            </>
          ) : (
            <div className="grid gap-6">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-950 dark:text-slate-50">Course List</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {courseList.length} course{courseList.length === 1 ? "" : "s"}
                  </p>
                </div>
                <CourseList courseList={courseList} onClickEdit={onClickEdit} />
              </div>

              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-950 dark:text-slate-50">Class Offerings</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {classList.length} class{classList.length === 1 ? "" : "es"}
                  </p>
                </div>
                <ClassList classList={classList} />
              </div>
            </div>
          )}
        </div>
      </section>

      {!isStudent ? (
        <>
          <SModal
            isOpen={isCourseModalVisible}
            onClose={handleCloseCourseModal}
            title={isEditing ? "Update course" : "Add new course"}
          >
            <Form layout="vertical" form={courseForm} onSubmitCapture={onSubmitCourse}>
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
                    <input className="absolute inset-0 z-10 h-full w-full opacity-0" type="file" onChange={handleFileChange} />
                    <div className="z-0 flex min-h-60 w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-300 p-4 md:w-60">
                      {bannerPreview.length > 0
                        ? <Image src={bannerPreview} alt="Course Banner Preview" layout="fill" objectFit="contain" className="rounded-md" />
                        : courseForm.getFieldValue("courseBanner")
                        ? <Image src={courseForm.getFieldValue("courseBanner")} alt="Course Banner Preview" layout="fill" objectFit="contain" className="rounded-md" />
                        : <p className="text-sm text-slate-500 dark:text-slate-400">Click to upload a banner</p>}
                    </div>
                  </div>
                </Form.Item>
              </div>

              <div className="flex justify-end gap-2">
                <SButton type="button" color="secondary" onClick={handleCloseCourseModal}>
                  Cancel
                </SButton>
                <SButton type="submit" color="primary" loading={isSubmittingCourse}>
                  {isEditing ? "Update" : "Submit"}
                </SButton>
              </div>
            </Form>
          </SModal>

          <SModal
            isOpen={isClassModalVisible}
            onClose={handleCloseClassModal}
            title="Add new class"
          >
            <Form layout="vertical" form={classForm} onSubmitCapture={onSubmitClass}>
              <div className="grid gap-4">
                <Form.Item
                  name="name"
                  label="Class Name"
                  rules={[{ required: true, message: "Please enter the class name!" }]}
                >
                  <SInput placeholder="Morning Batch A" />
                </Form.Item>

                <Form.Item
                  name="courseId"
                  label="Course"
                  rules={[{ required: true, message: "Please select a course!" }]}
                >
                  <Select
                    placeholder="Select course"
                    options={courseList.map((course) => ({
                      label: `${course.name} (${course.code})`,
                      value: course.id,
                    }))}
                  />
                </Form.Item>

                <Form.Item
                  name="teacherId"
                  label="Teacher"
                  rules={[{ required: true, message: "Please select a teacher!" }]}
                >
                  <Select
                    placeholder="Select teacher"
                    options={teacherList.map((teacher) => ({
                      label: `${teacher.firstName} ${teacher.lastName}`.trim() || teacher.username || teacher.email,
                      value: teacher.id,
                    }))}
                  />
                </Form.Item>

                <Form.Item
                  name="startDate"
                  label="Start Date"
                  rules={[{ required: true, message: "Please choose a start date!" }]}
                >
                  <DatePicker
                    showTime
                    className="w-full"
                    format="MMM D, YYYY h:mm A"
                    disabledDate={disabledPastDate}
                  />
                </Form.Item>

                <Form.Item
                  name="endDate"
                  label="End Date"
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
                <SButton type="button" color="secondary" onClick={handleCloseClassModal}>
                  Cancel
                </SButton>
                <SButton type="submit" color="primary" loading={isSubmittingClass}>
                  Create Class
                </SButton>
              </div>
            </Form>
          </SModal>
        </>
      ) : null}
    </>
  );
}
