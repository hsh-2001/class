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
            className='w-full'
        />
    )
};
