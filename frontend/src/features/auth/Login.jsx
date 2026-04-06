import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { forgetPassword, loginUser, verifyLogin } from "../../apis/auth.api";
import { setCredentials } from "./authSlice";
import { useNavigate } from "react-router-dom";
import { Input, Button, Card } from "../../components/ui";
import OtpInput from "../../components/ui/OtpInput";
// import { useLocation } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [step, setStep] = useState("login"); // login | verify | forgot | forgotSuccess

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);

  const [remember, setRemember] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // const location = useLocation();
  // const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    const saved = localStorage.getItem("rememberEmail");
    if (saved) {
      setEmail(saved);
      setRemember(true);
    }
  }, []);

  useEffect(() => {
    if (email) {
      document.getElementById("password")?.focus();
    }
  }, [email]);

  useEffect(() => {
    const savedStep = localStorage.getItem("loginStep");
    const savedEmail = localStorage.getItem("loginEmail");

    if (savedStep === "verify" && savedEmail) {
      setStep("verify");
      setEmail(savedEmail);
    }
  }, []);

  useEffect(() => {
    if (step !== "verify") return;

    setTimer(30);

    const interval = setInterval(() => {
      setTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [step]);

  // 🔐 LOGIN
  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      // 👉 call /login
      const res = await loginUser({ email, password });

      if (remember) {
        localStorage.setItem("rememberEmail", email);
      } else {
        localStorage.removeItem("rememberEmail");
      }

      if (res.data.data.requires2FA) {
        setOtp("");
        setStep("verify");

        localStorage.setItem("loginStep", "verify");
        localStorage.setItem("loginEmail", email);
      } else {
        dispatch(setCredentials(res.data.data));

        navigate("/");;
      }
    } catch (err) {
      console.error(err)
      setError("Invalid credentials", err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔢 VERIFY 2FA
  const handleVerify = async () => {
    try {
      setLoading(true);

      const res = await verifyLogin({ email, otp });

      dispatch(setCredentials(res.data.data));
      localStorage.removeItem("loginStep");
      localStorage.removeItem("loginEmail");

      navigate("/");
    } catch {
      setError("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // 📧 FORGOT PASSWORD
  const handleForgot = async () => {
    try {
      setLoading(true);

      await forgetPassword({ email });

      setStep("forgotSuccess");
    } catch {
      setError("Email not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md space-y-4">

        {/* 🔐 LOGIN */}
        {step === "login" && (
          <>
            <h2 className="text-xl font-semibold">Login</h2>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Remember */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <Input
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember((prev) => !prev)}
                />
                Remember me
              </label>

              <button
                className="text-(--primary) cursor-pointer"
                onClick={() => setStep("forgot")}
              >
                Forgot password?
              </button>
            </div>

            <Button onClick={handleLogin} disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>

            {/* Social */}
            <div className="flex gap-2">
              <Button className="w-full">Google</Button>
              <Button className="w-full">GitHub</Button>
            </div>

            <p className="text-sm text-center">
              Don’t have an account?{" "}
              <span
                className="text-(--primary) cursor-pointer"
                onClick={() => navigate("/register")}
              >
                Register
              </span>
            </p>
          </>
        )}

        {/* 🔢 2FA VERIFY */}
        {step === "verify" && (
          <>
            <h2 className="text-xl font-semibold text-center">
              Verify Code
            </h2>

            {/* 📩 CONTEXT */}
            <p className="text-sm text-(--muted) text-center">
              Enter the 6-digit code sent to{" "}
              <span className="font-medium">{email}</span>
            </p>

            {error && (
              <p className="text-sm text-red-500 text-center">
                {error}
              </p>
            )}

            {/* 🔢 OTP INPUT */}
            <OtpInput
              value={otp}
              onChange={setOtp}
              length={6}
              autoFocus
            />

            {/* 🔘 ACTIONS */}
            <div className="space-y-2 mt-2">

              {/* VERIFY */}
              <Button
                onClick={handleVerify}
                disabled={loading || otp.length !== 6}
                className="w-full"
              >
                {loading ? "Verifying..." : "Verify"}
              </Button>

              {/* 🔁 RESEND */}
              <button
                disabled={timer > 0}
                onClick={() => {
                  handleLogin(); // resend
                  setTimer(30);
                }}
                className="text-sm text-(--primary) w-full disabled:opacity-50"
              >
                {timer > 0
                  ? `Resend in ${timer}s`
                  : "Resend code"}
              </button>

              {/* 🔙 BACK */}
              <button
                onClick={() => {
                  setStep("login");
                  localStorage.removeItem("loginStep");
                }}
                className="text-sm text-(--muted) w-full"
              >
                Back to login
              </button>
            </div>
          </>
        )}

        {/* 📧 FORGOT PASSWORD */}
        {step === "forgot" && (
          <>
            <h2 className="text-xl font-semibold">
              Reset Password
            </h2>

            <Input
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Button onClick={handleForgot} disabled={loading}>
              Send Reset Link
            </Button>

            <button
              className="text-sm"
              onClick={() => setStep("login")}
            >
              Back to login
            </button>
          </>
        )}

        {/* ✅ SUCCESS */}
        {step === "forgotSuccess" && (
          <>
            <h2 className="text-xl font-semibold">
              Check your email
            </h2>

            <p className="text-sm text-(--muted)">
              We sent a reset link to your email.
            </p>

            <Button onClick={() => setStep("login")}>
              Back to login
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}

export default Login;