import { useState } from "react";
import { registerUser } from "../../apis/auth.api";
import { useUpload } from "../../hooks/useUpload";
import { useDropzone } from "../../hooks/useDropZone";
import { Avatar, Button, Card, Input } from "../../components/ui";
import { useUsernameCheck } from "../../features/user/useUsernameCheck";

function Register() {
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
  });

  const [avatar, setAvatar] = useState({});
  const [cover, setCover] = useState({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔥 Separate uploads
  const avatarUpload = useUpload();
  const coverUpload = useUpload();
  const status = useUsernameCheck(form.username);

  // 🎯 Dropzones
  const avatarDrop = useDropzone({
    onDrop: async (file) => {
      const res = await avatarUpload.uploadFile(file);
      setAvatar(res);
    },
  });

  const coverDrop = useDropzone({
    onDrop: async (file) => {
      const res = await coverUpload.uploadFile(file);
      setCover(res);
    },
  });

  // const usernameStatus = useUsernameCheck(form.username);

  // 🚀 REGISTER
  const handleRegister = async () => {
    try {
      setLoading(true);

      await registerUser({
        ...form,
        avatarUrl: avatar.url,
        avatarPublicId: avatar.publicId,
        coverImage: cover.url,
        coverImagePublicId: cover.publicId,
      });

      setStep(4);
    } catch {
      setError("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md space-y-5">

        {/* 🔢 STEP INDICATOR */}
        <div className="flex justify-between text-xs text-(--muted)">
          <span className={step >= 1 ? "text-(--primary)" : ""}>Account</span>
          <span className={step >= 2 ? "text-(--primary)" : ""}>Profile</span>
          <span className={step >= 3 ? "text-(--primary)" : ""}>Review</span>
        </div>

        {/* ❌ ERROR */}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {/* 🧩 STEP 1 */}
        {step === 1 && (
          <>
            <h2>Create Account</h2>

            <Input
              placeholder="Full Name"
              value={form.fullname}
              onChange={(e) =>
                setForm({ ...form, fullname: e.target.value })
              }
            />

            <Input
              placeholder="Username"
              value={form.username}
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
            />

            {/* STATUS */}
            <p className="text-xs mt-1">
              {status === "checking" && (
                <span className="text-(--muted)">Checking...</span>
              )}

              {status === "available" && (
                <span className="text-green-500">✅ Available</span>
              )}

              {status === "taken" && (
                <span className="text-red-500">❌ Username taken</span>
              )}
            </p>

            <Input
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <Input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <Button disabled={
              !form.username ||
              status === "taken" ||
              status === "checking"
            } onClick={() => setStep(2)}>
              Next
            </Button>
          </>
        )}

        {/* 🖼 STEP 2 */}
        {step === 2 && (
          <>
            <h2>Profile Setup</h2>

            {/* Avatar */}
            <div
              onDrop={avatarDrop.handleDrop}
              onDragOver={avatarDrop.handleDragOver}
              onDragLeave={avatarDrop.handleDragLeave}
              className={`border-2 border-dashed p-4 rounded text-center cursor-pointer
                ${avatarDrop.isDragging ? "border-(--primary)" : "border-(--border)"}`}
            >
              {avatar.url ? (
                <Avatar src={avatar.url} name={form.username} size="lg" />
              ) : (
                <p>Upload Avatar</p>
              )}
              <p className="text-xs">{avatarUpload.progress}%</p>
            </div>

            {/* Cover */}
            <div
              onDrop={coverDrop.handleDrop}
              onDragOver={coverDrop.handleDragOver}
              onDragLeave={coverDrop.handleDragLeave}
              className={`border-2 border-dashed p-4 rounded text-center cursor-pointer
                ${coverDrop.isDragging ? "border-(--primary)" : "border-(--border)"}`}
            >
              {cover.url ? (
                <img src={cover.url} className="rounded max-h-40" />
              ) : (
                <p>Upload Cover Image</p>
              )}
              <p className="text-xs">{coverUpload.progress}%</p>
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={() => setStep(3)}>
                Next
              </Button>
            </div>
          </>
        )}

        {/* 🔍 STEP 3 */}
        {step === 3 && (
          <>
            <h2>Review</h2>

            <div className="space-y-2 text-sm">
              <p><strong>Name:</strong> {form.fullname}</p>
              <p><strong>Username:</strong> {form.username}</p>
              <p><strong>Email:</strong> {form.email}</p>
            </div>

            <div className="flex items-center gap-4">
              {avatar.url && (
                <Avatar src={avatar.url} name={form.username} />
              )}
              {cover.url && (
                <img src={cover.url} className="w-20 rounded" />
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button onClick={handleRegister} disabled={loading}>
                {loading ? "Creating..." : "Submit"}
              </Button>
            </div>
          </>
        )}

        {/* ✅ STEP 4 */}
        {step === 4 && (
          <div className="text-center space-y-3">
            <h2>Verify your email</h2>
            <p className="text-sm text-(--muted)">
              We sent a verification link to your email.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}

export default Register;