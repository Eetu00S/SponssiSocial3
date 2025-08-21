# Sponssi Social

Sponssi Social on moderni sosiaalisen median sivusto, joka yhdistää uutiset ja keskustelun. Sivusto on suunniteltu Ylen tyyliseksi ja keskittyy nuorille ja Pirkanmaan alueelle. Se tarjoaa käyttäjille mahdollisuuden julkaista artikkeleita ja kommentoida niitä, erityisesti koulutus- ja paikallisuutisiin keskittyen.

## Ominaisuudet

### 🎨 Käyttöliittymä
- **Moderni ja responsiivinen design** - Toimii kaikilla laitteilla
- **Dark/Light mode** - Vaihda teemaa yhden klikkauksella
- **Ylen tyylinen ulkoasu** - Tuttu ja käyttäjäystävällinen

### 📝 Artikkelit
- **Artikkelien julkaisu** - Julkaise omia artikkeleita helposti
- **Kategoriat** - Jaa artikkelit kategorioihin (Koulutus, Pirkanmaa, Kulttuuri, Urheilu, Teknologia)
- **Kirjoittajan nimi** - Näytä artikkelin kirjoittaja
- **Aikaleima** - Näytä julkaisuajan
- **Nuorille suunnatut aiheet** - Keskitys lukioaiheisiin ja paikallisiin uutisiin

### 💬 Kommentointi
- **Kommentit artikkeleille** - Lisää kommentteja artikkeleihin
- **Kommentoijan nimi** - Näytä kommentoijan nimi
- **Aikaleima** - Näytä kommentin ajan

### 🔍 Hakeminen ja suodattaminen
- **Kategoriasuodattimet** - Suodata artikkelit kategorioittain
- **Järjestelyvaihtoehdot** - Uusimmat, suosituimmat, eniten kommentteja
- **Navigaatio** - Etusivu, trendit, uusimmat
- **Pirkanmaa-keskitys** - Paikalliset uutiset ja tapahtumat

### ❤️ Sosiaaliset ominaisuudet
- **Tykkäysjärjestelmä** - Tykkää artikkeleista
- **Kommenttilaskuri** - Näytä kommenttien määrä
- **Trendit** - Näytä suosituimmat aiheet (#LukioElämä, #Tampere, #Ylioppilaskirjoitukset)

## Käyttöohjeet

### Artikkelin julkaisu
1. Klikkaa "Julkaise"-painiketta oikeassa yläkulmassa
2. Täytä lomake:
   - Kirjoittajan nimi
   - Artikkelin otsikko
   - Valitse kategoria
   - Kirjoita artikkelin sisältö
3. Klikkaa "Julkaise"

### Kommentin lisääminen
1. Klikkaa kommenttikuvaketta artikkelin alla
2. Täytä lomake:
   - Nimesi
   - Kommenttisi
3. Klikkaa "Lähetä"

### Teeman vaihto
- Klikkaa kuu/aurinko-ikonia oikeassa yläkulmassa vaihtaaksesi dark/light modea välillä

### Suodattaminen
- Käytä sivupalkin kategorioita suodattaaksesi artikkeleita
- Käytä yläpalkin valitsinta järjestelläksesi artikkeleita

## Teknologiat

- **HTML5** - Semanttinen rakenne
- **CSS3** - Moderni tyylitys ja animaatiot
- **JavaScript (ES6+)** - Interaktiivinen toiminnallisuus
- **LocalStorage** - Tietojen tallennus selaimessa
- **Font Awesome** - Ikonit
- **Google Fonts** - Inter-fontti

## Tiedostorakenne

```
Sponssi Social/
├── index.html          # Pääsivu
├── styles.css          # Tyylitiedosto
├── script.js           # JavaScript-toiminnallisuus
└── README.md           # Tämä tiedosto
```

## Asennus ja käyttö

1. Lataa kaikki tiedostot samaan kansioon
2. Avaa `index.html` selaimessa
3. Aloita käyttö!

Sivusto toimii kokonaan selaimessa eikä vaadi palvelinta. Kaikki tiedot tallennetaan selaimen LocalStorageen.

### Yhteinen backend (jotta julkaisut/kommentit näkyvät kaikille)

Tarvitset pienen Node.js-palvelimen. Voit ajaa sen paikallisesti tai hostata esim. Render/railway.

Paikallinen kehitys:

```bash
cd "Somesovellus/Sponssi Social"
npm install
npm start
```

Tämä käynnistää API:n porttiin 3000. Frontend käyttää automaattisesti `http://localhost:3000` kun se avataan paikallisesti.

Staattinen hostaus (GitHub Pages):
1. Hostaa `server.js` esim. Renderissä ja saat osoitteen tyyliin `https://<oma-api>.onrender.com`
2. Avaa `config.js` ja aseta:

```js
window.SPONSSI_API_BASE = 'https://<oma-api>.onrender.com';
```

Frontend käyttää nyt yhteistä API:ta, ja julkaisut/kommentit näkyvät kaikille.

## Tulevaisuuden ominaisuudet

- Käyttäjätilien järjestelmä
- Kuvien lisääminen artikkeleihin
- Hakutoiminto
- Ilmoitukset uusista artikkeleista
- Mobiilisovellus
- Lukioiden omat uutiskanavat
- Tapahtumakalenteri Pirkanmaalle

## Lisenssi

Tämä projekti on avoimen lähdekoodin ja vapaasti käytettävissä.

---

**Sponssi Social** - Nuorten ääni Pirkanmaalla! 📚🏫✨
