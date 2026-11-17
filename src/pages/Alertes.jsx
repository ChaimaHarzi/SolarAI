import { useState } from "react";
import { Link } from "react-router-dom";
import { Topbar, Info, Badge } from "../components/ui.jsx";
import { alertes, fmt } from "../data/demo.js";

const FILTRES = ["Toutes", "Haute", "Moyenne", "Basse"];

export default function Alertes() {
  const [filtre, setFiltre] = useState("Toutes");
  const liste = filtre === "Toutes" ? alertes : alertes.filter((a) => a.priorite === filtre);
  const nb = (f) => (f === "Toutes" ? alertes.length : alertes.filter((a) => a.priorite === f).length);

  return (
    <>
      <Topbar titre="Alertes" />
      <div className="content">
        <div className="chips">
          {FILTRES.map((f) => (
            <button key={f} className={`chip${f === filtre ? " on" : ""}`} onClick={() => setFiltre(f)}>{f} ({nb(f)})</button>
          ))}
          <Info id="priorite" />
        </div>

        {liste.map((a, i) => (
          <section key={a.id} className={`card alert-card ${a.priorite}`}>
            <div>
              <Badge type={a.priorite}>Priorité {a.priorite.toLowerCase()}</Badge>
              <h3>{a.titre}</h3>
              <p>{a.description}</p>
              <div className="alert-meta">
                {a.depuis}
                {a.perte ? <> · Perte estimée : {fmt(a.perte)} kWh <Info id="perte" /></> : null}
              </div>
            </div>
            <Link to={`/alertes/${a.id}`} className={`btn${i === 0 ? " primary" : ""}`}>Voir le détail</Link>
          </section>
        ))}
        {liste.length === 0 && <p style={{ color: "var(--muted)" }}>Aucune alerte de ce niveau.</p>}

        <div className="note">Une alerte signale un écart anormal. Une inspection sur place est nécessaire avant de conclure à une panne.</div>
      </div>
    </>
  );
}
