import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Root
app.get("/", (req, res) => {
  res.send("✅ Thakkar Travels Backend is running");
});

// Dummy user
const users = [];

async function initUser() {
  const passwordHash = await bcrypt.hash("123456", 10);
  users.push({
    email: "ops@thakkartravels.com",
    passwordHash,
  });
}
await initUser();

// Avoid Cannot GET /api/login
app.get("/api/login", (req, res) => {
  res.send("❌ This endpoint expects POST request");
});

// Login API
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email & Password required" });
  }

  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = jwt.sign({ email }, "THAKKAR_SECRET_KEY", { expiresIn: "1h" });

  res.json({
    success: true,
    token,
    user: { email },
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
