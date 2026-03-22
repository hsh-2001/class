import { Loader } from "lucide-react";

interface SButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type: "button" | "submit" | "reset";
    color: "primary" | "secondary" | "danger";
    loading?: boolean;
}

export default function SButton({ children, onClick, type, color, loading }: SButtonProps) {
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
            className={`h-8 whitespace-nowrap rounded-full px-4 text-sm font-medium transition-colors ${styleMapping(color)} ${loading ? "cursor-not-allowed opacity-50" : " cursor-pointer"}`}
            onClick={onClick}
            disabled={loading}
        >
            {loading ? (<div className="flex items-center gap-2"> <Loader className="animate-spin h-4 w-4" /> {children} </div>) : children}
        </button>
    );
};
