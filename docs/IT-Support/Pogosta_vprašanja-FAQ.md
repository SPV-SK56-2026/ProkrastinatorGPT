# ProkrastinatorGPT — Pogosta vprašanja (FAQ)

> Ta dokument zbira najpogostejša tehnična in splošna vprašanja o projektu ProkrastinatorGPT.
>
> **Repozitorij:** [github.com/SPV-SK56-2026/ProkrastinatorGPT](https://github.com/SPV-SK56-2026/ProkrastinatorGPT)
> **Zadnja posodobitev:** Marec 2026

---

## Kazalo

### Za končne uporabnike
1. [Splošno o razširitvi](#1-splošno-o-razširitvi)
2. [Uporaba in funkcionalnost](#2-uporaba-in-funkcionalnost)
3. [Zasebnost in varnost](#3-zasebnost-in-varnost)

---

---

# Za končne uporabnike

---

## 1. Splošno o razširitvi

---

**Kaj je ProkrastinatorGPT?**

ProkrastinatorGPT je brezplačna brskalniška razširitev za študente in dijake. Ko odpreš nalogo v Moodle učilnici, razširitev samodejno analizira navodila z umetno inteligenco in ti prikaže:
- kratek povzetek tega kar se od tebe zahteva,
- oceno zahtevnosti naloge,
- predviden čas za reševanje,
- načrt reševanja po korakih.

---

**Ali je razširitev brezplačna?**

Da, razširitev je brezplačna. 

---

**Na katerih brskalnikih deluje razširitev?**

Razširitev je združljiva z vsemi brskalniki, ki temeljijo na Chromium jedru ali podpirajo Web Extensions API:
- Google Chrome
- Microsoft Edge
- Vivaldi
- Mozilla Firefox

---

**Na katerih platformah deluje razširitev?**

Trenutno razširitev deluje na **Moodle** spletnih učilnicah.

---

**Ali moram imeti račun za uporabo?**

Da, za uporabo razširitve je potrebna registracija z e-poštnim naslovom in geslom. To nam omogoča shranjevanje preteklih analiz in upravljanje omejitev.

---

**Ali razširitev deluje brez internetne povezave?**

Ne. Razširitev za analizo nalog pošilja zahteve na naš strežnik in OpenAI API, kar zahteva aktivno internetno povezavo.

---

## 2. Namestitev

---

**Zakaj razširitve ne najdem v Chrome Web Store?**

Razširitev je trenutno v razvoju in še ni bila oddana v uradno pregledovanje Chrome Web Store. Na voljo je za prenos prek GitHub Releases:
[github.com/SPV-SK56-2026/ProkrastinatorGPT/releases](https://github.com/SPV-SK56-2026/ProkrastinatorGPT/releases)

---

**Chrome prikazuje opozorilo "This extension is not from the Chrome Web Store" — je to varno?**

Da, razširitev je varna. Opozorilo se prikaže pri vsaki razširitvi, ki ni naložena iz uradne trgovine. Ker je razširitev še v razvoju in ni bila oddana v Chrome Web Store, jo je treba namestiti ročno. Izvorna koda je v celoti javno dostopna na GitHubu.

---

**Razširitev v Firefoxu izgine po ponovnem zagonu brskalnika.**

Razširitev je bila naložena kot začasna (Temporary Add-on). Za trajno namestitev:
1. Odpri `about:addons`
2. Klikni zobnik **"Install Add-on From File..."**
3. Izberi datoteko `prokrastinator-firefox.xpi`

Če Firefox javi napako glede podpisa, uporabi Firefox Developer Edition.

---

**Kako posodobim razširitev na novejšo verzijo?**

1. Prenesi novo verzijo z [GitHub Releases](https://github.com/SPV-SK56-2026/ProkrastinatorGPT/releases)
2. Pojdi na stran z razširitvami (npr. `chrome://extensions/`)
3. Odstrani staro verzijo in namesti novo po enakem postopku

Ko bo razširitev v uradnih trgovinah, se bo posodabljala samodejno.

---

**Kako odstranim razširitev?**

1. Odpri stran z razširitvami (`chrome://extensions/`, `edge://extensions/`, `vivaldi://extensions/` ali `about:addons`)
2. Poišči **ProkrastinatorGPT**
3. Klikni **"Remove"** oziroma **"Odstrani"**

---

## 3. Uporaba in funkcionalnost

---

**Razširitev ne zazna naloge na moji Moodle strani.**

Možni vzroki:
- Tvoja šola uporablja nestandardno Moodle domeno, ki ni vključena v dovoljeni seznam. Obvesti nas prek [GitHub Issues](https://github.com/SPV-SK56-2026/ProkrastinatorGPT/issues) s svojo Moodle domeno.
- Stran se ni v celoti naložila — počakaj, da se stran popolnoma naloži, in poskusi znova.
- Razširitev morda ni aktivirana za to stran — preveri, da je ikona v orodni vrstici aktivna (ne siva).

---

**Ikone razširitve ne vidim v orodni vrstici.**

Klikni ikono sestavljanke v orodni vrstici brskalnika in nato (pin) zraven ProkrastinatorGPT. S tem jo pripneš v orodno vrstico.

---

**AI analiza vrne napačen ali nekoristen odgovor.**

AI modeli niso popolni in lahko občasno vrnejo nepopolne ali netočne informacije. Priporočamo:
- Vedno preveri AI odgovor z originalnimi navodili naloge.
- Če je odgovor očitno napačen, poišči gumb za osvežitev analize v popup oknu.
- Prijavi napako prek [GitHub Issues](https://github.com/SPV-SK56-2026/ProkrastinatorGPT/issues).

---

**Koliko časa traja analiza naloge?**

Analiza ponavadi traja 2–5 sekund. Čas je odvisen od dolžine navodil in obremenjenosti strežnika. Če je naloga že bila analizirana prej (enaka naloga na istem predmetu), je odgovor prikazan takoj iz predpomnilnika.

---

**Ali razširitev podpira naloge v tujih jezikih?**

Da. GPT-4o, ki ga razširitev uporablja za analizo, podpira večino svetovnih jezikov, vključno z angleščino, slovenščino in drugimi.

---

## 4. Zasebnost in varnost

---

**Ali razširitev shranjuje vsebino mojih nalog?**

Besedilo nalog se pošlje na naš backend strežnik za procesiranje z AI, nato pa se shrani v zbirko podatkov v anonimni obliki (brez vezave na osebne podatke) za namene predpomnjenja. Nalog ne delimo s tretjimi osebami razen z OpenAI za namen analize.

---

**Kdo ima dostop do mojih podatkov?**

Dostop do podatkov imajo samo člani razvojne ekipe SPV-SK56-2026. Podatkov ne prodajamo in ne delimo s tretjimi osebami. Za več informacij glejte našo politiko zasebnosti v repozitoriju.

---

**Je moje geslo varno?**

Da. Gesla so zgoščena z bcrypt algoritmom — to pomeni, da nikoli niso shranjena v čistem besedilu. Tudi v primeru vdora v bazo napadalec ne more pridobiti tvojega dejanskega gesla.

---

**Kako se odjavim iz razširitve?**

Klikni ikono razširitve v orodni vrstici → pojdi na nastavitve → **"Odjava"**. Opomba: logout funkcionalnost je trenutno še v razvoju.

---

**Ali je razširitev varna za uporabo na šolskih računalnikih?**

Da. Razširitev ne shranjuje občutljivih podatkov lokalno. API ključi so shranjeni samo na našem strežniku, ne v razširitvi sami. Komunikacija med razširitvijo in strežnikom poteka prek HTTPS.

---

*Ni odgovora na tvoje vprašanje? Odpri issue na [GitHubu](https://github.com/SPV-SK56-2026/ProkrastinatorGPT/issues) ali kontaktiraj razvojno ekipo SPV-SK56-2026.*
