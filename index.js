const express = require("express");
const { initialiseDatabase } = require("./db.connect");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { default: axios } = require("axios");

const albumRoutes = require("");
const imageRoutes = require("");
const usersRoutes = require("");

const app = express();
initialiseDatabase();

app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

app.use("/albums", albumRoutes);
app.use("/albums", imageRoutes);
app.use("/users", usersRoutes);

const SECRET_KEY = "";
const JWT_SECRET = "";

const verifyJWT = "";

app.post("/admin/login", (req, res) => {
  const { secret } = req.body;
  if (secret === SECRET_KEY) {
    const token = jwt.sign(
      {
        userId: "test-admin-id",
        email: "admin@example.com",
        name: "Admin User",
        role: "admin",
      },
      JWT_SECRET,
      { expiresIn: "24h" },
    );
    res.json({ token });
  } else {
    res.json({ message: "Invalid Secret." });
  }
});

app.get("/auth/google", (req, res) => {
  const redirectUri = ``;
  res.redirect(redirectUri);
});

app.get("/auth/google/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).json({ message: "No code provided." });
  }
  try {
    const tokenResponse = await axios.post(
      "",
      new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_url: process.env.GOODLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
    );
    const accessToken = tokenResponse.data.access_token;

    const userResponse = await axios.get("", {
      headers: { Authorization: `Bearer${accessToken}` },
    });

    const { email, id, name, picture } = userResponse.data;

    const token = jwt.sign({ userId: id, email, name, picture }, JWT_SECRET, {
      expiresIn: "24h",
    });
  } catch (error) {}
});
