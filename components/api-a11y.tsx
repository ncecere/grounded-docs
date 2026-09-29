'use client';
import { useEffect } from 'react';

/**
 * The generated API reference has select buttons (media types, examples)
 * with no accessible name: a combobox doesn't take its name from its content.
 * Name each one after what it selects (WCAG 4.1.2).
 */
export function ApiA11y() {
  useEffect(() => {
    const label = () => {
      for (const el of document.querySelectorAll<HTMLElement>('#nd-page [role="combobox"]:not([aria-labelledby])')) {
        if (el.hasAttribute('aria-label') && !el.hasAttribute('data-api-a11y')) continue;
        const value = el.textContent?.trim() ?? '';
        const name = value.includes('/') ? `Media type: ${value}` : `Example: ${value || 'choose'}`;
        if (el.getAttribute('aria-label') !== name) el.setAttribute('aria-label', name);
        el.setAttribute('data-api-a11y', '');
      }
    };
    label();
    const observer = new MutationObserver(label);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, []);
  return null;
}
