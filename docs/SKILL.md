# SKILL: Event‑Driven Architecture + CQRS

## Kontekst domenowy

Aplikacja do tworzenia i obsługi ankiet online.
Stack technologiczny:

* Frontend: Angular
* Backend: NestJS
* ORM: Prisma
* DB: PostgreSQL
* Architektura: CQRS + Event‑Driven Architecture (EDA)

System jest **read‑heavy**, z częstymi agregacjami wyników ankiet.

---

## Cel tej umiejętności

Agent AI posiadający tę umiejętność:

* rozumie różnicę między **Command / Event / Query**,
* potrafi projektować i implementować **EDA w NestJS**,
* potrafi łączyć **EDA z CQRS** bez silnego sprzężenia,
* wie kiedy używać eventów in‑process, a kiedy brokera,
* potrafi projektować **eventy domenowe** dla aplikacji ankiet.

---

## Definicje

### Command

Żądanie wykonania akcji.

* pochodzi z HTTP / UI,
* może zostać odrzucone (walidacja),
* **nie jest faktem domenowym**.

Przykłady:

* `CreateSurveyCommand`
* `SubmitResponseCommand`

---

### Event

Fakt, który **już się wydarzył**.

* immutable,
* nie zawiera logiki,
* nie zwraca odpowiedzi,
* nie zna konsumentów.

Przykłady:

* `SurveyPublishedEvent`
* `ResponseSubmittedEvent`

---

### Query

Zapytanie o dane.

* brak efektów ubocznych,
* korzysta wyłącznie z **read modelu**.

---

## Event‑Driven Architecture (EDA)

### Założenia

* komponenty komunikują się przez **zdarzenia**, a nie wywołania,
* write side publikuje eventy domenowe,
* read side i integracje reagują asynchronicznie,
* brak bezpośrednich zależności między modułami.

---

## Eventy domenowe w aplikacji ankiet

Minimalny zestaw:

* `SurveyCreated`
* `SurveyPublished`
* `QuestionAdded`
* `QuestionRemoved`
* `ResponseSubmitted`
* `SurveyClosed`

Każdy event:

* opisuje *co się stało*,
* zawiera tylko dane faktu (ID, timestamp, payload),
* NIE zawiera logiki biznesowej.

---

## Integracja EDA z CQRS

### Przepływ

1. HTTP → Command
2. Command Handler → zapis do **Write DB**
3. Emisja Eventu domenowego
4. Listener / Projection
5. Aktualizacja **Read DB** / agregatów
6. HTTP Query → Read DB

Write model **nie zna** read modelu.

---

## Implementacja EDA w NestJS (in‑process)

### Narzędzie

`@nestjs/event-emitter`

Stosowane gdy:

* jedna instancja backendu lub brak wymagań durability,
* niskie opóźnienia,
* prostota ważniejsza niż niezawodność brokera.

---

### Emitowanie eventu (Write Side)

* po **udanym zapisie** do bazy danych,
* poza transakcją aplikacyjną,
* event jest publikowany jako fakt domenowy.

---

### Obsługa eventu (Read Side / Projection)

* listener działa asynchronicznie,
* buduje read model,
* aktualizuje agregaty,
* może być wiele listenerów dla jednego eventu.

---

## Read Model

Cechy:

* denormalizowany,
* zoptymalizowany pod odczyt,
* brak walidacji domenowej,
* może zawierać preliczone statystyki.

Przykład:

* `survey_read`
* `response_read`
* `aggregate_result`

---

## AGGREGATE_RESULT

Służy do przechowywania statystyk ankiet.

Przykładowe dane:

* liczba odpowiedzi,
* średnia / mediana,
* rozkład odpowiedzi,
* NPS.

Aktualizowany **wyłącznie przez eventy**.

---

## Skalowanie EDA

### Kiedy dodać broker (Kafka / RabbitMQ)

* wiele instancji backendu,
* potrzeba retry / durability,
* niezależne skalowanie consumerów.

Architektura eventów pozostaje taka sama — zmienia się tylko transport.

---

## Antywzorce (zakazane)

* Event zawierający logikę
* Event używany jak request
* Synchroniczna aktualizacja read modelu
* Jedna transakcja: write + read
* Read model używany do walidacji

---

## Zasada nadrzędna

> **Command zmienia stan, Event informuje o fakcie, Query tylko czyta.**

Agent AI powinien zawsze projektować rozwiązania zgodnie z tą zasadą.
