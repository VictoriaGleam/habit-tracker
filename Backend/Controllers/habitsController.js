const db = require('../Models/database');


// Hämta alla vanor för en användare
exports.getHabits = (req, res) => {
    const { user_id } = req.params;

    db.all(
        `SELECT id, user_id, title, description, start_date, frequency
         FROM habits
         WHERE user_id = ?`,
        [user_id],
        (err, rows) => {
            if (err) {
                console.log("DB ERROR (getHabits):", err);
                return res.status(500).json({ error: err.message });
            }
            res.json(rows);
        }
    );
};

// Skapa ny vana
exports.createHabit = (req, res) => {
    console.log("REQ BODY (createHabit):", req.body);

    const { user_id, title, description, start_date, frequency } = req.body;

    if (!user_id || !title || !start_date || !frequency) {
        return res.status(400).json({
            error: "user_id, title, start_date och frequency krävs."
        });
    }

    db.run(
        `INSERT INTO habits (user_id, title, description, start_date, frequency)
         VALUES (?, ?, ?, ?, ?)`,
        [user_id, title, description || "", start_date, frequency],
        function (err) {
            if (err) {
                console.log("DB ERROR (createHabit):", err);
                return res.status(500).json({ error: err.message });
            }

            res.json({
                id: this.lastID,
                user_id,
                title,
                description: description || "",
                start_date,
                frequency
            });
        }
    );
};

// Uppdatera vana
exports.updateHabit = (req, res) => {
    const { id } = req.params;
    const { title, description, start_date, frequency } = req.body;

    db.run(
        `UPDATE habits
         SET title = ?, description = ?, start_date = ?, frequency = ?
         WHERE id = ?`,
        [title, description || "", start_date, frequency, id],
        function (err) {
            if (err) {
                console.log("DB ERROR (updateHabit):", err);
                return res.status(500).json({ error: err.message });
            }

            res.json({ success: true });
        }
    );
};

// Ta bort vana
exports.deleteHabit = (req, res) => {
    const { id } = req.params;

    db.run(
        `DELETE FROM habits WHERE id = ?`,
        [id],
        function (err) {
            if (err) {
                console.log("DB ERROR (deleteHabit):", err);
                return res.status(500).json({ error: err.message });
            }

            res.json({ success: true });
        }
    );
};
