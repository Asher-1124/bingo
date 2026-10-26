const express = require("express");
const path = require("path");

const drawn = new Set();

function randomBall() {
  if (drawn.size >= 75) {
    return null;
  }
  let n;
  do {
    n = Math.floor(Math.random() * 75) + 1;
  } while (drawn.has(n));
  drawn.add(n);
  return n;
}

function createApp() {
  const app = express();
  app.use(express.static(path.join(__dirname, "public")));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, drawn: drawn.size });
  });

  app.post("/api/draw", express.json(), (_req, res) => {
    const ball = randomBall();
    if (ball === null) {
      return res.status(409).json({ error: "All balls drawn" });
    }
    res.json({ ball, drawn: [...drawn].sort((a, b) => a - b) });
  });

  app.post("/api/reset", (_req, res) => {
    drawn.clear();
    res.json({ ok: true });
  });

  return app;
}

function start() {
  const PORT = Number(process.env.PORT) || 3000;
  const HOST = process.env.HOST || "0.0.0.0";
  const app = createApp();
  return app.listen(PORT, HOST, () => {
    console.log(`Bingo server listening on http://${HOST}:${PORT}`);
  });
}

if (require.main === module) {
  start();
}

module.exports = { createApp, start, randomBall };
