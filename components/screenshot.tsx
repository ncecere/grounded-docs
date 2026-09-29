import slots from '@/lib/screenshot-slots.json';
import imported from '@/lib/screenshots.json';

type SlotName = keyof typeof slots;
type Imported = Record<string, { src: string; width: number; height: number }>;

/**
 * A named screenshot slot. When `npm run screenshots` has imported the image
 * (lib/screenshots.json), it renders it with its width and height; otherwise it
 * renders a clearly marked placeholder, so a page never shows a broken image.
 * Screenshots come only from the public "Example University" demo instance.
 */
export function Screenshot({ slot, caption }: { slot: SlotName; caption?: string }) {
  const meta = slots[slot];
  const img = (imported as Imported)[slot];

  if (img) {
    return (
      <figure className="not-prose my-6">
        {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-optimised WebP */}
        <img
          src={img.src}
          alt={meta.alt}
          width={img.width}
          height={img.height}
          loading="lazy"
          decoding="async"
          className="h-auto w-full rounded-xl border border-fd-border bg-fd-card shadow-brand-2"
        />
        {caption ? (
          <figcaption className="mt-2 text-center text-sm text-fd-muted-foreground">{caption}</figcaption>
        ) : null}
      </figure>
    );
  }

  return (
    <figure
      className="not-prose my-6 flex aspect-[16/9] w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-fd-border bg-fd-muted p-6 text-center"
      data-screenshot-slot={slot}
    >
      <span className="rounded-md bg-fd-card px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground">
        Screenshot to come
      </span>
      <span className="max-w-prose text-sm text-fd-muted-foreground">{meta.alt}</span>
      <code className="text-xs text-fd-muted-foreground">{slot}</code>
      {caption ? <figcaption className="sr-only">{caption}</figcaption> : null}
    </figure>
  );
}
