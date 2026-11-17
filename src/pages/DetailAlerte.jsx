import { useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from "recharts";
import { Topbar, Card, Info, Badge, Legende } from "../components/ui.jsx";
import { alertes, fmt } from "../data/demo.js";

export default function DetailAlerte() {
  const { id } = useParams();
  const a = alertes.find((x) => x.id === id);
  const [faits, setFaits] = useState({});
  const [verifiee, setVerifiee] = useState(false);
  const [rapport, setRapport] = useState(null);
  const [copie, setCopie] = useState(false);
  if (!a) return <Navigate to="/alertes" />;

  const exporter = () => {
    const lignes = [
      `Alerte : ${a.titre}`, `Priorité : ${a.priorite}`, `${a.depuis}`,
      a.perte ? `Perte estimée : ${fmt(a.perte)} kWh` : "", `Score d'anomalie : ${a.score}`, "",
      "Ce qui se passe :", ...a.explication, "", "Quoi vérifier :",
      ...a.verifications.map((v, i) => `${faits[i] ? "[x]" : "[ ]"} ${v}`), "",
      "Données de démonstration (simulées).",
    ].filter((l, i, arr) => l !== "" || arr[i - 1] !== "");
    setRapport(lignes.join("\n"));
    setCopie(false);
  };

  const telecharger = () => {
    const blob = new Blob([rapport], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const lien = document.createElement("a");
    lien.href = url; lien.download = `rapport_${a.id}.txt`; lien.click();
    URL.revokeObjectURL(url);
  };

  const copier = async () => {
    try { await navigator.clipboard.writeText(rapport); setCopie(true); } catch { setCopie(false); }
  };

  return (
    <>
      <Topbar titre="Détail de l'alerte" />
      <div className="content">
        <div className="breadcrumb"><Link to="/alertes">Alertes</Link> / {a.titre.split(" :")[0]}</div>

        <Card>
          <Badge type={a.priorite}>Priorité {a.priorite.toLowerCase()}</Badge>
          <h2 style={{ fontSize: 22, margin: "14px 0 8px" }}>{a.titre}</h2>
          <div className="row-sub" style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            {a.depuis}
            {a.perte ? <> · Perte estimée : {fmt(a.perte)} kWh <Info id="perte" /></> : null}
            {" "}· Score d'anomalie : {String(a.score).replace(".", ",")} sur 1 <Info id="score" />
          </div>
        </Card>

        {verifiee && <div className="done-banner">✓ Alerte marquée comme vérifiée.</div>}

        {rapport && (
          <Card titre="Rapport de l'alerte" action={
            <div style={{ display: "flex", gap: 12 }}>
              <button className="btn" onClick={copier}>{copie ? "Copié ✓" : "Copier"}</button>
              <button className="btn" onClick={telecharger}>Télécharger (.txt)</button>
              <button className="btn" onClick={() => setRapport(null)}>Fermer</button>
            </div>}>
            <pre style={{ whiteSpace: "pre-wrap", margin: 0, fontFamily: "inherit", color: "var(--muted)" }}>{rapport}</pre>
          </Card>
        )}

        <div className="grid-main">
          <div style={{ display: "grid", gap: 24 }}>
            <Card titre="Ce qui se passe">
              {a.explication.map((t) => <p key={t} style={{ margin: "0 0 6px", fontSize: 15 }}>{t}</p>)}
            </Card>
            {a.comparaison && (
              <Card titre={`${a.nomCourbe} comparé aux autres (7 jours)`} action={<Legende reel={a.nomCourbe} prevu="Moyenne des autres" couleur="var(--red)" />}>
                <div className="unit">kWh</div>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={a.comparaison} margin={{ top: 10, right: 16, left: 10, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="var(--grid)" />
                    <ReferenceArea x1="16 nov." x2="17 nov." fill="var(--red-soft)" fillOpacity={0.6} />
                    <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#6b7480", fontSize: 12 }} />
                    <YAxis domain={[1500, 3000]} ticks={[1500, 2000, 2500, 3000]} tickFormatter={fmt} tickLine={false} axisLine={false} tick={{ fill: "#6b7480", fontSize: 12 }} width={56} />
                    <Tooltip formatter={(v, n) => [`${fmt(v)} kWh`, n === "onduleur" ? a.nomCourbe : "Moyenne des autres"]} />
                    <Line type="linear" dataKey="autres" stroke="var(--blue)" strokeWidth={2} strokeDasharray="6 5" dot={false} />
                    <Line type="linear" dataKey="onduleur" stroke="var(--red)" strokeWidth={3} dot={{ r: 4, fill: "var(--red)" }} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            )}
          </div>

          <div style={{ display: "grid", gap: 24 }}>
            <Card titre="Pourquoi cette alerte ?">
              {a.raisons.map((r) => (
                <div className="kv" key={r.k}>
                  <span>{r.k}{r.info && <Info id={r.info} droite />}</span>
                  <span className={r.ton || ""}>{r.v}</span>
                </div>
              ))}
            </Card>
            <Card titre="Quoi vérifier ?">
              {a.verifications.map((v, i) => (
                <label key={v} className={`check${faits[i] ? " fait" : ""}`}>
                  <input type="checkbox" checked={!!faits[i]} onChange={() => setFaits({ ...faits, [i]: !faits[i] })} />
                  <span>{v}</span>
                </label>
              ))}
              <p style={{ margin: "14px 0 0", fontSize: 13 }}>
                <b style={{ color: "var(--link)" }}>À confirmer par un technicien</b><br />
                <span style={{ color: "var(--muted)" }}>avant de conclure à une panne.</span>
              </p>
            </Card>
            <div style={{ display: "flex", gap: 16 }}>
              <button className="btn primary" style={{ flex: 1 }} onClick={() => setVerifiee(true)} disabled={verifiee}>
                {verifiee ? "Vérifiée ✓" : "Marquer vérifiée"}
              </button>
              <button className="btn" style={{ flex: 1 }} onClick={exporter}>Exporter</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
