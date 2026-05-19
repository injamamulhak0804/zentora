import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { InfoItem } from "../../component/Profile/InfoItem";
import { Section } from "../../component/Profile/Section";
import Portal from "../../component/shared/Portal";

function ProfilePage({ data = "Sign out" }) {
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      setUserData(JSON.parse(storedData));
    }
  }, []);

  const handleSignOut = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      await fetch(`${backendUrl}/api/v1/user/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // proceed with local sign-out even if request fails
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      navigate("/auth");
    }
  };

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
            <InfoItem
              label="Full Name"
              value={userData?.name || "Not provided"}
            />
            <InfoItem label="Email" value={userData?.email || "Not provided"} />
            <InfoItem label="Role" value={userData?.role || "Not specified"} />
            <InfoItem
              label="Timezone"
              value={
                userData?.timezone ||
                Intl.DateTimeFormat().resolvedOptions().timeZone ||
                "Not set"
              }
            />
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
            <button
              // onClick={data ? handleSignOut : () => navigate("/auth")}
              className="h-9 rounded-md bg-red-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-red-700"
            >
              {data ? "Sign Out" : "Sign In"}
            </button>
          </div>
        </Section>
      </div>
    </section>
  );
}

export default ProfilePage;
