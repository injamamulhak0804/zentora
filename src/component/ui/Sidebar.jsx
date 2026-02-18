import { useState } from "react";

// ── Icons (inline SVG to keep it dependency-free) ──────────────
const icons = {
  plus: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  database: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v6c0 1.657 4.03 3 9 3s9-1.343 9-3V5" />
      <path d="M3 11v6c0 1.657 4.03 3 9 3s9-1.343 9-3v-6" />
    </svg>
  ),
  user: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  calendar: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),
  bolt: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  bell: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  settings: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
};

// ── Nav items config ───────────────────────────────────────────
const navItems = [
  { id: "add",      icon: icons.plus,     label: "Add Element",   top: true },
  { id: "data",     icon: icons.database, label: "Data",          top: true },
  { id: "users",    icon: icons.user,     label: "Users",         top: true },
  { id: "schedule", icon: icons.calendar, label: "Schedule",      top: true },
  { id: "actions",  icon: icons.bolt,     label: "Actions",       top: true },
  { id: "alerts",   icon: icons.bell,     label: "Alerts",        top: true },
];

// ── Tooltip ────────────────────────────────────────────────────
function Tooltip({ label }) {
  return (
    <div
      className="
        absolute left-full ml-3 p-5
        bg-inverse text-text-inverse text-xs font-sans font-medium
        rounded-md shadow-lg whitespace-nowrap
        pointer-events-none z-50
        opacity-0 translate-x-5
        group-hover:opacity-100 group-hover:translate-x-0
        transition-all duration-150
      "
    >
      {label}
      {/* arrow */}
      <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-inverse" />
    </div>
  );
}

// ── Nav Button ─────────────────────────────────────────────────
function NavButton({ icon, label, active, onClick }) {
  return (
    <div className="relative group flex items-center justify-center">
      <button
        onClick={onClick}
        aria-label={label}
        className={`
          relative flex items-center justify-center
          w-10 h-10 rounded-xl
          transition-all duration-150
          ${active
            ? "bg-accent text-accent-foreground shadow-md shadow-brand-500/20"
            : "text-text-tertiary hover:text-text-primary hover:bg-subtle"
          }
        `}
      >
        {icon}
        {/* active indicator dot */}
        {active && (
          <span className="absolute -right-0.5 -top-0.5 w-2 h-2 rounded-full bg-brand-400 ring-2 ring-surface" />
        )}
      </button>
      {/* <Tooltip label={label} /> */}
    </div>
  );
}

// ── Logo ───────────────────────────────────────────────────────
function Logo() {
  return (
    <div className="relative group flex items-center justify-center">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center shadow-md shadow-brand-500/30 cursor-pointer">
        <span className="text-white font-sans font-bold text-lg leading-none select-none">S</span>
      </div>
      {/* <Tooltip label="CanvaToCode" /> */}
    </div>
  );
}

// ── Avatar ─────────────────────────────────────────────────────
function Avatar() {
  return (
    <div className="relative group flex items-center justify-center">
      <button
        aria-label="Profile"
        className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-border hover:ring-accent transition-all duration-150 cursor-pointer"
      >
        {/* Placeholder avatar — swap src for real image */}
        <div className="w-full h-full bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center">
          <span className="text-white font-sans font-semibold text-sm select-none">A</span>
        </div>
      </button>
      {/* <Tooltip label="Profile" /> */}
    </div>
  );
}

// ── Divider ────────────────────────────────────────────────────
function Divider() {
  return <div className="w-6 h-px bg-border-subtle mx-auto" />;
}

// ── Main Sidebar ───────────────────────────────────────────────
export default function Sidebar() {
  const [active, setActive] = useState("data");

  return (
    <aside
      className="
        flex flex-col items-center
        w-16 h-screen py-48 gap-1
        bg-surface border-r border-border
        shadow-panel
      "
    >
      {/* Logo */}
      <div className="mb-3">
        <Logo />
      </div>

      <Divider />

      {/* Nav items */}
      <nav className="flex flex-col items-center gap-1 mt-2 flex-1">
        {navItems.map((item) => (
          <NavButton
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={active === item.id}
            onClick={() => setActive(item.id)}
          />
        ))}
      </nav>

      {/* Bottom section */}
      <div className="flex flex-col items-center gap-2 mt-auto">
        <Divider />
        <div className="relative group flex items-center justify-center mt-1">
          <button
            aria-label="Settings"
            className="flex items-center justify-center w-10 h-10 rounded-xl text-text-tertiary hover:text-text-primary hover:bg-subtle transition-all duration-150"
          >
            {icons.settings}
          </button>
          {/* <Tooltip label="Settings" /> */}
        </div>
        <Avatar />
      </div>
    </aside>
  );
}
