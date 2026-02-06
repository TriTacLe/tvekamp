# Tvekamp

Tvekamp mellom Web og DevOps teamene i Orbit. Spin hjulet, velg spillere, kjemp, og registrer vinneren!

---

## Tech Stack

| Lag        | Teknologi                                    |
| ---------- | -------------------------------------------- |
| Framework  | Next.js 14 (App Router)                      |
| Språk      | TypeScript                                   |
| Styling    | Tailwind CSS                                 |
| 3D         | React Three Fiber + drei                     |
| Data       | JSON-filer (`data/`)                         |
| Deploy     | Vercel                                       |

---

## Prosjektstruktur

```
tvekamp/
├── app/
│   ├── layout.tsx              # Root layout (fonter, providers, 3D-bakgrunn)
│   ├── page.tsx                # Hovedside — hjulvisning
│   ├── globals.css             # Tailwind + egne stiler
│   ├── participants/page.tsx   # Lagoversikt
│   ├── games/page.tsx          # Alle spill
│   ├── results/page.tsx        # Resultattavle + kamphistorikk
│   └── api/
│       ├── participants/route.ts   # GET deltakere
│       ├── games/route.ts          # GET spill
│       └── results/route.ts        # GET/POST resultater
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # "TVEKAMP" tittel
│   │   └── Navigation.tsx      # Fane-navigasjon
│   ├── wheel/
│   │   ├── SpinWheel.tsx       # Spillflyt-orkestrator (6 faser)
│   │   ├── SpinButton.tsx      # SPIN-knapp
│   │   ├── GameIntro.tsx       # Spillavsløring
│   │   ├── PlayerSelect.tsx    # Velg web/devops-spiller
│   │   ├── GameActive.tsx      # Kamp pågår
│   │   └── ResultModal.tsx     # Velg vinner
│   ├── participants/
│   │   ├── TeamGrid.tsx        # To-kolonne lagoversikt
│   │   ├── ParticipantCard.tsx # Deltakerkort med bilde
│   │   └── TeamStats.tsx       # Lagstatistikk
│   ├── results/
│   │   ├── Scoreboard.tsx      # Stillingsoversikt
│   │   ├── MatchHistory.tsx    # Kamphistorikk
│   │   └── ResultItem.tsx      # Enkeltkamp
│   ├── games/
│   │   ├── GamesList.tsx       # Spilliste
│   │   └── GameCard.tsx        # Spillkort
│   ├── three/
│   │   ├── Scene.tsx           # Global R3F Canvas (fast bakgrunn)
│   │   ├── SpinningWheel3D.tsx # 3D-hjul med segmenter
│   │   ├── Satellite.tsx       # Satellitt i bane
│   │   ├── StarField.tsx       # Stjernefelt
│   │   └── Confetti3D.tsx      # Konfetti-partikler
│   └── ui/
│       ├── Modal.tsx           # Gjenbrukbar modal
│       └── Button.tsx          # Gjenbrukbar knapp
├── context/
│   └── GameSessionContext.tsx  # Spilløkt-state (spilte spill, brukte spillere, fase)
├── hooks/
│   ├── useParticipants.ts
│   ├── useGames.ts
│   ├── useResults.ts
│   └── useGameSession.ts
├── lib/
│   ├── types.ts                # TypeScript-typer
│   └── constants.ts            # Farger, lagconfig, navigasjon
├── data/
│   ├── participants.json       # Deltakere
│   ├── games.json              # Spill
│   └── results.json            # Resultater
└── public/uploads/             # Deltaker-bilder
```

---

## Spillflyt

Hele kampflyten styres av `SpinWheel.tsx` som en tilstandsmaskin med 6 faser:

```
[idle] → SPIN → [spinning] → animasjon ferdig → [reveal]
  → vis spill → velg spillere → [player-select] → START → [active]
  → kamp ferdig → [result] → velg vinner → [idle]
```

### Fasene i detalj

| Fase            | Hva skjer                                                    |
| --------------- | ------------------------------------------------------------ |
| `idle`          | Hjulet vises med tilgjengelige spill. SPIN-knappen er aktiv. |
| `spinning`      | 3D-hjulet spinner med ease-out-animasjon (4-6 sek).          |
| `reveal`        | Valgt spill vises med regler og info.                        |
| `player-select` | Velg en Web-spiller og en DevOps-spiller fra dropdown.       |
| `active`        | Kamp pågår! Viser VS-overlay med spillerne.                  |
| `result`        | Velg hvem som vant. Resultatet lagres via API.               |

### Filtrering

- **Hjulet** viser kun spill som ikke er spilt i denne økten (`playedGameIds`)
- **Spillervalg** viser kun deltakere som ikke har spilt ennå (`usedPlayerNames`)
- Etter at vinner er registrert: spillet og spillerne markeres som brukt
- Alt nullstilles ved sideoppdatering (økt-basert)

---

## Sider

| Sti             | Beskrivelse                           |
| --------------- | ------------------------------------- |
| `/`             | Hjulet — spin og spill                |
| `/participants` | Lagoversikt (Web vs DevOps)           |
| `/games`        | Alle spill med regler og tid          |
| `/results`      | Stillingstavle + kamphistorikk        |

---

## API-ruter

| Metode | Sti                  | Beskrivelse            |
| ------ | -------------------- | ---------------------- |
| GET    | `/api/participants`  | Hent alle deltakere    |
| GET    | `/api/games`         | Hent alle spill        |
| GET    | `/api/results`       | Hent alle resultater   |
| POST   | `/api/results`       | Registrer nytt resultat |

### POST `/api/results` — body

```json
{
  "gameId": "1",
  "gameName": "Stein, Saks, Papir",
  "winner": "web",
  "webPlayer": "Ola",
  "devopsPlayer": "Kari"
}
```

---

## 3D-bakgrunn

En persistent Three.js-scene kjører bak alt innhold på alle sider:

- **Stjernefelt** — 300 partikler som roterer sakte
- **Satellitt** — boks med solcellepaneler og antenne i elliptisk bane
- **Konfetti** — partikkeleksplosjon når en vinner registreres

Alle 3D-komponenter bruker `next/dynamic` med `ssr: false` (Three.js støtter ikke server-side rendering).

---

## Kjøre lokalt

```bash
npm install
npm run dev
```

Åpne [http://localhost:3000](http://localhost:3000).

## Bygge for produksjon

```bash
npm run build
npm start
```

## Deploy på Vercel

Push til GitHub og koble repoet til Vercel. Bygget kjøres automatisk.

> **Merk:** Vercel har read-only filsystem i produksjon. Resultater lagres kun lokalt. For persistent lagring i prod kan Vercel KV brukes.

---

## Datamodeller

### Participant

```typescript
{
  id: string;
  name: string;
  team: 'web' | 'devops';
  funFact?: string;
  superpower?: string;
  imageUrl?: string;
  createdAt?: string;
}
```

### Game

```typescript
{
  id: string;
  name: string;
  rules: string;
  time: number;       // minutter
  players: number;
  visible: boolean;
  createdAt?: string;
}
```

### GameResult

```typescript
{
  id: string;
  gameId: string;
  gameName: string;
  winner: 'web' | 'devops';
  webPlayer: string;
  devopsPlayer: string;
  timestamp: string;
}
```

---

## Farger

| Element         | Farge                              |
| --------------- | ---------------------------------- |
| Web primary     | `#6366f1` (indigo)                 |
| Web secondary   | `#8b5cf6` (violet)                 |
| DevOps primary  | `#f97316` (orange)                 |
| DevOps secondary| `#22c55e` (grønn)                  |
| Bakgrunn        | `#0f0f1a`                          |
| Kort            | `#1a1a2e`                          |

## Fonter

- **Bangers** — display/titler
- **Poppins** — brødtekst
