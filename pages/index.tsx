import useOverview from "@/hooks/useOverview";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { User, Users, Book, Clipboard, MessageCircle } from "lucide-react";

export default function Home() {
  const { t } = useTranslation();
  const { overview, getOverview, isLoading } = useOverview();

  useEffect(() => {
    getOverview();
  }, []);

  return (
    <div className="min-h-screen p-6 space-y-8 transition-colors duration-300">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title={t("total_students")} value={overview?.total_students} Icon={User} isLoading={isLoading('get')} />
        <StatCard title={t("total_teachers")} value={overview?.total_teachers} Icon={Users} isLoading={isLoading('get')} />
        <StatCard title={t("total_classes")} value={overview?.total_classes} Icon={Clipboard} isLoading={isLoading('get')} />
        <StatCard title={t("total_courses")} value={overview?.total_courses} Icon={Book} isLoading={isLoading('get')} />
        <StatCard title={t("total_groups")} value={overview?.total_groups} Icon={MessageCircle} isLoading={isLoading('get')} />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
          {t("courses_with_classes")}
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {overview?.courses_with_classes?.map((course) => (
            <div
              key={course.course_id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-lg transition-shadow duration-200"
            >
              <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-gray-100">
                {course.course_name}
              </h3>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
                {course.classes?.map((cls) => (
                  <li key={cls.class_id}>{cls.class_name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
          {t("courses_with_no_classes")}
        </h2>

        <div className="flex flex-wrap gap-2">
          {overview?.courses_with_no_classes?.map((course) => (
            <span
              key={course.course_id}
              className="px-3 py-1 rounded-full border border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 text-sm font-medium"
            >
              {course.course_name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value?: number;
  Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  isLoading: boolean
}

function StatCard({ title, value, Icon, isLoading }: StatCardProps) {
  return <>
    {
      isLoading ?
        <div className=" animate-pulse bg-gray-100 dark:bg-slate-600/60 h-20 rounded-lg">
        </div>
        : <div className="bg-white dark:bg-gray-800 rounded-lg p-5 dark:hover:scale-105 transition-all flex items-center space-x-4 hover:shadow-xl duration-200">
          {Icon && <Icon className="w-8 h-8 text-blue-500 dark:text-blue-400" />}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-300">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value ?? 0}</p>
          </div>
        </div>
    }
  </>;
}