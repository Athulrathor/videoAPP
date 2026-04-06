import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";

function WatchLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <Navbar setSidebarOpen={setSidebarOpen} />

            <div className="relative flex-1 min-h-0 overflow-hidden">
                <Sidebar
                    collapsed={false}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    overlayOnly
                />

                <main className="flex-1 min-h-0 overflow-y-auto no-scrollbar bg-(--bg)">
                    <div className="w-full px-4 max-sm:p-0 max-sm:rounded-none">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default WatchLayout;