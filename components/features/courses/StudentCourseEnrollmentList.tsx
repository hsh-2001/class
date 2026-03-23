import SButton from "@/components/ui/SButton";
import { IStudentCourseEnrollmentItem } from "@/types/enrollment";
import { Alert, Card, Skeleton, Tag } from "antd";
import dayjs from "dayjs";
import Image from "next/image";
import { useTranslation } from "react-i18next";

interface StudentCourseEnrollmentListProps {
    courses: IStudentCourseEnrollmentItem[];
    isLoading: boolean;
    enrollingClassId: string | null;
    onEnroll: (classId: string) => void;
}

export default function StudentCourseEnrollmentList({
    courses,
    isLoading,
    enrollingClassId,
    onEnroll,
}: StudentCourseEnrollmentListProps) {
    const { t } = useTranslation();

    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                    <Card key={index} className="rounded-2xl">
                        <Skeleton active paragraph={{ rows: 4 }} />
                    </Card>
                ))}
            </div>
        );
    }

    if (courses.length === 0) {
        return (
            <Alert
                type="info"
                showIcon
                message={t("courses.enrollment.noClassesTitle")}
                description={t("courses.enrollment.noClassesDescription")}
            />
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => {
                const startDate = dayjs(course.startDate);
                const endDate = course.endDate ? dayjs(course.endDate) : null;

                return (
                    <Card
                        key={course.classId}
                        className="overflow-hidden rounded-3xl border border-black/10 shadow-sm dark:border-white/10"
                        cover={
                            course.courseBanner ? (
                                <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-900">
                                    <Image
                                        src={course.courseBanner}
                                        alt={course.courseName}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="flex h-44 items-center justify-center bg-gradient-to-br from-sky-100 to-cyan-50 text-sm font-medium text-sky-800 dark:from-slate-900 dark:to-slate-800 dark:text-sky-200">
                                    {course.courseCode}
                                </div>
                            )
                        }
                    >
                        <div className="space-y-4">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                                        {course.courseCode}
                                    </p>
                                    <h3 className="mt-2 text-lg font-semibold text-slate-950 dark:text-slate-50">
                                        {course.courseName}
                                    </h3>
                                </div>
                                <Tag color={course.isEnrolled ? "green" : "blue"}>
                                    {course.isEnrolled ? t("courses.enrollment.enrolled") : t("courses.enrollment.open")}
                                </Tag>
                            </div>

                            <p className="min-h-12 text-sm text-slate-600 dark:text-slate-300">
                                {course.courseDescription || t("courses.enrollment.noDescription")}
                            </p>

                            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/5">
                                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                    {course.className}
                                </p>
                                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                                    {t("courses.enrollment.starts")} {startDate.isValid() ? startDate.format("MMM D, YYYY h:mm A") : t("courses.enrollment.tbd")}
                                </p>
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    {t("courses.enrollment.ends")} {endDate?.isValid() ? endDate.format("MMM D, YYYY h:mm A") : t("courses.table.notScheduled")}
                                </p>
                                {course.enrolledAt ? (
                                    <p className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                        {t("courses.enrollment.joined")} {dayjs(course.enrolledAt).format("MMM D, YYYY")}
                                    </p>
                                ) : null}
                            </div>

                            {course.isEnrolled ? (
                                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
                                    {t("courses.enrollment.alreadyEnrolled")}
                                </div>
                            ) : (
                                <SButton
                                    type="button"
                                    color="primary"
                                    loading={enrollingClassId === course.classId}
                                    onClick={() => onEnroll(course.classId)}
                                >
                                    {t("courses.enrollment.enrollNow")}
                                </SButton>
                            )}
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}
