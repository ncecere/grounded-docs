/**
 * Grounded's logo, the "Cited" mark: a citation's brackets around a check
 * (the heavier small-size drawing, for 20–32 px). Decorative: the product
 * name next to it is the accessible text.
 */
export function GroundedMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width="20"
      height="20"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <rect width="64" height="64" rx="14" fill="var(--grounded-primary)" />
      <path d="M22 15H15.5V49H22M42 15H48.5V49H42" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M23.8 32.4L29.4 38L40.2 26.6" fill="none" stroke="#6ee7b7" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function NavTitle() {
  return (
    <span className="inline-flex items-center gap-2 font-semibold tracking-tight">
      <GroundedMark />
      <span>Grounded</span>
      <span className="rounded-md border border-fd-border px-1.5 py-0.5 text-xs font-medium text-fd-muted-foreground">
        docs
      </span>
    </span>
  );
}
