"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { IMAGE_TYPES, MAX_IMAGE_BYTES, type MediaScope } from "@/lib/media";

// Picks an image, uploads it straight to Vercel Blob and puts the resulting address in a hidden input, so the surrounding
// form saves it with everything else. `initialUrl` is the already-saved image; `name` is the form field.
export function ImageUpload({
  name,
  scope,
  initialUrl,
  enabled,
  label = "Imagem",
  serverError,
}: {
  name: string;
  scope: MediaScope;
  initialUrl: string;
  /** False when Blob is not configured; the control then explains instead of failing on click. */
  enabled: boolean;
  label?: string;
  /** The form action's error for this field, if the last save was refused. */
  serverError?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(initialUrl);
  const [preview, setPreview] = useState<string | null>(initialUrl || null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  async function pick(file: File | undefined) {
    if (!file) return;
    setError(undefined);
    if (!(file.type in IMAGE_TYPES)) return setError("Use uma imagem JPEG, PNG ou WebP.");
    if (file.size > MAX_IMAGE_BYTES) return setError("A imagem passa de 5 MB. Reduza e tente de novo.");
    setBusy(true);
    try {
      const ext = IMAGE_TYPES[file.type as keyof typeof IMAGE_TYPES];
      const blob = await upload(`${scope}/${crypto.randomUUID()}.${ext}`, file, { access: "public", handleUploadUrl: "/dashboard/api/uploads", contentType: file.type });
      setUrl(blob.url);
      setPreview(URL.createObjectURL(file));
    } catch (e) {
      setError(e instanceof Error && e.message ? e.message : "Não foi possível enviar a imagem. Verifique a conexão e tente de novo.");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div className="dash-upload">
      <input type="hidden" name={name} value={url} />
      <div className="dash-upload-box">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element -- a local blob or a Blob address; a plain preview is enough
          <img src={preview} alt="" className="dash-upload-img" />
        ) : (
          <span className="dash-upload-empty">Sem imagem</span>
        )}
      </div>
      <div className="dash-upload-side">
        <span className="dash-label">{label}</span>
        <div className="dash-upload-actions">
          <button type="button" className="dash-btn dash-btn-ghost dash-btn-sm" disabled={!enabled || busy} onClick={() => input.current?.click()}>
            {busy ? "Enviando…" : preview ? "Trocar imagem" : "Escolher imagem"}
          </button>
          {preview && !busy && (
            <button
              type="button"
              className="dash-btn dash-btn-ghost dash-btn-sm"
              onClick={() => {
                setUrl("");
                setPreview(null);
              }}
            >
              Remover
            </button>
          )}
        </div>
        <input ref={input} type="file" accept={Object.keys(IMAGE_TYPES).join(",")} hidden onChange={(e) => pick(e.target.files?.[0])} />
        <p className="dash-field-hint">{enabled ? "JPEG, PNG ou WebP, até 5 MB. A imagem só vale depois de salvar." : "O armazenamento de imagens ainda não foi configurado (veja o README)."}</p>
        {(error ?? serverError) && (
          <p className="dash-field-error" role="alert">
            {error ?? serverError}
          </p>
        )}
      </div>
    </div>
  );
}
