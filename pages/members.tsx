import StudentList from "@/components/features/members/StudentList";
import SButton from "@/components/ui/SButton";
import SInput from "@/components/ui/SInput";
import SModal from "@/components/ui/SModal";
import SToggleButton from "@/components/ui/SToggleButton";
import useMembers from "@/hooks/useMembers";
import { DatePicker, Form, Select } from "antd";
import { useEffect, useState } from "react";

export default function Members() {
    const [isActive, setIsActive] = useState("students");

    const {
        isModalVisible,
        setIsModalVisible,
        onSubmit,
        form,
        fieldItem,
        genders,
        onGetAllStudents,
        studentList,
    } = useMembers();

    useEffect(() => {
        onGetAllStudents();
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
                        Add Member
                    </SButton>
                </div>

                {
                    isActive === "students" ? (
                        <StudentList studentList={studentList}/>
                    ) :
                        (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                                Teachers list is empty.
                            </div>
                        )
                }
            </div>
            <SModal
                isOpen={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                title="Add new student"
            >
                <Form
                    name="add-member"
                    layout="vertical"
                    form={form}
                    onSubmitCapture={onSubmit}
                >
                    <div className="grid md:grid-cols-2 gap-4">
                        {fieldItem.map((field, index) => {
                            let inputComponent;
                            if (field.name === "dateOfBirth") {
                                inputComponent = <DatePicker className="w-full" />;
                            } else if (field.name === "gender") {
                                inputComponent = (
                                    <Select
                                        defaultValue="MALE"
                                        onChange={(e) => form.setFieldValue("gender", e)}
                                        options={genders}
                                        className="w-full"
                                    />
                                );
                            } else {
                                inputComponent = (
                                    <SInput
                                        placeholder={`Enter ${field.label.toLowerCase()}`}
                                        disabled={field.disabled}
                                    />
                                );
                            }

                            return (
                                <Form.Item
                                    key={field.name}
                                    name={field.name}
                                    label={field.label}
                                    rules={field.rules}
                                >
                                    {inputComponent}
                                </Form.Item>
                            );
                        })}
                    </div>
                    <div className="flex justify-end gap-2">
                        <SButton type="button" color="secondary" onClick={() => setIsModalVisible(false)}>
                            Cancel
                        </SButton>
                        <SButton type="submit" color="primary" >
                            Submit
                        </SButton>
                    </div>
                </Form>
            </SModal>
        </>
    )
}
