import { Input } from 'antd';

interface IInputProps {
    placeholder?: string;
    value?: string | number;
    onChange?: (value: string | number) => void;
    disabled?: boolean;
    type: 'text' | 'email' | 'password';
}

export default function SInput({ placeholder, value, onChange, disabled, type }: IInputProps) {
    return (
        <>
            {
                type === 'password' ? (
                    <Input.Password
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => onChange?.(e.target.value)}
                        disabled={disabled}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-400 focus:bg-white"
                    />
                ) : (
                    <Input
                        type={type}
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => onChange?.(e.target.value)}
                        disabled={disabled}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-400 focus:bg-white"
                    />
                )

            }
        </>
    )
};
