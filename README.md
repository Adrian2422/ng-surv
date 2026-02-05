Monorepo aplikacji do tworzenia ankiet
=====================================

Krótki opis
----------

To jest monorepo aplikacji do tworzenia ankiet. Zawiera osobne aplikacje frontendowe i backendowe oraz wspólne ustawienia projektu.

Aktualny stan repozytorium
---------------------------

- Root: pliki konfiguracyjne monorepo (`pnpm-workspace.yaml`, `pnpm-lock.yaml`, `package.json`)
- `apps/api` — backend (NestJS) z podstawową strukturą kodu i testami
- `apps/web` — frontend (Angular) z podstawową strukturą aplikacji

Uwagi dotyczące uruchamiania
---------------------------

1. Zainstaluj zależności na poziomie repozytorium:

   pnpm install

2. Sprawdź i uruchom wybrany projekt (przykładowo):

   cd apps/api
   pnpm run start:dev   # lub sprawdź dostępne skrypty w apps/api/package.json

   cd ../web
   pnpm run start       # lub sprawdź dostępne skrypty w apps/web/package.json

Co warto dodać dalej
-------------------

- Rozszerzyć README każdego subprojektu (`apps/api`, `apps/web`) o szczegółowe instrukcje
- Dodać opis CI/CD oraz standardy uruchamiania i testowania
- Dokumentację API (np. Swagger) oraz przykładowe scenariusze testowe

Kontakt / informacje
---------------------

Jeśli potrzebujesz, mogę rozbudować ten README o instrukcje uruchomienia, diagramy architektury lub sekcję deweloperską.
