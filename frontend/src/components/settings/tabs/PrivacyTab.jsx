import { Card, Button } from "../../ui/index";

function ToggleRow({ label, description, checked, onChange }) {
    return (
        <div className="flex items-start justify-between gap-4 py-4 border-b border-(--border) last:border-b-0">
            <div>
                <h3 className="font-medium">{label}</h3>
                {description && (
                    <p className="text-sm text-(--muted) mt-1">{description}</p>
                )}
            </div>

            <button
                type="button"
                onClick={() => onChange(!checked)}
                className={`
          relative w-12 h-7 rounded-full transition
          ${checked ? "bg-(--primary)" : "bg-(--subtle)"}
        `}
            >
                <span
                    className={`
            absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition
            ${checked ? "translate-x-5" : "translate-x-0"}
          `}
                />
            </button>
        </div>
    );
}

function PrivacyTab({ settings, onChange, onSave, isSaving }) {
    return (
        <div className="space-y-6">
            <Card className="p-5">
                <h2 className="mb-1">Watch history & recommendations</h2>
                <p className="text-sm text-(--muted) mb-4">
                    Control how your watch activity affects recommendations and suggestions.
                </p>

                <ToggleRow
                    label="Pause watch history"
                    description="Stop saving videos and shorts you watch."
                    checked={!!settings?.watchHistoryPause}
                    onChange={(value) => onChange("watchHistoryPause", value)}
                />

                <ToggleRow
                    label="Use watch history for recommendations"
                    description="Personalize recommendations using your watch activity."
                    checked={!!settings?.watchHistoryRecommentation}
                    onChange={(value) => onChange("watchHistoryRecommentation", value)}
                />

                <ToggleRow
                    label="Use watch history in suggestions"
                    description="Show suggestions based on watched content."
                    checked={!!settings?.watchHistoryInSuggestion}
                    onChange={(value) => onChange("watchHistoryInSuggestion", value)}
                />
            </Card>

            <Card className="p-5">
                <h2 className="mb-1">Notifications</h2>
                <p className="text-sm text-(--muted) mb-4">
                    Choose what you want to be notified about.
                </p>

                <ToggleRow
                    label="Recommended content notifications"
                    description="Receive notifications for recommended content."
                    checked={!!settings?.notificationReccommentedContent}
                    onChange={(value) => onChange("notificationReccommentedContent", value)}
                />

                <ToggleRow
                    label="Comment notifications"
                    description="Get notified when someone comments on your content."
                    checked={!!settings?.notificationOfComment}
                    onChange={(value) => onChange("notificationOfComment", value)}
                />

                <ToggleRow
                    label="Like notifications"
                    description="Get notified when someone likes your content."
                    checked={!!settings?.notificationOfLikes}
                    onChange={(value) => onChange("notificationOfLikes", value)}
                />

                <ToggleRow
                    label="Subscriber notifications"
                    description="Get notified when someone subscribes to you."
                    checked={!!settings?.notificationOfSubcriber}
                    onChange={(value) => onChange("notificationOfSubcriber", value)}
                />
            </Card>

            <div className="flex justify-end">
                <Button onClick={onSave} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save settings"}
                </Button>
            </div>
        </div>
    );
}

export default PrivacyTab;