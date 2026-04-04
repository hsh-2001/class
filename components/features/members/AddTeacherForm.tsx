import SButton from "@/components/ui/SButton";
import SInput from "@/components/ui/SInput";
import { IFormItem } from "@/types/formBase";
import { ICreateTeacherDTO } from "@/types/teacher";
import { Form, Select, FormInstance } from "antd";

interface IAddTeacherFormProps {
    form: FormInstance<ICreateTeacherDTO & { confirmPassword: string }>;
    fieldItem: IFormItem<ICreateTeacherDTO & { confirmPassword: string }>[];
    genders: { label: string, value: string }[];
    onSubmit: () => void;
    onCancel?: () => void;
    submitText?: string;
    isLoading?: boolean;
}

export default function AddTeacherForm(
    { form, fieldItem, genders, onSubmit, onCancel, submitText = "Submit", isLoading = false }: IAddTeacherFormProps
) {
    return (
        <>
            <Form
                name="add-member"
                layout="vertical"
                form={form}
                onSubmitCapture={onSubmit}
            >
                <div className="grid md:grid-cols-2 gap-4 max-h-[calc(100vh-300px)] overflow-y-auto">
                    {fieldItem.map((field) => {
                        let inputComponent;
                        if (field.name === "gender") {
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
                                    type={["password", "confirmPassword"].includes(field.name) ? "password" : "text"}
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
                <div className="flex justify-end mt-2 gap-2">
                    <SButton type="button" color="secondary" onClick={onCancel}>
                        Cancel
                    </SButton>
                    <SButton type="submit" color="primary" loading={isLoading}>
                        {submitText}
                    </SButton>
                </div>
            </Form>
        </>
    )
}
