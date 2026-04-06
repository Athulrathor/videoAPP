import { useState } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import { Outlet } from "react-router-dom";

function MainLayout() {
    const [collapsed, setCollapsed] = useState(false); // desktop
    const [sidebarOpen, setSidebarOpen] = useState(false); // mobile

    return (
        <div className="h-screen flex flex-col">
            {/* 🔝 Navbar */}
            <Navbar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                setSidebarOpen={setSidebarOpen}
            />

            {/* 🔻 Content Area */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <Sidebar
                    collapsed={collapsed}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto bg-(--bg)">
                    <div className="p-3">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default MainLayout;