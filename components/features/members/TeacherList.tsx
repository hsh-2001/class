import { TeacherResponse } from "@/types/teacher";
import Table from "antd/es/table/Table";

export default function TeacherList({ teacherList }: { teacherList: TeacherResponse[] }) {
    return (
        <div className="w-full overflow-auto">
            <Table
                pagination={false}
                dataSource={teacherList}
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
                        width: '50%',
                        render: (_, record) => `${record.firstName} ${record.lastName || ""}`,
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