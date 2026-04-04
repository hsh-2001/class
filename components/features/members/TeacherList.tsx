import { TeacherResponse } from "@/types/teacher";
import Table from "antd/es/table/Table";
import { Edit } from "lucide-react";

export default function TeacherList({ teacherList, onClickEdit, isLoading }:
    { teacherList: TeacherResponse[], onClickEdit: (record: TeacherResponse) => void, isLoading: boolean }) {
    return (
        <div className="w-full overflow-auto">
            <Table
                pagination={false}
                dataSource={teacherList}
                rowKey="id"
                loading={isLoading}
                columns={[
                    {
                        title: "ID",
                        dataIndex: "id",
                        key: "id",
                        width: '30%',
                    },
                    {
                        title: "Full Name",
                        key: "name",
                        width: '20%',
                        render: (_, record) => `${record.firstName} ${record.lastName || ""}`,
                    },
                    {
                        title: "Username",
                        dataIndex: "username",
                        key: "username",
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
                            <div className="flex gap-2">
                                <button onClick={() => onClickEdit(record)}>
                                    <Edit className="text-black/90 dark:text-slate-50 h-4 w-4 cursor-pointer" />
                                </button>
                            </div>
                        ),
                    }
                ]}
            />
        </div>
    )
}