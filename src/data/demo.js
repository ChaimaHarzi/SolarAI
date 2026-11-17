// ------------------------------------------------------------------
// DONNÉES DE DÉMONSTRATION (SIMULÉES)
// Ces chiffres sont inventés pour le prototype. Plus tard, ils seront
// remplacés par les réponses de l'API (backend FastAPI) :
//   GET /api/centrales            -> centrales
//   GET /api/production?...       -> productionJour / productionSemaine / productionMois
//   GET /api/alertes              -> alertes
// Il suffira de remplacer les imports de ce fichier par des appels fetch().
// ------------------------------------------------------------------

export const AUJOURDHUI = "Mar. 17 nov. 2026";

export const centrale = {
  id: "demo",
  nom: "Centrale démo",
  puissanceMW: 2,
  lieu: "Gabès",
  majA: "16 h 40",
};

export const onduleurs = [
  { id: 1, nom: "Onduleur 1", produit: 2750, prevu: 2800 },
  { id: 2, nom: "Onduleur 2", produit: 2720, prevu: 2800 },
  { id: 3, nom: "Onduleur 3", produit: 2100, prevu: 2800 },
  { id: 4, nom: "Onduleur 4", produit: 2730, prevu: 2800 },
];

// Production heure par heure aujourd'hui (kW). Creux à 14 h = données manquantes de l'onduleur 1.
const heures = Array.from({ length: 14 }, (_, i) => 6 + i);
const bruit = [0, -10, -30, -60, -80, -120, -140, -130, -110, -90, -60, -30, -10, 0];
export const productionJour = heures.map((h, i) => {
  const prevu = Math.round(1350 * Math.sin((Math.PI * (h - 6)) / 13));
  let reel = Math.max(0, Math.round(prevu * 0.97 + bruit[i]));
  if (h === 14) reel = Math.round(reel * 0.6);
  return { label: `${h} h`, reel, prevu };
});

// 7 derniers jours (kWh)
export const productionSemaine = [
  { label: "11 nov.", reel: 10900, prevu: 11000 },
  { label: "12 nov.", reel: 11300, prevu: 11200 },
  { label: "13 nov.", reel: 9800, prevu: 9900 },
  { label: "14 nov.", reel: 11100, prevu: 11100 },
  { label: "15 nov.", reel: 10900, prevu: 11000 },
  { label: "16 nov.", reel: 10400, prevu: 11100 },
  { label: "17 nov.", reel: 10300, prevu: 11200 },
];

// 30 derniers jours (kWh), générés de façon déterministe
export const productionMois = Array.from({ length: 30 }, (_, i) => {
  const jour = i + 1 <= 13 ? `${i + 18} oct.` : `${i - 13} nov.`;
  const prevu = Math.round(10800 + 500 * Math.sin(i / 3));
  const meteo = i % 9 === 4 ? 0.8 : 1; // quelques jours nuageux
  const panne = i >= 28 ? 0.92 : 1; // onduleur 3 depuis le 16 nov.
  return { label: jour, reel: Math.round(prevu * meteo * 0.985 * panne), prevu: Math.round(prevu * meteo) };
});

export const totalJour = { produit: 10300, prevu: 11200 };

export const alertes = [
  {
    id: "a1",
    priorite: "Haute",
    titre: "Onduleur 3 : production 25 % sous la normale",
    description: "L'onduleur 3 produit beaucoup moins que les autres, alors que le temps est ensoleillé.",
    depuis: "Depuis le 16 nov.",
    perte: 1400,
    score: 0.87,
    explication: [
      "Depuis 2 jours, l'onduleur 3 produit environ 700 kWh de moins par jour que prévu.",
      "Le temps est ensoleillé et les 3 autres onduleurs fonctionnent normalement.",
    ],
    raisons: [
      { k: "Écart avec la prévision", v: "−25 %", ton: "rouge", info: "ecart" },
      { k: "Météo", v: "Ensoleillé" },
      { k: "Durée", v: "2 jours" },
      { k: "Autres onduleurs", v: "Normaux", ton: "vert" },
    ],
    verifications: [
      "Lire les alarmes de l'onduleur 3",
      "Contrôler les câbles et connexions",
      "Regarder la propreté des panneaux",
    ],
    comparaison: [
      { label: "11 nov.", onduleur: 2720, autres: 2725 },
      { label: "12 nov.", onduleur: 2790, autres: 2800 },
      { label: "13 nov.", onduleur: 2430, autres: 2450 },
      { label: "14 nov.", onduleur: 2760, autres: 2775 },
      { label: "15 nov.", onduleur: 2700, autres: 2740 },
      { label: "16 nov.", onduleur: 2100, autres: 2770 },
      { label: "17 nov.", onduleur: 2100, autres: 2735 },
    ],
    nomCourbe: "Onduleur 3",
  },
  {
    id: "a2",
    priorite: "Moyenne",
    titre: "Onduleur 1 : données manquantes",
    description: "Aucune mesure reçue entre 14 h et 15 h aujourd'hui.",
    depuis: "Aujourd'hui",
    perte: null,
    score: 0.64,
    explication: [
      "L'onduleur 1 n'a envoyé aucune mesure entre 14 h et 15 h.",
      "La production réelle de cette heure est donc inconnue : ce n'est pas forcément une panne.",
    ],
    raisons: [
      { k: "Valeurs manquantes", v: "12", ton: "orange" },
      { k: "Période", v: "14 h – 15 h" },
      { k: "Autres onduleurs", v: "Normaux", ton: "vert" },
    ],
    verifications: [
      "Vérifier la connexion internet de l'onduleur 1",
      "Regarder si l'onduleur a redémarré",
      "Réimporter le fichier de données si besoin",
    ],
    comparaison: null,
  },
  {
    id: "a3",
    priorite: "Basse",
    titre: "Centrale : production un peu sous la prévision",
    description: "Sur 2 semaines, la production est 2 % sous la prévision. Possible salissure des panneaux.",
    depuis: "Depuis 2 semaines",
    perte: 3000,
    score: 0.41,
    explication: [
      "Depuis 2 semaines, la centrale produit environ 2 % de moins que prévu, sur tous les onduleurs.",
      "Une baisse lente et générale fait souvent penser à de la poussière sur les panneaux.",
    ],
    raisons: [
      { k: "Écart avec la prévision", v: "−2 %", ton: "orange", info: "ecart" },
      { k: "Durée", v: "2 semaines" },
      { k: "Onduleurs concernés", v: "Tous" },
    ],
    verifications: ["Regarder la propreté des panneaux", "Prévoir un nettoyage si nécessaire"],
    comparaison: null,
  },
];

export const centrales = [
  { id: "demo", nom: "Centrale démo", lieu: "Gabès", mw: 2, onduleurs: 4, reel: 10300, prevu: 11200, alertes: 3 },
  { id: "sud", nom: "Centrale Sud", lieu: "Médenine", mw: 1, onduleurs: 2, reel: 5450, prevu: 5600, alertes: 0 },
  { id: "nord", nom: "Centrale Nord", lieu: "Kairouan", mw: 2, onduleurs: 4, reel: 10900, prevu: 11000, alertes: 0 },
];

// Textes des bulles d'aide (icône i)
export const AIDE = {
  onduleur: ["Onduleur", "Boîtier qui convertit l'électricité des panneaux et mesure la production. Une centrale en a plusieurs."],
  kwh: ["kWh", "La quantité d'électricité produite. C'est ce que la centrale vend à la STEG."],
  prevue: ["Production prévue", "Ce que la centrale devrait produire, calculé par SolarAI à partir de la météo et de l'historique."],
  ecart: ["Écart", "La différence entre la production réelle et la production prévue, en %."],
  kw: ["kW", "La puissance produite à chaque instant. Pendant une heure, 1 kW donne 1 kWh."],
  priorite: ["Priorité", "Indique quelle alerte traiter en premier : haute, moyenne ou basse."],
  perte: ["Perte estimée", "L'électricité que la centrale n'a pas produite à cause du problème, estimée par SolarAI."],
  score: ["Score d'anomalie", "Note de 0 à 1 donnée par l'IA. Plus elle est proche de 1, plus le comportement est inhabituel."],
  puissance: ["Puissance installée", "La taille de la centrale : ce qu'elle peut produire au maximum. 1 MW = 1 000 kW."],
  csv: ["Fichier CSV", "Un tableau de données (comme un fichier Excel simple) exporté depuis le portail de l'onduleur."],
};

export const fmt = (n) => n.toLocaleString("fr-FR").replace(/ /g, " ");
export const ecartPct = (reel, prevu) => Math.round(((reel - prevu) / prevu) * 100);
export const signe = (n) => (n < 0 ? `−${Math.abs(n)}` : `${n}`);
