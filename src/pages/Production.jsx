import { useState } from "react";
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Topbar, Card, Info, Badge, Legende } from "../components/ui.jsx";
import { onduleurs, productionJour, productionSemaine, productionMois, totalJour, fmt, ecartPct, signe } from "../data/demo.js";

const PERIODES = {
  Jour: { data: productionJour, titre: "Production heure par heure — aujourd'hui", unite: "kW", info: "kw" },
  Semaine: { data: productionSemaine, titre: "Production jour par jour — 7 derniers jours", unite: "kWh", info: "kwh" },
  Mois: { data: productionMois, titre: "Production jour par jour — 30 derniers jours", unite: "kWh", info: "kwh" },
};

export default function Production() {
  const [periode, setPeriode] = useState("Jour");
  const p = PERIODES[periode];
  const total = onduleurs.reduce((s, o) => ({ produit: s.produit + o.produit, prevu: s.prevu + o.prevu }), { produit: 0, prevu: 0 });

  return (
    <>
      <Topbar titre="Production" />
      <div className="content">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div className="tabs">
            {Object.keys(PERIODES).map((k) => (
              <button key={k} className={k === periode ? "on" : ""} onClick={() => setPeriode(k)}>{k}</button>
            ))}
          </div>
          <strong>Aujourd'hui : {fmt(totalJour.produit)} kWh produits sur {fmt(totalJour.prevu)} kWh prévus</strong>
        </div>

        <Card titre={p.titre} info={p.info} action={<Legende />}>
          <div className="unit">{p.unite}</div>
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={p.data} margin={{ top: 10, right: 16, left: 10, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--grid)" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#6b7480", fontSize: 12 }} interval={periode === "Mois" ? 4 : periode === "Jour" ? 1 : 0} />
              <YAxis tickFormatter={fmt} tickLine={false} axisLine={false} tick={{ fill: "#6b7480", fontSize: 12 }} width={56} />
              <Tooltip formatter={(v, n) => [`${fmt(v)} ${p.unite}`, n === "reel" ? "Réel" : "Prévu"]} />
              <Area type="monotone" dataKey="reel" stroke="var(--amber)" strokeWidth={3} fill="var(--amber)" fillOpacity={0.15} />
              <Line type="monotone" dataKey="prevu" stroke="var(--blue)" strokeWidth={2} strokeDasharray="6 5" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>

        <Card titre="Détail par onduleur (aujourd'hui)" info="onduleur">
          <table>
            <thead>
              <tr><th>Onduleur</th><th>Produit</th><th>Prévu</th><th><span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>Écart <Info id="ecart" /></span></th><th>État</th></tr>
            </thead>
            <tbody>
              {onduleurs.map((o) => {
                const e = ecartPct(o.produit, o.prevu);
                return (
                  <tr key={o.id}>
                    <td>{o.nom}</td>
                    <td>{fmt(o.produit)} kWh</td>
                    <td style={{ color: "var(--muted)" }}>{fmt(o.prevu)} kWh</td>
                    <td className={e <= -20 ? "rouge" : ""} style={{ fontWeight: e <= -20 ? 600 : 400 }}>{signe(e)} %</td>
                    <td>{e <= -20 ? <Badge type="alerte">Alerte</Badge> : <Badge type="ok">OK</Badge>}</td>
                  </tr>
                );
              })}
              <tr className="total">
                <td>Total centrale</td><td>{fmt(total.produit)} kWh</td>
                <td style={{ color: "var(--muted)" }}>{fmt(total.prevu)} kWh</td>
                <td>{signe(ecartPct(total.produit, total.prevu))} %</td><td />
              </tr>
            </tbody>
          </table>
        </Card>
      </div>
    </>
  );
}
