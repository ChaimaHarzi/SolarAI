# SolarAI — Interface (prototype)

Interface web du projet SolarAI, réalisée avec **React** (Vite), **Recharts** pour les graphiques et **React Router** pour la navigation.

> Toutes les données affichées sont **simulées** (données de démonstration). Elles se trouvent dans `src/data/demo.js`.

## Lancer le projet sur ton ordinateur

1. Installer **Node.js** (version 18 ou plus) : https://nodejs.org
2. Ouvrir un terminal dans ce dossier, puis taper :

```bash
npm install      # une seule fois : télécharge les bibliothèques
npm run dev      # lance l'interface
```

3. Ouvrir l'adresse affichée dans le terminal (en général http://localhost:5173).

Pour créer la version finale à mettre en ligne : `npm run build` (le résultat est dans le dossier `dist/`).

## Les écrans

| Écran | Fichier | Ce qu'il fait |
|---|---|---|
| Accueil | `src/pages/Accueil.jsx` | Indicateurs du jour, production des 7 derniers jours, état des onduleurs, dernières alertes |
| Production | `src/pages/Production.jsx` | Courbe réelle / prévue (Jour, Semaine, Mois) et tableau par onduleur |
| Alertes | `src/pages/Alertes.jsx` | Liste des alertes, filtres par priorité |
| Détail d'une alerte | `src/pages/DetailAlerte.jsx` | Explication, graphique, raisons, cases « quoi vérifier », bouton « Marquer vérifiée », export du rapport (.txt) |
| Installations | `src/pages/Installations.jsx` | Liste des centrales et import d'un fichier CSV avec vérification des colonnes et des valeurs manquantes |

Les icônes **« i »** affichent une bulle d'aide au survol de la souris. Les textes des bulles sont dans `AIDE`, en bas de `src/data/demo.js`.

## Tester l'import CSV

Un fichier d'exemple est fourni : `public/exemple_production.csv` (séparateur `;`, colonnes `date;heure;onduleur;puissance (kW)`). Il contient volontairement 4 valeurs manquantes (onduleur 1, à 14 h).

## Brancher le backend plus tard (pour Ahmed)

Aujourd'hui, les écrans importent les données depuis `src/data/demo.js`. Pour utiliser l'API FastAPI, il suffira de remplacer ces imports par des appels `fetch()`, par exemple :

```js
const reponse = await fetch("http://localhost:8000/api/alertes");
const alertes = await reponse.json();
```

Endpoints suggérés, avec la même forme que les objets de `demo.js` :

- `GET /api/centrales` → liste des centrales
- `GET /api/production?centrale=demo&periode=jour|semaine|mois` → `{ label, reel, prevu }[]`
- `GET /api/onduleurs?centrale=demo` → production et prévision par onduleur
- `GET /api/alertes?centrale=demo` → liste des alertes (priorité, titre, score, perte, raisons, vérifications…)
- `POST /api/import` → envoi du fichier CSV

## Organisation des fichiers

```
src/
  main.jsx            point d'entrée
  App.jsx             liste des pages (routes)
  styles.css          couleurs et mise en page
  components/
    Sidebar.jsx       menu de gauche
    ui.jsx            éléments réutilisables : barre du haut, carte, badge, icône « i »
  pages/              un fichier par écran
  data/demo.js        données simulées + textes des bulles d'aide
public/
  exemple_production.csv
```
