# ProkrastinatorGPT — Vzpostavitveni dokument za razvijalce

> **Projekt:** ProkrastinatorGPT — Browser Extension za analizo Moodle nalog z AI  
> **Repozitorij:** [github.com/SPV-SK56-2026/ProkrastinatorGPT](https://github.com/SPV-SK56-2026/ProkrastinatorGPT)  
> **Licenca:** GPL-3.0  
> **Zadnja posodobitev:** Marec 2026

---

## Kazalo

1. [Pregled projekta](#pregled-projekta)
2. [Splošne zahteve](#splošne-zahteve)
3. [Kloniranje repozitorija](#kloniranje-repozitorija)
4. [Frontend — Razširitev za brskalnik](#frontend--razširitev-za-brskalnik)
5. [Backend — Express API strežnik](#backend--express-api-strežnik)
6. [Database — PostgreSQL](#database--postgresql)
7. [Docker & Watchtower (Unraid)](#docker--watchtower-unraid)
8. [Struktura repozitorija](#struktura-repozitorija)
9. [Git workflow](#git-workflow)

---

## Pregled projekta

ProkrastinatorGPT je brskalniška razširitev (Browser Extension), zasnovana za študente, ki želijo optimizirati čas pri delu z digitalnimi učnimi gradivi. Orodje s pomočjo LLM analizira navodila nalog v Moodle učilnicah in vrne:

- **AI povzetek** bistvenih zahtev naloge
- **Oceno zahtevnosti** (enostavna / srednja / zahtevna)
- **Predviden časovni okvir** za oddajo
- **Načrt reševanja** po korakih

Arhitektura je razdeljena na tri sklope:

```
[ Browser Extension (Frontend) ]
           ↕ REST API
[ Express.js strežnik (Backend) ]  ←→  [ OpenAI / LLM API ]
           ↕
  [ PostgreSQL — Render.com ]
           ↕
       [ pgAdmin 4 ]
```

---

## Splošne zahteve

Pred začetkom poskrbi, da imaš nameščeno:

| Orodje | Minimalna verzija | Namestitev |
|--------|-------------------|------------|
| Node.js | 20.x LTS | https://nodejs.org |
| npm | 10.x | Priložen z Node.js |
| Git | 2.40+ | https://git-scm.com |
| Docker | 24.x | https://docs.docker.com/get-docker/ |
| Docker Compose | v2.x | Priložen z Docker Desktop |
| pgAdmin 4 | najnovejši | https://www.pgadmin.org/download/ |
| VS Code (priporočeno) | najnovejši | https://code.visualstudio.com |

Preveri verzije:
```bash
node -v
npm -v
git --version
docker --version
docker compose version
```

---

## Kloniranje repozitorija

```bash
# Kloniraj repozitorij
git clone https://github.com/SPV-SK56-2026/ProkrastinatorGPT.git

# Vstopi v mapo
cd ProkrastinatorGPT
```

---

## Frontend — Razširitev za brskalnik

### Tehnologije
- **HTML5, CSS3** — struktura in stilizacija popup vmesnika
- **JavaScript (ES6+) / TypeScript** — logika razširitve
- **React** — UI komponente znotraj popupa
- **Web Extensions API** — združljivo s Chrome, Edge, Firefox

### Namestitev

```bash
# Vstopi v frontend mapo
cd code/frontend

# Namesti odvisnosti
npm install
```

### Razvoj

```bash
# Zaženi razvojni build z opazovanjem sprememb (watch mode)
npm run dev
```

### Build za produkcijo

```bash
# Zgenerira mapo /dist z optimizirano razširitvijo
npm run build
```

### Nalaganje razširitve v brskalnik (razvojni način)

**Google Chrome / Edge:**
1. Odpri `chrome://extensions/` (ali `edge://extensions/`)
2. Vklopi **Developer mode** (zgoraj desno)
3. Klikni **Load unpacked**
4. Izberi mapo `code/frontend/dist`

**Firefox:**
1. Odpri `about:debugging#/runtime/this-firefox`
2. Klikni **Load Temporary Add-on**
3. Izberi datoteko `code/frontend/dist/manifest.json`

### Priporočene VS Code razširitve (Frontend)

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

### Struktura frontend kode

```
code/frontend/
├── public/
│   └── manifest.json          # Web Extension manifest (v3)
├── src/
│   ├── components/            # React komponente
│   │   ├── Popup.tsx          # Glavni popup vmesnik
│   │   ├── Summary.tsx        # Prikaz AI povzetka
│   │   └── DifficultyBadge.tsx
│   ├── content/
│   │   └── contentScript.ts   # Vbrizgan skript v Moodle strani
│   ├── background/
│   │   └── background.ts      # Service worker razširitve
│   ├── styles/
│   │   └── popup.css
│   └── utils/
│       └── api.ts             # Klici na backend API
├── tsconfig.json
├── package.json
└── vite.config.ts             # (ali webpack.config.js)
```

### Okolijske spremenljivke (Frontend)

Ustvari datoteko `.env` v mapi `code/frontend/`:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_API_VERSION=v1
```

> Nikoli ne shranjuj API ključev direktno v frontend kodi — vsi klici na LLM gredo skozi backend!

---

## Backend — Express API strežnik

### Tehnologije
- **Node.js + Express.js** — REST API strežnik
- **JavaScript / TypeScript** — jezikovna osnova
- **npm** — upravljanje odvisnosti
- **Docker** — kontejnerizacija
- **Watchtower** — samodejno posodabljanje Docker kontejnerjev
- **Unraid** — strežniška platforma za gostovanje

### Namestitev (lokalni razvoj)

```bash
# Vstopi v backend mapo
cd code/backend

# Namesti odvisnosti
npm install
```

### Okolijske spremenljivke (Backend)

Ustvari datoteko `.env` v mapi `code/backend/`:

```env
# Splošno
NODE_ENV=development
PORT=5000

# OpenAI / LLM
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxx
OPENAI_MODEL=gpt-4o

# CORS
ALLOWED_ORIGINS=chrome-extension://,moz-extension://

# PostgreSQL — Render.com
DATABASE_URL=postgresql://admin:geslo@dpg-xxxxxxxxxxxx.oregon-postgres.render.com:5432/prokrastinator
DB_HOST=dpg-xxxxxxxxxxxx.oregon-postgres.render.com
DB_PORT=5432
DB_NAME=prokrastinator
DB_USER=admin
DB_PASSWORD=geslo
DB_SSL=true
```

> Datoteka `.env` je v `.gitignore` — je NIKOLI ne commitas!

### Zagon v razvojnem načinu

```bash
# Z nodemon (samodejni ponovni zagon ob spremembi)
npm run dev

# Ali direktno
node src/index.js
```

### Struktura backend kode

```
code/backend/
├── src/
│   ├── index.js               # Vstopna točka Express strežnika
│   ├── routes/
│   │   ├── analyze.js         # POST /api/v1/analyze
│   │   └── health.js          # GET /api/v1/health
│   ├── controllers/
│   │   └── analyzeController.js
│   ├── services/
│   │   ├── llmService.js      # Integracija z OpenAI API
│   │   └── moodleParser.js    # Obdelava Moodle vsebine
│   ├── middleware/
│   │   ├── cors.js
│   │   ├── rateLimit.js
│   │   └── errorHandler.js
│   └── config/
│       └── env.js
├── Dockerfile
├── docker-compose.yml
├── package.json
└── .env.example
```

### Ključni API endpointi

| Metoda | Pot | Opis |
|--------|-----|------|
| `GET` | `/api/v1/health` | Preveri stanje strežnika |
| `POST` | `/api/v1/analyze` | Analizira navodila naloge z AI |

**Primer zahteve `POST /api/v1/analyze`:**

```json
{
  "taskText": "Napiši poročilo o ekosistemu...",
  "courseId": "moodle-course-123",
  "deadline": "2026-04-01"
}
```

**Primer odgovora:**

```json
{
  "summary": "Napiši poročilo o izbranem ekosistemu...",
  "difficulty": "srednja",
  "estimatedHours": 4,
  "steps": [
    "Izberi ekosistem",
    "Poišči vire",
    "Napiši uvod..."
  ]
}
```

---

## Database — PostgreSQL

### Tehnologije
- **PostgreSQL** — relacijska baza podatkov
- **Render.com** — cloud hosting baze (brezplačen tier za razvoj)
- **pgAdmin 4** — grafični vmesnik za upravljanje baze

---

### Vzpostavitev baze na Render.com

#### 1. Ustvari PostgreSQL instanco

1. Odpri [render.com](https://render.com) in se prijavi (ali ustvari račun)
2. Klikni **"New +"** → **"PostgreSQL"**
3. Izpolni nastavitve:

| Polje | Vrednost |
|-------|----------|
| Name | `prokrastinator-db` |
| Database | `prokrastinator` |
| User | `admin` |
| Region | `Frankfurt (EU Central)` — najbližje Sloveniji |
| PostgreSQL Version | `16` |
| Plan | `Free` (za razvoj) |

4. Klikni **"Create Database"**
5. Po ustvaritvi se prikaže stran s podatki o bazi — shrani si **Internal Database URL** in **External Database URL**

#### 2. Pridobi povezovalne podatke

Na Render nadzorni plošči za svojo bazo najdi razdelek **"Connections"**:

```
Host:      dpg-xxxxxxxxxxxx.oregon-postgres.render.com
Port:      5432
Database:  prokrastinator
Username:  admin
Password:  (prikaže Render — shrani na varno)

External Database URL:
postgresql://admin:geslo@dpg-xxxxxxxxxxxx.oregon-postgres.render.com/prokrastinator

Internal Database URL (samo med Render storitvami):
postgresql://admin:geslo@dpg-xxxxxxxxxxxx-a/prokrastinator
```

> Te podatke vnesi v `.env` datoteko backenda. Nikoli jih ne commitaj v git!

---

### Vzpostavitev pgAdmin 4

pgAdmin je grafično orodje za upravljanje PostgreSQL baze — primerno za ogled tabel, pisanje SQL poizvedb in upravljanje shem.

#### Namestitev

Prenesi in namesti pgAdmin 4 z uradne strani:
[pgadmin.org/download](https://www.pgadmin.org/download/)

Podprti sistemi: Windows, macOS, Linux

#### Povezava na Render bazo prek pgAdmin

1. Odpri pgAdmin 4
2. V levem panelu z desno miškino tipko klikni **"Servers"** → **"Register"** → **"Server..."**
3. Zavihek **General**:
   - Name: `ProkrastinatorGPT - Render`
4. Zavihek **Connection**:

| Polje | Vrednost |
|-------|----------|
| Host name/address | `dpg-xxxxxxxxxxxx.oregon-postgres.render.com` |
| Port | `5432` |
| Maintenance database | `prokrastinator` |
| Username | `admin` |
| Password | `<tvoje geslo iz Render>` |
| Save password | ✅ |

5. Zavihek **SSL**:
   - SSL mode: `Require`

6. Klikni **"Save"**

7. Strežnik se pojavi v levem drevesu — razširi ga in vidiš bazo `prokrastinator`

---

### Shema baze podatkov

```sql
-- Uporabniki (neobvezno — za kasnejšo personalizacijo)
CREATE TABLE users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at  TIMESTAMP DEFAULT NOW()
);

-- Analize nalog
CREATE TABLE analyses (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    task_text       TEXT NOT NULL,
    summary         TEXT,
    difficulty      VARCHAR(20) CHECK (difficulty IN ('enostavna', 'srednja', 'zahtevna')),
    estimated_hours NUMERIC(5,1),
    steps           JSONB,
    course_id       VARCHAR(255),
    deadline        DATE,
    created_at      TIMESTAMP DEFAULT NOW()
);

-- Indeksi
CREATE INDEX idx_analyses_created_at ON analyses(created_at DESC);
CREATE INDEX idx_analyses_course_id ON analyses(course_id);
```

#### Zagon sheme

Shemo poženi v pgAdmin z orodjem **Query Tool**:

1. V pgAdmin z desno tipko klikni na bazo `prokrastinator` → **"Query Tool"**
2. Prilepi zgornjo SQL kodo
3. Pritisni **F5** ali klikni gumb **Execute**

Ali prek terminala:

```bash
psql "postgresql://admin:geslo@dpg-xxxx.render.com/prokrastinator?sslmode=require" -f docs/schema.sql
```

---

### Lokalni razvoj z Docker PostgreSQL

Za lokalni razvoj brez Render povezave lahko zaženeš PostgreSQL v Dockerju:

```yaml
# docker-compose.yml — dodaj ta servis
services:
  db:
    image: postgres:16-alpine
    container_name: prokrastinator-db-local
    environment:
      POSTGRES_DB: prokrastinator
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: geslo_lokalno
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./docs/schema.sql:/docker-entrypoint-initdb.d/schema.sql

volumes:
  pgdata:
```

```bash
# Zaženi lokalno bazo
docker compose up -d db

# Poveži pgAdmin na lokalno bazo
# Host: localhost | Port: 5432 | SSL: Disable
```

Lokalni `.env` za razvoj:
```env
DATABASE_URL=postgresql://admin:geslo_lokalno@localhost:5432/prokrastinator
DB_SSL=false
```

---

### Priporočene VS Code razširitve (Database)

```json
{
  "recommendations": [
    "mtxr.sqltools",
    "mtxr.sqltools-driver-pg"
  ]
}
```

SQLTools omogoča pisanje SQL poizvedb direktno v VS Code brez pgAdmin.

---

## Docker & Watchtower (Unraid)

### Dockerfile (Backend)

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY src/ ./src/

EXPOSE 5000

CMD ["node", "src/index.js"]
```

### Docker Compose (lokalni razvoj)

```yaml
version: '3.9'

services:
  backend:
    build: ./code/backend
    container_name: prokrastinator-backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=development
    env_file:
      - ./code/backend/.env
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    container_name: prokrastinator-db-local
    environment:
      POSTGRES_DB: prokrastinator
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: geslo_lokalno
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./docs/schema.sql:/docker-entrypoint-initdb.d/schema.sql
    restart: unless-stopped

  # Watchtower — samodejno posodablja kontejnerje
  watchtower:
    image: containrrr/watchtower
    container_name: watchtower
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    command: --interval 30 prokrastinator-backend
    restart: unless-stopped

volumes:
  pgdata:
```

### Zagon z Docker Compose

```bash
# Zgradi in zaženi vse storitve
docker compose up --build

# Zaženi v ozadju (detached)
docker compose up -d

# Ustavi vse storitve
docker compose down

# Preveri loge
docker compose logs -f backend
```

### Namestitev na Unraid

1. Odpri Unraid spletni vmesnik (`http://<ip-strežnika>`)
2. Pojdi na **Docker** zavihek
3. Klikni **Add Container**
4. Vnesi vrednosti iz `docker-compose.yml`
5. Nastavi **Watchtower** za samodejno posodabljanje ob novem Docker image buildu

**Priporočeno:** Postavi GitHub Actions pipeline, ki avtomatično zgradi in potisne image na Docker Hub ob vsakem `push` na `main` branch — Watchtower ga bo samodejno potegnil.

---

## Struktura repozitorija

```
ProkrastinatorGPT/
├── .github/
│   └── workflows/             # GitHub Actions CI/CD
├── code/
│   ├── frontend/              # Browser Extension (React/TS)
│   └── backend/               # Express.js API (Node.js)
├── design/                    # UI/UX skice in assets
├── docs/                      # Projektna dokumentacija
├── .gitignore
├── CONTRIBUTING.md
├── LICENSE                    # GPL-3.0
└── README.md
```

---

## Git workflow

### Veje (Branches)

| Veja | Namen |
|------|-------|
| `main` | Stabilna produkcijska koda |
| `develop` | Aktivni razvoj — PR-ji gredo sem |
| `feature/<ime>` | Nova funkcionalnost |
| `fix/<ime>` | Popravek napake |
| `hotfix/<ime>` | Urgentni popravek v produkciji |

### Tipičen razvojni cikel

```bash
# 1. Posodobi lokalni develop
git checkout develop
git pull origin develop

# 2. Ustvari novo feature vejo
git checkout -b feature/ai-summary-parser

# 3. Razvijaj in commitas
git add .
git commit -m "feat: add Moodle task text extraction"

# 4. Potisni na GitHub
git push origin feature/ai-summary-parser

# 5. Odpri Pull Request v develop na GitHubu
```

### Konvencija commit sporočil (Conventional Commits)

```
feat: nova funkcionalnost
fix: popravek napake
docs: sprememba dokumentacije
style: formatiranje (brez logičnih sprememb)
refactor: prestrukturiranje kode
test: dodajanje testov
chore: vzdrževanje, odvisnosti
```

---

*Dokument vzdržuje ekipa SPV-SK56-2026. Ob vprašanjih odpri issue na [GitHubu](https://github.com/SPV-SK56-2026/ProkrastinatorGPT/issues).*
