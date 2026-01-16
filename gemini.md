# Mój Komunikator - Dokumentacja Projektu

## 📋 Opis Projektu

Prosty klient czatu zbudowany w **React Native (Expo)** komunikujący się z serwerem **Socket.io**. Aplikacja umożliwia wysyłanie i odbieranie wiadomości w czasie rzeczywistym.

---

## 🗂 Struktura Projektu

```
moj-komunikator/
├── App.js              # Główna aplikacja React Native
├── package.json        # Zależności klienta
├── app.json            # Konfiguracja Expo
├── babel.config.js     # Konfiguracja Babel
├── gemini.md           # Ta dokumentacja
└── serwer/
    ├── index.js        # Serwer Socket.io
    └── package.json    # Zależności serwera
```

---

## 🚀 Instrukcja Uruchomienia

### Krok 1: Instalacja zależności klienta

Otwórz terminal w katalogu projektu:

```bash
cd c:\Users\Lentach\Desktop\moj-komunikator
npm install
```

### Krok 2: Instalacja zależności serwera

W **nowym** oknie terminala:

```bash
cd c:\Users\Lentach\Desktop\moj-komunikator\serwer
npm install
```

### Krok 3: Uruchomienie serwera

W terminalu z katalogu `serwer`:

```bash
npm start
```

Powinieneś zobaczyć:
```
========================================
  Serwer czatu działa na porcie 3000
  http://localhost:3000
========================================
```

### Krok 4: Uruchomienie aplikacji

W pierwszym terminalu (katalog główny projektu):

```bash
npx expo start --web
```

Aplikacja otworzy się w przeglądarce pod adresem `http://localhost:8081`.

---

## 🧪 Testowanie

### Test komunikacji między oknami:

1. Otwórz aplikację w przeglądarce
2. Otwórz **drugą kartę** z tym samym adresem (`http://localhost:8081`)
3. Ustaw okna obok siebie
4. Wyślij wiadomość z jednego okna → powinna pojawić się w obu

### Weryfikacja połączenia:

- **Zielony status "Połączono ✓"** = serwer działa, połączenie aktywne
- **Czerwony status "Rozłączono ✗"** = serwer nie działa, uruchom go

---

## 🏗 Architektura

### Klient (App.js)

| Element | Opis |
|---------|------|
| `useState` | Przechowuje: tekst wiadomości, listę wiadomości, status połączenia |
| `useRef` | Przechowuje referencję do socket.io |
| `useEffect` | Inicjalizuje połączenie socket przy starcie |
| `FlatList` | Wyświetla listę wiadomości |
| `TextInput` | Pole do wpisywania wiadomości |
| `TouchableOpacity` | Przycisk "Wyślij" |

### Serwer (serwer/index.js)

| Element | Opis |
|---------|------|
| Express | Serwer HTTP |
| Socket.io | Obsługa WebSocket |
| `wyslij_wiadomosc` | Event odbierany od klienta |
| `odbierz_wiadomosc` | Event wysyłany do wszystkich klientów |

### Przepływ wiadomości:

```
Klient A                    Serwer                     Klient B
   │                          │                           │
   │──wyslij_wiadomosc───────>│                           │
   │                          │──odbierz_wiadomosc──────>│
   │<──odbierz_wiadomosc──────│                           │
   │                          │                           │
```

---

## 🔐 Bezpieczeństwo (Przygotowanie pod szyfrowanie)

Kod zawiera dwie funkcje-placeholder gotowe na implementację szyfrowania:

### `prepareMessageForSending(text)`
```javascript
// Lokalizacja: App.js, linie 35-40
// Wywoływana przed wysłaniem wiadomości
// TODO: Dodaj szyfrowanie (np. AES-256)
```

### `processIncomingMessage(msg)`
```javascript
// Lokalizacja: App.js, linie 47-54
// Wywoływana po odebraniu wiadomości
// TODO: Dodaj deszyfrowanie
```

**Przykład przyszłej implementacji:**
```javascript
import CryptoJS from 'crypto-js';
const SECRET_KEY = 'twój-tajny-klucz';

const prepareMessageForSending = (text) => {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};

const processIncomingMessage = (msg) => {
  const bytes = CryptoJS.AES.decrypt(msg, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
```

---

## 📦 Wymagane biblioteki

### Klient (główny folder):
- `expo` - Framework React Native
- `socket.io-client` - Klient WebSocket
- `react-native-web` - Obsługa przeglądarki
- `react-dom` - Renderowanie w przeglądarce

### Serwer (folder `serwer`):
- `express` - Serwer HTTP
- `socket.io` - Serwer WebSocket

---

## ⚠️ Rozwiązywanie problemów

| Problem | Rozwiązanie |
|---------|-------------|
| `ERR_CONNECTION_REFUSED` | Uruchom serwer: `cd serwer && npm start` |
| Status "Rozłączono" | Sprawdź czy serwer działa na porcie 3000 |
| Wiadomości nie przychodzą | Odśwież stronę (F5) i sprawdź konsolę |
| Błąd `socket is undefined` | Upewnij się że `socketRef.current` istnieje |

---

## 📝 Historia zmian

| Data | Zmiana |
|------|--------|
| 2026-01-15 | Utworzenie projektu od podstaw |
| 2026-01-15 | Dodanie statusu połączenia w UI |
| 2026-01-15 | Przygotowanie placeholderów na szyfrowanie |
| 2026-01-16 | Utworzenie profesjonalnego README.md |

---

## 👤 Dla następnego agenta

Jeśli kontynuujesz pracę nad tym projektem:

1. **Struktura jest kompletna** - wszystkie pliki są na miejscu
2. **Serwer wymaga osobnego uruchomienia** - `cd serwer && npm start`
3. **Szyfrowanie** - zaimplementuj w funkcjach `prepareMessageForSending` i `processIncomingMessage`
4. **Testy** - otwórz dwie karty przeglądarki aby testować

Kluczowe pliki do edycji:
- `App.js` - logika klienta
- `serwer/index.js` - logika serwera
