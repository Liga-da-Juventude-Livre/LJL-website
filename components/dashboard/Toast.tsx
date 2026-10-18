"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "./icons";

// Shows the message that arrives as ?ok=… after an action (see lib/flash.ts) for a few seconds, then removes it from
// the address so a refresh does not show it again.
export function Toast() {
  const params = useSearchParams();
  const pathname = usePathname();
  const incoming = params.get("ok");
  const [message, setMessage] = useState<string | null>(incoming);
  // A new message arrives with the next navigation; the address is cleaned right after, so keep it in state.
  if (incoming && incoming !== message) setMessage(incoming);

  useEffect(() => {
    if (!incoming) return;
    const next = new URLSearchParams(params.toString());
    next.delete("ok");
    history.replaceState(null, "", `${pathname}${next.size ? `?${next}` : ""}`);
    const t = setTimeout(() => setMessage(null), 5000);
    return () => clearTimeout(t);
    // `incoming` is the trigger; the rest only rebuilds the clean address.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incoming]);

  if (!message) return null;
  return (
    <div className="dash-toast" role="status">
      <Icon name="check" size={18} />
      <span>{message}</span>
      <button type="button" onClick={() => setMessage(null)} aria-label="Fechar aviso">
        <Icon name="close" size={16} />
      </button>
    </div>
  );
}
