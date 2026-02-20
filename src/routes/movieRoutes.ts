import express, { Request, Response } from "express";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.json({
    httpMethod: "get",
  });
});
router.post("/", (req: Request, res: Response) => {
  res.json({
    httpMethod: "post",
  });
});

export default router;
