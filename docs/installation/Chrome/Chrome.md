# Namestitev razširitve v Chrome

Ta vodič prikazuje, kako ročno naložiš razširitev `ProkrastinatorGPT` v brskalnik Google Chrome.

## Predpogoji

Pred začetkom preveri:

- da imaš zgrajeno razširitev v mapi `code/frontend/dist`
- da uporabljaš lokalno kopijo projekta `ProkrastinatorGPT`

Mapa, ki jo boš izbral v Chrome, je:

```text
code/frontend/dist
```

## Koraki namestitve

### 1. Odpri meni v brskalniku Chrome

V zgornjem desnem kotu klikni ikono menija s tremi pikami.

![1. Odpri meni v Chrome](./Chrome_1.png)

### 2. Odpri upravljanje razširitev

V meniju izberi `Razširitve`, nato klikni `Upravljanje razširitev`.

![2. Odpri upravljanje razširitev](./Chrome_2.png)

### 3. Vklopi način za razvijalce

Na strani `chrome://extensions` v zgornjem desnem kotu vklopi stikalo `Način za razvijalce`.

![3. Vklopi način za razvijalce](./Chrome_3.png)

### 4. Klikni Naloži razpakirano

Ko je način za razvijalce vklopljen, klikni gumb `Naloži razpakirano`.

![4. Naloži razpakirano razširitev](./Chrome_4.png)

### 5. Izberi mapo dist

V raziskovalcu datotek odpri mapo projekta, nato pojdi v `code/frontend` in izberi mapo `dist`. Nato klikni `Izberite mapo`.

![5. Izberi mapo dist](./Chrome_5.png)

### 6. Preveri, da je razširitev uspešno naložena

Če je bila namestitev uspešna, se bo na strani z razširitvami prikazala kartica `ProkrastinatorGPT`. Preveri tudi, da je razširitev vklopljena.

![6. Uspešno naložena razširitev](./Chrome_6.png)

## Če razširitve ne vidiš

Preveri naslednje:

- da si izbral mapo `code/frontend/dist` in ne `src` ali `public`
- da mapa `dist` vsebuje datoteko `manifest.json`
- da je razširitev po nalaganju ostala vklopljena

## Opomba

Če spremeniš kodo razširitve, jo običajno ponovno zgradiš in nato na strani `chrome://extensions` klikneš ikono za osvežitev razširitve.
