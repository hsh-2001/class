"use client";

interface SToggleButtonProps {
    isActive: boolean;
    onChange: () => void;
    name: { option1: string; option2: string };
    icon?: { icon1: React.ReactNode; icon2: React.ReactNode };
}
export default function SToggleButton({ isActive, onChange, name, icon }: SToggleButtonProps) {
    return (
        <div className="relative grid w-max grid-cols-2 rounded-full border border-gray-300 p-1 dark:border-gray-800">
            <div
                className="absolute inset-y-1 z-0 rounded-full bg-black/90 transition-all duration-300 ease-in-out dark:bg-white/90"
                style={{
                    left: isActive ? "0.25rem" : "calc(50% + 0.125rem)",
                    width: "calc(50% - 0.30rem)",
                }}
            />
            <button
                type="button"
                className={`relative z-10 flex items-center justify-center gap-1 px-4 py-1 transition-colors ${isActive ? "text-white/90 dark:text-black/90" : "text-gray-500 dark:text-white/90"}`}
                onClick={() => onChange()}>
                {icon?.icon1} {name.option1}
            </button>
            <button
                type="button"
                className={`relative z-10 flex items-center justify-center gap-1 px-4 py-1 transition-colors ${!isActive ? "text-white/90 dark:text-black/90" : "text-gray-500 dark:text-white/90"}`}
                onClick={() => onChange()}>
                {icon?.icon2} {name.option2}
            </button>
        </div>
    );
}
