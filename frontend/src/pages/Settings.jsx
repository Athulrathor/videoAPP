import { Outlet, NavLink } from "react-router-dom";

function Settings() {
    return (
        <div className="max-w-4xl mx-auto p-4 space-y-4">
            <h1 className="text-xl font-semibold">Settings</h1>

            {/* Tabs */}
            <div className="flex gap-4">
                <NavLink to="appearance">Appearance</NavLink>
                <NavLink to="profile">Profile</NavLink>
                <NavLink to="keyboard">Keyboard Shortcut</NavLink>
                <NavLink to="security">Security</NavLink>
                <NavLink to="privacy">Privacy</NavLink>
                <NavLink to="devices">Devices</NavLink>
            </div>

            {/* Content */}
            <div className="bg-(--surface) p-4 rounded-lg border border-(--border)">
                <Outlet />
            </div>
        </div>
    );
}

export default Settings;