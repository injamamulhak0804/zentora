function SettingsPage() {
  return (
    <section className="h-full w-full overflow-auto bg-[#f5f5f5] p-6">
      <div className="mx-auto max-w-3xl space-y-4">
        <h1 className="text-2xl font-semibold text-text-primary">Settings</h1>
        <p className="text-sm text-text-secondary">
          Manage workspace-level preferences for your UI builder project.
        </p>

        <div className="rounded-lg border border-border bg-surface p-4 shadow-panel">
          <h2 className="text-sm font-semibold text-text-primary">General</h2>
          <p className="mt-1 text-sm text-text-secondary">
            Settings controls can be added here as your product grows.
          </p>
        </div>
      </div>
    </section>
  );
}

export default SettingsPage;
