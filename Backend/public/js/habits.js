document.addEventListener("DOMContentLoaded", () => {
    const user = getUser();
    if (!user) return logout();

    document.getElementById("logout-btn").addEventListener("click", logout);
    document.getElementById("new-habit-form").addEventListener("submit", createHabit);

    loadHabits();
});

let editingHabitId = null;

// ---------------------------------------------------------
// Hämta alla vanor
// ---------------------------------------------------------
async function loadHabits() {
    const user = getUser();
    const habits = await apiGet(`/habits/${user.id}`);

    window.currentHabits = habits;

    renderTodayHabits(habits);
    renderAllHabits(habits);
}

// ---------------------------------------------------------
// Skapa eller uppdatera vana
// ---------------------------------------------------------
async function createHabit(e) {
    e.preventDefault();

    const user = getUser();
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    let start_date = document.getElementById("start_date").value;
    const frequency = document.getElementById("frequency").value;

    if (!title || !frequency)
        return alert("Titel och frekvens är obligatoriska.");

    if (!start_date) {
        start_date = new Date().toISOString().split("T")[0];
    }

    if (editingHabitId) {
        await apiPut(`/habits/${editingHabitId}`, {
            title,
            description,
            start_date,
            frequency
        });

        editingHabitId = null;
        document.querySelector("#new-habit-form button").textContent = "Spara vana";
    } else {
        await apiPost("/habits", {
            user_id: user.id,
            title,
            description,
            start_date,
            frequency
        });
    }

    document.getElementById("new-habit-form").reset();
    await loadHabits();
}

// ---------------------------------------------------------
// Rendera dagens vanor
// ---------------------------------------------------------
function renderTodayHabits(habits) {
    const container = document.getElementById("today-list");
    const today = new Date().toISOString().split("T")[0];

    const todaysHabits = habits.filter(h => {
        const habitDate = new Date(h.start_date).toISOString().split("T")[0];
        return habitDate <= today;
    });

    container.innerHTML = todaysHabits.length
        ? todaysHabits.map(h => `
            <div class="today-item">
                <span>${h.title}</span>
            </div>
        `).join("")
        : `<div class="empty-state">Inga dagens vanor.</div>`;
}

// ---------------------------------------------------------
// Rendera alla vanor
// ---------------------------------------------------------
function renderAllHabits(habits) {
    const container = document.getElementById("habits-list");

    container.innerHTML = habits.length
        ? habits.map(h => `
            <div class="habit-item">
                <div class="habit-title">${h.title}</div>
                <div class="habit-description">${h.description || ""}</div>
                <div class="habit-frequency">Frekvens: ${h.frequency}</div>

                <button onclick="editHabit(${h.id})">Redigera</button>
                <button onclick="deleteHabit(${h.id})">Ta bort</button>
            </div>
        `).join("")
        : `<div class="empty-state">Inga vanor ännu.</div>`;
}

// ---------------------------------------------------------
// Ta bort vana
// ---------------------------------------------------------
async function deleteHabit(id) {
    if (!confirm("Ta bort vana?")) return;
    await apiDelete(`/habits/${id}`);
    loadHabits();
}
