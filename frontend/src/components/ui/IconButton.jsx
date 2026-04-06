import React from "react";

function IconButton({
    icon,
    label,
    variant = "ghost",
    className = "",
    children,
    ...props
}) {
    const variants = {
        ghost: "bg-transparent hover:bg-[var(--surface2)] text-[var(--text)]",
        soft: "bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--surface2)] text-[var(--text)]",
        primary: "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]",
    };

    return (
        <button
            type="button"
            aria-label={label}
            title={label}
            className={`
        inline-flex items-center justify-center gap-2
        h-10 min-w-10 px-3
        rounded-(--radius)
        transition
        ${variants[variant] || variants.ghost}
        ${className}
      `}
            {...props}
        >
            {icon && <span className="shrink-0">{icon}</span>}
            {children}
        </button>
    );
}

export default IconButton;