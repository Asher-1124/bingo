const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const { createApp } = require("../server.js");

function request(app, method, url) {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      const req = http.request(
        { hostname: "127.0.0.1", port, path: url, method },
        (res) => {
          let data = "";
          res.on("data", (chunk) => {
            data += chunk;
          });
          res.on("end", () => {
            server.close(() =>
              resolve({ status: res.statusCode, body: JSON.parse(data) })
            );
          });
        }
      );
      req.on("error", (err) => {
        server.close(() => reject(err));
      });
      req.end();
    });
  });
}

describe("bingo server", () => {
  it("health endpoint responds", async () => {
    const app = createApp();
    const res = await request(app, "GET", "/api/health");
    assert.equal(res.status, 200);
    assert.equal(res.body.ok, true);
  });

  it("draw returns a ball", async () => {
    const app = createApp();
    const res = await request(app, "POST", "/api/draw");
    assert.equal(res.status, 200);
    assert.ok(res.body.ball >= 1 && res.body.ball <= 75);
  });
});
