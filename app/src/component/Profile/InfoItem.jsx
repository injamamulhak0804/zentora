export function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-text-tertiary">
        {label}
      </p>
      <p className="mt-1 text-sm text-text-primary">{value}</p>
    </div>
  );
}
