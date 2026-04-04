import { getApiErrorMessage } from "@/lib/api-error";
import {
    callCreateClass,
    callCreateCourse,
    callEnrollStudentCourse,
    callGetClasses,
    callGetCourses,
    callGetStudentCourses,
    callGetTeachers,
    callUpdateClass,
    callUpdateCourse,
} from "@/lib/api-calling";
import { upload } from "@/lib/upload";
import { ClassResponse, ICreateClassDTO } from "@/types/class";
import { CourseResponse, ICreateCourseDTO } from "@/types/course";
import { IStudentCourseEnrollmentItem } from "@/types/enrollment";
import { TeacherResponse } from "@/types/teacher";
import { DatePicker } from "antd";
import { useForm } from "antd/es/form/Form";
import dayjs, { Dayjs } from "dayjs";
import { useCallback, useEffect, useRef, useState } from "react";
import useLoading from "./useLoading";

type CourseFormValues = Omit<ICreateCourseDTO, "schoolId">;
type ClassFormValues = Omit<ICreateClassDTO, "startDate" | "endDate"> & {
    startDate: Dayjs;
    endDate?: Dayjs;
};
type CurrentUser = {
    role?: string;
};

export default function useCourse() {
    const [courseForm] = useForm<CourseFormValues>();
    const [classForm] = useForm<ClassFormValues>();
    const [courseList, setCourseList] = useState<CourseResponse[]>([]);
    const [classList, setClassList] = useState<ClassResponse[]>([]);
    const [teacherList, setTeacherList] = useState<TeacherResponse[]>([]);
    const [studentCourseList, setStudentCourseList] = useState<IStudentCourseEnrollmentItem[]>([]);
    const [isCourseModalVisible, setIsCourseModalVisible] = useState(false);
    const [isClassModalVisible, setIsClassModalVisible] = useState(false);
    const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string>("");
    const [isSubmittingCourse, setIsSubmittingCourse] = useState(false);
    const [isSubmittingClass, setIsSubmittingClass] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [isUserReady, setIsUserReady] = useState(false);
    const [enrollingClassId, setEnrollingClassId] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [isEditingClass, setIsEditingClass] = useState(false);
    const [isClass, setIsClass] = useState(false);

    const isEditing = editingCourseId !== null;
    const isStudent = currentUser?.role === "STUDENT";
    const file = useRef<File | null>(null);

    const {
        startLoading,
        stopLoading,
        isLoading,
    } = useLoading();

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        const rawUser = window.localStorage.getItem("user");
        if (rawUser) {
            try {
                setCurrentUser(JSON.parse(rawUser));
            } catch {
                setCurrentUser(null);
            }
        }

        setIsUserReady(true);
    }, []);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        file.current = e.target.files?.[0] || null;
        const preview = file.current ? URL.createObjectURL(file.current) : "";
        setBannerPreview(preview);
    };

    const handleSaveBanner = async (): Promise<string | undefined> => {
        if (file.current) {
            const uploadResult = await upload("class/courses", file.current);
            const uploadedUrl = uploadResult?.data?.[0]?.download_url;
            if (uploadedUrl) {
                courseForm.setFieldValue("courseBanner", uploadedUrl);
                setBannerPreview(uploadedUrl);
                return uploadedUrl;
            }
        }

        return undefined;
    };

    const loadAdminData = useCallback(async () => {
        const [coursesResponse, classesResponse, teachersResponse] = await Promise.all([
            callGetCourses(),
            callGetClasses(),
            callGetTeachers(),
        ]);

        if (coursesResponse.data.success) {
            setCourseList(coursesResponse.data.data.map((item: CourseResponse) => new CourseResponse(item)));
        }

        if (classesResponse.data.success) {
            setClassList(classesResponse.data.data.map((item: ClassResponse) => new ClassResponse(item)));
        }

        if (teachersResponse.data.success) {
            setTeacherList(teachersResponse.data.data.map((item: TeacherResponse) => new TeacherResponse(item)));
        }
    }, []);

    const onLoadCourses = useCallback(async () => {
        startLoading('get-courses');
        try {
            if (isStudent) {
                const response = await callGetStudentCourses();
                if (response.data.success) {
                    setStudentCourseList(response.data.data);
                }
                return;
            }

            await loadAdminData();
        } catch (error: unknown) {
            console.error(
                getApiErrorMessage(
                    error,
                    isStudent ? "Failed to fetch available enrollments." : "Failed to fetch course data.",
                ),
            );
        } finally {
            stopLoading('get-courses');
        }
    }, [isStudent, loadAdminData]);

    useEffect(() => {
        if (!isUserReady) {
            return;
        }

        void onLoadCourses();
    }, [isUserReady, onLoadCourses]);

    const handleCloseCourseModal = () => {
        setIsCourseModalVisible(false);
        setEditingCourseId(null);
        setBannerPreview("");
        file.current = null;
        courseForm.resetFields();
    };

    const handleCloseClassModal = () => {
        setIsClassModalVisible(false);
        classForm.resetFields();
    };

    const onSubmitCourse = async () => {
        const values = courseForm.getFieldsValue();
        setIsSubmittingCourse(true);

        try {
            const bannerUrl = await handleSaveBanner();
            if (bannerUrl) {
                values.courseBanner = bannerUrl;
            }

            if (isEditing && editingCourseId) {
                const response = await callUpdateCourse({
                    id: editingCourseId,
                    name: values.name,
                    code: values.code,
                    description: values.description,
                    courseBanner: values.courseBanner,
                });

                if (response.data.success) {
                    handleCloseCourseModal();
                    await onLoadCourses();
                }
                return;
            }

            const response = await callCreateCourse(values);
            if (response.data.success) {
                handleCloseCourseModal();
                await onLoadCourses();
            }
        } catch (error: unknown) {
            console.error(getApiErrorMessage(error, isEditing ? "Failed to update course." : "Failed to create course."));
        } finally {
            setBannerPreview("");
            file.current = null;
            setIsSubmittingCourse(false);
        }
    };

    const onSubmitClass = async () => {
        const values = classForm.getFieldsValue();
        setIsSubmittingClass(true);

        try {
            const response = await callCreateClass({
                name: values.name,
                courseId: values.courseId,
                teacherId: values.teacherId,
                startDate: values.startDate.toISOString(),
                endDate: values.endDate ? values.endDate.toISOString() : null,
            });

            if (response.data.success) {
                handleCloseClassModal();
                await onLoadCourses();
            }
        } catch (error: unknown) {
            console.error(getApiErrorMessage(error, "Failed to create class."));
        } finally {
            setIsSubmittingClass(false);
        }
    };

    const onClickEdit = (course: CourseResponse) => {
        setEditingCourseId(course.id);
        courseForm.setFieldsValue({
            name: course.name,
            code: course.code,
            description: course.description,
            courseBanner: course.courseBanner,
        });
        setIsCourseModalVisible(true);
    };

    const onEnrollCourse = async (classId: string) => {
        try {
            setEnrollingClassId(classId);
            const response = await callEnrollStudentCourse({ classId });
            if (response.data.success) {
                setStudentCourseList(response.data.data);
            }
        } catch (error: unknown) {
            console.error(getApiErrorMessage(error, "Failed to enroll in course."));
        } finally {
            setEnrollingClassId(null);
        }
    };

    const editingClassId = useRef<string | null>(null);
    const onClickEditClass = async (classId: string) => {
        setIsEditingClass(true);
        setIsClassModalVisible(true);
        editingClassId.current = classId;

        const classToEdit = classList.find((cls) => cls.id === classId);
        if (!classToEdit) {
            return;
        }
        classForm.setFieldsValue({
            name: classToEdit.name,
            courseId: classToEdit.courseId,
            teacherId: classToEdit.teacherId,
            startDate: dayjs(classToEdit.startDate),
            endDate: classToEdit.endDate ? dayjs(classToEdit.endDate) : undefined,
        });
    }

    const handleUpdateClass = async () => {
        const values = classForm.getFieldsValue();
        setIsSubmittingClass(true);
        if (!editingClassId.current) {
            console.error("No class selected for editing.");
            setIsSubmittingClass(false);
            return;
        }
        try {
            const response = await callUpdateClass(editingClassId.current, {
                name: values.name,
                courseId: values.courseId,
                teacherId: values.teacherId,
                startDate: values.startDate.toISOString(),
                endDate: values.endDate ? values.endDate.toISOString() : null,
            });

            if (response.data.success) {
                handleCloseClassModal();
                await onLoadCourses();
            }
        } catch (error: unknown) {
            console.error(getApiErrorMessage(error, "Failed to update class."));
        } finally {
            setIsSubmittingClass(false);
            setIsEditingClass(false);
        }
    };

    return {
        DatePicker,
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
        onLoadCourses,
        onSubmitClass,
        onSubmitCourse,
        setIsClassModalVisible,
        setIsCourseModalVisible,
        studentCourseList,
        teacherList,
        disabledPastDate: (current: Dayjs) => current && current < dayjs().startOf("minute"),
        onClickEditClass,
        handleUpdateClass,
        isEditingClass,
        isClass,
        setIsClass,
        isLoading,
    };
}
