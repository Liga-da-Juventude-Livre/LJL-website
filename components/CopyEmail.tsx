"use client";

import { useRef, useState } from "react";

// Shows the address as text and copies it on click; if the clipboard is refused, selects the text instead.
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      const sel = getSelection();
      const range = document.createRange();
      range.selectNodeContents(textRef.current!);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  };

  return (
    <div className="copy-email" style={{ "--chars": email.length } as React.CSSProperties}>
      <span ref={textRef} className="copy-email-text">
        {email}
      </span>
      <button
        type="button"
        className={`copy-email-btn${copied ? " is-copied" : ""}`}
        onClick={copy}
        aria-label={copied ? "E-mail copiado" : "Copiar e-mail"}
      >
        <svg className="copy-email-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {copied ? (
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          ) : (
            <>
              <rect x="9" y="9" width="11" height="11" rx="2.5" />
              <path d="M5 15V6.5A2.5 2.5 0 0 1 7.5 4H15" />
            </>
          )}
        </svg>
        <span className="copy-email-label">{copied ? "Copiado" : "Copiar"}</span>
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? "E-mail copiado" : ""}
      </span>
    </div>
  );
}
