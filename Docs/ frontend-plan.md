# Frontend-plan – Habit Tracker

## 1. Översikt
Frontend består av statiska HTML-sidor med CSS och JavaScript.  
Syftet är att skapa en enkel, tydlig och användarvänlig prototyp som kommunicerar med backend via API-anrop.

---

## 2. Sidor som ska byggas

### 1. Login / Register
- Inloggningsformulär
- Registreringsformulär
- Felmeddelanden
- Koppling till backend (POST /users/login, POST /users/register)

### 2. User Dashboard
- Lista över användarens vanor
- Knapp: “Skapa ny vana”
- Markera dag som fullföljd
- Visa statistik (procent, streaks)
- Hämta data från backend (GET /habits)

### 3. Skapa vana
- Formulär för titel, beskrivning, startdatum, frekvens
- POST /habits

### 4. Statistik
- Visa:
  - procent klarade dagar
  - streaks
  - senaste 7 dagarna
- GET /habit-log

### 5. Admin Dashboard
- Lista över alla användares vanor
- Filter (per användare)
- Sökfunktion
- GET /admin/habits

---

## 3. Komponenter

### Navbar
- Dashboard
- Skapa vana
- Statistik
- Admin (endast om role = admin)

### Habit Card
- Titel
- Beskrivning
- Dagens status (klar/ej klar)
- Knapp: markera klar

### Statistikkomponent
- Procent
- Streak
- Diagram (enkel textbaserad prototyp)

---

## 4. Navigation
- Ingen SPA – varje sida är en egen HTML-fil
- JavaScript hanterar API-anrop
- LocalStorage lagrar:
  - token
  - user_id
  - role

---

## 5. Designprinciper
- Enkel, ren, modern
- Grön färgpalett (hälsa, vanor)
- Responsiv layout
- Fokus på tydlighet framför avancerad UI
