export const formatLastActive = (date) => {
    if (!date) return "N/A";

    const now = new Date();
    const past = new Date(date);

    if (isNaN(past)) return "N/A";

    const diff = Math.floor((now - past) / 1000); // seconds

    if (diff < 60) return "Just now";

    const mins = Math.floor(diff / 60);
    if (mins < 60) return `${mins} min${mins > 1 ? "s" : ""} ago`;

    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

    const days = Math.floor(hours / 24);
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;

    // fallback to date
    return past.toLocaleDateString();
};