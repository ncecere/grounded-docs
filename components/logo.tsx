/**
 * Grounded's mark, as the app draws it: an indigo tile with a teal accent
 * (web/src/components/ui/app-shell, `Brand`). Decorative: the product name
 * next to it is the accessible text.
 */
export function GroundedMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      width="20"
      height="20"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <rect width="20" height="20" rx="6" fill="var(--grounded-primary)" />
      <rect x="11" y="11" width="6" height="6" rx="2" fill="var(--grounded-highlight)" />
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
