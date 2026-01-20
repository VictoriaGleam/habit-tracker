const API_URL = "http://localhost:3000";

async function apiPost(path, data) {
    const res = await fetch(API_URL + path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return res.json();
}

async function apiGet(path) {
    const res = await fetch(API_URL + path);
    return res.json();
}

async function apiDelete(path) {
    const res = await fetch(API_URL + path, { method: "DELETE" });
    return res.json();
}

async function apiPut(path, data) {
    const res = await fetch(API_URL + path, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return res.json();
}
