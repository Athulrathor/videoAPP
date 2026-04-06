function Avatar({ src, name = "", size = 32 }) {
    const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

    return src ? (
        <img
            src={src}
            alt={name}
            className="rounded-full"
            style={{ width: size, height: size }}
        />
    ) : (
        <div
            className="rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-xs"
            style={{ width: size, height: size }}
        >
            {initials}
        </div>
    );
}

export default Avatar;