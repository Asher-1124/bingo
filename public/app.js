const lastBallEl = document.getElementById("last-ball");
const calledListEl = document.getElementById("called-list");
const statusEl = document.getElementById("status");
const drawBtn = document.getElementById("draw-btn");
const resetBtn = document.getElementById("reset-btn");

function renderCalled(numbers) {
  calledListEl.innerHTML = "";
  for (const n of numbers) {
    const li = document.createElement("li");
    li.textContent = String(n);
    calledListEl.appendChild(li);
  }
}

drawBtn.addEventListener("click", async () => {
  statusEl.textContent = "Drawing…";
  const res = await fetch("/api/draw", { method: "POST" });
  const data = await res.json();
  if (!res.ok) {
    statusEl.textContent = data.error || "Draw failed";
    return;
  }
  lastBallEl.textContent = String(data.ball);
  renderCalled(data.drawn);
  statusEl.textContent = `Ball ${data.ball} called (${data.drawn.length}/75).`;
});

resetBtn.addEventListener("click", async () => {
  await fetch("/api/reset", { method: "POST" });
  lastBallEl.textContent = "—";
  calledListEl.innerHTML = "";
  statusEl.textContent = "Game reset. Press Draw to call a number.";
});
