import { useRef } from "react";

function OtpInput({ value, onChange, length = 6 }) {
    const inputsRef = useRef([]);

    const handleChange = (e, index) => {
        const val = e.target.value.replace(/\D/, "");
        if (!val) return;

        const newOtp = value.split("");
        newOtp[index] = val;
        const final = newOtp.join("").slice(0, length);

        onChange(final);

        // 👉 move forward
        if (index < length - 1) {
            inputsRef.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            const newOtp = value.split("");
            newOtp[index] = "";
            onChange(newOtp.join(""));

            if (index > 0) {
                inputsRef.current[index - 1].focus();
            }
        }
    };

    const handlePaste = (e) => {
        const paste = e.clipboardData.getData("text").slice(0, length);
        if (!/^\d+$/.test(paste)) return;

        onChange(paste);

        paste.split("").forEach((_, i) => {
            if (inputsRef.current[i]) {
                inputsRef.current[i].value = paste[i];
            }
        });
    };

    return (
        <div
            className="flex justify-between gap-2"
            onPaste={handlePaste}
        >
            {Array.from({ length }).map((_, i) => (
                <input
                    key={i}
                    ref={(el) => (inputsRef.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className="w-10 h-12 text-center text-lg border border-(--border) rounded bg-(--bg)"
                    onChange={(e) => handleChange(e, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    aria-label={`OTP digit ${i + 1}`}
                />
            ))}
        </div>
    );
}

export default OtpInput;