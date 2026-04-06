import { useState, useRef, useEffect } from "react";

function DropDown({ trigger, children, align = "right" }) {
    const [open, setOpen] = useState(false);
    const ref = useRef();

    useEffect(() => {
        const handler = (e) => {
            if (!ref.current?.contains(e.target)) setOpen(false);
        };
        const handleEsc = (e) => e.key === "Escape" && setOpen(false);

        document.addEventListener("mousedown", handler);
        document.addEventListener("keydown", handleEsc);
        return () => {
            document.removeEventListener("mousedown", handler);
            document.removeEventListener("keydown", handleEsc);
        };
    }, []);

    return (
        <div className="relative" ref={ref}>
            {/* Trigger */}
            <div onClick={() => setOpen((p) => !p)} className="cursor-pointer">
                {trigger}
            </div>

            {/* Menu */}
            {open && (
                <div
                    className={`
                        absolute ${align === "right" ? "right-0" : "left-0"} mt-2
                        min-w-48 w-max
                        bg-(--surface) border border-(--border)
                        rounded-xl shadow-lg
                        p-1 z-999
                    `}
                >
                    {children}
                </div>
            )}
        </div>
    );
}

// ─── Sub-components ──────────────────────────────────────────

// Individual menu item
DropDown.Item = function DropDownItem({
    children,
    onClick,
    icon,
    variant = "default",
    // closeOnClick = true,
}) {
    const colorMap = {
        default: "text-(--text) hover:bg-(--surface-hover)",
        danger: "text-red-500 hover:bg-red-500/10",
        success: "text-green-500 hover:bg-green-500/10",
    };

    return (
        <button
            onClick={onClick}
            className={`
                w-full flex items-center gap-2
                px-3 py-2 rounded-lg
                text-sm text-left
                border-none bg-transparent
                cursor-pointer transition-colors duration-100
                ${colorMap[variant] ?? colorMap.default}
            `}
        >
            {icon && <span className="w-4 h-4 shrink-0">{icon}</span>}
            <span>{children}</span>
        </button>
    );
};

// Divider line
DropDown.Divider = function DropDownDivider() {
    return <hr className="my-1 border-(--border)" />;
};

// Section label
DropDown.Label = function DropDownLabel({ children }) {
    return (
        <div className="px-3 py-1 text-xs text-(--text-muted) font-medium uppercase tracking-wide">
            {children}
        </div>
    );
};

export default DropDown;