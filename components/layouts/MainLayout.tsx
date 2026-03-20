import useMainLayout from "@/hooks/useMainLayout";
import Header from "../features/Header";
import SideBar from "../features/Sidebar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const {
    onToggleSidebar,
    isSidebarOpen,
  } = useMainLayout();
  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-slate-950 dark:text-slate-100">
      <Header onToggleSidebar={onToggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className="flex h-[calc(100vh-5rem)]">
        <SideBar onToggleSidebar={onToggleSidebar} />
        <main className="flex-1 overflow-hidden main-layout">
          <div className="w-full h-full overflow-auto p-2 sm:p-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
