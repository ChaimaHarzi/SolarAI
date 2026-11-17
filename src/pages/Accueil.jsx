import { Link } from "react-router-dom";
import { Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Scatter, ComposedChart } from "recharts";
import { Topbar, Card, Info, Badge, Legende } from "../components/ui.jsx";
import { centrale, onduleurs, productionSemaine, totalJour, alertes, fmt, ecartPct, signe } from "../data/demo.js";

// Petit trait horizontal pour la production prévue sur chaque barre
const TraitPrevu = ({ cx, cy }) => (
  <line x1={cx - 30} x2={cx + 30} y1={cy} y2={cy} stroke="var(--blue)" strokeWidth={2} strokeDasharray="5 4" />
);

export default function Accueil() {
  const ecart = ecartPct(totalJour.produit, totalJour.prevu);
  const hautes = alertes.filter((a) => a.priorite === "Haute").length;
  return (
    <>
      <Topbar titre="Accueil" />
      <div className="content">
        <div className="grid-4">
          <Card>
            <div className="kpi-label">Production aujourd'hui <Info id="kwh" /></div>
            <div className="kpi-value">{fmt(totalJour.produit)} kWh</div>
            <div className="kpi-sub">Mis à jour à {centrale.majA}</div>
          </Card>
          <Card>
            <div className="kpi-label">Production prévue <Info id="prevue" /></div>
            <div className="kpi-value">{fmt(totalJour.prevu)} kWh</div>
            <div className="kpi-sub">Selon la météo du jour</div>
          </Card>
          <Card>
            <div className="kpi-label">Écart <Info id="ecart" /></div>
            <div className="kpi-value rouge">{signe(ecart)} %</div>
            <div className="kpi-sub rouge">Sous la prévision</div>
          </Card>
          <Card>
            <div className="kpi-label">Alertes ouvertes</div>
            <div className="kpi-value">{alertes.length}</div>
            <div className="kpi-sub rouge">Dont {hautes} priorité haute</div>
          </Card>
        </div>

        <div className="grid-main">
          <Card titre="Production des 7 derniers jours" action={<Legende />}>
            <div className="unit">kWh</div>
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={productionSemaine} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--grid)" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#6b7480", fontSize: 12 }} />
                <YAxis tickFormatter={fmt} tickLine={false} axisLine={false} tick={{ fill: "#6b7480", fontSize: 12 }} width={56} />
                <Tooltip formatter={(v, n) => [`${fmt(v)} kWh`, n === "reel" ? "Réel" : "Prévu"]} />
                <Bar dataKey="reel" radius={[4, 4, 0, 0]} barSize={46}>
                  {productionSemaine.map((d) => (
                    <Cell key={d.label} fill={ecartPct(d.reel, d.prevu) <= -5 ? "var(--red)" : "var(--amber)"} />
                  ))}
                </Bar>
                <Scatter dataKey="prevu" shape={<TraitPrevu />} />
              </ComposedChart>
            </ResponsiveContainer>
          </Card>

          <Card titre="État des onduleurs" info="onduleur" droite>
            {onduleurs.map((o) => {
              const alerte = ecartPct(o.produit, o.prevu) <= -20;
              return (
                <div className="row" key={o.id}>
                  <div>
                    <div className="row-title">{o.nom}</div>
                    <div className="row-sub">{fmt(o.produit)} kWh sur {fmt(o.prevu)} prévus</div>
                  </div>
                  {alerte ? <Badge type="alerte">Alerte</Badge> : <Badge type="ok">OK</Badge>}
                </div>
              );
            })}
          </Card>
        </div>

        <Card titre="Dernières alertes" action={<Link className="link" to="/alertes">Voir toutes les alertes →</Link>}>
          {alertes.map((a) => (
            <Link className="row" key={a.id} to={`/alertes/${a.id}`}>
              <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                <span style={{ width: 86 }}><Badge type={a.priorite}>{a.priorite}</Badge></span>
                <span className="row-title">{a.titre}</span>
              </div>
              <span className="row-sub">{a.depuis}</span>
            </Link>
          ))}
        </Card>
      </div>
    </>
  );
}
