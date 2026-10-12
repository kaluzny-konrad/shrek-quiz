# Shrek Pub Quiz

Quiz wielokrotnego wyboru o uniwersum Shreka — **43 pytania**, **76 pkt** max, tablica wyników na żywo.

Źródło pytań: [`shrek_pub_quiz_master.md`](./shrek_pub_quiz_master.md).

## Lokalnie

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000)

Bez Redis API trzyma graczy w **pamięci jednego procesu** (OK do testów na laptopie). Na produkcji podłącz storage.

## Deploy na Vercel

1. **Utwórz projekt** w Vercel i połącz to repozytorium (framework: Next.js).
2. W projekcie: **Marketplace → Redis** (Upstash) → dodaj do projektu.
3. Zmienne (zwykle ustawia integracja):
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
4. Deploy z gałęzi `main`. Każdy push = nowy preview/produkcja.

Lokalnie z produkcyjnym Redis:

```bash
vercel env pull .env.local
npm run dev
```

## Strony

| Ścieżka    | Opis |
| ---------- | ---- |
| `/`        | Nick, start, postęp |
| `/quiz`    | Wszystkie pytania + sticky wynik |
| `/tablica` | Ranking + mapa odpowiedzi |

## Skrypty

- `npm run dev` — development
- `npm run build` — build produkcyjny (walidacja pytań przy starcie)
- `npm run start` — serwer po buildzie
- `npm run lint` — ESLint
