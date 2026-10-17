/** Plain GET form: it works without JavaScript, and /verify turns the code into /verify/<code>. */
export function VerifyForm({ defaultValue = "", error }: { defaultValue?: string; error?: boolean }) {
  return (
    <form action="/verify" method="get" className="verify-form">
      <label htmlFor="code" className="sr-only">
        Código do certificado
      </label>
      <input
        id="code"
        name="code"
        defaultValue={defaultValue}
        className="verify-input"
        placeholder="LJL-XXXX-XXXX-XXXX"
        autoComplete="off"
        autoCapitalize="characters"
        spellCheck={false}
        required
        aria-invalid={error || undefined}
        aria-describedby={error ? "verify-error" : undefined}
      />
      <button type="submit" className="btn btn-yellow">
        Verificar
      </button>
      {error && (
        <p id="verify-error" className="verify-error" role="alert">
          Esse código não tem o formato certo. Ele começa com LJL e tem mais 12 letras e números, como LJL-7K2M-QX4D-9HWB.
        </p>
      )}
    </form>
  );
}
