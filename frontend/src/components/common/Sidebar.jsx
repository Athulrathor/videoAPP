import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { Film, History, House, ListVideo } from "lucide-react";
import { Avatar } from "../ui/index";

function Sidebar({
    collapsed,
    sidebarOpen,
    setSidebarOpen,
    overlayOnly = false,
}) {
    const { user } = useSelector((state) => state.auth || {});

    const menu = [
        {
            title: "Main",
            items: [
                { name: "Home", path: "/", icon: <House size={16} /> },
                { name: "Shorts", path: "/shorts", icon: <Film size={16} /> },
            ],
        },
        {
            title: "Library",
            items: [
                { name: "History", path: "/history", icon: <History size={16} /> },
                { name: "Playlists", path: "/playlist/1", icon: <ListVideo size={16} /> },
            ],
        },
        user && {
            title: "You",
            items: [
                {
                    name: "Your Channel",
                    path: `/channel/${user.username}`,
                    icon: user.avatar ? (
                        <Avatar src={user.avatar} name={user.username} />
                    ) : "👤",
                },
            ],
        },
    ].filter(Boolean);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") {
                setSidebarOpen?.(false);
            }
        };

        if (sidebarOpen) {
            window.addEventListener("keydown", handleEsc);
        }

        return () => {
            window.removeEventListener("keydown", handleEsc);
        };
    }, [sidebarOpen, setSidebarOpen]);

    const location = useLocation();

    useEffect(() => {
        setSidebarOpen?.(false);
    }, [location.pathname, setSidebarOpen]);

    return (
        <>
            {sidebarOpen && (
                <div
                    className="fixed inset-0 top-14 bg-black/40 z-40"
                    onClick={() => setSidebarOpen?.(false)}
                />
            )}

            <aside
                className={
                    overlayOnly
                        ? `
                            fixed top-14 left-0 z-50
                            h-[calc(100vh-56px)] w-60
                            bg-(--surface) border-r border-(--border)
                            transition-transform duration-300 shadow-sm
                            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                          `
                        : `
                            fixed md:static
                            top-14 md:top-0 left-0 z-50
                            h-[calc(100vh-56px)] md:h-full
                            bg-(--surface) border-r border-(--border)
                            transition-all duration-300 shadow-sm
                            ${collapsed ? "md:w-16" : "md:w-60"}
                            w-60
                            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                            md:translate-x-0
                          `
                }
                onClick={(e) => e.stopPropagation()}
            >
                <nav className="flex-1 px-2 py-4 space-y-4">
                    {menu.map((section, i) => (
                        <div key={i}>
                            {!(overlayOnly ? false : collapsed) && (
                                <p className="text-xs text-(--muted) px-2 mb-1">
                                    {section.title}
                                </p>
                            )}

                            {section.items.map((item) => (
                                <NavLink
                                    key={item.name}
                                    to={item.path}
                                    onClick={() => setSidebarOpen?.(false)}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-3 py-2 rounded transition
                                        ${isActive
                                            ? "bg-(--primary) text-white"
                                            : "text-(--muted) hover:bg-(--surface2) hover:text-(--text)"
                                        }`
                                    }
                                >
                                    <span className="w-5 text-center">
                                        {item.icon}
                                    </span>

                                    {!(overlayOnly ? false : collapsed) && (
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

export default Sidebar;