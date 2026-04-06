import { useEffect, useState } from "react";
import { Button } from "../ui";
import {
    deleteOtherSessions,
    deleteSession,
    getSession,
    logoutAllUser,
} from "../../apis/auth.api";
import { formatLastActive } from "../../utils/formatDate";
import SessionSkeleton from "../ui/skeleton/settingsSkeleton/SessionSkeleton";
import { logout } from "../../features/auth/authSlice";
import { useDispatch } from "react-redux";

function DevicesTab() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    const dispatch = useDispatch();

    const fetchSessions = async () => {
        try {
            setLoading(true);
            const res = await getSession();
            setSessions(res.data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    const handleLogoutSession = async (sessionId) => {
        try {
            setActionLoading(sessionId);

            // ✅ optimistic UI
            setSessions((prev) =>
                prev.filter((s) => s._id !== sessionId)
            );

            await deleteSession(sessionId);

            // ✅ sync with backend (important)
            fetchSessions();
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleLogoutOthers = async () => {
        try {
            setActionLoading("others");
            await deleteOtherSessions();
            fetchSessions();
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleLogoutAll = async () => {
        try {
            setActionLoading("all");
            await logoutAllUser();

            dispatch(logout());
            setSessions([]);
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="space-y-4">
            <h2 className="font-medium">Your Sessions</h2>

            {/* 🔘 ACTIONS */}
            {sessions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant="ghost"
                        onClick={handleLogoutOthers}
                        disabled={actionLoading === "others"}
                        aria-label="Logout other devices"
                    >
                        {actionLoading === "others"
                            ? "Logging out..."
                            : "Logout other devices"}
                    </Button>

                    <Button
                        variant="danger"
                        onClick={handleLogoutAll}
                        disabled={actionLoading === "all"}
                        aria-label="Logout all devices"
                    >
                        {actionLoading === "all"
                            ? "Logging out..."
                            : "Logout all devices"}
                    </Button>
                </div>
            )}

            {/* 🔄 SKELETON */}
            {loading && (
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <SessionSkeleton key={i} />
                    ))}
                </div>
            )}

            {/* 📭 EMPTY */}
            {!loading && sessions.length === 0 && (
                <p className="text-sm text-(--muted)">
                    No active sessions
                </p>
            )}

            {/* 📱 SESSIONS */}
            {!loading &&
                sessions.map((session) => {
                    return (
                        <div
                            key={session._id}
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-(--border) p-3 rounded-lg hover:bg-(--surface)"
                        >
                            {/* INFO */}
                            <div className="space-y-1">
                                <p className="text-sm font-medium flex items-center gap-2">
                                    {session.deviceName || "Unknown device"}

                                    {session.isCurrent && (
                                        <span className="text-xs text-green-500">
                                            ● Active now
                                        </span>
                                    )}
                                </p>

                                <p className="text-xs text-(--muted)">
                                    {session.browser} • {session.os} • {session.platform}
                                </p>

                                <p className="text-xs text-(--muted)">
                                    {session.location ? session.location?.city || session.location?.country || "Unknown Location"  : "Unknown Location"}
                                </p>

                                <p className="text-xs text-(--muted)">
                                    IP: {session.ipAddress || "N/A"}
                                </p>

                                <p
                                    className="text-xs text-(--muted)"
                                    title={new Date(session.lastActive).toLocaleString()}
                                >
                                    Last active: {formatLastActive(session.lastActive)}
                                </p>
                            </div>

                            {/* ACTION */}
                            {!session.isCurrent && (
                                <Button
                                    variant="ghost"
                                    onClick={() =>
                                        handleLogoutSession(session._id)
                                    }
                                    disabled={actionLoading === session._id}
                                    aria-label="Logout session"
                                >
                                    {actionLoading === session._id
                                        ? "Removing..."
                                        : "Logout"}
                                </Button>
                            )}
                        </div>
                    );
                })}
        </div>
    );
}

export default DevicesTab;