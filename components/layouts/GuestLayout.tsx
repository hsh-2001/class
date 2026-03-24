import { GuestHeader } from "../features/GuestHeader"

export default function GuestLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900 dark:text-slate-100">
            <GuestHeader />
            <div className="w-full h-full">
                {children}
            </div>
        </div>
    );
}