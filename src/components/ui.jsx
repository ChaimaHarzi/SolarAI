import { AIDE, AUJOURDHUI, centrale } from "../data/demo.js";

// Barre du haut : titre de la page, centrale choisie, date
export function Topbar({ titre, selection = `${centrale.nom} · ${centrale.puissanceMW} MW` }) {
  return (
    <header className="topbar">
      <h1>{titre}</h1>
      <span className="select">{selection} ▾</span>
      <span className="date">{AUJOURDHUI}</span>
    </header>
  );
}

// Icône « i » : la bulle d'aide s'affiche au survol (ou au clavier avec Tab)
export function Info({ id, droite = false }) {
  const [titre, texte] = AIDE[id];
  return (
    <span className={`info${droite ? " droite" : ""}`}>
      <button type="button" className="info-btn" aria-label={`Aide : ${titre}`}>i</button>
      <span className="info-tip" role="tooltip"><b>{titre}</b>{texte}</span>
    </span>
  );
}

export function Card({ titre, info, droite, action, children, className = "" }) {
  return (
    <section className={`card ${className}`}>
      {(titre || action) && (
        <div className="card-head">
          {titre && <h2 className="card-title">{titre}{info && <Info id={info} droite={droite} />}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Badge({ type, children }) {
  return <span className={`badge ${type}`}>{children}</span>;
}

export function Legende({ reel = "Réel", prevu = "Prévu", couleur = "var(--amber)" }) {
  return (
    <div className="legend">
      <span><i style={{ background: couleur }} />{reel}</span>
      <span><i className="dash" />{prevu}</span>
    </div>
  );
}
