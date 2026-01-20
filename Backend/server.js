const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Statiska filer
app.use(express.static(path.join(__dirname, "Views")));
app.use(express.static(path.join(__dirname, "public")));

// Routes
const userRoutes = require("./Routes/users");
const habitRoutes = require("./Routes/habits");
const habitLogRoutes = require("./Routes/habitlog");

app.use("/users", userRoutes);
app.use("/habits", habitRoutes);
app.use("/habitlog", habitLogRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
