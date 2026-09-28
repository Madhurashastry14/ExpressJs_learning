import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
import studentrouter from "./routes/studentroute.js";
import authRoute from "./routes/authroute.js";
import errorHandler from "./middleware/errorhandler.js";
const app = express();
app.use(cors());
app.use(express.json());

app.use("/students", studentrouter);
app.use("/auth", authRoute);
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});
app.use(errorHandler);
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
