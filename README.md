# NgSurv – CQRS + Event‑Driven Architecture

## Opis projektu

Projekt **NgSurv** to aplikacja do tworzenia, publikowania i analizowania ankiet online.
System został zaprojektowany z myślą o:

* dużej liczbie odczytów (read‑heavy),
* skalowalności,
* jasnym rozdziale odpowiedzialności,
* łatwej rozbudowie o nowe funkcje (analityka, integracje).

Architektura opiera się na **CQRS (Command Query Responsibility Segregation)** oraz **Event‑Driven Architecture (EDA)**, z wyraźnym podziałem na **Write Model** i **Read Model**.

Projekt jest przygotowany tak, aby mógł być współtworzony lub częściowo implementowany przez **agentów AI**, przy użyciu plików normatywnych (`SKILL.md`, `POLICY.md`).

---

## Technologie używane

### Backend

* **NestJS** – framework backendowy
* **Prisma ORM** – dostęp do bazy danych
* **PostgreSQL** – relacyjna baza danych
* **Swagger (OpenAPI)** – dokumentacja API
* **Zod** – walidacja schematów danych
* **@nestjs/cqrs** – obsługa wzorca CQRS
* **@nestjs/event-emitter** – obsługa eventów domenowych

### Frontend

* **Angular** – aplikacja SPA
* **Tailwind CSS** – stylowanie UI

### Architektura i wzorce

* CQRS (Command / Query)
* Event‑Driven Architecture
* Read / Write Model separation

---

## Jak uruchomić projekt

Repozytorium ma strukturę monorepo z katalogiem `apps/`.

### Struktura katalogów

```
apps/
 ├─ api/        # Backend – NestJS
 └─ web/        # Frontend – Angular
```

---

### Wymagania

* Node.js >= 20
* pnpm
* PostgreSQL

---

### Uruchomienie backendu (NestJS)

```bash
cd apps/api
pnpm install
```

Skonfiguruj zmienne środowiskowe:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/survey_write
DATABASE_READ_URL=postgresql://user:password@localhost:5432/survey_read
```

Migracje Prisma:

```bash
npx prisma migrate dev
```

Start API:

```bash
pnpm run start:dev
```

Swagger dostępny pod:

```
http://localhost:3000/api
```

---

### Uruchomienie frontend (Angular)

```bash
cd apps/web
pnpm install
pnpm start
```

Aplikacja dostępna pod:

```
http://localhost:4200
```

---

## Architektura

System jest logicznie podzielony na **Write Side** i **Read Side**, komunikujące się wyłącznie przez **eventy domenowe**.

### Wysokopoziomowy przepływ

```
HTTP Command
   ↓
Command Handler
   ↓
WRITE DB (Prisma)
   ↓
Domain Event
   ↓
Projection / Event Handler
   ↓
READ DB (Prisma)
   ↓
HTTP Query
```

---

### Struktura backendu (NestJS)

```
apps/api/src/
 ├─ modules/
 │   ├─ surveys/
 │   │   ├─ commands/
 │   │   ├─ events/
 │   │   ├─ queries/
 │   │   └─ handlers/
 │   ├─ responses/
 │   ├─ analytics/
 │   └─ projections/
 ├─ prisma/
 │   ├─ write/
 │   └─ read/
 ├─ shared/
 │   ├─ zod/
 │   └─ guards/
 └─ main.ts
```

Każdy **Command**, **Event** i **Query** posiada osobną klasę.

---

## Wzorce architektoniczne

### CQRS (Command Query Responsibility Segregation)

* **Command** – zmienia stan systemu (Write Model)
* **Query** – odczytuje dane (Read Model)
* Write i Read Model są fizycznie i logicznie rozdzielone

Korzyści:

* skalowalność,
* prostsza analityka,
* brak konfliktów odczyt/zapis.

---

### Event‑Driven Architecture (EDA)

* Po każdej zmianie stanu emitowany jest **event domenowy**
* Eventy są asynchroniczne i nie znają konsumentów
* Read Model i agregaty są budowane przez **projekcje**

Przykładowe eventy:

* `SurveyCreated`
* `SurveyPublished`
* `ResponseSubmitted`

---

### Zod – walidacja schematów

* Zod jest używany do:

   * walidacji DTO na granicy HTTP,
   * walidacji payloadów eventów,
   * spójnych kontraktów danych.

Zod **nie** jest używany do walidacji domenowej (ta należy do Write Model).

---

## Dokumenty architektoniczne

W repozytorium znajdują się dodatkowe dokumenty:

* `SKILL.md` – kompetencje i wiedza agenta AI
* `ERD.md` - diagramy ERD w notacji Mermaid (klasyczny + CQRS)

Dokumenty te są **wiążące** dla implementacji backendu.

---

## Zasada nadrzędna projektu

> **Write Model jest źródłem prawdy. Read Model jest jedynie projekcją.**

Każda implementacja API musi respektować CQRS i Event‑Driven Architecture, nawet kosztem prostoty kodu.
