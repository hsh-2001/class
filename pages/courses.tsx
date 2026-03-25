import ClassList from "@/components/features/courses/ClassList";
import CourseList from "@/components/features/courses/CourseList";
import StudentCourseEnrollmentList from "@/components/features/courses/StudentCourseEnrollmentList";
import SButton from "@/components/ui/SButton";
import SInput from "@/components/ui/SInput";
import SModal from "@/components/ui/SModal";
import SToggleButton from "@/components/ui/SToggleButton";
import useCourse from "@/hooks/useCourse";
import { DatePicker, Form, Select, Skeleton } from "antd";
import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function CoursesPage() {
  const { t } = useTranslation();
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
    onClickEditClass,
    isEditingClass,
    handleUpdateClass,
    isClass,
    setIsClass,
  } = useCourse();

  return (
    <>
      <section className="grid gap-6 page-body">
        <div className="flex justify-between">
          <SToggleButton
            name={{ option1: t("courses.courses"), option2: t("courses.classes") }}
            onChange={() => setIsClass(prev => !prev)}
            isActive={!isClass}
          />
          <div>
            <SButton type="button" color="primary" onClick={() => isClass ? setIsClassModalVisible(true) : setIsCourseModalVisible(true)}>
              {isClass ? t("courses.addClass") : t("courses.addCourse")}
            </SButton>
          </div>
        </div>

        <div className="rounded-xl border border-black/10 bg-white/75 p-6 dark:border-white/10 dark:bg-white/5">
          {!isUserReady ? (
            <Skeleton active paragraph={{ rows: 6 }} />
          ) : isStudent ? (
            <>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-950 dark:text-slate-50">{t("courses.availableCourses")}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {t("courses.optionsCount", { count: studentCourseList.length })}
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
              {
                !isClass ? (
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-slate-950 dark:text-slate-50">{t("courses.courseList")}</h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {t("courses.coursesCount", { count: courseList.length })}
                      </p>
                    </div>
                    <CourseList courseList={courseList} onClickEdit={onClickEdit} />
                  </div>
                ) : (
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-slate-950 dark:text-slate-50">{t("courses.classOfferings")}</h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {t("courses.classesCount", { count: classList.length })}
                      </p>
                    </div>
                    <ClassList classList={classList} onEdit={onClickEditClass} />
                  </div>
                )
              }
            </div>
          )}
        </div>
      </section>

      {!isStudent ? (
        <>
          <SModal
            isOpen={isCourseModalVisible}
            onClose={handleCloseCourseModal}
            title={isEditing ? t("courses.updateCourse") : t("courses.addNewCourse")}
          >
            <Form layout="vertical" form={courseForm} onSubmitCapture={onSubmitCourse}>
              <div className="grid gap-4">
                <Form.Item
                  name="name"
                  label={t("courses.courseName")}
                  rules={[{ required: true, message: t("courses.validation.courseName") }]}
                >
                  <SInput placeholder={t("courses.enterCourseName")} />
                </Form.Item>

                <Form.Item
                  name="code"
                  label={t("courses.courseCode")}
                  rules={[{ required: true, message: t("courses.validation.courseCode") }]}
                >
                  <SInput placeholder={t("courses.enterCourseCode")} />
                </Form.Item>

                <Form.Item
                  name="description"
                  label={t("courses.descriptionLabel")}
                  rules={[{ required: true, message: t("courses.validation.courseDescription") }]}
                >
                  <SInput placeholder={t("courses.enterCourseDescription")} />
                </Form.Item>

                <Form.Item
                  name="courseBanner"
                  label={t("courses.courseBanner")}
                  rules={[{ required: true, message: t("courses.validation.courseBanner") }]}
                >
                  <div className="relative w-full md:w-60">
                    <input className="absolute inset-0 z-10 h-full w-full opacity-0" type="file" onChange={handleFileChange} />
                    <div className="z-0 flex min-h-60 w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-300 p-4 md:w-60">
                      {bannerPreview.length > 0
                        ? <Image src={bannerPreview} alt="Course Banner Preview" layout="fill" objectFit="contain" className="rounded-md" />
                        : courseForm.getFieldValue("courseBanner")
                          ? <Image src={courseForm.getFieldValue("courseBanner")} alt="Course Banner Preview" layout="fill" objectFit="contain" className="rounded-md" />
                          : <p className="text-sm text-slate-500 dark:text-slate-400">{t("courses.clickToUploadBanner")}</p>}
                    </div>
                  </div>
                </Form.Item>
              </div>

              <div className="flex justify-end gap-2">
                <SButton type="button" color="secondary" onClick={handleCloseCourseModal}>
                  {t("common.cancel")}
                </SButton>
                <SButton type="submit" color="primary" loading={isSubmittingCourse}>
                  {isEditing ? t("common.update") : t("common.submit")}
                </SButton>
              </div>
            </Form>
          </SModal>

          <SModal
            isOpen={isClassModalVisible}
            onClose={handleCloseClassModal}
            title={isEditingClass ? t("common.updateClass") : t("courses.addNewClass")}
          >
            <Form layout="vertical" form={classForm} onSubmitCapture={() => isEditingClass ? handleUpdateClass() : onSubmitClass()}>
              <div className="grid gap-4">
                <Form.Item
                  name="name"
                  label={t("courses.className")}
                  rules={[{ required: true, message: t("courses.validation.className") }]}
                >
                  <SInput placeholder={t("courses.morningBatch")} />
                </Form.Item>

                <Form.Item
                  name="courseId"
                  label={t("courses.course")}
                  rules={[{ required: true, message: t("courses.validation.selectCourse") }]}
                >
                  <Select
                    placeholder={t("courses.selectCourse")}
                    options={courseList.map((course) => ({
                      label: `${course.name} (${course.code})`,
                      value: course.id,
                    }))}
                  />
                </Form.Item>

                <Form.Item
                  name="teacherId"
                  label={t("courses.teacher")}
                  rules={[{ required: true, message: t("courses.validation.selectTeacher") }]}
                >
                  <Select
                    placeholder={t("courses.selectTeacher")}
                    options={teacherList.map((teacher) => ({
                      label: `${teacher.firstName} ${teacher.lastName}`.trim() || teacher.username || teacher.email,
                      value: teacher.id,
                    }))}
                  />
                </Form.Item>

                <Form.Item
                  name="startDate"
                  label={t("courses.startDate")}
                  rules={[{ required: true, message: t("courses.validation.selectStartDate") }]}
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
                  label={t("courses.endDate")}
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
                  {t("common.cancel")}
                </SButton>
                <SButton type="submit" color="primary" loading={isSubmittingClass}>
                  {isEditingClass ? t("common.update") : t("courses.createClass")}
                </SButton>
              </div>
            </Form>
          </SModal>
        </>
      ) : null}
    </>
  );
}
