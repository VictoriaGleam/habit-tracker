# Databasdesign – Habit Tracker

## 1. Översikt
Databasen består av tre tabeller: `users`, `habits` och `habit_log`.  
Strukturen följer ett enkelt och tydligt MVC-upplägg där varje tabell representerar en central del av applikationen.

Relationerna är:
- En användare kan ha flera vanor
- En vana kan ha flera loggar (dagliga markeringar)

---

## 2. ER-diagram (textbaserat)

users (1) ──── (∞) habits (1) ──── (∞) habit_log

---

## 3. Tabellbeskrivningar

### **users**
Lagrar information om användare och deras roll i systemet.

| Kolumn     | Typ     | Beskrivning                         |
|------------|---------|--------------------------------------|
| id         | INTEGER | Primärnyckel, autoincrement          |
| name       | TEXT    | Användarens namn                     |
| email      | TEXT    | Unik e-postadress                    |
| password   | TEXT    | Hashat lösenord                      |
| role       | TEXT    | "user" eller "admin"                 |

---

### **habits**
Lagrar användarens vanor.

| Kolumn       | Typ     | Beskrivning                                      |
|--------------|---------|---------------------------------------------------|
| id           | INTEGER | Primärnyckel, autoincrement                       |
| user_id      | INTEGER | Foreign key → users.id                            |
| title        | TEXT    | Namn på vanan                                     |
| description  | TEXT    | Kort beskrivning                                  |
| start_date   | TEXT    | Datum då vanan startar                            |
| frequency    | TEXT    | Frekvens (t.ex. "daily", "weekdays")              |

---

### **habit_log**
Lagrar dagliga markeringar för varje vana.

| Kolumn     | Typ     | Beskrivning                                      |
|------------|---------|---------------------------------------------------|
| id         | INTEGER | Primärnyckel, autoincrement                       |
| habit_id   | INTEGER | Foreign key → habits.id                           |
| date       | TEXT    | Datum för loggningen (YYYY-MM-DD)                 |
| status     | INTEGER | 1 = klarad, 0 = ej klarad                         |

---

## 4. Relationer

### **users → habits**
- En användare kan ha flera vanor  
- Kopplas via `habits.user_id`

### **habits → habit_log**
- En vana kan ha flera loggar  
- Kopplas via `habit_log.habit_id`

### **Sammanfattning**
- 1 user → ∞ habits  
- 1 habit → ∞ habit_logs  

---

## 5. Datatyper (SQLite)

- **INTEGER** – används för id, foreign keys och status  
- **TEXT** – används för namn, e-post, datum, beskrivningar  
- **AUTOINCREMENT** – genererar unika id:n  
- **FOREIGN KEY** – säkerställer relationer mellan tabeller  

---

## 6. Exempeldata (valfritt men bra för testning)

### users
| id | name     | email              | password | role  |
|----|----------|--------------------|----------|-------|
| 1  | Anna     | anna@mail.com      | (hash)   | user  |
| 2  | Admin    | admin@mail.com     | (hash)   | admin |

### habits
| id | user_id | title          | description        | start_date  | frequency |
|----|---------|----------------|--------------------|-------------|-----------|
| 1  | 1       | Dricka vatten  | 8 glas per dag     | 2026-01-10  | daily     |
| 2  | 1       | Läsa 10 min    | Kvällsrutin        | 2026-01-10  | daily     |

### habit_log
| id | habit_id | date       | status |
|----|----------|------------|--------|
| 1  | 1        | 2026-01-10 | 1      |
| 2  | 1        | 2026-01-11 | 0      |
| 3  | 2        | 2026-01-10 | 1      |

---

## 7. Sammanfattning
Databasen är enkel, skalbar och perfekt för en prototyp.  
Den stödjer:
- användare  
- vanor  
- dagliga markeringar  
- statistik  
- admin-översikt  

