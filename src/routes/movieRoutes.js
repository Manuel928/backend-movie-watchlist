import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    httpMethod: "get",
  });
});
router.post("/", (req, res) => {
  res.json({
    httpMethod: "post",
  });
});


export default router