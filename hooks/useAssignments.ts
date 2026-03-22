import { getApiErrorMessage } from "@/lib/api-error";
import { callCreateAssignment, callGetAssignments } from "@/lib/api-calling";
import { getUserRoleFromStorage } from "@/lib/role-access";
import { AssignmentResponse, IAssignmentClassOption, IAssignmentPageData, ICreateAssignmentDTO } from "@/types/assignment";
import dayjs, { Dayjs } from "dayjs";
import { useForm } from "antd/es/form/Form";
import { useCallback, useEffect, useState } from "react";

type AssignmentFormValues = Omit<ICreateAssignmentDTO, "dueDate"> & {
    dueDate: Dayjs;
};

export default function useAssignments() {
    const [form] = useForm<AssignmentFormValues>();
    const [assignments, setAssignments] = useState<AssignmentResponse[]>([]);
    const [classOptions, setClassOptions] = useState<IAssignmentClassOption[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUserReady, setIsUserReady] = useState(false);
    const [role, setRole] = useState<ReturnType<typeof getUserRoleFromStorage>>();

    const canManage = role === "ADMIN" || role === "TEACHER";

    useEffect(() => {
        setRole(getUserRoleFromStorage());
        setIsUserReady(true);
    }, []);

    const fetchAssignments = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await callGetAssignments();
            if (response.data.success) {
                const payload = response.data.data as IAssignmentPageData;
                setAssignments(payload.assignments.map((item) => new AssignmentResponse(item)));
                setClassOptions(payload.classOptions);
            }
        } catch (error: unknown) {
            console.error(getApiErrorMessage(error, "Failed to fetch assignments."));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!isUserReady) {
            return;
        }

        void fetchAssignments();
    }, [fetchAssignments, isUserReady]);

    const handleCloseModal = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const onSubmit = async () => {
        const values = form.getFieldsValue();
        setIsSubmitting(true);

        try {
            const response = await callCreateAssignment({
                classId: values.classId,
                title: values.title,
                dueDate: values.dueDate.toISOString(),
            });

            if (response.data.success) {
                const payload = response.data.data as IAssignmentPageData;
                setAssignments(payload.assignments.map((item) => new AssignmentResponse(item)));
                setClassOptions(payload.classOptions);
                handleCloseModal();
            }
        } catch (error: unknown) {
            console.error(getApiErrorMessage(error, "Failed to create assignment."));
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        assignments,
        canManage,
        classOptions,
        disabledPastDate: (current: Dayjs) => current && current < dayjs().startOf("minute"),
        form,
        handleCloseModal,
        isLoading,
        isModalVisible,
        isSubmitting,
        isUserReady,
        onSubmit,
        setIsModalVisible,
    };
}
