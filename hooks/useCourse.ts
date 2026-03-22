import { getApiErrorMessage } from "@/lib/api-error";
import { callCreateCourse, callGetCourses, callUpdateCourse } from "@/lib/api-calling";
import { CourseResponse, ICreateCourseDTO } from "@/types/course";
import { useRef, useState } from "react";
import { useForm } from "antd/es/form/Form";
import { upload } from "@/lib/upload";

type CourseFormValues = Omit<ICreateCourseDTO, "schoolId">;

export default function useCourse() {
    const [courseForm] = useForm<CourseFormValues>();
    const [courseList, setCourseList] = useState<CourseResponse[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    const isEditing = editingCourseId !== null;

    const file = useRef<File>(null);
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        file.current = e.target.files?.[0] || null;
        console.log("Selected file:", file.current);
        const preview = file.current ? URL.createObjectURL(file.current) : "";
        setBannerPreview(preview);
    };

    const handleSaveBanner = async (): Promise<string | undefined> => {
        if (file.current) {
            const uploadResult = await upload("class/courses", file.current);
            if (uploadResult) {
                courseForm.setFieldValue("courseBanner", uploadResult.data[0].download_url);
                setBannerPreview(uploadResult?.data?.[0]?.download_url || "");
                return uploadResult.data[0].download_url;
            }
        }
        return;
    }

    const onGetAllCourses = async () => {
        try {
            const response = await callGetCourses();
            if (response.data.success) {
                const courses = response.data.data.map((item: CourseResponse) => new CourseResponse(item));
                setCourseList(courses);
            }
        } catch (error: unknown) {
            console.error(getApiErrorMessage(error, "Failed to fetch courses."));
        }
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setEditingCourseId(null);
        courseForm.resetFields();
    };

    const onSubmit = async () => {
        const values = courseForm.getFieldsValue();
        setIsLoading(true);
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
                    handleCloseModal();
                    onGetAllCourses();
                }
                return;
            }
            const response = await callCreateCourse(values);
            if (response.data.success) {
                handleCloseModal();
                onGetAllCourses();
            }
        } catch (error: unknown) {
            console.error(getApiErrorMessage(error, isEditing ? "Failed to update course." : "Failed to create course."));
        } finally {
            setBannerPreview("");
            file.current = null;
            setIsLoading(false);
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
        setIsModalVisible(true);
    };

    return {
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
    };
}
