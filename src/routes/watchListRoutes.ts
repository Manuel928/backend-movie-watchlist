import express from "express";

// Auth Middleware
import { authMiddleware } from "../middleware/authMiddleware.js";

// Zod validation middleware
import { validateRequest } from "../middleware/validateRequest.js";

// Watchlist Controllers
import {
  addToWatchList,
  removeFromWatchList,
  updateWatchlistItem,
} from "../controller/watchListController.js";

// Validation schema
import {
  addToWatchListSchema,
  updateWatchlistItemSchema,
} from "../validators/watchlistValidators.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", validateRequest(addToWatchListSchema), addToWatchList);

router.put(
  "/update/:id",
  validateRequest(updateWatchlistItemSchema),
  updateWatchlistItem,
);

router.delete("/delete/:id", removeFromWatchList);

export default router;
