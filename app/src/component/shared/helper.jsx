// ── Divider 
export function Divider() {
  return <div className="w-6 h-px bg-border-subtle mx-auto" />;
}

// ── Avatar ─
export function Avatar({ active = false, onClick }) {
  return (
    <div className="relative group flex items-center justify-center">
      <button
        aria-label="Profile"
        onClick={onClick}
        className={`w-10 h-10 rounded-full overflow-hidden ring-2 transition-all duration-150 cursor-pointer ${
          active ? "ring-blue-500" : "ring-border hover:ring-accent"
        }`}
      >
        {/* Placeholder avatar — swap src for real image */}
        <div className="w-full h-full bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center">
          <span className="text-white font-sans font-semibold text-sm select-none">
            A
          </span>
        </div>
      </button>
      {/* <Tooltip label="Profile" /> */}
    </div>
  );
}

// ── Logo ───
export function Logo() {
  return (
    <div className="relative group flex items-center justify-center">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center shadow-md shadow-brand-500/30 cursor-pointer">
        <span className="text-white font-sans font-bold text-lg leading-none select-none">
          z
        </span>
      </div>
    </div>
  );
}

// ── Tooltip 
export function Tooltip({ label }) {
  return (
    <div
      className="
        absolute left-full ml-3 p-2
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
