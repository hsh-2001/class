import { getApiErrorMessage } from "@/lib/api-error";
import { callCreateCourse, callGetCourses, callUpdateCourse } from "@/lib/api-calling";
import { CourseResponse, ICreateCourseDTO } from "@/types/course";
import { useState } from "react";
import { useForm } from "antd/es/form/Form";

type CourseFormValues = Omit<ICreateCourseDTO, "schoolId">;

export default function useCourse() {
    const [courseForm] = useForm<CourseFormValues>();
    const [courseList, setCourseList] = useState<CourseResponse[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingCourseId, setEditingCourseId] = useState<string | null>(null);

    const isEditing = editingCourseId !== null;

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

        try {
            if (isEditing && editingCourseId) {
                const response = await callUpdateCourse({
                    id: editingCourseId,
                    name: values.name,
                    code: values.code,
                    description: values.description,
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
        }
    };

    const onClickEdit = (course: CourseResponse) => {
        setEditingCourseId(course.id);
        courseForm.setFieldsValue({
            name: course.name,
            code: course.code,
            description: course.description,
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
    };
}
