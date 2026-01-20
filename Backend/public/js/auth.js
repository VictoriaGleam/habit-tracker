// ---------------------------------------------------------
// Registrera användare
// ---------------------------------------------------------
async function register(event) {
    event.preventDefault();

    const username = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    const response = await fetch("/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (data.error) {
        alert(data.error);
        document.getElementById("register-password").value = "";
        return;
    }

    localStorage.setItem("user_id", data.id);
    window.location.href = "dashboard.html";
}

// ---------------------------------------------------------
// Logga in användare
// ---------------------------------------------------------
async function login(event) {
    event.preventDefault();

    const username = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const response = await fetch("/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (data.error) {
        alert(data.error);
        document.getElementById("login-password").value = "";
        return;
    }

    localStorage.setItem("user_id", data.id);
    window.location.href = "dashboard.html";
}
