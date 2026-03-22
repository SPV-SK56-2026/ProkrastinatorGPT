# Namestitev razširitve v Edge

Ta vodič prikazuje, kako ročno naložiš razširitev `ProkrastinatorGPT` v brskalnik Microsoft Edge.

## Predpogoji

Pred začetkom preveri:

- da imaš zgrajeno razširitev v mapi `code/frontend/dist`
- da uporabljaš lokalno kopijo projekta `ProkrastinatorGPT`

Mapa, ki jo boš izbral v Edge, je:

```text
code/frontend/dist
```

## Koraki namestitve

### 1. Odpri meni v brskalniku Edge

V zgornjem desnem kotu klikni ikono menija s tremi pikami.

![1. Odpri meni v Edge](./Edge_1.png)

### 2. Odpri upravljanje razširitev

V meniju izberi `Razširitve`, nato klikni `Upravljanje razširitev`.

![2. Odpri upravljanje razširitev](./Edge_2.png)

### 3. Vklopi način za razvijalce in klikni Naloži nezapakirano

Na strani `edge://extensions` v levem spodnjem delu vklopi `Način za razvijalce`. Nato klikni gumb `Naloži nezapakirano`.

![3. Vklopi način za razvijalce in naloži razširitev](./Edge_3.png)

### 4. Izberi mapo dist

V raziskovalcu datotek odpri mapo projekta, nato pojdi v `code/frontend` in izberi mapo `dist`. Nato klikni `Izberite mapo`.

![4. Izberi mapo dist](./Edge_4.png)

### 5. Preveri, da je razširitev uspešno naložena

Če je bila namestitev uspešna, se bo na strani z razširitvami prikazala kartica `ProkrastinatorGPT`. Preveri tudi, da je razširitev vklopljena.

![5. Uspešno naložena razširitev](./Edge_5.png)

## Če razširitve ne vidiš

Preveri naslednje:

- da si izbral mapo `code/frontend/dist` in ne `src` ali `public`
- da mapa `dist` vsebuje datoteko `manifest.json`
- da je razširitev po nalaganju ostala vklopljena

## Opomba

Če spremeniš kodo razširitve, jo običajno ponovno zgradiš in nato na strani `edge://extensions` klikneš `Naloži znova` ali osvežiš razširitev.
