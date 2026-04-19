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
  }
});
