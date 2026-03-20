import { getApiErrorMessage } from "@/lib/api-error";
import { IFormItem } from "@/types/formBase";
import { StudentResponse, TCreateStudentDTO } from "@/types/student";
import dayjs from "dayjs";
import { useForm } from "antd/es/form/Form";
import { useState } from "react";
import { callCreateStudent, callGetStudents } from "@/lib/api-calling";


export default function useMembers() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [studentList, setStudentList] = useState<StudentResponse[]>([]);

    const [form] = useForm<TCreateStudentDTO & { confirmPassword: string }>();

    const genders = [
        { label: "Male", value: "MALE" },
        { label: "Female", value: "FEMALE" },
    ]

    const fieldItem: IFormItem<TCreateStudentDTO & { confirmPassword: string }>[] = [
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
    ]

    const onSubmit = async () => {
        const values = form.getFieldsValue();
        const payload = {
            ...values,
            dateOfBirth: dayjs.isDayjs(values.dateOfBirth)
                ? values.dateOfBirth.toISOString()
                : values.dateOfBirth,
        };

        try {
            const response = await callCreateStudent(payload);
            if (response.data.success) {
                setIsModalVisible(false);
                form.resetFields();
                onGetAllStudents();
            }
        } catch (error: unknown) {
            console.error(getApiErrorMessage(error, "Failed to create student."));
        }
    }

    const onGetAllStudents = async () => {
        try {
            const response = await callGetStudents();
            console.log(response.data);
            if (response.data.success) {
                const students = response.data.data.map((item: StudentResponse) => new StudentResponse(item));
                setStudentList(students);
            }
        } catch (error: unknown) {
            console.error(getApiErrorMessage(error, "Failed to fetch students."));
        }
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
    }
};
