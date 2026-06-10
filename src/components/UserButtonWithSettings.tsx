"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useEffect } from "react";
import { Check, Bell } from "lucide-react";

// ── Settings form — rendered inside Clerk's UserProfilePage ──────────────────
function NotificationSettings() {
  const me = useQuery(api.users.getMe);
  const updateSettings = useMutation(api.users.updateSettings);

  const [phone, setPhone] = useState("");
  const [notifyVia, setNotifyVia] = useState<"email" | "phone" | "both">("email");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Populate form once user data loads
  useEffect(() => {
    if (me) {
      setPhone(me.phone ?? "");
      setNotifyVia(me.notifyVia ?? "email");
    }
  }, [me]);

  // Format phone as user types: strip non-digits, apply XX XXXX-XXXX pattern
  function handlePhoneChange(raw: string) {
    const digits = raw.replace(/\D/g, "").slice(0, 11);
    setPhone(digits);
  }

  function formatDisplay(digits: string) {
    if (digits.length === 0) return "";
    if (digits.length <= 2) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
    return `${digits.slice(0, 2)} ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (phone && phone.length < 10) {
      setError("El número debe tener al menos 10 dígitos.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await updateSettings({
        phone: phone.length >= 10 ? phone : undefined,
        notifyVia,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("No se pudo guardar. Intentá de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  if (me === undefined) {
    return (
      <div style={{ padding: "24px 0" }}>
        <div style={{ width: 160, height: 16, borderRadius: 8, background: "var(--line)", marginBottom: 12 }} />
        <div style={{ width: 240, height: 44, borderRadius: 12, background: "var(--line)" }} />
      </div>
    );
  }

  const options: { value: "email" | "phone" | "both"; label: string; icon: string; desc: string }[] = [
    { value: "email",  label: "Email",    icon: "✉️", desc: me?.email ?? "" },
    { value: "phone",  label: "Teléfono", icon: "📱", desc: phone ? `+54 ${formatDisplay(phone)}` : "Ingresá tu número abajo" },
    { value: "both",   label: "Ambos",    icon: "🔔", desc: "Email y teléfono" },
  ];

  return (
    <form onSubmit={handleSave} style={{ fontFamily: "var(--pc-font-sans)", padding: "4px 0 24px" }}>
      <h2 style={{
        fontFamily: "var(--pc-font-display)",
        fontWeight: 700,
        fontSize: 20,
        color: "var(--ink)",
        letterSpacing: "-0.02em",
        marginBottom: 4,
      }}>
        Notificaciones
      </h2>
      <p style={{ fontSize: 14, color: "var(--ink-soft)", marginBottom: 28, lineHeight: 1.5 }}>
        Elegí por dónde querés que te avisemos cuando hay novedades en tus pedidos.
      </p>

      {/* Notification channel */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", marginBottom: 12 }}>
          Recibir avisos por
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {options.map((opt) => {
            const active = notifyVia === opt.value;
            return (
              <label
                key={opt.value}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 16px",
                  borderRadius: 14,
                  border: `1.5px solid ${active ? "var(--teal)" : "var(--line)"}`,
                  background: active ? "var(--teal-tint)" : "var(--surface)",
                  cursor: "pointer",
                  transition: "border-color .15s, background .15s",
                }}
              >
                <input
                  type="radio"
                  name="notifyVia"
                  value={opt.value}
                  checked={active}
                  onChange={() => setNotifyVia(opt.value)}
                  style={{ display: "none" }}
                />
                <span style={{ fontSize: 20, flexShrink: 0 }}>{opt.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, fontSize: 14, color: "var(--ink)", margin: 0 }}>{opt.label}</p>
                  <p style={{ fontSize: 12, color: "var(--muted)", margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {opt.desc}
                  </p>
                </div>
                <div style={{
                  width: 20, height: 20, borderRadius: "50%",
                  border: `2px solid ${active ? "var(--teal)" : "var(--line-2)"}`,
                  background: active ? "var(--teal)" : "transparent",
                  display: "grid", placeItems: "center", flexShrink: 0, transition: "all .15s",
                }}>
                  {active && (
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />
                  )}
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Phone number */}
      <div style={{ marginBottom: 28 }}>
        <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", marginBottom: 12 }}>
          Número de teléfono
        </label>
        <div style={{ display: "flex", alignItems: "center", border: `1.5px solid var(--line-2)`, borderRadius: 14, overflow: "hidden", background: "var(--surface)", transition: "border-color .15s" }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--teal)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--line-2)")}
        >
          <div style={{
            padding: "0 14px",
            borderRight: `1px solid var(--line)`,
            height: 48,
            display: "flex", alignItems: "center",
            fontSize: 14, fontWeight: 600, color: "var(--ink-soft)",
            background: "var(--bg-2)", flexShrink: 0,
          }}>
            🇦🇷 +54
          </div>
          <input
            type="tel"
            value={formatDisplay(phone)}
            onChange={(e) => handlePhoneChange(e.target.value)}
            placeholder="11 1234-5678"
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              padding: "0 14px",
              height: 48,
              fontSize: 15,
              color: "var(--ink)",
              background: "transparent",
              fontFamily: "var(--pc-font-sans)",
            }}
          />
        </div>
        <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>
          Solo para avisarte sobre tus pedidos. No lo compartimos con nadie.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          background: "var(--red-tint)", border: "1px solid #f5c6c0", borderRadius: 12,
          padding: "12px 14px", fontSize: 13, color: "var(--red)", marginBottom: 16,
        }}>
          {error}
        </div>
      )}

      {/* Save button */}
      <button
        type="submit"
        disabled={saving}
        style={{
          width: "100%",
          background: saved ? "var(--green)" : "var(--teal)",
          color: "#fff",
          border: "none",
          borderRadius: 999,
          padding: "13px 22px",
          fontSize: 15,
          fontWeight: 600,
          fontFamily: "var(--pc-font-sans)",
          cursor: saving ? "not-allowed" : "pointer",
          opacity: saving ? 0.7 : 1,
          transition: "background .2s, opacity .2s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        {saved ? (
          <>
            <Check className="w-4 h-4" strokeWidth={2.5} />
            ¡Guardado!
          </>
        ) : saving ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
}

// ── Bell icon for the sidebar ────────────────────────────────────────────────
function BellIcon() {
  return <Bell className="w-4 h-4" />;
}

// ── Exported wrapper ─────────────────────────────────────────────────────────
export function UserButtonWithSettings() {
  return (
    <UserButton>
      <UserButton.UserProfilePage
        label="Notificaciones"
        url="notificaciones"
        labelIcon={<BellIcon />}
      >
        <NotificationSettings />
      </UserButton.UserProfilePage>
    </UserButton>
  );
}
