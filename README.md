# EA Plus Formation — Compagnon Ringover

Application qui affiche automatiquement, pendant un appel Ringover, la fiche
argumentaire adaptée au **secteur de l'entreprise appelée** (Commerce,
Restauration, Hôtellerie, Construction) pour vendre les formations IA — et les
autres formations — d'EA Plus Formation.

## Ce que ça fait

- Base de **11 160 sociétés** (téléphone, secteur, activité, OPCO) issue de
  ton fichier de prospection.
- Un tableau de bord web (`public/index.html`) que le télépro garde ouvert
  pendant ses appels.
- Un point d'entrée webhook (`/webhook/ringover`) : quand Ringover envoie
  l'événement d'appel, l'app retrouve l'entreprise par son numéro et pousse
  en direct sur le tableau de bord :
  - le secteur et l'OPCO dont dépend l'entreprise
  - les douleurs métier probables
  - les arguments IA à utiliser
  - les autres formations EA Plus Formation à proposer
  - les réponses aux objections courantes
- Une **recherche manuelle** (nom ou téléphone) si l'appel ne matche pas.
- Un endpoint `/api/simulate` pour tester sans être branché à Ringover.

## Installation

```bash
npm install
npm start
```

L'app tourne sur `http://localhost:3000`. Ouvre cette adresse dans un
navigateur (ou en 2e écran) pendant les sessions d'appel.

## Tester sans Ringover

```bash
curl -X POST http://localhost:3000/api/simulate \
  -H "Content-Type: application/json" \
  -d '{"tel":"0556518002"}'
```

Le dashboard ouvert dans le navigateur se met à jour instantanément.

## Connecter Ringover (webhook réel)

1. **Déployer l'app** quelque part d'accessible publiquement (obligatoire :
   Ringover doit pouvoir atteindre ton serveur depuis internet). Options simples :
   - Render.com (gratuit pour démarrer) : "New Web Service" → connecter le repo
     → build command `npm install` → start command `npm start`
   - Railway.app, Fly.io, ou un VPS classique avec PM2 + nginx

2. Une fois déployée, tu obtiens une URL publique, ex :
   `https://ea-ringover.onrender.com`

3. Dans **Ringover → Dashboard → Developer → Webhooks**, ajoute un webhook sur
   l'événement "Appel entrant" (ringing) ou "Appel décroché" (answered) et
   renseigne l'URL :
   `https://ea-ringover.onrender.com/webhook/ringover`

4. Passe un appel test : le nom de l'entreprise et son argumentaire doivent
   apparaître sur le dashboard en quelques secondes.

> Le format exact du payload envoyé par Ringover peut varier selon la config
> du compte. Le serveur logue chaque payload reçu (`console.log`) : si le
> matching ne fonctionne pas du premier coup, regarde les logs pour voir sous
> quel nom de champ arrive le numéro de l'appelant, et ajuste la liste
> `candidates` dans `server.js` (fonction du webhook) en conséquence — c'est
> une ligne à modifier.

## Mettre à jour la base de prospects

Remplace `data/prospects.json` par un nouvel export (même structure) :

```json
[
  {"secteur": "Commerce", "opco": "OPCO EP", "nom": "...", "activite": "...", "ville": "...", "cp": "...", "tel": "0600000000"},
  ...
]
```

Le champ `tel` doit être au format 10 chiffres commençant par 0 (c'est comme
ça que le webhook fait le matching).

## Adapter les argumentaires

Tout le contenu commercial (douleurs métier, arguments IA, autres formations,
objections) est dans `data/arguments.js` — un fichier simple à éditer, pas de
code à toucher.

## Limites actuelles

- Base construite automatiquement à partir de fichiers de prospection avec
  une classification par mots-clés / codes NAF : à vérifier au fil de l'eau,
  quelques secteurs peuvent être mal classés.
- Les arguments IA/formations sont un premier jet à affiner avec le contenu
  réel des parcours EA Plus Formation.
- Pas d'authentification sur le dashboard : à restreindre (mot de passe /
  accès réseau interne) avant un déploiement public durable.
