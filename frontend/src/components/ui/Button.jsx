const variants = {
    primary: "bg-[var(--primary)] text-white",
    secondary: "bg-[var(--surface)] border border-[var(--border)]",
    ghost: "hover:bg-[var(--border)]",
};

function Button({
    children,
    variant = "primary",
    className = "",
    ...props
}) {
    return (
        <button
            className={`px-3 py-1.5 rounded 
                  text-sm font-medium
                  ${variants[variant]} 
                  ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}

export default Button;