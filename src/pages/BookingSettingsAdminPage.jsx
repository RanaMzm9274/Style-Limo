import React, { useEffect, useState } from "react";
import {
  CalendarCog,
  CarFront,
  Check,
  LayoutDashboard,
  LogOut,
  Save,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { refreshBookingSettingsCache } from "../hooks/useBookingSettings.js";
const api = async (url, options) => {
  const response = await fetch(url, options);
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || "Something went wrong.");
  return body;
};
export default function BookingSettingsAdminPage() {
  const navigate = useNavigate(),
    [state, setState] = useState({ loading: true, user: null, settings: null }),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const auth = await api("/api/auth/status");
        if (!auth.authenticated) return navigate("/admin", { replace: true });
        const settings = await api("/api/admin/booking-settings");
        setState({ loading: false, user: auth.user, settings });
      } catch {
        navigate("/admin", { replace: true });
      }
    })();
  }, [navigate]);
  if (state.loading)
    return <main className="admin-loading">LOADING BOOKING SETTINGS…</main>;
  const set = (key, value) =>
    setState((current) => ({
      ...current,
      settings: { ...current.settings, [key]: value },
    }));
  const save = async (event) => {
    event.preventDefault();
    setBusy(true);
    setNotice(null);
    try {
      const settings = await api("/api/admin/booking-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state.settings),
      });
      refreshBookingSettingsCache(settings);
      setState((current) => ({ ...current, settings }));
      setNotice({
        type: "success",
        text: "Booking details published successfully.",
      });
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    } finally {
      setBusy(false);
    }
  };
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    navigate("/admin", { replace: true });
  };
  const fields = [
    ["kicker", "Section label"],
    ["titleLine1", "Title — first line"],
    ["titleLine2", "Title — second line"],
    ["intro", "Introductory copy"],
    ["confirmationKicker", "Confirmation label"],
    ["confirmationTitleLine1", "Confirmation title — first line"],
    ["confirmationTitleLine2", "Confirmation title — second line"],
    ["confirmationMessage", "Confirmation message"],
  ];
  return (
    <div className="admin-app">
      <aside className="admin-sidebar">
        <Link to="/" className="admin-logo">
          STYLE <span>EXPRESS</span> LIMO
        </Link>
        <nav aria-label="Admin sections">
          <Link to="/admin">
            <LayoutDashboard size={18} /> Homepage banner
          </Link>
          <Link to="/admin/fleet">
            <CarFront size={18} /> Fleet catalog
          </Link>
          <Link className="active" to="/admin/booking-settings">
            <CalendarCog size={18} /> Booking details
          </Link>
        </nav>
        <div className="admin-user">
          <span>{state.user.email}</span>
          <button onClick={logout}>
            <LogOut size={16} /> SIGN OUT
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <header className="admin-header">
          <div>
            <p className="admin-kicker">CONTENT / BOOKING</p>
            <h1>Booking details</h1>
            <p>
              Control customer-facing booking options, rules and confirmation
              copy.
            </p>
          </div>
          <Link to="/booking" target="_blank">
            VIEW BOOKING ↗
          </Link>
        </header>
        <form className="admin-form" onSubmit={save}>
          <section className="admin-card">
            <div className="admin-card-head">
              <span>01</span>
              <div>
                <h2>Page content</h2>
                <p>All fields marked with an asterisk are required.</p>
              </div>
            </div>
            <div className="admin-fields booking-settings-fields">
              {fields.map(([key, label]) => (
                <label
                  className={
                    ["intro", "confirmationMessage"].includes(key) ? "wide" : ""
                  }
                  key={key}
                >
                  {label} *
                  <input
                    required
                    maxLength={
                      key.includes("Message") || key === "intro" ? 240 : 70
                    }
                    value={state.settings[key]}
                    onChange={(event) => set(key, event.target.value)}
                  />
                </label>
              ))}
            </div>
          </section>
          <section className="admin-card">
            <div className="admin-card-head">
              <span>02</span>
              <div>
                <h2>Options and rules</h2>
                <p>Use one item per line. Empty items are ignored.</p>
              </div>
            </div>
            <div className="admin-fields booking-settings-fields">
              <label>
                Minimum notice (days)
                <input
                  required
                  type="number"
                  min="0"
                  max="365"
                  value={state.settings.minimumNoticeDays}
                  onChange={(event) =>
                    set("minimumNoticeDays", Number(event.target.value))
                  }
                />
              </label>
              <div />
              <label>
                Services *
                <textarea
                  required
                  rows="7"
                  value={state.settings.services.join("\n")}
                  onChange={(event) =>
                    set("services", event.target.value.split("\n"))
                  }
                />
              </label>
              <label>
                Durations *
                <textarea
                  required
                  rows="7"
                  value={state.settings.durations.join("\n")}
                  onChange={(event) =>
                    set("durations", event.target.value.split("\n"))
                  }
                />
              </label>
            </div>
          </section>
          <div className="admin-savebar">
            <div>
              {notice && (
                <span className={notice.type} role="status">
                  {notice.type === "success" && <Check size={15} />}{" "}
                  {notice.text}
                </span>
              )}
            </div>
            <button className="admin-primary" disabled={busy}>
              <Save size={17} />
              {busy ? "PUBLISHING…" : "PUBLISH BOOKING DETAILS"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
