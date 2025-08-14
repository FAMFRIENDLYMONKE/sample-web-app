import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import Bugsnag from "@bugsnag/js";
import BugsnagPluginExpress from "@bugsnag/plugin-express";
import calculatorRoutes from "./routes/calculator";

Bugsnag.start({
  apiKey: process.env.BUGSNAG_API_KEY || "YOUR_API_KEY_HERE",
  plugins: [BugsnagPluginExpress],
  releaseStage: process.env.NODE_ENV || "development",
});

const bugsnagMiddleware = Bugsnag.getPlugin("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Sample Web App" });
});

if (bugsnagMiddleware) {
  app.use(bugsnagMiddleware.requestHandler);
}

app.use("/", calculatorRoutes);

if (bugsnagMiddleware) {
  app.use(bugsnagMiddleware.errorHandler);
}

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    Bugsnag.notify(err);

    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
  }
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
