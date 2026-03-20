import { useState } from "react";

export default function useMainLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const onToggleSidebar = () => {
        const sidebar = document.querySelector(".sidebar");
        if (sidebar && !sidebar.classList.contains("open")) {
            sidebar.classList.add("open");
            sidebar.classList.remove("closing");
            setIsSidebarOpen(true);
            return;
        }
        const sidebarOpent = document.querySelector(".sidebar.open");
        if (sidebarOpent) {
            sidebarOpent.classList.add("closing");
            setTimeout(() => {
                sidebarOpent.classList.remove("open");
                setIsSidebarOpen(false);
            }, 300);
        }
    };

    return {
        onToggleSidebar,
        isSidebarOpen,
        setIsSidebarOpen
    }
}