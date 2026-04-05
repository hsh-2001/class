import { ClassResponse } from "@/types/class";
import { Table } from "antd";
import dayjs from "dayjs";
import { Edit, Trash } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ClassList(
    { classList, onEdit, onDelete }:
        {
            classList: ClassResponse[],
            onEdit: (classId: string) => void
            onDelete: (id: string) => void
        }) {
    const { t } = useTranslation();

    return (
        <Table
            rowKey="id"
            pagination={false}
            dataSource={classList}
            columns={[
                {
                    title: t("courses.table.class"),
                    dataIndex: "name",
                    key: "name",
                },
                {
                    title: t("courses.course"),
                    key: "course",
                    render: (_, record) => `${record.courseName} (${record.courseCode})`,
                },
                {
                    title: t("courses.teacher"),
                    dataIndex: "teacherName",
                    key: "teacherName",
                },
                {
                    title: t("courses.table.start"),
                    dataIndex: "startDate",
                    key: "startDate",
                    render: (value: string) => dayjs(value).format("MMM D, YYYY h:mm A"),
                },
                {
                    title: t("courses.table.end"),
                    dataIndex: "endDate",
                    key: "endDate",
                    render: (value: string | null) => value ? dayjs(value).format("MMM D, YYYY h:mm A") : t("courses.table.notScheduled"),
                },
                {
                    title: t("courses.table.actions"),
                    dataIndex: "actions",
                    key: "actions",
                    render: (_, record) => (
                        <div className="flex gap-2">
                            <Edit className="cursor-pointer text-gray-500 hover:text-gray-700" size={18} onClick={() => {
                                onEdit(record.id);
                            }} />
                            <Trash className="cursor-pointer text-red-500 hover:text-red-400" size={18} onClick={() => {
                                onDelete(record.id);
                            }} />
                        </div>
                    ),
                },
            ]}
        />
    );
}
