# Tvekamp

Laget for tvekamp mellom Devops og web teamene i orbit

Dette prosjektet er en enkel fullstack webapplikasjon bygget med **Node.js og Express**, der frontend serveres statisk fra backend. Applikasjonen er ment å kjøres som én samlet tjeneste (er nå deployet på Render).

---

## Overordnet arkitektur

Prosjektet følger en **monorepo fullstack-struktur**:

- **Backend**: Node.js + Express
- **Frontend**: HTML, CSS og vanilla JavaScript
- **Servering**: Express serverer frontend-filer fra `public/`

Applikasjonen har **ingen separat frontend-build** (ingen React). Alt kjøres direkte i nettleseren.

---

## Mappestruktur

```text
.
├── server.js          # Hovedfil for Express-serveren
├── package.json       # Prosjektmetadata, scripts og dependencies
├── package-lock.json  # Låste dependency-versjoner
├── public/            # Frontend (statiske filer)
│   ├── index.html     # Hovedside for applikasjonen
│   ├── css/
│   │   └── styles.css
│   └── js/
│       ├── api.js     # API-kall til backend (fetch)
│       └── auth.js    # client login / autentisering (frontend)
└── README.md
```

---

## Backend

### Techstack

- **Node.js** (runtime)
- **Express** (webserver / API)

### Ansvar

- Starte HTTP-server
- Servere statiske filer fra `public/`
- Eksponere API-endepunkter (f.eks. `/api/...`)

### Viktige detaljer

- Render setter port via `process.env.PORT`
- Express må derfor bruke fallback:

```javascript
const port = process.env.PORT || 3000;
```

- Frontend lastes via:

```javascript
expressApplication.use(express.static("public"));
```

---

## Frontend

### Techstack

Plain HTML, CSS, JS

### Ansvar

- Presentasjon av UI
- Brukerinteraksjon
- Kall mot backend via `fetch`

### Kommunikasjon med backend

Frontend gjør HTTP-kall direkte til Express-serveren:

```javascript
fetch("/api/...");
```

Dette fungerer fordi frontend og backend kjøres på **samme origin**.

---

## Tech Stack (oppsummert)

| Lag      | Teknologi             |
| -------- | --------------------- |
| Runtime  | Node.js               |
| Backend  | Express               |
| Frontend | HTML, CSS, JavaScript |
| Deploy   | Render                |

---

## Deploy

Applikasjonen er designet for å deployes som én **Web Service** på Render.

Render:

- kjører `npm install`
- starter appen med `npm start`
- eksponerer én offentlig URL
