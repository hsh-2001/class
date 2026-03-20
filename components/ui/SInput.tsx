import { Input } from 'antd';

interface IInputProps {
    placeholder?: string;
    value?: string | number;
    onChange?: (value: string | number) => void;
    disabled?: boolean;
}

export default function SInput({ placeholder, value, onChange, disabled }: IInputProps) {
    return (
        <Input
            placeholder={placeholder}
            value={value}
            disabled={disabled}
            onChange={(e) => onChange?.(e.target.value)}
            className='bg-slate-50 bordern dark:text-slate-50! dark:bg-slate-950! text-black/90 outline-none active:outline-none focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400 rounded-md'
        />
    )
};