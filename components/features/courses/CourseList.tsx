import { ICourse } from "@/types/course";
import { Table } from "antd";
import { Edit, Trash } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function CourseList({ courseList, onClickEdit, isLoading, onDelete }:
  { courseList: ICourse[]; onClickEdit: (record: ICourse) => void; isLoading: boolean, onDelete: (id: string) => void }) {
  const { t } = useTranslation();

  return (
    <Table
      rowKey="id"
      pagination={false}
      dataSource={courseList}
      loading={isLoading}
      columns={[
        {
          title: t("courses.table.name"),
          dataIndex: "name",
          key: "name",
        },
        {
          title: t("courses.table.code"),
          dataIndex: "code",
          key: "code",
          width: 180,
        },
        {
          title: t("courses.table.description"),
          dataIndex: "description",
          key: "description",
        },
        {
          title: t("courses.table.courseBanner"),
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
              <span className="text-sm text-slate-500 dark:text-slate-400">{t("courses.table.noBanner")}</span>
            );
          },
        },
        {
          title: t("courses.table.actions"),
          key: "actions",
          width: 100,
          render: (_, record) => (
            <div className="flex gap-2">
              <button onClick={() => onClickEdit(record)}>
                <Edit className="h-4 w-4 cursor-pointer text-black/90 dark:text-slate-50" />
              </button>
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
