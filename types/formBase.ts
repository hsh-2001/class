import type { Rule } from "antd/es/form";

export interface IFormItem<T> {
    name: keyof T;
    label: string;
    option?: string[] | { label: string; value: string | number }[];
    disabled?: boolean;
    rules?: Rule[];
};
