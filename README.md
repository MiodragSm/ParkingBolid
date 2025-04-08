# Mobilna aplikacija za plaćanje parkinga

## Opis projekta
Ova mobilna aplikacija omogućava jednostavno i brzo plaćanje parkinga putem SMS poruka u većini gradova u Srbiji. Korisnici mogu da odaberu grad, zonu parkiranja i vozilo, a aplikacija automatski generiše SMS poruku za plaćanje, čime se izbegavaju greške i štedi vreme. Cilj aplikacije je da olakša svakodnevno korišćenje javnih parking prostora, uz intuitivan i pregledan interfejs.

## Funkcionalnosti
- Pregled dostupnih zona parkiranja u različitim gradovima Srbije
- Automatsko generisanje SMS poruke za plaćanje parkinga
- Čuvanje i izbor više registarskih oznaka vozila
- Podešavanje podrazumevanog grada i vozila
- Jednostavan izbor grada i zone putem preglednih menija
- Sekcija za pomoć i podešavanja unutar aplikacije

## Tehnologije
- **React Native** – razvoj aplikacije za Android i iOS platforme iz jednog koda
- **JavaScript / TypeScript** – programski jezici korišćeni u razvoju
- **React Context API** – za upravljanje globalnim stanjem aplikacije
- **Metro bundler** – alat za razvoj i testiranje aplikacije
- **CocoaPods** – upravljanje i instalacija iOS biblioteka

## Instalacija
Pre instalacije, potrebno je podesiti razvojno okruženje prema [zvaničnom React Native vodiču](https://reactnative.dev/docs/environment-setup).

1. Klonirajte repozitorijum:
    ```bash
    git clone <URL do repozitorijuma>
    cd <ime-projekta>
    ```

2. Instalirajte JavaScript zavisnosti:
    ```bash
    npm install
    # ili
    yarn install
    ```

3. (iOS) Instalirajte CocoaPods zavisnosti:
    ```bash
    bundle install
    bundle exec pod install
    ```

4. Pokrenite Metro server:
    ```bash
    npm start
    # ili
    yarn start
    ```

5. Pokrenite aplikaciju:
    - **Android:**
        ```bash
        npm run android
        # ili
        yarn android
        ```
    - **iOS:**
        ```bash
        npm run ios
        # ili
        yarn ios
        ```

## Korišćenje
Nakon pokretanja aplikacije:
- Odaberite grad u kojem parkirate
- Izaberite odgovarajuću zonu parkiranja
- Odaberite ili unesite registarski broj vozila
- Aplikacija će generisati SMS poruku koju možete poslati na odgovarajući broj za plaćanje parkinga

## Slični programi
Aplikacija je razvijena kao alternativa postojećim rešenjima za plaćanje parkinga putem mobilnih uređaja, sa fokusom na jednostavnost i pouzdanost.

## Licenca
Ovaj projekat je open-source i dostupan pod MIT licencom.
