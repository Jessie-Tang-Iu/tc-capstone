import express from "express";
import dotenv from "dotenv";
import { testConnection } from "./database/db.js";
import usersRouter from "./routes/users.js";
import coursesRouter from "./routes/courses.js";
import adminRouter from "./routes/admin.js";

import { clerkMiddleware } from "@clerk/express";

dotenv.config();

const app = express();
const PORT = 5000;

// JSON parsing, takes the Json sent for the request body and creates a object from it instead
app.use(express.json());

// This checks for session tokens in requests, so that way when getAuth(req) is called in controllers it get the user that requested it
app.use(clerkMiddleware());

// Routes
app.use("/users", usersRouter);
app.use("/courses", coursesRouter);
app.use("/admin", adminRouter);

// Async code to test the database then start listening on Port 5000 if successful
(async () => {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`Backend listening on port ${PORT}`);
  });
})();
