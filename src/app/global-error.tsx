"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#fef8f3",
          color: "#1d1b19",
          padding: 24,
        }}
      >
        <h1 style={{ fontSize: 24, marginBottom: 8 }}>Saanjh</h1>
        <p style={{ fontSize: 14, opacity: 0.8, textAlign: "center" }}>
          {error.message || "Application error"}
        </p>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            marginTop: 24,
            padding: "12px 24px",
            borderRadius: 9999,
            border: "none",
            background: "#8b4e3c",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
