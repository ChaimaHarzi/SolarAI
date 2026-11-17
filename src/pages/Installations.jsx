import { useRef, useState } from "react";
import { Topbar, Card, Info, Badge } from "../components/ui.jsx";
import { centrales, fmt } from "../data/demo.js";

const COLONNES = ["date", "heure", "onduleur", "puissance"];

// Lit un fichier CSV et vérifie : colonnes attendues, nombre de lignes, valeurs manquantes
function verifierCsv(texte, nom) {
  const lignes = texte.split(/\r?\n/).filter((l) => l.trim() !== "");
  if (lignes.length === 0) return { nom, erreur: "Le fichier est vide." };
  const sep = lignes[0].includes(";") ? ";" : ",";
  const entetes = lignes[0].split(sep).map((h) => h.trim().toLowerCase().replace(/\s*\(.*\)/, ""));
  const manquantes = COLONNES.filter((c) => !entetes.includes(c));
  const idx = COLONNES.map((c) => entetes.indexOf(c));
  let vides = 0;
  lignes.slice(1).forEach((l) => {
    const cases = l.split(sep);
    idx.forEach((i) => { if (i >= 0 && (cases[i] === undefined || cases[i].trim() === "")) vides += 1; });
  });
  return { nom, lignes: lignes.length - 1, manquantes, vides };
}

export default function Installations() {
  const [survol, setSurvol] = useState(false);
  const [ajout, setAjout] = useState(false);
  const [resultat, setResultat] = useState({ nom: "production_nov.csv", lignes: 8064, manquantes: [], vides: 12, demo: true });
  const input = useRef(null);
  const totalMW = centrales.reduce((s, c) => s + c.mw, 0);

  const lire = (fichier) => {
    if (!fichier) return;
    const r = new FileReader();
    r.onload = () => setResultat(verifierCsv(String(r.result), fichier.name));
    r.readAsText(fichier);
  };

  return (
    <>
      <Topbar titre="Installations" selection="Toutes les centrales" />
      <div className="content">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <strong style={{ fontSize: 16 }}>{centrales.length} centrales · {totalMW} MW au total</strong>
          <div style={{ display: "flex", gap: 16 }}>
            <button className="btn" onClick={() => input.current?.click()}>Importer des données</button>
            <button className="btn primary" onClick={() => setAjout(!ajout)}>+ Ajouter une installation</button>
          </div>
        </div>

        {ajout && <div className="note">Le formulaire d'ajout d'une installation sera développé dans une prochaine version.</div>}

        <Card titre="Mes centrales">
          <table>
            <thead>
              <tr>
                <th>Centrale</th><th>Lieu</th>
                <th><span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>Puissance installée <Info id="puissance" /></span></th>
                <th>Onduleurs</th><th>Aujourd'hui (réel / prévu)</th><th>État</th>
              </tr>
            </thead>
            <tbody>
              {centrales.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600 }}>{c.nom}</td><td>{c.lieu}</td><td>{c.mw} MW</td><td>{c.onduleurs}</td>
                  <td>{fmt(c.reel)} / {fmt(c.prevu)} kWh</td>
                  <td>{c.alertes ? <Badge type="alerte">{c.alertes} alertes</Badge> : <Badge type="ok">OK</Badge>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card titre="Importer des données" info="csv">
          <div className="import-grid">
            <div
              className={`drop${survol ? " over" : ""}`}
              onClick={() => input.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setSurvol(true); }}
              onDragLeave={() => setSurvol(false)}
              onDrop={(e) => { e.preventDefault(); setSurvol(false); lire(e.dataTransfer.files[0]); }}
            >
              <strong>Glisse ton fichier CSV ici</strong>
              ou clique pour le choisir sur ton ordinateur
              <small>Colonnes attendues : date, heure, onduleur, puissance (kW)</small>
              <input ref={input} type="file" accept=".csv,text/csv" hidden onChange={(e) => lire(e.target.files[0])} />
            </div>

            <div>
              <strong>{resultat.demo ? "Dernier import" : "Résultat de l'import"}</strong>
              <div className="row-sub">{resultat.nom}{resultat.demo ? " · Centrale démo" : ""}</div>
              {resultat.erreur ? (
                <div className="status"><span className="dot err">×</span>{resultat.erreur}</div>
              ) : (
                <>
                  <div className="row-sub">{fmt(resultat.lignes)} lignes{resultat.demo ? " · du 11 au 17 nov." : ""}</div>
                  {resultat.manquantes.length === 0 ? (
                    <div className="status"><span className="dot ok">✓</span>Colonnes valides</div>
                  ) : (
                    <div className="status"><span className="dot err">×</span>Colonnes manquantes : {resultat.manquantes.join(", ")}</div>
                  )}
                  {resultat.vides > 0 ? (
                    <div className="status"><span className="dot warn">!</span>
                      <div>{resultat.vides} valeurs manquantes{resultat.demo && <div className="row-sub">Onduleur 1, le 17 nov. entre 14 h et 15 h</div>}</div>
                    </div>
                  ) : (
                    <div className="status"><span className="dot ok">✓</span>Aucune valeur manquante</div>
                  )}
                </>
              )}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
