# Quiz imprezowy

Synchronizowany quiz ABCD: **1670**, **Halloween**, **Zwierzogród** (18 pytań).

## Impreza (8 osób)

1. **Prowadzący** — otwórz `/host`, klucz domyślny: `impreza` (zmienna `HOST_SECRET` na Vercel).
2. Przed startem: **„Wyczyść bazę przed imprezą”** (czyści graczy + pytanie 1).
3. **Gracze** — `/` → nick → `/quiz` (wszyscy widzą to samo pytanie).
4. Po odpowiedziach: prowadzący → **Następne pytanie**.

**Redis (Upstash) na Vercel jest wymagany** — bez tego sesja nie synchronizuje się między telefonami.

## Lokalnie

```bash
npm install
npm run build
npm run start
```

## Vercel

- Repo → Import → Next.js
- Marketplace → **Redis** → `KV_REST_API_URL`, `KV_REST_API_TOKEN`
- Opcjonalnie: `HOST_SECRET=impreza`

## API (prowadzący)

`POST /api/session` z nagłówkiem `x-host-secret` i body:

- `{ "action": "next" }` — kolejne pytanie
- `{ "action": "reset" }` — pytanie 1, gracze zostają
- `{ "action": "resetAll" }` — pusta baza + pytanie 1
