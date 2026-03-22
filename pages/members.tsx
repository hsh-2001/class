import AddStudentForm from "@/components/features/members/AddStudentForm";
import AddTeacherForm from "@/components/features/members/AddTeacherForm";
import StudentList from "@/components/features/members/StudentList";
import TeacherList from "@/components/features/members/TeacherList";
import SButton from "@/components/ui/SButton";
import SModal from "@/components/ui/SModal";
import SToggleButton from "@/components/ui/SToggleButton";
import useMembers from "@/hooks/useMembers";
import { useEffect } from "react";

export default function Members() {
    const {
        isModalVisible,
        setIsModalVisible,
        onSubmit,
        form,
        fieldItem,
        genders,
        onGetAllStudents,
        studentList,
        isActive,
        setIsActive,
        teacherFieldItems,
        teacherForm,
        onGetAllTeachers,
        teacherList,
    } = useMembers();

    useEffect(() => {
        onGetAllStudents();
        onGetAllTeachers();
    }, []);

    return (
        <>
            <div className="w-full h-full overflow-auto page-body">
                <div className="flex justify-between mb-2 items-center">
                    <SToggleButton
                        isActive={isActive === "students"}
                        onChange={() => isActive === "students" ? setIsActive("teachers") : setIsActive("students")}
                        name={{ option1: "Students", option2: "Teachers" }}
                        icon={{ icon1: <>👨‍🎓</>, icon2: <>👩‍🏫</> }}
                    />
                    <SButton type="button" color="primary" onClick={() => setIsModalVisible(true)}>
                        {isActive === "students" ? "Add Student" : "Add Teacher"}
                    </SButton>
                </div>

                {
                    isActive === "students" ?
                        <StudentList studentList={studentList} />
                        : <TeacherList teacherList={teacherList} />
                }
            </div>
            <SModal
                isOpen={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                title={isActive === "students" ? "Add new student" : "Add new teacher"}
            >
                {
                    isActive === "students" ?
                        <AddStudentForm
                            form={form}
                            fieldItem={fieldItem}
                            genders={genders}
                            onSubmit={onSubmit}
                            onCancel={() => setIsModalVisible(false)}
                        />
                        :

                        <AddTeacherForm
                            form={teacherForm}
                            fieldItem={teacherFieldItems}
                            genders={genders}
                            onSubmit={onSubmit}
                            onCancel={() => setIsModalVisible(false)}
                        />
                }
            </SModal>
        </>
    )
}
