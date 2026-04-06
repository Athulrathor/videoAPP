import { Shield, Lock, PlaySquare, Clapperboard, ListVideo, LayoutGrid, Monitor } from "lucide-react";

const tabs = [
    { key: "overview", label: "Overview", icon: <LayoutGrid size={16} /> },
    { key: "videos", label: "Videos", icon: <PlaySquare size={16} /> },
    { key: "shorts", label: "Shorts", icon: <Clapperboard size={16} /> },
    { key: "playlists", label: "Playlists", icon: <ListVideo size={16} /> },
    { key: "privacy", label: "Privacy", icon: <Lock size={16} /> },
    { key: "security", label: "Security", icon: <Shield size={16} /> },
    { key: "sessions", label: "Sessions", icon: <Monitor size={16} /> },
];





// const tabs = [
//     { id: "appearance", label: "Appearance" },
//     { id: "profile", label: "Profile" },
//     { id: "security", label: "Security" },
//     { id: "devices", label: "Devices" },
// ];

function Tabs({ activeTab, onChange }) {
    return (
        <div className="flex flex-wrap gap-2 border-b border-(--border) pb-3">
            {tabs.map((tab) => (
                <button
                    key={tab.key}
                    onClick={() => onChange(tab.key)}
                    className={`
            inline-flex items-center gap-2 px-4 py-2 text-sm rounded-(--radius)
            transition border
            ${activeTab === tab.key
                            ? "bg-(--primary) text-white border-(--primary)"
                            : "bg-(--surface) text-(--text) border-(--border) hover:bg-(--surface2)"
                        }
          `}
                >
                    {tab.icon}
                    {tab.label}
                </button>
            ))}
        </div>
    );
}

export default Tabs;