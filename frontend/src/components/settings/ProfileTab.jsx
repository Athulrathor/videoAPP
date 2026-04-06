import { useState } from "react";
import { Input, Button, Avatar, Card } from "../ui";

function ProfileTab() {
    const [form, setForm] = useState({
        fullname: "",
        username: "",
        avatar: "",
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        try {
            setLoading(true);

            // 🔌 API CALL
            // await updateProfile(form)

            console.log("Profile updated", form);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">

            {/* 👤 PROFILE CARD */}
            <Card className="p-4 space-y-4">
                <h2 className="font-semibold text-lg">Profile</h2>

                {/* Avatar */}
                <div className="flex items-center gap-4">
                    <Avatar src={form.avatar} name={form.username} size="lg" />

                    <Button variant="ghost">
                        Change Avatar
                    </Button>
                </div>

                {/* Inputs */}
                <div className="grid gap-3 sm:grid-cols-2">

                    <div>
                        <label className="text-sm text-(--muted)">
                            Full Name
                        </label>
                        <Input
                            value={form.fullname}
                            onChange={(e) =>
                                setForm({ ...form, fullname: e.target.value })
                            }
                            placeholder="Enter full name"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-(--muted)">
                            Username
                        </label>
                        <Input
                            value={form.username}
                            onChange={(e) =>
                                setForm({ ...form, username: e.target.value })
                            }
                            placeholder="Enter username"
                        />
                    </div>

                </div>

                {/* Save */}
                <div className="flex justify-end">
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </Card>

            {/* ⚠️ DANGER ZONE */}
            <Card className="p-4 space-y-3 border border-red-500/30">
                <h3 className="text-red-500 font-medium">Danger Zone</h3>

                <Button variant="danger">
                    Delete Account
                </Button>
            </Card>
        </div>
    );
}

export default ProfileTab;