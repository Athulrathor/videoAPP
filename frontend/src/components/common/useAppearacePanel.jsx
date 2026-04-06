import { useEffect, useState } from "react";

const defaultSettings = {
    theme: "system",
    fontSize: "medium",
    motion: "normal",
    contrast: "normal",
};

export const useAppearance = () => {
    const [settings, setSettings] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("appearance")) || defaultSettings;
        } catch {
            return defaultSettings;
        }
    });

    useEffect(() => {
        const root = document.documentElement;
        const media = window.matchMedia("(prefers-color-scheme: dark)");

        // 🌗 THEME APPLY
        const applyTheme = (mode) => {
            const root = document.documentElement;

            if (mode === "dark") {
                root.classList.add("dark");
            } else {
                root.classList.remove("dark");
            }
        };

        let cleanup = () => { };

        if (settings.theme === "system") {
            applyTheme(media.matches ? "dark" : "light");

            const handler = () => {
                applyTheme(media.matches ? "dark" : "light");
            };

            media.addEventListener("change", handler);
            cleanup = () => media.removeEventListener("change", handler);
        } else {
            applyTheme(settings.theme);
        }

        // 🔠 FONT SIZE
        const fontMap = {
            small: "14px",
            medium: "16px",
            large: "18px",
        };

        root.style.setProperty(
            "--font-size",
            fontMap[settings.fontSize] || "16px"
        );

        // 🎯 MOTION
        root.style.setProperty(
            "--transition",
            settings.motion === "reduced" ? "0s" : "0.2s ease"
        );

        // 🌈 CONTRAST
        root.classList.toggle("contrast", settings.contrast === "high");

        // 💾 SAVE
        localStorage.setItem("appearance", JSON.stringify(settings));

        return cleanup;
    }, [settings]);

    return { settings, setSettings };
};