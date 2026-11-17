import { NavLink } from "react-router-dom";
import { alertes } from "../data/demo.js";

const liens = [
  { to: "/", label: "Accueil", end: true },
  { to: "/production", label: "Production" },
  { to: "/alertes", label: "Alertes", compteur: alertes.length },
  { to: "/installations", label: "Installations" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo"><span className="logo-sun" />SolarAI</div>
      <nav className="nav">
        {liens.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end}>
            {l.label}
            {l.compteur ? <span className="nav-count">{l.compteur}</span> : null}
          </NavLink>
        ))}
      </nav>
      <div className="demo-note"><b>Données de démonstration</b>(simulées)</div>
    </aside>
  );
}
