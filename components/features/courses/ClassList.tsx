import { ClassResponse } from "@/types/class";
import { Table } from "antd";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

export default function ClassList({ classList }: { classList: ClassResponse[] }) {
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
            ]}
        />
    );
}
