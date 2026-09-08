// EA Plus Formation — Compagnon Ringover
// Backend Express : reçoit les webhooks Ringover, identifie l'entreprise appelée
// à partir de la base de prospects, et pousse l'argumentaire adapté en temps réel
// vers le tableau de bord du télépro (via Server-Sent Events).

const express = require("express");
const path = require("path");
const fs = require("fs");
const argumentsBank = require("./data/arguments.js");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;

// ---------- Chargement de la base de prospects en mémoire ----------
const PROSPECTS_PATH = path.join(__dirname, "data", "prospects.json");
let prospects = [];
let prospectsByTel = new Map();

function loadProspects() {
  const raw = fs.readFileSync(PROSPECTS_PATH, "utf-8");
  prospects = JSON.parse(raw);
  prospectsByTel = new Map();
  for (const p of prospects) {
    if (p.tel) prospectsByTel.set(p.tel, p);
  }
  console.log(`[data] ${prospects.length} prospects chargés en mémoire`);
}
loadProspects();

// ---------- Normalisation numéro de téléphone (format FR à 10 chiffres) ----------
function normalizePhone(raw) {
  if (!raw) return "";
  let d = String(raw).replace(/[^0-9]/g, "");
  if (d.startsWith("33") && d.length === 11) d = "0" + d.slice(2);
  if (d.length === 9 && !d.startsWith("0")) d = "0" + d;
  return d;
}

// ---------- Construction de la fiche argumentaire pour une entreprise ----------
function buildBrief(prospect) {
  const secteurData = argumentsBank[prospect.secteur] || null;
  return {
    entreprise: {
      nom: prospect.nom,
      secteur: prospect.secteur,
      activite: prospect.activite,
      ville: prospect.ville,
      cp: prospect.cp,
      opco: prospect.opco,
      tel: prospect.tel,
    },
    argumentaire: secteurData
      ? {
          douleurs: secteurData.douleurs,
          argumentsIA: secteurData.argumentsIA,
          autresFormations: secteurData.autresFormations,
        }
      : null,
    objections: argumentsBank.objectionsGenerales,
  };
}

// ---------- Server-Sent Events : diffusion en direct au dashboard ----------
let sseClients = [];

function broadcast(event, data) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach((res) => res.write(payload));
}

app.get("/events", (req, res) => {
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.flushHeaders();
  res.write("event: ping\ndata: connected\n\n");
  sseClients.push(res);
  req.on("close", () => {
    sseClients = sseClients.filter((c) => c !== res);
  });
});

// ---------- Webhook Ringover ----------
// À configurer dans Ringover > Dashboard > Developer > Webhooks
// Événements conseillés : "Appel entrant" (ringing) et "Appel décroché" (answered)
// Ringover envoie un payload JSON ; les noms de champs peuvent varier selon la
// configuration du compte, donc on essaie plusieurs clés possibles.
app.post("/webhook/ringover", (req, res) => {
  const body = req.body || {};
  console.log("[webhook] payload reçu:", JSON.stringify(body));

  const candidates = [
    body.caller_number,
    body.from_number,
    body.from,
    body.number,
    body.caller,
    body.contact_number,
    body.cid_number,
    body.channel && body.channel.from,
  ].filter(Boolean);

  const rawNumber = candidates[0];
  const tel = normalizePhone(rawNumber);

  let brief = null;
  const prospect = prospectsByTel.get(tel);
  if (prospect) {
    brief = buildBrief(prospect);
  } else {
    brief = {
      entreprise: { nom: null, tel: rawNumber || tel },
      argumentaire: null,
      objections: argumentsBank.objectionsGenerales,
      inconnu: true,
    };
  }

  broadcast("call", brief);
  res.status(200).json({ ok: true, matched: !!prospect });
});

// ---------- Recherche manuelle (téléphone ou nom) ----------
app.get("/api/search", (req, res) => {
  const q = (req.query.q || "").trim();
  if (!q) return res.json([]);

  const telQuery = normalizePhone(q);
  if (telQuery.length >= 6) {
    const exact = prospectsByTel.get(telQuery);
    if (exact) return res.json([buildBrief(exact)]);
  }

  const qLower = q.toLowerCase();
  const results = prospects
    .filter((p) => p.nom && String(p.nom).toLowerCase().includes(qLower))
    .slice(0, 20)
    .map(buildBrief);

  res.json(results);
});

// ---------- Simulateur d'appel (pour tester sans Ringover branché) ----------
app.post("/api/simulate", (req, res) => {
  const tel = normalizePhone(req.body.tel || "");
  const prospect = prospectsByTel.get(tel);
  const brief = prospect
    ? buildBrief(prospect)
    : { entreprise: { nom: null, tel }, argumentaire: null, objections: argumentsBank.objectionsGenerales, inconnu: true };
  broadcast("call", brief);
  res.json({ ok: true, matched: !!prospect });
});

app.get("/api/stats", (req, res) => {
  const bySecteur = {};
  for (const p of prospects) {
    bySecteur[p.secteur] = (bySecteur[p.secteur] || 0) + 1;
  }
  res.json({ total: prospects.length, bySecteur });
});

app.listen(PORT, () => {
  console.log(`EA Plus Formation — Compagnon Ringover en écoute sur le port ${PORT}`);
});
