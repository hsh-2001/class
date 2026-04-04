import { getApiErrorMessage } from "@/lib/api-error";
import { IFormItem } from "@/types/formBase";
import { StudentResponse, TCreateStudentDTO, TUpdateStudentDTO } from "@/types/student";
import dayjs from "dayjs";
import { useForm } from "antd/es/form/Form";
import { useState } from "react";
import {
    callCreateStudent,
    callCreateTeacher,
    callGetStudents,
    callGetTeachers,
    callUpdateStudent,
    callUpdateTeacher
} from "@/lib/api-calling";
import { ICreateTeacherDTO, IUpdateTeacherDTO, TeacherResponse } from "@/types/teacher";
import useLoading from "./useLoading";

type StudentFormValues = TCreateStudentDTO & { confirmPassword: string };
type TeacherFormValues = ICreateTeacherDTO & { confirmPassword: string };

export default function useMembers() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [studentList, setStudentList] = useState<StudentResponse[]>([]);
    const [isActive, setIsActive] = useState("students");
    const [editingId, setEditingId] = useState<string | null>(null);
    const isEditing = editingId !== null;
    const {
        startLoading,
        stopLoading,
        isLoading,
    } = useLoading();

    const [form] = useForm<StudentFormValues>();
    const [teacherForm] = useForm<TeacherFormValues>();
    const [teacherList, setTeacherList] = useState<TeacherResponse[]>([]);

    const genders = [
        { label: "Male", value: "MALE" },
        { label: "Female", value: "FEMALE" },
    ]

    const studentCreateFields: IFormItem<StudentFormValues>[] = [
        {
            name: "email",
            label: "Email",
            rules: [
                { required: true, message: "Please input the email!" },
                { type: "email", message: "Please enter a valid email!" },
            ],

        },
        {
            name: "username",
            label: "Username",
            rules: [
                { required: true, message: "Please enter a username!" },
            ],
        },
        {
            name: "password",
            label: "Password",
            rules: [
                { required: true, message: "Please enter a password!" },
                { min: 6, message: "Password must be at least 6 characters!" },
            ],
        },
        {
            name: "confirmPassword",
            label: "Confirm Password",
            rules: [
                { required: true, message: "Please confirm the password!" },
            ],
        },
        {
            name: "firstName",
            label: "First Name",
            rules: [
                { required: true, message: "Please enter the first name!" },
            ],
        },
        {
            name: "lastName",
            label: "Last Name",
            rules: [
                { required: true, message: "Please enter the last name!" },
            ],
        },
        {
            name: "dateOfBirth",
            label: "Date of Birth",
            rules: [
                { required: true, message: "Please enter the date of birth!" },
            ],
        },
        {
            name: "phone",
            label: "Phone",
            rules: [
                { required: true, message: "Please enter the phone number!" },
                { pattern: /^\d{10}$/, message: "Please enter a valid 10-digit phone number!" },
            ],
        },
        {
            name: "age",
            label: "Age",
        },
        {
            name: "gender",
            label: "Gender",
        },
        {
            name: "address",
            label: "Address",
            rules: [
                { required: true, message: "Please enter the address!" },
            ],
        },
    ];

    const teacherCreateFields: IFormItem<TeacherFormValues>[] = [
        {
            name: "email",
            label: "Email",
            rules: [
                { required: true, message: "Please input the email!" },
                { type: "email", message: "Please enter a valid email!" },
            ],
        },
        {
            name: "username",
            label: "Username",
            rules: [
                { required: true, message: "Please enter a username!" },
            ],
        },
        {
            name: "password",
            label: "Password",
            rules: [
                { required: true, message: "Please enter a password!" },
                { min: 6, message: "Password must be at least 6 characters!" },
            ],
        },
        {
            name: "confirmPassword",
            label: "Confirm Password",
            rules: [
                { required: true, message: "Please confirm the password!" },
            ],
        },
        {
            name: "firstName",
            label: "First Name",
            rules: [
                { required: true, message: "Please enter the first name!" },
            ],
        },
        {
            name: "lastName",
            label: "Last Name",
            rules: [
                { required: true, message: "Please enter the last name!" },
            ],
        },
        {
            name: "phone",
            label: "Phone",
            rules: [
                { required: true, message: "Please enter the phone number!" },
                { pattern: /^\d{10}$/, message: "Please enter a valid 10-digit phone number!" },
            ],
        },
        {
            name: "gender",
            label: "Gender",
        },
        {
            name: "address",
            label: "Address",
            rules: [
                { required: true, message: "Please enter the address!" },
            ],
        },
    ];

    const fieldItem = studentCreateFields.filter((field) =>
        !isEditing || (field.name !== "password" && field.name !== "confirmPassword")
    );

    const teacherFieldItems = teacherCreateFields.filter((field) =>
        !isEditing || (field.name !== "password" && field.name !== "confirmPassword")
    );


    const handleCreateStudent = async () => {
        const values = form.getFieldsValue();
        const payload = {
            ...values,
            dateOfBirth: dayjs.isDayjs(values.dateOfBirth)
                ? values.dateOfBirth.toISOString()
                : values.dateOfBirth,
        };

        startLoading("create-student");

        try {
            const response = await callCreateStudent(payload);
            if (response.data.success) {
                setIsModalVisible(false);
                form.resetFields();
                onGetAllStudents();
            }
        } catch (error: unknown) {
            console.error(getApiErrorMessage(error, "Failed to create student."));
        } finally {
            stopLoading("create-student");
        }
    }

    const handleUpdateStudent = async () => {
        const values = form.getFieldsValue();
        if (!editingId) return;

        startLoading("update-student");

        const payload: TUpdateStudentDTO = {
            id: editingId,
            email: values.email,
            username: values.username,
            firstName: values.firstName,
            lastName: values.lastName,
            phone: values.phone,
            gender: values.gender,
        };

        try {
            const response = await callUpdateStudent(payload);
            if (response.data.success) {
                handleCloseModal();
                onGetAllStudents();
            }
        } catch (error: unknown) {
            console.error(getApiErrorMessage(error, "Failed to update student."));
        } finally {
            stopLoading("update-student");
        }
    }

    const handleCreateTeacher = async () => {
        const values = teacherForm.getFieldsValue();
        const payload = {
            ...values,
        };

        startLoading("create-teacher");

        try {
            const response = await callCreateTeacher(payload);
            if (response.data.success) {
                setIsModalVisible(false);
                teacherForm.resetFields();
                onGetAllTeachers();
            }
        } catch (error: unknown) {
            console.error(getApiErrorMessage(error, "Failed to create teacher."));
        }
        finally {
            stopLoading("create-teacher");
        }
    }

    const handleUpdateTeacher = async () => {
        const values = teacherForm.getFieldsValue();
        if (!editingId) return;
        startLoading("update-teacher");

        const payload: IUpdateTeacherDTO = {
            id: editingId,
            email: values.email,
            username: values.username,
            firstName: values.firstName,
            lastName: values.lastName,
            phone: values.phone,
            gender: values.gender,
        };

        try {
            const response = await callUpdateTeacher(payload);
            if (response.data.success) {
                handleCloseModal();
                onGetAllTeachers();
            }
        } catch (error: unknown) {
            console.error(getApiErrorMessage(error, "Failed to update teacher."));
        } finally {
            stopLoading("update-teacher");
        }
    }

    const onSubmit = isActive === "students"
        ? isEditing ? handleUpdateStudent : handleCreateStudent
        : isEditing ? handleUpdateTeacher : handleCreateTeacher;

    const onGetAllStudents = async () => {
        startLoading("get-student");
        try {
            const response = await callGetStudents();
            if (response.data.success) {
                const students = response.data.data.map((item: StudentResponse) => new StudentResponse(item));
                setStudentList(students);
            }
        } catch (error: unknown) {
            console.error(getApiErrorMessage(error, "Failed to fetch students."));
        } finally {
            stopLoading("get-student");
        }
    }

    const onGetAllTeachers = async () => {
        startLoading("get-teacher");
        try {
            const response = await callGetTeachers();
            console.log(response.data.success);
            if (response.data.success) {
                const teachers = response.data.data.map((item: TeacherResponse) => new TeacherResponse(item));
                setTeacherList(teachers);
            }
        } catch (error: unknown) {
            console.error(getApiErrorMessage(error, "Failed to fetch teachers."));
        } finally {
            stopLoading("get-teacher");
        }
    }

    const onClickEdit = (record: StudentResponse | TeacherResponse) => {
        setEditingId(record.id);
        if (isActive === "students" && record instanceof StudentResponse) {
            form.setFieldsValue({
                email: record.email,
                username: record.username,
                firstName: record.firstName,
                lastName: record.lastName,
                phone: record.phone || undefined,
                gender: record.gender,
                dateOfBirth: record.dateOfBirth ? dayjs(record.dateOfBirth) : undefined,
                confirmPassword: "",
            });
        } else if (record instanceof TeacherResponse) {
            teacherForm.setFieldsValue({
                email: record.email,
                username: record.username,
                firstName: record.firstName,
                lastName: record.lastName,
                phone: record.phone || undefined,
                gender: record.gender,
                schoolId: record.schoolId,
                confirmPassword: "",
            });
        }
        setIsModalVisible(true);
    }

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setEditingId(null);
        form.resetFields();
        teacherForm.resetFields();
    }

    return {
        isModalVisible,
        setIsModalVisible,
        form,
        onSubmit,
        fieldItem,
        genders,
        onGetAllStudents,
        studentList,
        isActive,
        setIsActive,
        teacherFieldItems,
        teacherForm,
        onGetAllTeachers,
        teacherList,
        onClickEdit,
        handleCloseModal,
        isEditing,
        isLoading,
    }
};
