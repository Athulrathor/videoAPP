import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";

// Lazy pages
const Home = lazy(() => import("../pages/Home"));
const Watch = lazy(() => import("../pages/Watch"));

// Normal pages
import Shorts from "../pages/Shorts";
import Profile from "../pages/Profile";
import History from "../pages/History";
// import Videos from "../pages/Videos";
import Playlist from "../pages/Playlist";
import UserPlaylists from "../pages/UserPlaylists"

import FileUpload from "../components/fileUpload/FileUpload";

// Settings Tabs
import AppearanceTab from "../components/settings/AppearanceTab";
import ProfileTab from "../components/settings/ProfileTab";
import SecurityTab from "../components/settings/SecurityTab";
import DevicesTab from "../components/settings/DevicesTab";
import KeyboardTab from "../components/settings/KeyboardTab";
import Settings from "../pages/Settings";


// Auth
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";

// Layout & Protected
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import SettingsLayout from "../layouts/SettingsLayout";
import WatchLayout from "../layouts/WatchLayout";
import PrivacyTab from "../components/settings/tabs/PrivacyTab";

function AppRoutes() {
    return (
        <>
        <Suspense fallback={<div>Loading...</div>}>
                <Routes>

                    {/* 🌍 DEFAULT APP (WITH SIDEBAR) */}
                    <Route element={<MainLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/shorts" element={<Shorts />} />

                        <Route
                            path="/history"
                            element={<ProtectedRoute><History /></ProtectedRoute>}
                        />

                        {/* <Route
                            path="/playlist/:id"
                            element={<ProtectedRoute><Playlist /></ProtectedRoute>}
                        /> */}
                    </Route>

                    {/* 🎥 WATCH + CHANNEL (NO SIDEBAR) */}
                    <Route element={<WatchLayout />}>

                        <Route path="/watch/:id" element={<Watch />} />

                        <Route
                            path="/channel/:username"
                            element={<ProtectedRoute><Profile /></ProtectedRoute>}
                        />

                        <Route path="/playlists" element={<ProtectedRoute><UserPlaylists /></ProtectedRoute>} />
                        <Route path="/playlist/:id" element={<ProtectedRoute><Playlist /></ProtectedRoute>} />

                    </Route>

                    {/* ⚙️ SETTINGS */}
                    <Route
                        path="/settings"
                        element={
                            <ProtectedRoute>
                                <SettingsLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Navigate to="profile" replace />} />
                        <Route path="profile" element={<ProfileTab />} />
                        <Route path="security" element={<SecurityTab />} />
                        <Route path="privacy" element={<PrivacyTab />} />
                        <Route path="keyboard" element={<KeyboardTab />} />
                        <Route path="appearance" element={<AppearanceTab />} />
                        <Route path="devices" element={<DevicesTab />} />
                    </Route>

                    {/* 🔐 AUTH */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                </Routes>
            </Suspense>
        </>
    );
}

export default AppRoutes;