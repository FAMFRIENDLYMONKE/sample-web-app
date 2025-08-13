import express from "express";
import { body, validationResult } from "express-validator";
import { Calculator } from "../controllers/calculator";

const router = express.Router();
const calculator = new Calculator();

const numberValidation = [
  body("num1").isFloat().withMessage("First number must be a valid number"),
  body("num2").isFloat().withMessage("Second number must be a valid number"),
];

// Validation error handler
const handleValidationErrors = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post("/add", numberValidation, handleValidationErrors, (req, res) => {
  const { num1, num2 } = req.body;
  const result = calculator.add(parseFloat(num1), parseFloat(num2));
  res.json({ result });
});

router.post(
  "/subtract",
  numberValidation,
  handleValidationErrors,
  (req, res) => {
    const { num1, num2 } = req.body;
    const result = calculator.subtract(parseFloat(num1), parseFloat(num2));
    res.json({ result });
  }
);

router.post(
  "/multiply",
  numberValidation,
  handleValidationErrors,
  (req, res) => {
    const { num1, num2 } = req.body;
    const result = calculator.multiply(parseFloat(num1), parseFloat(num2));
    res.json({ result });
  }
);

router.post("/divide", numberValidation, handleValidationErrors, (req, res) => {
  const { num1, num2 } = req.body;
  if (parseFloat(num2) === 0) {
    return res.status(400).json({ error: "Cannot divide by zero" });
  }
  const result = calculator.divide(parseFloat(num1), parseFloat(num2));
  res.json({ result });
});

export default router;
