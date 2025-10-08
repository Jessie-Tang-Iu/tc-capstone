import express from "express";
import dotenv from "dotenv";
import { testConnection } from "./database/db.js";
import usersRouter from "./routes/users.js";

import { clerkMiddleware, getAuth } from "@clerk/express";

dotenv.config();

const app = express();
const PORT = 5000;

// JSON parsing
app.use(express.json());

// Clerk middleware to populate req.auth if token is valid
app.use(clerkMiddleware());

// Routes
app.use("/users", usersRouter);

(async () => {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`Backend listening on port ${PORT}`);
  });
})();
