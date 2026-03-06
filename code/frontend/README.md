# Front-end Razvoj

Tukaj se nahaja vsa koda za uporabniški vmesnik.

## Navodila
- Vse komponente in sloge (CSS/SASS) shranjujte v to mapo.
- Preden dodate novo knjižnico, se posvetujte z ostalimi v ekipi.
- **Pomembno:** Prepričajte se, da se vaša koda pravilno poveže z Back-end API-jem.

## Gradnja razširitve

Zaženi:
```
npm run build
```

Ta ukaz ustvari mapo `dist`.

Če ni vključene datoteke `manifest.json` samodejno, jo ročno kopiraj v mapo `dist`.

Struktura mape mora zgledati tako:
```
dist/
manifest.json
index.html
assets/
```

## Nalaganje razširitve v Chrome

- Odpri **Google Chrome**
- Pojdi na `chrome://extensions`
- Vklopi **Način za razvijalce**
- Klikni **Naloži razpakirano**
- Izberi mapo `dist`

Po uspešni namestitvi se bo pojavila **ikona razširitve**.  
