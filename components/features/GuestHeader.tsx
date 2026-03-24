import ThemeToggle from "../ui/ThemeToggle";

export function GuestHeader() {
    return (
        <header className="w-full bg-slate-100 border-slate-200 dark:bg-slate-950/95 dark:border-white/10 border-b h-16 flex items-center justify-end px-4">
            <div>
                <ThemeToggle />
            </div>
        </header>
    );
}