import { StudentResponse } from "@/types/student";
import { Table } from "antd";

export default function StudentList({ studentList }: { studentList: StudentResponse[] }) {
    return (
        <div>
            <Table
                dataSource={studentList}
                rowKey="id"
                columns={[
                    {
                        title: "ID",
                        dataIndex: "id",
                        key: "id",
                    },
                    {
                        title: "Full Name",
                        key: "name",
                        render: (_, record) => `${record.firstName} ${record.lastName}`,
                    },
                    {
                        title: "Email",
                        dataIndex: "email",
                        key: "email",
                    },
                    {
                        title: "Phone",
                        dataIndex: "phone",
                        key: "phone",
                    },
                ]}
            />
        </div>
    )
}