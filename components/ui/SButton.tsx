interface SButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type: "button" | "submit" | "reset";
    color: "primary" | "secondary" | "danger";
}

export default function SButton({ children, onClick, type, color }: SButtonProps) {
    const styleMapping = (color: SButtonProps["color"]) => {
        switch (color) {
            case "primary":
                return "bg-black/90 text-white hover:bg-black/70 dark:bg-white/90 dark:text-black hover:dark:bg-white/95 hover:dark:bg-white/95";
            case "secondary":
                return "bg-gray-300 text-gray-700 hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-300 hover:dark:bg-gray-600";
            case "danger":
                return "bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:text-white hover:dark:bg-red-700";
            default:
                return "";
        }
    }

    return (
        <button
            type={type}
            className={`rounded-full px-4 h-8 text-sm font-medium transition-colors ${styleMapping(color)}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};