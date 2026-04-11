import { NavLink, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { User, Lock, Monitor, Smartphone, Keyboard, FingerprintPattern } from "lucide-react";

function SettingsSidebar({ collapsed, sidebarOpen, setSidebarOpen }) {
    const location = useLocation();

    const menu = [
        {
            title: "Account",
            items: [
                { name: "Profile", path: "/settings/profile", icon: <User size={16} /> },
                { name: "Security", path: "/settings/security", icon: <Lock size={16} /> },
                { name: "Privacy", path: "/settings/privacy", icon: <FingerprintPattern size={16} /> },
            ],
        },
        {
            title: "Preferences",
            items: [
                { name: "Appearance", path: "/settings/appearance", icon: <Monitor size={16} /> },
                { name: "Keyboard", path: "/settings/keyboard", icon: <Keyboard size={16} /> },
                { name: "Devices", path: "/settings/devices", icon: <Smartphone size={16} /> },
            ],
        },
    ];

    // ✅ Close on route change (mobile UX)
    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname, setSidebarOpen]);

    // ✅ ESC key support
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") setSidebarOpen(false);
        };

        if (sidebarOpen) {
            window.addEventListener("keydown", handleEsc);
        }

        return () => window.removeEventListener("keydown", handleEsc);
    }, [sidebarOpen, setSidebarOpen]);

    return (
        <>
            {/* 📱 BACKDROP */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 top-14 bg-black/40 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* 📦 SIDEBAR */}
            <aside
                className={`
          fixed md:static
          top-14 md:top-0
          left-0 z-50
          h-[calc(100vh-56px)] md:h-full
          bg-(--surface) border-r border-(--border)
          transition-all duration-300

          ${collapsed ? "md:w-16" : "md:w-60"}

          w-60
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
                onClick={(e) => e.stopPropagation()}
            >
                <nav className="flex-1 px-2 py-4 space-y-4">
                    {menu.map((section, i) => (
                        <div key={i}>
                            {!collapsed && (
                                <p className="text-xs text-(--muted) px-2 mb-1">
                                    {section.title}
                                </p>
                            )}

                            {section.items.map((item) => (
                                <NavLink
                                    key={item.name}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-3 py-2 rounded
                    ${isActive ? "bg-(--primary) text-white" : ""}
                    hover:bg-(--border)`
                                    }
                                >
                                    <span className="w-5 text-center">
                                        {item.icon}
                                    </span>

                                    {!collapsed && (
                                        <span className="text-sm">{item.name}</span>
                                    )}
                                </NavLink>
                            ))}
                        </div>
                    ))}
                </nav>
            </aside>
        </>
    );
}

export default SettingsSidebar;
