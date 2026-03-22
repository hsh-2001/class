import { ICourse } from "@/types/course";
import { Table } from "antd";
import { Edit } from "lucide-react";
import Image from "next/image";

export default function CourseList({ courseList, onClickEdit }: { courseList: ICourse[]; onClickEdit: (record: ICourse) => void }) {
  return (
    <Table
      rowKey="id"
      pagination={false}
      dataSource={courseList}
      columns={[
        {
          title: "Name",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "Code",
          dataIndex: "code",
          key: "code",
          width: 180,
        },
        {
          title: "Description",
          dataIndex: "description",
          key: "description",
        },
        {
          title: "Course Banner",
          dataIndex: "courseBanner",
          key: "courseBanner",
          width: 150,
          render: (value) => {
            return value ? (
              <Image
                src={value}
                alt="Course Banner"
                width={40}
                height={40}
                className="object-cover rounded-md" />
            ) : (
              <span className="text-sm text-slate-500 dark:text-slate-400">No banner</span>
            );
          },
        },
        {
          title: "Actions",
          key: "actions",
          width: 100,
          render: (_, record) => (
            <button onClick={() => onClickEdit(record)}>
              <Edit className="h-4 w-4 cursor-pointer text-black/90 dark:text-slate-50" />
            </button>
          ),
        },
      ]}
    />
  );
}