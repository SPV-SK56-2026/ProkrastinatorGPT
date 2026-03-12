# Backend – Database Setup

Ta projekt uporablja **PostgreSQL bazo podatkov**, ki je gostovana v oblaku na platformi **Render**. Struktura baze se upravlja preko migracij z orodjem **node-pg-migrate**.

## Povezava na bazo

Backend se na bazo povezuje preko okoljske spremenljivke `DATABASE_URL`.

V backend mapi je potrebno ustvariti `.env` datoteko z naslednjo vsebino:

DATABASE_URL="EXTERNAL URL na v discordu"

## Migracije baze

Za upravljanje strukture baze uporabljamo **node-pg-migrate**. Migracije omogočajo sledljivost sprememb baze in enostavno nadgrajevanje strukture.

### Poganjanje migracij

Izvede vse nove migracije:

npm run migrate

Razveljavi zadnjo migracijo:

npm run migrate:down

### Ustvarjanje nove migracije

npm run migrate:create -- ime-migracije

Vsaka sprememba strukture baze mora biti zapisana kot nova migracijska datoteka.