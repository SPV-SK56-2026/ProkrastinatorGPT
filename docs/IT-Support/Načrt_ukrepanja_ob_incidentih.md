# ProkrastinatorGPT — Incident Response Runbook

> Ta dokument opisuje postopke za reševanje najpogostejših incidentov v produkcijskem okolju.
> Slediti korakov v vrstnem redu — ne preskakuj korakov.
>
> **Repozitorij:** [github.com/SPV-SK56-2026/ProkrastinatorGPT](https://github.com/SPV-SK56-2026/ProkrastinatorGPT)
> **Zadnja posodobitev:** Marec 2026

---

## Kazalo

1. [Splošna diagnostika — začni tukaj](#1-splošna-diagnostika--začni-tukaj)
2. [Backend strežnik ne odgovarja](#2-backend-strežnik-ne-odgovarja)
3. [Baza podatkov nedostopna](#3-baza-podatkov-nedostopna)
4. [Watchtower ne posodablja kontejnerja](#4-watchtower-ne-posodablja-kontejnerja)
5. [OpenAI API ključ potekel ali dosegel limit](#5-openai-api-ključ-potekel-ali-dosegel-limit)
6. [JWT secret kompromitiran](#6-jwt-secret-kompromitiran)
7. [GitHub Actions pipeline je padel](#7-github-actions-pipeline-je-padel)
8. [Kontakti in eskalacija](#8-kontakti-in-eskalacija)

---

> ### Hitri ukazi za diagnostiko
>
> ```bash
> # Preveri stanje vseh kontejnerjev
> docker ps -a
>
> # Preveri loge backenda
> docker compose logs -f backend --tail=50
>
> # Preveri healthcheck
> curl http://localhost:5000/api/v1/health
>
> # Preveri loge baze
> docker compose logs -f db --tail=50
> ```

---

## 1. Splošna diagnostika — začni tukaj

Preden greš na specifičen scenarij, naredi hitro splošno diagnostiko da ugotoviš kje je problem.

### Korak 1 — Preveri katere storitve tečejo

```bash
docker ps -a
```

Pričakovani rezultat — vse tri storitve morajo biti v statusu `Up`:

```
CONTAINER ID   NAME                        STATUS
xxxxxxxxxxxx   prokrastinator-backend      Up 2 hours
xxxxxxxxxxxx   prokrastinator-db-local     Up 2 hours
xxxxxxxxxxxx   watchtower                  Up 2 hours
```

Če katera storitev kaže `Exited` ali `Restarting` → pojdi na ustrezen razdelek.

### Korak 2 — Preveri healthcheck

```bash
curl http://localhost:5000/api/v1/health
```

- Vrne `{"status": "ok"}` → backend teče, problem je drugje (morda baza ali OpenAI)
- `Connection refused` → backend ne odgovarja → pojdi na [Razdelek 2](#2-backend-strežnik-ne-odgovarja)
- `{"status": "error", "db": "unreachable"}` → problem z bazo → pojdi na [Razdelek 3](#3-baza-podatkov-nedostopna)

### Korak 3 — Preveri loge

```bash
# Zadnjih 50 vrstic logov backenda
docker compose logs backend --tail=50

# Sledenje logom v realnem času
docker compose logs -f backend
```

Poišči vrstice z `ERROR`, `FATAL`, `ECONNREFUSED`, `ETIMEDOUT` ali `UnauthorizedError`.

---

## 2. Backend strežnik ne odgovarja

**Simptomi:**
- Razširitev v brskalniku prikaže napako `Failed to fetch` ali `Network Error`
- `curl http://localhost:5000/api/v1/health` vrne `Connection refused`
- Docker status kaže `Exited` ali `Restarting` za `prokrastinator-backend`

---

### 2.1 Kontejner se je ustavil

**Diagnostika:**
```bash
docker ps -a
docker compose logs backend --tail=100
```

**Rešitev A — Restart kontejnerja:**
```bash
docker compose restart backend
```
Počakaj 10 sekund in preveri:
```bash
curl http://localhost:5000/api/v1/health
```

**Rešitev B — Če restart ne pomaga, znova zgradi:**
```bash
docker compose down backend
docker compose up -d backend
```

---

### 2.2 Kontejner se nenehno restarta (`Restarting`)

**Diagnostika:**
```bash
docker compose logs backend --tail=50
```

Poišči vzrok — najpogostejše napake:

| Napaka v logih | Vzrok | Rešitev |
|----------------|-------|---------|
| `Cannot find module` | Manjkajoče npm odvisnosti | Glej 2.3 |
| `ECONNREFUSED` na port 5432 | Baza nedostopna | Glej Razdelek 3 |
| `invalid input syntax` | Napaka v `.env` | Glej 2.4 |
| `SyntaxError` | Napaka v kodi | Glej 2.5 |

---

### 2.3 Manjkajoče npm odvisnosti

```bash
docker compose down backend
docker compose build --no-cache backend
docker compose up -d backend
```

---

### 2.4 Napaka v `.env` datoteki

Preveri da so vse obvezne spremenljivke nastavljene:
```bash
docker exec prokrastinator-backend env | grep -E "NODE_ENV|PORT|DATABASE_URL|OPENAI_API_KEY|JWT_SECRET"
```

Vse spremenljivke morajo imeti vrednosti. Če katera manjka:
1. Uredi `code/backend/.env`
2. Znova zaženi kontejner:
```bash
docker compose up -d --force-recreate backend
```

---

### 2.5 Napaka v kodi po zadnjem deploymentu

Če se je incident zgodil takoj po novem deploymentu, naredi rollback na prejšnjo verzijo:

```bash
# Preveri zadnje Docker image tage na Docker Hub
# Nato zaženite specifično verzijo
docker compose down backend
docker pull <dockerhub-user>/prokrastinator-backend:<prejšnja-verzija>

# Posodobi docker-compose.yml da kaže na prejšnjo verzijo
# image: <dockerhub-user>/prokrastinator-backend:<prejšnja-verzija>

docker compose up -d backend
```

**Koga obvesti:** Backend ekipo — takoj ko je storitev spet živa, da preverijo zadnji commit.

---

### 2.6 Port 5000 je zaseden

```bash
# Preveri kateri proces zaseda port
lsof -i :5000

# Ubij proces (zamenjaj PID)
kill -9 <PID>

# Znova zaženi kontejner
docker compose up -d backend
```

---

## 3. Baza podatkov nedostopna

**Simptomi:**
- Backend logi kažejo `ECONNREFUSED`, `ETIMEDOUT` ali `SSL connection error`
- Healthcheck vrne `{"status": "error", "db": "unreachable"}`
- pgAdmin ne more vzpostaviti povezave

---

### 3.1 Lokalni Docker PostgreSQL kontejner se je ustavil

**Diagnostika:**
```bash
docker ps -a | grep db
docker compose logs db --tail=50
```

**Rešitev:**
```bash
docker compose restart db

# Počakaj 15 sekund da se baza zažene
sleep 15

# Preveri
docker compose logs db --tail=20
docker compose restart backend
```

---

### 3.2 Render.com baza je nedostopna

**Diagnostika:**
1. Odpri [status.render.com](https://status.render.com) — preveri ali Render poroča o izpadih
2. Preveri Render nadzorno ploščo za svojo bazo → zavihek **Logs**

**Rešitev A — Render ima izpad:**
- Počakaj da Render odpravi izpad (ponavadi < 30 minut)
- Obvesti ekipo da je baza začasno nedostopna
- Backend bo samodejno vzpostavil povezavo ko bo baza spet živa

**Rešitev B — Render baza je "suspended" (brezplačni plan):**
Brezplačne baze na Render se po 90 dneh neaktivnosti suspendirajo.
1. Odpri Render nadzorno ploščo → tvoja baza
2. Klikni **"Resume"**
3. Počakaj 1–2 minuti da se baza zažene
4. Znova zaženi backend: `docker compose restart backend`

---

### 3.3 SSL napaka pri povezavi na Render

**Napaka v logih:**
```
Error: self signed certificate in certificate chain
```

**Rešitev:**
Preveri `code/backend/.env`:
```env
DB_SSL=true
```
Preveri v kodi da pgPool upošteva SSL nastavitev. Znova zaženi backend.

---

### 3.4 Napačno geslo za bazo

**Napaka v logih:**
```
password authentication failed for user "admin"
```

**Rešitev:**
1. Pojdi na Render nadzorno ploščo → tvoja baza → **Settings** → **Reset Database Password**
2. Shrani novo geslo
3. Posodobi `code/backend/.env`:
   ```env
   DB_PASSWORD=novo_geslo
   DATABASE_URL=postgresql://admin:novo_geslo@host/prokrastinator
   ```
4. Znova zaženi backend:
   ```bash
   docker compose up -d --force-recreate backend
   ```

**Koga obvesti:** Celotno ekipo — vsak ki ima lokalno `.env` datoteko jo mora posodobiti.

---

### 3.5 Tabele ne obstajajo

**Napaka v logih:**
```
relation "users" does not exist
```

**Rešitev — Zaženi shemo:**
```bash
psql "postgresql://admin:geslo@host/prokrastinator?sslmode=require" -f docs/schema.sql
```

Ali prek pgAdmin:
1. Odpri Query Tool
2. Prilepi vsebino `docs/schema.sql`
3. Pritisni **F5**

---

## 4. Watchtower ne posodablja kontejnerja

**Simptomi:**
- Po uspešnem GitHub Actions deploymentu se kontejner na Unraid ni posodobil
- `docker ps` kaže staro verzijo image-a

---

### 4.1 Preveri ali Watchtower teče

```bash
docker ps | grep watchtower
docker compose logs watchtower --tail=50
```

Če Watchtower ne teče:
```bash
docker compose up -d watchtower
```

---

### 4.2 Watchtower ne najde novega image-a

**Diagnostika:**
```bash
docker compose logs watchtower --tail=50
```

Poišči vrstice kot:
```
level=info msg="Found new prokrastinator-backend:latest image"
```
ali
```
level=info msg="Session done" Containers Updated=0
```

Če piše `Updated=0` čeprav je bil nov deploy:
1. Preveri da je GitHub Actions uspešno potisnil image na Docker Hub
2. Preveri da je ime image-a v Watchtower ukazu točno enako imenu kontejnerja:
   ```yaml
   command: --interval 30 prokrastinator-backend
   ```
3. Ročno potegni najnovejši image:
   ```bash
   docker pull <dockerhub-user>/prokrastinator-backend:latest
   docker compose up -d --force-recreate backend
   ```

---

### 4.3 Ročni deployment (bypass Watchtower)

Če Watchtower ne deluje in je treba nujno posodobiti:

```bash
# Na Unraid strežniku
docker pull <dockerhub-user>/prokrastinator-backend:latest
docker stop prokrastinator-backend
docker rm prokrastinator-backend
docker compose up -d backend
```

**Koga obvesti:** Po rešitvi incidenta odpri GitHub Issue za sledenje Watchtower problemu.

---

## 5. OpenAI API ključ potekel ali dosegel limit

**Simptomi:**
- Backend logi kažejo `401 Unauthorized` ali `429 Too Many Requests` pri klicih na OpenAI
- Razširitev prikaže napako `AI analiza trenutno ni na voljo`
- Healthcheck je `ok`, AI analize pa ne delujejo

---

### 5.1 API ključ je potekel ali preklican

**Diagnostika:**
```bash
docker compose logs backend --tail=50 | grep -i openai
```

Če vidiš `401 Unauthorized`:

**Rešitev:**
1. Odpri [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Ustvari nov API ključ
3. Posodobi `code/backend/.env`:
   ```env
   OPENAI_API_KEY=sk-nova-vrednost
   ```
4. Znova zaženi backend:
   ```bash
   docker compose up -d --force-recreate backend
   ```

**Koga obvesti:** Celotno ekipo — stari API ključ je treba preklicati na OpenAI nadzorni plošči.

---

### 5.2 Dosežen rate limit (`429 Too Many Requests`)

**Diagnostika:**
```bash
docker compose logs backend --tail=50 | grep "429"
```

**Takojšnji ukrep:**
- Rate limit se ponavadi ponastavi po 1 minuti (RPM limit) ali po 1 dnevu (dnevni limit)
- Preveri porabo na [platform.openai.com/usage](https://platform.openai.com/usage)

**Kratkoročna rešitev — dodaj retry z zamikom:**
Backend mora imeti implementiran exponential backoff pri `429` napakah. Če tega še ni, dodaj ročno zamudo med zahtevami.

**Dolgoročna rešitev:**
- Nadgradi OpenAI plan za višje rate limite
- Implementiraj request queuing na backendu
- Optimiziraj predpomnjenje (caching) v tabeli `assignments` da se izogneš ponavljajočim klicem

---

### 5.3 Izčrpan OpenAI kredit

**Diagnostika:**
Preveri [platform.openai.com/usage](https://platform.openai.com/usage) — zavihek **Billing**.

**Rešitev:**
1. Dodaj kredit ali posodobi plačilno metodo na OpenAI nadzorni plošči
2. Ustvari nov API ključ (priporočeno po spremembi plačilnih podatkov)
3. Posodobi `.env` in znova zaženi backend

---

## 6. JWT secret kompromitiran

**Simptomi:**
- Sum, da je nekdo pridobil dostop do `JWT_SECRET` vrednosti iz `.env`
- Nenavadne prijave ali dostopi do API endpointov
- `JWT_SECRET` je bil slučajno committan v git repozitorij

> **Ta incident je kritičen — ukrepaj takoj.**
> Sprememba `JWT_SECRET` razveljavi VSE obstoječe seje vseh uporabnikov hkrati.

---

### Korak 1 — Takoj generiraj nov JWT secret

```bash
# Generiraj kriptografsko varen 64-znakovni secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Korak 2 — Posodobi `.env`

```env
JWT_SECRET=nov_kriptografski_secret
```

### Korak 3 — Znova zaženi backend

```bash
docker compose up -d --force-recreate backend
```

Vsi obstoječi JWT žetoni so zdaj neveljavni — vsi uporabniki se morajo znova prijaviti.

### Korak 4 — Če je bil secret committan v git

```bash
# Odstrani .env iz git zgodovine
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch code/backend/.env" \
  --prune-empty --tag-name-filter cat -- --all

git push origin --force --all
```

### Korak 5 — Preveri `.gitignore`

```bash
cat .gitignore | grep .env
```

Mora vsebovati:
```
.env
code/backend/.env
code/frontend/.env
```

**Koga obvesti:** Celotno ekipo — takoj. Vsi morajo vedeti da so bile seje razveljavljene.

---

## 7. GitHub Actions pipeline je padel

**Simptomi:**
- GitHub prikazuje rdeči X pri zadnjem commitu na `main`
- Watchtower ne dobi novega Docker image-a
- Deploy ni uspel

---

### 7.1 Preveri zakaj je pipeline padel

1. Odpri [github.com/SPV-SK56-2026/ProkrastinatorGPT/actions](https://github.com/SPV-SK56-2026/ProkrastinatorGPT/actions)
2. Klikni na zadnji neuspeli workflow
3. Odpri padli job in poišči napako

Najpogostejši vzroki:

| Napaka | Vzrok | Rešitev |
|--------|-------|---------|
| `docker login failed` | Docker Hub credentials potekli | Glej 7.2 |
| `npm ci` failed | Konflikt v `package-lock.json` | Glej 7.3 |
| `Build failed` | Napaka v kodi | Backend/Frontend ekipa |
| `Secrets not found` | Manjkajoči GitHub secret | Glej 7.4 |

---

### 7.2 Docker Hub credentials so potekli

1. Pojdi na **GitHub repozitorij → Settings → Secrets and variables → Actions**
2. Posodobi `DOCKER_USERNAME` in `DOCKER_PASSWORD`
3. Znova zaženi pipeline: **Actions → zadnji workflow → Re-run jobs**

---

### 7.3 Konflikt v `package-lock.json`

```bash
cd code/backend   # ali code/frontend
rm -rf node_modules package-lock.json
npm install
git add package-lock.json
git commit -m "chore: regenerate package-lock.json"
git push
```

---

### 7.4 Manjkajoči GitHub Secrets

Preveri da so vsi potrebni GitHub Secrets nastavljeni:

**GitHub repozitorij → Settings → Secrets and variables → Actions:**

| Secret | Vrednost |
|--------|----------|
| `DOCKER_USERNAME` | Docker Hub uporabniško ime |
| `DOCKER_PASSWORD` | Docker Hub geslo ali access token |

---

### 7.5 Ročni deployment brez pipeline-a

Če pipeline ne deluje in je treba nujno deployati:

```bash
# Lokalno zgradi in potisni image
cd code/backend
docker build -t <dockerhub-user>/prokrastinator-backend:latest .
docker push <dockerhub-user>/prokrastinator-backend:latest

# Na Unraid — ročno posodobi kontejner
docker pull <dockerhub-user>/prokrastinator-backend:latest
docker compose up -d --force-recreate backend
```

**Koga obvesti:** Po rešitvi odpri GitHub Issue za sledenje pipeline problemu.

---

## 8. Kontakti in eskalacija

### Stopnje resnosti

| Stopnja | Opis | Odzivni čas |
|---------|------|-------------|
| **Kritično** | Produkcija popolnoma nedostopna, varnostni incident | Takoj |
| **Visoko** | Večina funkcionalnosti ne deluje, baza nedostopna | < 1 ura |
| **Srednje** | Posamezne funkcionalnosti ne delujejo | < 4 ure |
| **Nizko** | Manjše napake, ne vpliva na delovanje | Naslednji delovni dan |

### Postopek eskalacije

```
1. IT-Support poskuša rešiti sam (po tem runbooku)
         ↓ če ne uspe v 30 minutah
2. Obvesti odgovorni oddelek (Backend / DB / Frontend)
         ↓ če ne uspe v 1 uri
3. Odpri GitHub Issue z oznako [INCIDENT] in stopnjo resnosti
         ↓ za varnostne incidente
4. Takoj obvesti celotno ekipo — ne čakaj na rešitev
```


*Dokument vzdržuje IT-Support oddelek SPV-SK56-2026.*
*Ob novih incidentih dodaj nov scenarij v ta dokument.*
