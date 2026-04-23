const express = require("express");
const { initialiseDatabase } = require("./db.connect");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { default: axios } = require("axios");

const albumRoutes = require("./routes/album.routes");
const imageRoutes = require("./routes/image.routes");
const usersRoutes = require("./routes/user.routes");

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

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // This makes req.user.userId accessible
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

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
        redirect_url: process.env.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
    );
    const accessToken = tokenResponse.data.access_token;

    const userResponse = await axios.get("", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const { email, id, name, picture } = userResponse.data;

    const token = jwt.sign({ userId: id, email, name, picture }, JWT_SECRET, {
      expiresIn: "24h",
    });
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message: "Google Auth failed" });
  }
});

app.get("/api/protected", verifyJWT, (req, res) => {
  res.json({
    message: "Access granted to protected route",
    user: req.user,
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
