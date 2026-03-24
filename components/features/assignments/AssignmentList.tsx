import { AssignmentResponse } from "@/types/assignment";
import { Table, Tag } from "antd";
import dayjs from "dayjs";

export default function AssignmentList({ assignments }: { assignments: AssignmentResponse[] }) {
    return (
        <div className="w-full overflow-auto">
            <Table
                rowKey="id"
                pagination={false}
                dataSource={assignments}
                columns={[
                    {
                        title: "Assignment",
                        dataIndex: "title",
                        key: "title",
                    },
                    {
                        title: "Course",
                        key: "course",
                        render: (_, record) => `${record.courseName} (${record.courseCode})`,
                    },
                    {
                        title: "Class",
                        dataIndex: "className",
                        key: "className",
                    },
                    {
                        title: "Teacher",
                        dataIndex: "teacherName",
                        key: "teacherName",
                    },
                    {
                        title: "Due Date",
                        dataIndex: "dueDate",
                        key: "dueDate",
                        render: (value: string) => dayjs(value).format("MMM D, YYYY h:mm A"),
                    },
                    {
                        title: "Status",
                        key: "status",
                        render: (_, record) => {
                            const isOverdue = dayjs(record.dueDate).isBefore(dayjs());
                            return <Tag color={isOverdue ? "red" : "blue"}>{isOverdue ? "Overdue" : "Open"}</Tag>;
                        },
                    },
                ]}
            />
        </div>
    );
}
