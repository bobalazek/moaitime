export default function MoodEntriesActivity() {
  const moodEntries = [];

  return (
    <div data-test="mood--mood-entries-activity">
      {moodEntries.length === 0 && (
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground">No mood entries yet.</p>
        </div>
      )}
    </div>
  );
}
