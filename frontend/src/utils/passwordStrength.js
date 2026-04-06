// utils/passwordStrength.js
export const getPasswordStrength = (password) => {
    if (!password) return { label: "", score: 0 };

    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const levels = ["Weak", "Fair", "Good", "Strong", "Very Strong"];

    return {
        label: levels[score - 1] || "Weak",
        score,
    };
};