function SettingItem({ label, description, children }) {
    return (
        <div className="flex items-center justify-between gap-4">
            <div>
                <p className="text-sm font-medium">{label}</p>
                {description && (
                    <p className="text-xs text-(--muted)">
                        {description}
                    </p>
                )}
            </div>

            <div>{children}</div>
        </div>
    );
}

export default SettingItem;