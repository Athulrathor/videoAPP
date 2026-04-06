import { useAppearance } from "../common/useAppearacePanel";
import SettingSection from "./SettingSection";
import SettingItem from "./SettingItem";
import SettingToggle from "./SettingToggle";

function AppearanceTab() {
    const { settings, setSettings } = useAppearance();

    const update = (key, value) =>
        setSettings((prev) => ({ ...prev, [key]: value }));

    return (
        <div className="space-y-8 max-w-xl">

            {/* 🎨 THEME */}
            <SettingSection
                title="Theme"
                description="Choose how the interface looks"
            >
                <div role="radiogroup" className="space-y-2">
                    {["light", "dark", "system"].map((t) => (
                        <button
                            key={t}
                            role="radio"
                            aria-checked={settings.theme === t}
                            onClick={() => update("theme", t)}
                            className={`
                w-full flex items-center justify-between
                px-3 py-2 rounded-lg text-sm transition

                ${settings.theme === t
                                    ? "bg-(--primary) text-white"
                                    : "bg-(--surface2) text-(--text) hover:bg-(--border)"
                                }
              `}
                        >
                            <span className="capitalize">{t}</span>
                            {settings.theme === t && <span>✓</span>}
                        </button>
                    ))}
                </div>
            </SettingSection>

            {/* 🔠 TYPOGRAPHY */}
            <SettingSection title="Typography">
                <SettingItem label="Font size">
                    <select
                        value={settings.fontSize}
                        onChange={(e) => update("fontSize", e.target.value)}
                        className="bg-(--surface2) border border-(--border) px-2 py-1.5 rounded-md"
                    >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                    </select>
                </SettingItem>
            </SettingSection>

            {/* 🎬 MOTION */}
            <SettingSection title="Motion">
                <SettingItem label="Reduce animations">
                    <SettingToggle
                        checked={settings.motion === "reduced"}
                        onChange={(val) => update("motion", val ? "reduced" : "normal")}
                    />
                </SettingItem>
            </SettingSection>

            {/* 🌈 ACCESSIBILITY */}
            <SettingSection title="Accessibility">
                <SettingItem label="High contrast">
                    <SettingToggle
                        checked={settings.contrast === "high"}
                        onChange={(val) => update("contrast", val ? "high" : "normal")}
                    />
                </SettingItem>
            </SettingSection>

        </div>
    );
}
export default AppearanceTab;