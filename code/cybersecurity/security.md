# Rešena tveganja


## 2. Zaznana varnostna tveganja
| ID | Naziv | Resnost | Posledice | Datum odprave |
| :--- | :--- | :--- | :--- | :--- |
| SEC-01 | **Nezavarovan prenos podatkov** | Visoko | Ni šifriranja podatkov na API-jih in so lahko tarča preusmeritve, spremembe, kraje, ipd. | 13/03/2026
| SEC-02 | **Neobstoječa avtorizacija** | Visoko | Pomanjkanje avtorizacije | 14/03/2026
| SEC-## |  |  |  |

---

## 2. Rešitev tveganja
| ID | Naziv | Rešitev | Datum odprave |
| :--- | :--- | :--- | :--- 
| SEC-01 | **Nezavarovan prenos podatkov** | Sprememba HTTP v HTTPS protokol | 13/03/2026
| SEC-02 | **Neobstoječa avtorizacija** | Implementacija JWT | 14/03/2026
| SEC-## |  |  |  |

---

## 3.1 Varnostne izboljšave
* **Implementirana varna izmenjava podatkov**
* **Implementiran JWT**: Omejitev dostopa do podatkov dejanskim uporabnikom
