import { Outlet } from "react-router-dom";
import SettingsSidebar from "../components/settings/SettingsSidebar";
import { useState } from "react";
import Navbar from "../components/common/Navbar";

function SettingsLayout() {
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
                <SettingsSidebar
                    collapsed={collapsed}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-4 bg-(--bg)">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default SettingsLayout;