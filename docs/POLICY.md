# POLICY: CQRS + Event-Driven Architecture

## Zakres

Niniejszy dokument definiuje **obowiązujące zasady architektoniczne** dla agenta AI działającego w kontekście aplikacji ankiet online opartej o:

* Angular (frontend)
* NestJS (backend)
* Prisma ORM
* PostgreSQL
* Architektura: CQRS + Event-Driven Architecture (EDA)

Zasady mają charakter **wiążący** i nie podlegają interpretacji.

---

## Zasady nadrzędne (GLOBAL)

1. **Command, Event i Query są zawsze rozdzielone**
2. **Write model i Read model są zawsze rozdzielone**
3. **Event opisuje fakt, nigdy intencję**
4. **Read model nigdy nie wpływa na logikę domenową**
5. **Brak zależności wstecznych między modułami**

---

## POLITYKA COMMAND

### Dozwolone

* Command inicjuje zmianę stanu domeny
* Command przechodzi walidację biznesową
* Command może zostać odrzucony

### Zabronione

* Command emitujący Query
* Command aktualizujący Read Model
* Command wywołujący inny Command
* Command używany jako Event

---

## POLITYKA EVENT

### Definicja

Event to **nieodwracalny fakt domenowy**, który już się wydarzył.

### Dozwolone

* Emitowanie eventu **po zapisie** do Write DB
* Wiele listenerów dla jednego eventu
* Eventy asynchroniczne

### Zabronione

* Event zawierający logikę
* Event zwracający odpowiedź
* Event wywołujący Command
* Event używany do walidacji

---

## POLITYKA QUERY

### Dozwolone

* Query czyta wyłącznie Read Model
* Query nie posiada efektów ubocznych

### Zabronione

* Query modyfikujące dane
* Query odwołujące się do Write DB
* Query emitujące Event

---

## POLITYKA WRITE MODEL

### Dozwolone

* Normalizacja danych
* Walidacja reguł domenowych
* Transakcje

### Zabronione

* Agregacje statystyczne
* Logika prezentacyjna
* Cache pod odczyt

---

## POLITYKA READ MODEL

### Dozwolone

* Denormalizacja danych
* Preliczone statystyki
* Optymalizacja pod odczyt

### Zabronione

* Walidacja biznesowa
* Transakcje domenowe
* Zależność od Write Model

---

## POLITYKA EVENT HANDLERÓW

### Dozwolone

* Budowa projekcji (read model)
* Aktualizacja agregatów
* Integracje zewnętrzne

### Zabronione

* Modyfikacja Write Model
* Emisja kolejnych Command
* Logika decyzyjna domeny

---

## POLITYKA TRANSAKCJI

1. Write DB i Read DB **NIE mogą** być w jednej transakcji
2. Eventy są emitowane **po commit** Write DB
3. Spójność między modelami jest **eventualna**

---

## POLITYKA EDA (TRANSPORT)

### In-process events

Dozwolone gdy:

* pojedyncza instancja backendu
* brak wymagań durability

### Message broker (Kafka / RabbitMQ)

Wymagany gdy:

* wiele instancji backendu
* retry / replay
* niezależne skalowanie consumerów

Architektura eventów pozostaje niezmienna.

---

## POLITYKA AGREGATÓW (ANKIETY)

* Statystyki są liczone **wyłącznie** na podstawie eventów
* Agregaty są zapisywane w Read Model
* Brak dynamicznych obliczeń na Write Model

---

## ANTYWZORCE (BEZWZGLĘDNIE ZABRONIONE)

* "Szybki update" read modelu w command handlerze
* Jedna tabela dla write i read
* Event jako DTO HTTP
* Bezpośrednie wywołanie serwisu zamiast eventu
* Read model jako źródło prawdy

---

## ZASADA KOŃCOWA

> **Write Model jest źródłem prawdy. Read Model jest tylko projekcją.**

Agent AI ma obowiązek projektować i generować rozwiązania zgodnie z powyższymi zasadami, nawet kosztem prostoty implementacji.
