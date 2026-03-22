import { ClassResponse } from "@/types/class";
import { Table } from "antd";
import dayjs from "dayjs";

export default function ClassList({ classList }: { classList: ClassResponse[] }) {
    return (
        <Table
            rowKey="id"
            pagination={false}
            dataSource={classList}
            columns={[
                {
                    title: "Class",
                    dataIndex: "name",
                    key: "name",
                },
                {
                    title: "Course",
                    key: "course",
                    render: (_, record) => `${record.courseName} (${record.courseCode})`,
                },
                {
                    title: "Teacher",
                    dataIndex: "teacherName",
                    key: "teacherName",
                },
                {
                    title: "Start",
                    dataIndex: "startDate",
                    key: "startDate",
                    render: (value: string) => dayjs(value).format("MMM D, YYYY h:mm A"),
                },
                {
                    title: "End",
                    dataIndex: "endDate",
                    key: "endDate",
                    render: (value: string | null) => value ? dayjs(value).format("MMM D, YYYY h:mm A") : "Not scheduled",
                },
            ]}
        />
    );
}
