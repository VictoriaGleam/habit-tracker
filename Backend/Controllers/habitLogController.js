const db = require('../Models/database');


// Hämta historik för en vana
exports.getHistory = (req, res) => {
    const { habit_id } = req.params;

    db.all(
        `SELECT date, done
         FROM habit_log
         WHERE habit_id = ?
         ORDER BY date ASC`,
        [habit_id],
        (err, rows) => {
            if (err) {
                console.log("DB ERROR (getHistory):", err);
                return res.status(500).json({ error: err.message });
            }
            res.json(rows);
        }
    );
};

// Hämta logg för viss dag
exports.getLogForDate = (req, res) => {
    const { habit_id, date } = req.params;

    db.get(
        `SELECT id, habit_id, date, done
         FROM habit_log
         WHERE habit_id = ? AND date = ?`,
        [habit_id, date],
        (err, row) => {
            if (err) {
                console.log("DB ERROR (getLogForDate):", err);
                return res.status(500).json({ error: err.message });
            }
            res.json(row || { done: 0 });
        }
    );
};

// Markera vana som klar
exports.markDone = (req, res) => {
    const { habit_id, date, done } = req.body;

    if (!habit_id || !date) {
        return res.status(400).json({ error: "habit_id och date krävs" });
    }

    db.get(
        `SELECT id FROM habit_log WHERE habit_id = ? AND date = ?`,
        [habit_id, date],
        (err, row) => {
            if (err) {
                console.log("DB ERROR (markDone - select):", err);
                return res.status(500).json({ error: err.message });
            }

            if (row) {
                db.run(
                    `UPDATE habit_log SET done = ? WHERE id = ?`,
                    [done, row.id],
                    function (err2) {
                        if (err2) {
                            console.log("DB ERROR (markDone - update):", err2);
                            return res.status(500).json({ error: err2.message });
                        }
                        res.json({ success: true });
                    }
                );
            } else {
                db.run(
                    `INSERT INTO habit_log (habit_id, date, done)
                     VALUES (?, ?, ?)`,
                    [habit_id, date, done],
                    function (err2) {
                        if (err2) {
                            console.log("DB ERROR (markDone - insert):", err2);
                            return res.status(500).json({ error: err2.message });
                        }
                        res.json({ success: true });
                    }
                );
            }
        }
    );
};
