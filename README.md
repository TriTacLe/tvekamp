# Tvekamp

Tvekamp mellom Web og DevOps teamene i Orbit.

---

## Tech Stack

| Lag        | Teknologi                                    |
| ---------- | -------------------------------------------- |
| Framework  | Next.js 14 (App Router)                      |
| Språk      | TypeScript                                   |
| Styling    | Tailwind CSS                                 |
| 3D         | React Three Fiber + drei                     |
| UI         | Aceternity UI (ShootingStars, StarsBackground) |
| Database   | Upstash Redis                                |
| Deploy     | Vercel                                       |

---

## UML-diagrammer

### Komponentdiagram

```
┌─────────────────────────────────────────────────────┐
│                    app/layout.tsx                    │
│              (RootLayout + Providers)                │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────┐   ┌────────────────────────────┐  │
│  │  Scene.tsx    │   │     LayoutShell.tsx         │  │
│  │  (3D bakgrunn│   │  ┌────────┐ ┌───────────┐  │  │
│  │   fixed -z)  │   │  │Header  │ │Navigation │  │  │
│  │              │   │  └────────┘ └───────────┘  │  │
│  │ ┌──────────┐ │   │                            │  │
│  │ │Stars     │ │   │  ┌──────────────────────┐  │  │
│  │ │Background│ │   │  │    Page Content       │  │  │
│  │ └──────────┘ │   │  │  / → VideoLanding     │  │  │
│  │ ┌──────────┐ │   │  │  /play → SpinWheel    │  │  │
│  │ │Shooting  │ │   │  │  /participants        │  │  │
│  │ │Stars     │ │   │  │  /games               │  │  │
│  │ └──────────┘ │   │  │  /results             │  │  │
│  │ ┌──────────┐ │   │  └──────────────────────┘  │  │
│  │ │Satellite │ │   └────────────────────────────┘  │
│  │ └──────────┘ │                                   │
│  │ ┌──────────┐ │                                   │
│  │ │Confetti  │ │                                   │
│  │ └──────────┘ │                                   │
│  └──────────────┘                                   │
└─────────────────────────────────────────────────────┘
```

### Spillflyt (Tilstandsmaskin)

```
                    ┌─────────┐
                    │  idle   │◄──────────────────────┐
                    └────┬────┘                       │
                         │ SPIN                       │
                         ▼                            │
                    ┌──────────┐                      │
                    │ spinning │                      │
                    └────┬─────┘                      │
                         │ animasjon ferdig            │
                         ▼                            │
                    ┌──────────┐                      │
                    │  reveal  │                      │
                    └────┬─────┘                      │
                         │ velg spillere              │
                         ▼                            │
                 ┌───────────────┐                    │
                 │ player-select │                    │
                 └───────┬───────┘                    │
                         │ START                      │
                         ▼                            │
                    ┌──────────┐                      │
                    │  active  │                      │
                    └────┬─────┘                      │
                         │ kamp ferdig                │
                         ▼                            │
                    ┌──────────┐                      │
                    │  result  │                      │
                    └────┬─────┘                      │
                         │ velg vinner                │
                         ▼                            │
                    ┌──────────┐                      │
                    │ victory  │──────────────────────┘
                    └──────────┘
```

### Datamodell (ER-diagram)

```
┌─────────────────┐       ┌─────────────────┐
│   Participant    │       │      Game        │
├─────────────────┤       ├─────────────────┤
│ id: string       │       │ id: string       │
│ name: string     │       │ name: string     │
│ team: web|devops │       │ rules: string    │
│ funFact?: string │       │ time: number     │
│ superpower?: str │       │ players: number  │
│ imageUrl?: string│       │ visible: boolean │
│ createdAt?: str  │       │ createdAt?: str  │
└────────┬────────┘       └────────┬────────┘
         │                         │
         │    ┌────────────────┐   │
         └───►│  GameResult    │◄──┘
              ├────────────────┤
              │ id: string      │
              │ gameId: string  │
              │ gameName: string│
              │ winner: web|dev │
              │ webPlayer: str  │
              │ devopsPlayer:str│
              │ timestamp: str  │
              └────────────────┘
```

### API-ruter (Sekvensdiagram)

```
  Klient                    API                     Storage
    │                        │                        │
    │── GET /api/games ─────►│── getItem('games') ──►│
    │◄── Game[] ─────────────│◄── JSON ──────────────│
    │                        │                        │
    │── GET /api/participants►│── getItem('parti..') ►│
    │◄── Participant[] ──────│◄── JSON ──────────────│
    │                        │                        │
    │── GET /api/results ───►│── getItem('results') ►│
    │◄── GameResult[] ───────│◄── JSON ──────────────│
    │                        │                        │
    │── POST /api/results ──►│── getItem('results') ►│
    │   {gameId, winner,...} │◄── JSON ──────────────│
    │                        │── setItem('results') ►│
    │◄── 201 Created ────────│◄── OK ────────────────│
    │                        │                        │
```

### Lagringsstrategi

```
              ┌──────────────┐
              │ storage.ts   │
              │ (abstraction)│
              └──────┬───────┘
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
   ┌────────────┐ ┌──────┐ ┌──────────┐
   │Upstash Redis│ │  fs  │ │ /tmp     │
   │(Vercel prod)│ │(lokal│ │(fallback)│
   └────────────┘ │  dev) │ └──────────┘
                  └──────┘
```
