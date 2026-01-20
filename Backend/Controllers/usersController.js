const bcrypt = require("bcrypt");
const db = require('../Models/database');


// ---------------------------------------------------------
// Registrera användare
// ---------------------------------------------------------
exports.register = (req, res) => {
    console.log("REGISTER BODY:", req.body);
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username och password krävs" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    db.run(
        `INSERT INTO users (username, password) VALUES (?, ?)`,
        [username, hashedPassword],
        function (err) {
            if (err) {
                console.log("DB ERROR (register):", err);
                return res.status(500).json({ error: "Kunde inte skapa användare" });
            }

            res.json({ id: this.lastID, username });
        }
    );
};

// ---------------------------------------------------------
// Logga in användare
// ---------------------------------------------------------
exports.login = (req, res) => {
    console.log("LOGIN BODY:", req.body);
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username och password krävs" });
    }

    db.get(
        `SELECT * FROM users WHERE username = ?`,
        [username],
        (err, user) => {
            if (err) {
                console.log("DB ERROR (login):", err);
                return res.status(500).json({ error: "Serverfel" });
            }

            if (!user) {
                return res.status(400).json({ error: "Fel användarnamn eller lösenord" });
            }

            const match = bcrypt.compareSync(password, user.password);
            if (!match) {
                return res.status(400).json({ error: "Fel användarnamn eller lösenord" });
            }

            res.json({ id: user.id, username: user.username });
        }
    );
};
