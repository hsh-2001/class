export interface IFormItem<T> {
    name: keyof T;
    label: string;
    option?: string[] | { label: string; value: any }[];
    disabled?: boolean;
    rules?: any[];
};
