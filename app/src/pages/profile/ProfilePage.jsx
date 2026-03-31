import { useState } from "react";
import { InfoItem } from "../../component/Profile/InfoItem";
import { Section } from "../../component/Profile/Section";
import Portal from "../../component/shared/Portal";

function ProfilePage({data= "Sign out"}) {
   const [open, setOpen] = useState(false);

  return (
    <section className="h-full w-full overflow-auto bg-[#f5f5f5] p-6">
      <div className="mx-auto max-w-3xl space-y-4">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Profile</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Manage your account details, preferences, and security settings.
          </p>
        </div>

        <Section title="User Information">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoItem label="Full Name" value="Arafat Zaman" />
            <InfoItem label="Email" value="arafat@example.com" />
            <InfoItem label="Role" value="UI Designer" />
            <InfoItem label="Timezone" value="Asia/Dhaka (UTC+6)" />
          </div>
        </Section>

        <Section title="Preferences">
          <div className="space-y-3 text-sm text-text-secondary">
            <label className="flex items-center justify-between rounded-md border border-border-subtle bg-panel px-3 py-2">
              <span>Enable desktop notifications</span>
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </label>
            <label className="flex items-center justify-between rounded-md border border-border-subtle bg-panel px-3 py-2">
              <span>Show design tips on startup</span>
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </label>
          </div>
        </Section>

        <Section title="Security">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button className="h-10 rounded-md border border-border bg-subtle text-sm font-medium text-text-primary transition-colors hover:bg-panel">
              Change Password
            </button>
            <button className="h-10 rounded-md border border-border bg-subtle text-sm font-medium text-text-primary transition-colors hover:bg-panel">
              Enable Two-Factor Auth
            </button>
          </div>
        </Section>

        <Section title="Account Status">
          <div className="flex items-center justify-between gap-3 rounded-md border border-border-subtle bg-panel px-3 py-3">
            <p className="text-sm text-text-secondary">
              {data ? "You are currently signed in." : "You are not signed in."}
            </p>
            <button onClick={() => setOpen(true)} className="h-9 rounded-md bg-red-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-red-700">
              {data ? "Sign Out" : "Sign In"}
            </button>
          </div>
        </Section>
      </div>




      <div className="p-10">
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Open Portal
      </button>

      <Portal
        isOpen={open}
        isOverlay
        overlayColor="rgba(255,0,0,0.3)"
        CloseBtn={true}
        onClose={() => setOpen(false)}
      >
        <div className="text-lg font-semibold">Hello from Portal 🚀</div>
      </Portal>
    </div>
    </section>
  );
}

export default ProfilePage;
