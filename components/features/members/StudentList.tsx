import { StudentResponse } from "@/types/student";
import { Table } from "antd";
import { Edit } from "lucide-react";

export default function StudentList({ studentList, onClickEdit , isLoading}:
    { studentList: StudentResponse[], onClickEdit: (record: StudentResponse) => void, isLoading: boolean }) {
    return (
        <div className="w-full overflow-auto">
            <Table
                pagination={false}
                dataSource={studentList}
                rowKey="id"
                loading={isLoading}
                columns={[
                    {
                        title: "ID",
                        dataIndex: "id",
                        key: "id",
                        width: '20%',
                    },
                    {
                        title: "Full Name",
                        key: "name",
                        width: '20%',
                        render: (_, record) => `${record.firstName} ${record.lastName}`,
                    },
                    {
                        title: "Username",
                        dataIndex: "username",
                        key: "username",
                        render: (_, record) => record.username || "--",
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
                    {
                        title: "Actions",
                        key: "actions",
                        render: (_, record) => (
                            <button onClick={() => onClickEdit(record)}>
                                <Edit className="text-black/90 dark:text-slate-50 h-4 w-4 cursor-pointer" />
                            </button>
                        ),
                    },

                ]}
            />
        </div>
    )
}