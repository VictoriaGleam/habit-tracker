const userId = localStorage.getItem("user_id");
if (!userId) {
    window.location.href = "login.html"; // detta ska vara login.html – korrekt
}

// ---------------------------------------------------------
// Logga ut
// ---------------------------------------------------------
function logout() {
    localStorage.removeItem("user_id");
    window.location.href = "index.html"; // ändrad från login.html → index.html
}

let currentHabit = null;
let habitToDelete = null;

// ---------------------------------------------------------
// Ladda alla vanor
// ---------------------------------------------------------
async function loadHabits() {
    const res = await fetch(`/habits/${userId}`);
    const habits = await res.json();

    const habitList = document.getElementById("habit-list");
    habitList.innerHTML = "";

    habits.forEach(habit => {
        const li = document.createElement("li");
        li.classList.add("habit-item");

        li.innerHTML = `
            <div>
                <strong>${habit.title}</strong><br>
                <small>${habit.description || ""}</small>
            </div>
            <div class="habit-actions">
                <button onclick="openEditModal(${habit.id})">Redigera</button>
                <button onclick="openDeleteModal(${habit.id})">Ta bort</button>
            </div>
        `;

        habitList.appendChild(li);
    });

    await loadTodayHabits();
    await loadHistoryDropdown();
}

// ---------------------------------------------------------
// Skapa ny vana
// ---------------------------------------------------------
async function createHabit(event) {
    event.preventDefault();

    let startDate = document.getElementById("start_date").value;
    if (!startDate) {
        startDate = new Date().toISOString().split("T")[0];
    }

    const habit = {
        user_id: userId,
        title: document.getElementById("habit-title").value,
        description: document.getElementById("habit-description").value,
        frequency: document.getElementById("habit-frequency").value,
        start_date: startDate
    };

    await fetch("/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(habit)
    });

    document.getElementById("new-habit-form").reset();
    await loadHabits();
}

// ---------------------------------------------------------
// Öppna redigeringsmodal
// ---------------------------------------------------------
async function openEditModal(id) {
    const res = await fetch(`/habits/${userId}`);
    const habits = await res.json();
    currentHabit = habits.find(h => h.id === id);

    document.getElementById("editTitle").value = currentHabit.title;
    document.getElementById("editDescription").value = currentHabit.description;
    document.getElementById("editFrequency").value = currentHabit.frequency;

    document.getElementById("editModal").classList.remove("hidden");
}

// Stäng redigeringsmodal
document.getElementById("cancelEdit").onclick = () => {
    document.getElementById("editModal").classList.add("hidden");
};

// Spara ändringar
document.getElementById("saveEdit").onclick = async () => {
    const updated = {
        title: document.getElementById("editTitle").value,
        description: document.getElementById("editDescription").value,
        frequency: document.getElementById("editFrequency").value,
        start_date: currentHabit.start_date
    };

    await fetch(`/habits/${currentHabit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
    });

    document.getElementById("editModal").classList.add("hidden");
    await loadHabits();
};

// ---------------------------------------------------------
// Öppna ta-bort-modal
// ---------------------------------------------------------
function openDeleteModal(id) {
    habitToDelete = id;
    document.getElementById("deleteModal").classList.remove("hidden");
}

// Stäng ta-bort-modal
document.getElementById("cancelDelete").onclick = () => {
    habitToDelete = null;
    document.getElementById("deleteModal").classList.add("hidden");
};

// Bekräfta borttagning
document.getElementById("confirmDelete").onclick = async () => {
    if (!habitToDelete) return;

    await fetch(`/habits/${habitToDelete}`, {
        method: "DELETE"
    });

    habitToDelete = null;
    document.getElementById("deleteModal").classList.add("hidden");
    await loadHabits();
};

// ---------------------------------------------------------
// Dagens vanor
// ---------------------------------------------------------
async function loadTodayHabits() {
    const res = await fetch(`/habits/${userId}`);
    const habits = await res.json();

    const todayList = document.getElementById("today-habits");
    todayList.innerHTML = "";

    const today = new Date().toISOString().split("T")[0];

    for (const habit of habits) {
        const habitDate = new Date(habit.start_date).toISOString().split("T")[0];
        if (habitDate > today) continue;

        const logRes = await fetch(`/habitlog/${habit.id}/${today}`);
        const log = await logRes.json();

        const li = document.createElement("li");
        li.classList.add("today-item");

        li.innerHTML = `
            <span>${habit.title}</span>
            <button onclick="markDone(${habit.id})"
                style="background:${log.done ? '#8BC34A' : '#FF4FA3'}">
                ${log.done ? "Klar" : "Done"}
            </button>
        `;

        todayList.appendChild(li);
    }
}

// ---------------------------------------------------------
// Markera som klar
// ---------------------------------------------------------
async function markDone(habitId) {
    const today = new Date().toISOString().split("T")[0];

    await fetch("/habitlog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            habit_id: habitId,
            date: today,
            done: 1
        })
    });

    await loadTodayHabits();
    await loadHistory();
}

// ---------------------------------------------------------
// Historik dropdown
// ---------------------------------------------------------
async function loadHistoryDropdown() {
    const res = await fetch(`/habits/${userId}`);
    const habits = await res.json();

    const select = document.getElementById("history-select");
    select.innerHTML = "";

    habits.forEach(habit => {
        const option = document.createElement("option");
        option.value = habit.id;
        option.textContent = habit.title;
        select.appendChild(option);
    });

    if (habits.length > 0) {
        await loadHistory();
    }
}

// ---------------------------------------------------------
// Historiklista
// ---------------------------------------------------------
async function loadHistory() {
    const habitId = document.getElementById("history-select").value;
    if (!habitId) return;

    const res = await fetch(`/habitlog/${habitId}`);
    const history = await res.json();

    const list = document.getElementById("history-list");
    list.innerHTML = "";

    history.forEach(entry => {
        const li = document.createElement("li");
        li.classList.add("history-item");

        li.innerHTML = `
            <span class="history-date">${entry.date}</span>
            <span class="history-status">${entry.done ? "✔" : "✘"}</span>
        `;

        list.appendChild(li);
    });
}

loadHabits();

// ---------------------------------------------------------
// TAB-MENY
// ---------------------------------------------------------
const tabs = document.querySelectorAll(".dashboard-tabs button");
const sections = document.querySelectorAll(".section-card");

sections.forEach(sec => sec.style.display = "none");
document.getElementById("today").style.display = "block";
tabs[0].classList.add("active");

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        const target = tab.dataset.tab;

        sections.forEach(sec => sec.style.display = "none");
        document.getElementById(target).style.display = "block";

        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
    });
});
