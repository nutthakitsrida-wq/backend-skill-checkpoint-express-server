import express from "express";
import questionRouter from "./routes/questionRoutes.mjs";
import answerRouter from "./routes/answerRoutes.mjs";

const app = express();
const port = 4000;

// Parse JSON request bodies before sending requests to routers
app.use(express.json());

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

// API routers
app.use("/questions", questionRouter);
app.use("/questions", answerRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});