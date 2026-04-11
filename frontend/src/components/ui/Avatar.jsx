const AVATAR_SIZES = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
};

function Avatar({ src, name = "", size = 32 }) {
    const resolvedSize =
        typeof size === "number" ? size : AVATAR_SIZES[size] || AVATAR_SIZES.sm;

    const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

    return src ? (
        <img
            src={src}
            alt={name}
            className="block shrink-0 rounded-full object-cover"
            style={{ width: resolvedSize, height: resolvedSize }}
        />
    ) : (
        <div
            className="flex shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-xs text-white"
            style={{ width: resolvedSize, height: resolvedSize }}
        >
            {initials}
        </div>
    );
}

export default Avatar;
