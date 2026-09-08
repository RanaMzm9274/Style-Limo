import React, { useEffect, useRef, useState } from "react";
import {
  CarFront,
  Check,
  ImagePlus,
  LayoutDashboard,
  LogOut,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { refreshFleetCache } from "../hooks/useFleet.js";

const api = async (url, options) => {
  const response = await fetch(url, options);
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || "Something went wrong.");
  return body;
};
const blank = () => ({
  id: crypto.randomUUID(),
  brand: "",
  name: "",
  categories: [],
  variations: [],
  colors: [],
  model: "",
  engineCapacity: "",
  power: "",
  topSpeed: "",
  acceleration: "",
  price: "",
  image: "",
  available: true,
});
export default function FleetAdminPage() {
  const navigate = useNavigate(),
    fileRefs = useRef([]);
  const [state, setState] = useState({
    loading: true,
    user: null,
    fleet: null,
  });
  const [files, setFiles] = useState({}),
    [open, setOpen] = useState(null),
    [category, setCategory] = useState(""),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const auth = await api("/api/auth/status");
        if (!auth.authenticated) return navigate("/admin", { replace: true });
        const fleet = await api("/api/admin/fleet");
        setState({ loading: false, user: auth.user, fleet });
        setOpen(fleet.vehicles[0]?.id);
      } catch {
        navigate("/admin", { replace: true });
      }
    })();
  }, [navigate]);
  if (state.loading)
    return <main className="admin-loading">LOADING FLEET…</main>;
  const setFleet = (updater) =>
    setState((current) => ({
      ...current,
      fleet: typeof updater === "function" ? updater(current.fleet) : updater,
    }));
  const updateCar = (id, key, value) =>
    setFleet((fleet) => ({
      ...fleet,
      vehicles: fleet.vehicles.map((car) =>
        car.id === id ? { ...car, [key]: value } : car,
      ),
    }));
  const addCategory = () => {
    const normalized = category.trim().toUpperCase();
    if (!normalized) return;
    if (!state.fleet.categories.includes(normalized))
      setFleet((fleet) => ({
        ...fleet,
        categories: [...fleet.categories, normalized],
      }));
    setCategory("");
  };
  const removeCategory = (name) =>
    setFleet((fleet) => ({
      ...fleet,
      categories: fleet.categories.filter((item) => item !== name),
      vehicles: fleet.vehicles.map((car) => ({
        ...car,
        categories: car.categories.filter((item) => item !== name),
      })),
    }));
  const addCar = () => {
    const car = blank();
    setFleet((fleet) => ({ ...fleet, vehicles: [...fleet.vehicles, car] }));
    setOpen(car.id);
  };
  const removeCar = (id) => {
    if (state.fleet.vehicles.length === 1)
      return setNotice({
        type: "error",
        text: "At least one vehicle is required.",
      });
    if (!confirm("Remove this vehicle from the fleet?")) return;
    setFleet((fleet) => ({
      ...fleet,
      vehicles: fleet.vehicles.filter((car) => car.id !== id),
    }));
  };
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    navigate("/admin", { replace: true });
  };
  const save = async (event) => {
    event.preventDefault();
    setBusy(true);
    setNotice(null);
    const form = new FormData();
    form.append("fleet", JSON.stringify(state.fleet));
    Object.entries(files).forEach(([id, file]) => {
      const index = state.fleet.vehicles.findIndex((car) => car.id === id);
      if (index >= 0 && file) form.append(`image_${index}`, file);
    });
    try {
      const fleet = await api("/api/admin/fleet", {
        method: "PUT",
        body: form,
      });
      refreshFleetCache(fleet);
      setState((current) => ({ ...current, fleet }));
      setFiles({});
      fileRefs.current.forEach((input) => {
        if (input) input.value = "";
      });
      setNotice({ type: "success", text: "Fleet published successfully." });
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    } finally {
      setBusy(false);
    }
  };
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
          <Link className="active" to="/admin/fleet">
            <CarFront size={18} /> Fleet catalog
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
            <p className="admin-kicker">CONTENT / FLEET</p>
            <h1>Fleet catalog</h1>
            <p>
              Manage categories and every detail displayed across Fleet and
              Booking.
            </p>
          </div>
          <Link to="/fleet" target="_blank">
            VIEW FLEET ↗
          </Link>
        </header>
        <form className="admin-form" onSubmit={save}>
          <section className="admin-card">
            <div className="admin-card-head">
              <span>01</span>
              <div>
                <h2>Categories</h2>
                <p>Create filters and assign one or more to each vehicle.</p>
              </div>
            </div>
            <div className="category-editor">
              {state.fleet.categories.map((item) => (
                <span key={item}>
                  {item}
                  <button
                    type="button"
                    aria-label={`Remove ${item}`}
                    onClick={() => removeCategory(item)}
                  >
                    <Trash2 size={14} />
                  </button>
                </span>
              ))}
              <div>
                <input
                  aria-label="New category"
                  placeholder="NEW CATEGORY"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCategory();
                    }
                  }}
                />
                <button type="button" onClick={addCategory}>
                  <Plus size={16} /> ADD
                </button>
              </div>
            </div>
          </section>
          <section className="admin-card">
            <div className="admin-card-head fleet-card-heading">
              <span>02</span>
              <div>
                <h2>Vehicles</h2>
                <p>{state.fleet.vehicles.length} vehicles in the catalog.</p>
              </div>
              <button type="button" onClick={addCar}>
                <Plus size={16} /> NEW VEHICLE
              </button>
            </div>
            <div className="fleet-admin-list">
              {state.fleet.vehicles.map((car, index) => (
                <article
                  className={`fleet-admin-item ${open === car.id ? "open" : ""}`}
                  key={car.id}
                >
                  <button
                    type="button"
                    className="fleet-item-summary"
                    onClick={() => setOpen(open === car.id ? null : car.id)}
                    aria-expanded={open === car.id}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <small>{car.brand || "BRAND REQUIRED"}</small>
                      <b>{car.name || "UNTITLED VEHICLE"}</b>
                    </div>
                    <em>{car.categories.join(" · ") || "NO CATEGORY"}</em>
                    <strong>{open === car.id ? "CLOSE" : "EDIT"}</strong>
                  </button>
                  {open === car.id && (
                    <div className="fleet-item-body">
                      <div className="fleet-image-editor">
                        <img
                          src={
                            files[car.id]
                              ? URL.createObjectURL(files[car.id])
                              : car.image || "/favicon.svg"
                          }
                          alt="Vehicle preview"
                        />
                        <label>
                          <input
                            ref={(el) => (fileRefs.current[index] = el)}
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/avif"
                            onChange={(e) =>
                              setFiles((current) => ({
                                ...current,
                                [car.id]: e.target.files[0],
                              }))
                            }
                          />
                          <ImagePlus size={17} />{" "}
                          {files[car.id] ? "IMAGE SELECTED" : "UPLOAD IMAGE"}
                        </label>
                        <label className="url-field">
                          OR IMAGE URL
                          <input
                            type="url"
                            value={car.image}
                            onChange={(e) =>
                              updateCar(car.id, "image", e.target.value)
                            }
                          />
                        </label>
                      </div>
                      <div className="fleet-detail-fields">
                        <label>
                          Brand *
                          <input
                            required
                            value={car.brand}
                            onChange={(e) =>
                              updateCar(car.id, "brand", e.target.value)
                            }
                          />
                        </label>
                        <label>
                          Vehicle name *
                          <input
                            required
                            value={car.name}
                            onChange={(e) =>
                              updateCar(car.id, "name", e.target.value)
                            }
                          />
                        </label>
                        <label>
                          Model / trim *
                          <input
                            required
                            value={car.model}
                            onChange={(e) =>
                              updateCar(car.id, "model", e.target.value)
                            }
                          />
                        </label>
                        <label>
                          Engine capacity *
                          <input
                            required
                            placeholder="4.0L V8"
                            value={car.engineCapacity}
                            onChange={(e) =>
                              updateCar(
                                car.id,
                                "engineCapacity",
                                e.target.value,
                              )
                            }
                          />
                        </label>
                        <label>
                          Power
                          <input
                            placeholder="510 PS"
                            value={car.power}
                            onChange={(e) =>
                              updateCar(car.id, "power", e.target.value)
                            }
                          />
                        </label>
                        <label>
                          Top speed *
                          <input
                            required
                            placeholder="198 MPH"
                            value={car.topSpeed}
                            onChange={(e) =>
                              updateCar(car.id, "topSpeed", e.target.value)
                            }
                          />
                        </label>
                        <label>
                          0–62 time *
                          <input
                            required
                            placeholder="3.4 SEC"
                            value={car.acceleration}
                            onChange={(e) =>
                              updateCar(car.id, "acceleration", e.target.value)
                            }
                          />
                        </label>
                        <label>
                          Price per day *
                          <input
                            required
                            placeholder="495 or POA"
                            value={car.price}
                            onChange={(e) =>
                              updateCar(car.id, "price", e.target.value)
                            }
                          />
                        </label>
                        <label className="wide">
                          Variations <span>comma separated</span>
                          <input
                            value={car.variations.join(", ")}
                            onChange={(e) =>
                              updateCar(
                                car.id,
                                "variations",
                                e.target.value
                                  .split(",")
                                  .map((value) => value.trim())
                                  .filter(Boolean),
                              )
                            }
                          />
                        </label>
                        <label className="wide">
                          Colors <span>comma separated</span>
                          <input
                            value={car.colors.join(", ")}
                            onChange={(e) =>
                              updateCar(
                                car.id,
                                "colors",
                                e.target.value
                                  .split(",")
                                  .map((value) => value.trim())
                                  .filter(Boolean),
                              )
                            }
                          />
                        </label>
                        <fieldset className="wide">
                          <legend>Categories *</legend>
                          {state.fleet.categories.map((item) => (
                            <label key={item}>
                              <input
                                type="checkbox"
                                checked={car.categories.includes(item)}
                                onChange={(e) =>
                                  updateCar(
                                    car.id,
                                    "categories",
                                    e.target.checked
                                      ? [...car.categories, item]
                                      : car.categories.filter(
                                          (value) => value !== item,
                                        ),
                                  )
                                }
                              />
                              {item}
                            </label>
                          ))}
                        </fieldset>
                        <label className="availability-toggle">
                          <input
                            type="checkbox"
                            checked={car.available}
                            onChange={(e) =>
                              updateCar(car.id, "available", e.target.checked)
                            }
                          />
                          <span /> Available for booking
                        </label>
                        <button
                          type="button"
                          className="delete-vehicle"
                          onClick={() => removeCar(car.id)}
                        >
                          <Trash2 size={16} /> REMOVE VEHICLE
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              ))}
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
              {busy ? "PUBLISHING…" : "PUBLISH FLEET"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
