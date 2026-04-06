function SettingToggle({ checked, onChange, ariaLabel }) {
    return (
        <button
            role="switch"
            aria-checked={checked}
            aria-label={ariaLabel}
            onClick={() => onChange(!checked)}
            className={`w-10 h-5 rounded-full transition relative ${checked ? "bg-[var(--primary)]" : "bg-[var(--border)]"
                }`}
        >
            <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition ${checked ? "translate-x-5" : ""
                    }`}
            />
        </button>
    );
}

export default SettingToggle;