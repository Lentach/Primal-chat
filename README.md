# 💬 Mój Komunikator

Prosty klient czatu zbudowany w **React Native (Expo)** z backendem **Socket.io**. Umożliwia komunikację w czasie rzeczywistym między wieloma użytkownikami.

![Status](https://img.shields.io/badge/status-aktywny-brightgreen)
![React Native](https://img.shields.io/badge/React%20Native-v0.73.6-blue)
![Expo](https://img.shields.io/badge/Expo-v50-purple)
![Socket.io](https://img.shields.io/badge/Socket.io-v4.7.5-black)

---

## ✨ Funkcje

- 📱 **Wieloplatformowość** - Działa na Web, Android i iOS
- 🔄 **Komunikacja w czasie rzeczywistym** - WebSocket przez Socket.io
- 🎨 **Nowoczesny interfejs** - Inspirowany popularnymi komunikatorami
- ⚡ **Automatyczne ponowne łączenie** - W przypadku utraty połączenia
- 🔒 **Gotowość na szyfrowanie** - Przygotowane funkcje placeholder

---

## 🚀 Szybki Start

### 1. Instalacja zależności

```bash
# Klient (główny folder)
npm install

# Serwer
cd serwer && npm install
```

### 2. Uruchomienie serwera

```bash
cd serwer
npm start
```

Powinieneś zobaczyć:
```
========================================
  Serwer czatu działa na porcie 3000
  http://localhost:3000
========================================
```

### 3. Uruchomienie aplikacji

W **nowym terminalu** (w głównym folderze projektu):

```bash
npx expo start --web
```

Aplikacja otworzy się w przeglądarce pod adresem `http://localhost:8081`

---

## 📂 Struktura Projektu

```
moj-komunikator/
├── App.js              # Główna aplikacja React Native
├── package.json        # Zależności klienta
├── app.json            # Konfiguracja Expo
├── gemini.md           # Szczegółowa dokumentacja techniczna
├── README.md           # Ten plik
└── serwer/
    ├── index.js        # Serwer Socket.io
    └── package.json    # Zależności serwera
```

---

## 🧪 Testowanie

1. Otwórz aplikację w przeglądarce
2. Otwórz **drugą kartę** z tym samym adresem
3. Wyślij wiadomość z jednego okna → powinna pojawić się w obu

### Weryfikacja statusu:
- **Zielony** "Połączono ✓" = Serwer działa
- **Czerwony** "Rozłączono ✗" = Uruchom serwer

---

## 🏗️ Architektura

```
┌─────────────┐     WebSocket     ┌─────────────┐
│   Klient A  │ ◄──────────────►  │   Serwer    │
└─────────────┘                   │  Socket.io  │
                                  │  Port 3000  │
┌─────────────┐     WebSocket     │             │
│   Klient B  │ ◄──────────────►  └─────────────┘
└─────────────┘
```

### Eventy Socket.io:
| Event | Kierunek | Opis |
|-------|----------|------|
| `wyslij_wiadomosc` | Klient → Serwer | Wysłanie wiadomości |
| `odbierz_wiadomosc` | Serwer → Klienci | Broadcast wiadomości |

---

## 🔐 Bezpieczeństwo

Aplikacja zawiera przygotowane funkcje placeholder na szyfrowanie:

- `prepareMessageForSending(text)` - Szyfrowanie przed wysłaniem
- `processIncomingMessage(msg)` - Deszyfrowanie po odebraniu

**Przykład implementacji (CryptoJS):**
```javascript
import CryptoJS from 'crypto-js';
const SECRET = 'twój-klucz';

const encrypt = (text) => CryptoJS.AES.encrypt(text, SECRET).toString();
const decrypt = (msg) => CryptoJS.AES.decrypt(msg, SECRET).toString(CryptoJS.enc.Utf8);
```

---

## ⚠️ Rozwiązywanie Problemów

| Problem | Rozwiązanie |
|---------|-------------|
| `ERR_CONNECTION_REFUSED` | Uruchom serwer: `cd serwer && npm start` |
| "Rozłączono" w UI | Sprawdź czy serwer działa na porcie 3000 |
| Brak wiadomości | Odśwież stronę (F5) |

---

## 📦 Technologie

| Warstwa | Technologia |
|---------|-------------|
| Frontend | React Native + Expo |
| Backend | Express + Socket.io |
| Komunikacja | WebSocket |

---

## 📄 Dokumentacja

Szczegółowa dokumentacja techniczna znajduje się w pliku [gemini.md](./gemini.md).

---

## 📝 Licencja

Ten projekt jest dostępny do użytku prywatnego i edukacyjnego.

---

## 👨‍💻 Autorstwo

Projekt stworzony z pomocą AI (Gemini).

*Ostatnia aktualizacja: Styczeń 2026*
