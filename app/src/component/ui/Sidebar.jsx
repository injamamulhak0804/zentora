import { Avatar, Divider, Logo, Tooltip } from "../shared/helper";
import { navItems } from "../../constants";
import { SettingSvg } from "../../assets/Svgs";

export default function Sidebar({ active, setActive }) {
  return (
    <aside className="flex h-screen w-full flex-col items-center gap-1 border-r border-border bg-surface py-8 shadow-panel">
      {/* Logo */}
      <div className="mb-3">
        {/* <Logo />  */}
        <img src="./logo.png" alt="Logo" className="w-[40px] h-[40px]" />
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
            onClick={() => setActive("settings")}
            className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-150 ${
              active === "settings"
                ? "bg-accent text-accent-foreground shadow-md shadow-brand-500/20"
                : "text-text-tertiary hover:text-text-primary hover:bg-subtle"
            }`}
          >
            <SettingSvg />
          </button>
          <Tooltip label="Settings" />
        </div>
        <Avatar active={active === "profile"} onClick={() => setActive("profile")} />
      </div>
    </aside>
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
          w-10  h-10 rounded-xl
          transition-all duration-150 font-semibold
          ${
            active
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
      <Tooltip label={label} />
    </div>
  );
}
