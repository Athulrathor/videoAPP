import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Input, Card } from "../ui";
import {
    set2FA,
    disable2FA,
    TwoFactorEnable,
    changePassword,
} from "../../apis/auth.api";
import { BadgeCheck, ShieldCheck, Trash2, MailCheck } from "lucide-react";

function ModalShell({ title, onClose, children }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-3">
            <div className="w-full max-w-md bg-(--surface) rounded-(--radius-xl) border border-(--border) p-5 space-y-4 animate-fade-up shadow-xl">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{title}</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-(--muted) hover:text-(--text)"
                    >
                        ✕
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

function PasswordModal({ onClose }) {
    const [form, setForm] = useState({
        current: "",
        next: "",
        confirm: "",
    });
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");

    const validate = () => {
        const err = {};

        if (!form.current.trim()) err.current = "Current password required";
        if (form.next.length < 6) err.next = "Password must be at least 6 characters";
        if (form.next !== form.confirm) err.confirm = "Passwords do not match";
        if (form.current && form.next && form.current === form.next) {
            err.next = "New password must be different";
        }

        return err;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setApiError("");
        setSuccess("");

        const err = validate();
        setErrors(err);

        if (Object.keys(err).length > 0) return;

        try {
            setLoading(true);

            await changePassword({
                oldPassword: form.current,
                newPassword: form.next,
                confirmPassword: form.confirm,
            });

            setSuccess("Password updated successfully");
            setTimeout(() => onClose(), 800);
        } catch (e) {
            setApiError(
                e?.response?.data?.message || e?.message || "Failed to update password"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalShell title="Update Password" onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                    <label className="text-sm text-(--muted)">Current Password</label>
                    <Input
                        type="password"
                        value={form.current}
                        onChange={(e) => setForm((p) => ({ ...p, current: e.target.value }))}
                        placeholder="Enter current password"
                    />
                    {errors.current && <p className="text-xs text-red-500 mt-1">{errors.current}</p>}
                </div>

                <div>
                    <label className="text-sm text-(--muted)">New Password</label>
                    <Input
                        type="password"
                        value={form.next}
                        onChange={(e) => setForm((p) => ({ ...p, next: e.target.value }))}
                        placeholder="Enter new password"
                    />
                    {errors.next && <p className="text-xs text-red-500 mt-1">{errors.next}</p>}
                </div>

                <div>
                    <label className="text-sm text-(--muted)">Confirm Password</label>
                    <Input
                        type="password"
                        value={form.confirm}
                        onChange={(e) => setForm((p) => ({ ...p, confirm: e.target.value }))}
                        placeholder="Confirm new password"
                    />
                    {errors.confirm && <p className="text-xs text-red-500 mt-1">{errors.confirm}</p>}
                </div>

                {apiError && <p className="text-xs text-red-500">{apiError}</p>}
                {success && <p className="text-xs text-green-600">{success}</p>}

                <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? "Updating..." : "Update Password"}
                    </Button>
                </div>
            </form>
        </ModalShell>
    );
}

function DisableTwoFactorModal({ onClose, onSuccess }) {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");

    const handleDisable = async () => {
        if (!password.trim()) {
            setApiError("Password is required");
            return;
        }

        try {
            setLoading(true);
            setApiError("");
            await disable2FA({ password });
            onSuccess?.();
            onClose();
        } catch (e) {
            setApiError(
                e?.response?.data?.message || e?.message || "Failed to disable 2FA"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalShell title="Disable Two-Factor Authentication" onClose={onClose}>
            <div className="space-y-3">
                <p className="text-sm text-(--muted)">
                    Enter your password to disable two-factor authentication.
                </p>

                <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                />

                {apiError && <p className="text-xs text-red-500">{apiError}</p>}

                <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="button" variant="secondary" onClick={handleDisable} disabled={loading}>
                        {loading ? "Disabling..." : "Disable"}
                    </Button>
                </div>
            </div>
        </ModalShell>
    );
}

function TwoFactorModal({ onClose, onSuccess }) {
    const [step, setStep] = useState("loading");
    const [otp, setOtp] = useState("");
    const [backupCodes, setBackupCodes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [trustDevice, setTrustDevice] = useState(true);
    const [error, setError] = useState("");

    const setup2FA = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await set2FA();
            const codes = res?.data?.data?.backupCodes || [];

            setBackupCodes(codes);
            setStep("verify");
        } catch (e) {
            setError(
                e?.response?.data?.message || e?.message || "Failed to setup 2FA"
            );
            setStep("error");
        } finally {
            setLoading(false);
        }
    };

    const verifyOTP = async () => {
        if (otp.trim().length !== 6) {
            setError("Enter a valid 6-digit OTP");
            return;
        }

        try {
            setLoading(true);
            setError("");

            await TwoFactorEnable({ otp, trustDevice });
            setStep("backup");
            onSuccess?.();
        } catch (e) {
            setError(
                e?.response?.data?.message || e?.message || "Invalid OTP"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setup2FA();
    }, []);

    return (
        <ModalShell title="Two-Factor Authentication" onClose={onClose}>
            {step === "loading" && (
                <p className="text-sm text-(--muted)">Preparing 2FA setup...</p>
            )}

            {step === "error" && (
                <div className="space-y-3">
                    <p className="text-sm text-red-500">{error}</p>
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" onClick={onClose}>Close</Button>
                        <Button onClick={setup2FA}>Retry</Button>
                    </div>
                </div>
            )}

            {step === "verify" && (
                <div className="space-y-3">
                    <p className="text-sm text-(--muted)">
                        Enter the 6-digit OTP sent to your device.
                    </p>

                    <Input
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        placeholder="123456"
                        maxLength={6}
                    />

                    <label className="flex items-center gap-2 text-sm text-(--text)">
                        <input
                            type="checkbox"
                            checked={trustDevice}
                            onChange={() => setTrustDevice((p) => !p)}
                        />
                        Trust this device for 30 days
                    </label>

                    {error && <p className="text-xs text-red-500">{error}</p>}

                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button onClick={verifyOTP} disabled={loading}>
                            {loading ? "Verifying..." : "Verify"}
                        </Button>
                    </div>
                </div>
            )}

            {step === "backup" && (
                <div className="space-y-4">
                    <p className="text-sm text-(--text)">
                        Save your backup codes. You can use them if you lose access.
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-sm bg-(--surface2) p-3 rounded-(--radius)">
                        {backupCodes.map((code, i) => (
                            <span key={i} className="font-mono">
                                {code}
                            </span>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            onClick={() => navigator.clipboard.writeText(backupCodes.join("\n"))}
                        >
                            Copy
                        </Button>

                        <Button
                            variant="ghost"
                            onClick={() => {
                                const blob = new Blob([backupCodes.join("\n"), { type: "text/plain" }]);
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = "backup-codes.txt";
                                a.click();
                                URL.revokeObjectURL(url);
                            }}
                        >
                            Download
                        </Button>
                    </div>

                    <div className="flex justify-end">
                        <Button onClick={onClose}>Done</Button>
                    </div>
                </div>
            )}
        </ModalShell>
    );
}

function DeleteScheduleModal({ user, onClose, onConfirm }) {
    const [days, setDays] = useState(user?.scheduledDeletion ? 7 : 30);

    return (
        <ModalShell title="Schedule Account Deletion" onClose={onClose}>
            <div className="space-y-4">
                <p className="text-sm text-(--muted)">
                    Choose after how many days your account should be deleted.
                </p>

                <select
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-(--bg) border border-(--border) rounded-(--radius)"
                >
                    <option value={7}>7 days</option>
                    <option value={15}>15 days</option>
                    <option value={30}>30 days</option>
                </select>

                <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button variant="secondary" onClick={() => onConfirm(days)}>
                        {user?.scheduledDeletion ? "Update schedule" : "Schedule deletion"}
                    </Button>
                </div>
            </div>
        </ModalShell>
    );
}

function SecurityItem({ icon, title, description, action }) {
    return (
        <div className="flex items-start justify-between gap-4 py-4 border-b border-(--border) last:border-b-0">
            <div className="flex gap-3">
                <div className="mt-0.5 text-(--primary)">{icon}</div>
                <div>
                    <h3 className="font-medium">{title}</h3>
                    <p className="text-sm text-(--muted) mt-1">{description}</p>
                </div>
            </div>
            <div className="shrink-0">{action}</div>
        </div>
    );
}

function SecurityTab() {
    const authState = useSelector((state) => state.auth || state.user || {});
    const user = authState?.user || authState?.currentUser || null;

    const [twoFAOverride, setTwoFAOverride] = useState({
        userId: null,
        value: null,
    });
    const [show2FASetup, setShow2FASetup] = useState(false);
    const [showDisable2FA, setShowDisable2FA] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showDeletionModal, setShowDeletionModal] = useState(false);

    const twoFAEnabled =
        twoFAOverride.userId === user?._id && twoFAOverride.value !== null
            ? twoFAOverride.value
            : !!user?.twoFactorEnabled;

    const emailStatus = useMemo(() => {
        if (!user) return "Unavailable";
        return user.isEmailVerified ? "Verified" : "Pending";
    }, [user]);

    const handleEnable2FA = () => {
        setShow2FASetup(true);
    };

    const handleDisable2FA = () => {
        setShowDisable2FA(true);
    };

    const handleScheduleDeletion = (days) => {
        console.log("Schedule deletion after days:", days);
        setShowDeletionModal(false);
    };

    if (!user) {
        return (
            <Card className="p-5">
                <p className="text-sm text-(--muted)">
                    User security data not available.
                </p>
            </Card>
        );
    }

    return (
        <>
            <div className="space-y-6">
                <Card className="p-5">
                    <h2 className="mb-4 text-lg font-semibold">Account security</h2>

                    <SecurityItem
                        icon={<MailCheck size={18} />}
                        title="Email verification"
                        description={
                            user.isEmailVerified
                                ? "Your email is verified."
                                : "Your email is not verified yet."
                        }
                        action={
                            <span className={`text-sm ${emailStatus === "Verified" ? 'text-(--success)' : 'text-(--danger)'}`}>
                                {emailStatus}
                            </span>
                        }
                    />

                    <SecurityItem
                        icon={<ShieldCheck size={18} />}
                        title="Two-factor authentication"
                        description={
                            twoFAEnabled
                                ? "Two-factor authentication is enabled."
                                : "Add an extra layer of security to your account."
                        }
                        action={
                            twoFAEnabled ? (
                                <Button variant="secondary" onClick={handleDisable2FA}>
                                    Disable
                                </Button>
                            ) : (
                                <Button onClick={handleEnable2FA}>
                                    Enable
                                </Button>
                            )
                        }
                    />

                    <SecurityItem
                        icon={<BadgeCheck size={18} />}
                        title="Login method"
                        description={
                            user.through
                                ? "Third-party login is enabled."
                                : "Standard login is active."
                        }
                        action={
                            <span className="text-sm text-(--muted)">
                                {user.through ? "OAuth" : "Password"}
                            </span>
                        }
                    />

                    <SecurityItem
                        icon={<Trash2 size={18} />}
                        title="Schedule account deletion"
                        description={
                            user.scheduledDeletion
                                ? "Your account deletion is scheduled."
                                : "You can schedule your account for deletion."
                        }
                        action={
                            <Button
                                variant="secondary"
                                onClick={() => setShowDeletionModal(true)}
                            >
                                {user.scheduledDeletion ? "Manage" : "Schedule"}
                            </Button>
                        }
                    />

                    <div className="pt-4 flex flex-wrap gap-2">
                        <Button variant="secondary" onClick={() => setShowPasswordModal(true)}>
                            Change Password
                        </Button>
                    </div>
                </Card>
            </div>

            {showPasswordModal && (
                <PasswordModal onClose={() => setShowPasswordModal(false)} />
            )}

            {show2FASetup && (
                <TwoFactorModal
                    onClose={() => setShow2FASetup(false)}
                    onSuccess={() => setTwoFAOverride({ userId: user?._id, value: true })}
                />
            )}

            {showDisable2FA && (
                <DisableTwoFactorModal
                    onClose={() => setShowDisable2FA(false)}
                    onSuccess={() => setTwoFAOverride({ userId: user?._id, value: false })}
                />
            )}

            {showDeletionModal && (
                <DeleteScheduleModal
                    user={user}
                    onClose={() => setShowDeletionModal(false)}
                    onConfirm={handleScheduleDeletion}
                />
            )}
        </>
    );
}

export default SecurityTab;
