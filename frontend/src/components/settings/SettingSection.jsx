function SettingSection({ title, description, children }) {
    return (
        <section
            aria-labelledby={title}
            className="space-y-3 border-b border-(--border) pb-4"
        >
            <div>
                <h2 className="font-medium text-base">{title}</h2>
                {description && (
                    <p className="text-sm text-(--muted)">
                        {description}
                    </p>
                )}
            </div>

            <div className="space-y-2">{children}</div>
        </section>
    );
}

export default SettingSection;