import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const router = express.Router();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: "*",
  })
);

router.get("/scholar-fetch", async (req, res) => {
  const url = req.query.url;
  const response = await fetch(url);
  const text = await response.text();
  res.send(text);
});
app.use(router);

// server launch command: node server.js
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
