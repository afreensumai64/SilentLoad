const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "silentload_super_secret_key_2024";

const adapter = new FileSync(path.join(__dirname, "db.json"));
const db = low(adapter);
db.defaults({ users: [], tasks: [], checkins: [], moodLogs: [] }).write();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "No token provided" });
  const token = header.split(" ")[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields are required" });
    if (password.length < 8)
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    const emailLower = email.toLowerCase().trim();
    const existing = db.get("users").find({ email: emailLower }).value();
    if (existing)
      return res.status(409).json({ error: "This email is already registered" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: Date.now().toString(),
      name: name.trim(),
      email: emailLower,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };
    db.get("users").push(user).write();
    const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });
    const user = db.get("users").find({ email: email.toLowerCase().trim() }).value();
    if (!user)
      return res.status(401).json({ error: "Invalid email or password" });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ error: "Invalid email or password" });
    const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/auth/me", auth, (req, res) => {
  const user = db.get("users").find({ id: req.user.id }).value();
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ id: user.id, name: user.name, email: user.email });
});

app.get("/api/tasks", auth, (req, res) => {
  const today = new Date().toDateString();
  const tasks = db.get("tasks").filter((t) => t.userId === req.user.id && new Date(t.createdAt).toDateString() === today).value();
  res.json(tasks);
});

app.get("/api/tasks/all", auth, (req, res) => {
  const tasks = db.get("tasks").filter({ userId: req.user.id }).sortBy("createdAt").reverse().value();
  res.json(tasks);
});

app.post("/api/tasks", auth, (req, res) => {
  const { name, category, time, notes } = req.body;
  if (!name) return res.status(400).json({ error: "Task name is required" });
  const task = {
    id: Date.now().toString(),
    userId: req.user.id,
    name: name.trim(),
    category: category || "Personal",
    time: time || "",
    notes: notes || "",
    completed: false,
    completedAt: null,
    createdAt: new Date().toISOString(),
  };
  db.get("tasks").push(task).write();
  res.status(201).json(task);
});

app.patch("/api/tasks/:id/complete", auth, (req, res) => {
  const task = db.get("tasks").find({ id: req.params.id, userId: req.user.id }).value();
  if (!task) return res.status(404).json({ error: "Task not found" });
  const updated = { ...task, completed: !task.completed, completedAt: !task.completed ? new Date().toISOString() : null };
  db.get("tasks").find({ id: req.params.id }).assign(updated).write();
  res.json(updated);
});

app.delete("/api/tasks/:id", auth, (req, res) => {
  const task = db.get("tasks").find({ id: req.params.id, userId: req.user.id }).value();
  if (!task) return res.status(404).json({ error: "Task not found" });
  db.get("tasks").remove({ id: req.params.id }).write();
  res.json({ success: true });
});

app.post("/api/checkins", auth, (req, res) => {
  const { selectedAreas } = req.body;
  if (!selectedAreas || !Array.isArray(selectedAreas))
    return res.status(400).json({ error: "selectedAreas array required" });
  const capacityMap = { 0: 5, 1: 4, 2: 3, 3: 2, 4: 1 };
  const capacity = capacityMap[Math.min(selectedAreas.length, 4)];
  const today = new Date().toDateString();
  db.get("checkins").remove({ userId: req.user.id, date: today }).write();
  const checkin = { id: Date.now().toString(), userId: req.user.id, selectedAreas, capacity, date: today, createdAt: new Date().toISOString() };
  db.get("checkins").push(checkin).write();
  res.status(201).json(checkin);
});

app.get("/api/checkins/today", auth, (req, res) => {
  const today = new Date().toDateString();
  const checkin = db.get("checkins").find({ userId: req.user.id, date: today }).value();
  res.json(checkin || null);
});

app.post("/api/mood", auth, (req, res) => {
  const { mood, completedCount, totalCount } = req.body;
  if (!mood) return res.status(400).json({ error: "Mood required" });
  const log = { id: Date.now().toString(), userId: req.user.id, mood, completedCount: completedCount || 0, totalCount: totalCount || 0, date: new Date().toDateString(), createdAt: new Date().toISOString() };
  db.get("moodLogs").push(log).write();
  res.status(201).json(log);
});

app.get("/api/mood", auth, (req, res) => {
  const logs = db.get("moodLogs").filter({ userId: req.user.id }).sortBy("createdAt").reverse().take(30).value();
  res.json(logs);
});

app.get("/api/stats", auth, (req, res) => {
  const today = new Date().toDateString();
  const todayTasks = db.get("tasks").filter((t) => t.userId === req.user.id && new Date(t.createdAt).toDateString() === today).value();
  const checkin = db.get("checkins").find({ userId: req.user.id, date: today }).value();
  res.json({ todayTaskCount: todayTasks.length, todayCompleted: todayTasks.filter((t) => t.completed).length, capacity: checkin ? checkin.capacity : 5, checkinDone: !!checkin });
});

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => {
  console.log("SilentLoad backend running on http://localhost:" + PORT);
});
