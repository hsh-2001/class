import type { Role } from "@/types/enums";
import liveClassRepo from "@/repositories/live-class.repo";
import { ILiveClassItem, ILiveClassPageData, LiveClassStatus } from "@/types/live-class";

type LiveClassUserContext = {
    id: string;
    role: Role;
    schoolId: string;
};

const getLiveStatus = (startDate: Date, endDate: Date | null): LiveClassStatus => {
    const now = new Date();

    if (startDate > now) {
        return "UPCOMING";
    }

    if (!endDate || endDate >= now) {
        return "LIVE";
    }

    return "ENDED";
};

const mapLiveClass = (
    item: Awaited<ReturnType<typeof liveClassRepo.getLiveClassesBySchool>>[number],
): ILiveClassItem => ({
    id: item.id,
    className: item.name,
    courseName: item.course.name,
    courseCode: item.course.code,
    teacherName:
        [item.teacher.user.profile?.firstName ?? "", item.teacher.user.profile?.lastName ?? ""]
            .join(" ")
            .trim() || item.teacher.user.username || item.teacher.user.email,
    startDate: item.startDate.toISOString(),
    endDate: item.endDate?.toISOString() ?? null,
    status: getLiveStatus(item.startDate, item.endDate),
});

const getLiveClassesForUser = async (user: LiveClassUserContext): Promise<ILiveClassPageData> => {
    if (user.role === "ADMIN") {
        const sessions = await liveClassRepo.getLiveClassesBySchool(user.schoolId);
        return {
            sessions: sessions.map(mapLiveClass),
            canManage: true,
        };
    }

    if (user.role === "TEACHER") {
        const sessions = await liveClassRepo.getLiveClassesByTeacherUserId(user.id);
        return {
            sessions: sessions.map(mapLiveClass),
            canManage: true,
        };
    }

    const sessions = await liveClassRepo.getLiveClassesByStudentUserId(user.id);
    return {
        sessions: sessions.map(mapLiveClass),
        canManage: false,
    };
};

const liveClassService = {
    getLiveClassesForUser,
};

export default liveClassService;
