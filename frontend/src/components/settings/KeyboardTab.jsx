import SettingSection from "./SettingSection";
import SettingItem from "./SettingItem";
import SettingToggle from "./SettingToggle";
import { useAppearance } from "../common/useAppearacePanel";
// import { shortcuts } from "./keyboardConfig";

const shortcuts = [
    { id: "play_pause", label: "Play / Pause", keys: ["Space"] },
    { id: "seek_forward", label: "Seek Forward", keys: ["→"] },
    { id: "seek_backward", label: "Seek Backward", keys: ["←"] },
    { id: "mute", label: "Mute / Unmute", keys: ["M"] },
    { id: "fullscreen", label: "Fullscreen", keys: ["F"] },
];

function KeyboardTab() {
    const { settings, setSettings } = useAppearance();

    const update = (key, value) =>
        setSettings((prev) => ({ ...prev, [key]: value }));

    return (
        <div className="space-y-8 max-w-xl">

            {/* ⌨️ SHORTCUTS */}
            <SettingSection
                title="Keyboard Shortcuts"
                description="Quickly control the player using your keyboard"
            >
                <div className="space-y-2">
                    {shortcuts.map((item) => (
                        <div
                            key={item.id}
                            className="
                flex items-center justify-between
                px-3 py-2 rounded-lg
                bg-(--surface2)
                border border-(--border)
              "
                        >
                            <span className="text-sm">{item.label}</span>

                            <div className="flex gap-1">
                                {item.keys.map((k, i) => (
                                    <kbd
                                        key={i}
                                        className="
                      px-2 py-0.5 text-xs rounded
                      bg-(--bg)
                      border border-(--border)
                    "
                                    >
                                        {k}
                                    </kbd>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </SettingSection>

            {/* ♿ ACCESSIBILITY */}
            <SettingSection
                title="Accessibility"
                description="Improve usability and navigation"
            >
                <SettingItem label="Show focus outlines">
                    <SettingToggle
                        checked={settings.focusOutline ?? true}
                        onChange={(val) => update("focusOutline", val)}
                    />
                </SettingItem>

                <SettingItem label="Larger click targets">
                    <SettingToggle
                        checked={settings.largeTargets ?? false}
                        onChange={(val) => update("largeTargets", val)}
                    />
                </SettingItem>

                <SettingItem label="Reduce motion (shortcut)">
                    <SettingToggle
                        checked={settings.motion === "reduced"}
                        onChange={(val) =>
                            update("motion", val ? "reduced" : "normal")
                        }
                    />
                </SettingItem>
            </SettingSection>

        </div>
    );
}

export default KeyboardTab;