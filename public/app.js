const $ = (selector) => document.querySelector(selector);
let status = null;

function number(value, suffix = "") { return value === undefined || value === null ? "–" : `${value}${suffix}`; }

function renderPlan(plan) {
  if (!plan) return;
  const current = plan.plan || plan.candidate;
  $("#activeTitle").textContent = `${current.displayName} on ${current.device}`;
  $("#activeReason").textContent = plan.reason;
  $("#planState").textContent = plan.fallbackUsed ? "FALLBACK ACTIVE" : "READY";
  $("#planMeta").innerHTML = [current.runtime, current.precision, current.equivalence, plan.fallbackUsed ? "pre-token fallback" : "verified route"].map((item) => `<span>${item}</span>`).join("");
  const m = plan.metrics || current.telemetry;
  $("#ttft").textContent = number(m.ttftMs, " ms");
  $("#decode").textContent = number(m.decodeTps, " tok/s");
  $("#cpu").textContent = number(m.cpuLoad, "%");
  $("#energy").textContent = number(m.energyIndex);
  $("#telemetrySource").textContent = m.source || (m.measured ? "measured" : "simulation");
}

function renderCandidates(models, plan) {
  const active = plan?.plan?.id || plan?.candidate?.id;
  $("#candidates").innerHTML = models.map((model) => `
    <div class="candidate ${model.id === active ? "selected" : ""}">
      <div><h3>${model.displayName}</h3><p>${model.runtime} · ${model.device} · ${model.precision}</p><span class="detail">${model.equivalence} · ${model.qualityTier}</span></div>
      <span class="score">${model.id === active ? "SELECTED" : model.qualityTier.toUpperCase()}</span>
    </div>`).join("");
}

function renderEvents(events = []) {
  $("#events").innerHTML = events.length ? events.map((event) => `
    <div class="event ${event.type === "fallback" ? "fallback" : ""}"><time>${new Date(event.at).toLocaleTimeString()}</time><p>${event.message}</p></div>`).join("") : "<div class=\"event\"><p>No route events yet.</p></div>";
}

function renderStatus(data) {
  status = data;
  $("#chipset").textContent = data.device.chipset;
  $("#memory").textContent = `${data.device.availableMemoryGb} GB free`;
  $("#runtime").textContent = data.device.runtime;
  $("#runtimeBadge").textContent = data.device.runtime.includes("Simulation") ? "SIMULATION MODE" : "GENIEX BRIDGE";
  $("#runtimeBadge").className = data.device.runtime.includes("Simulation") ? "badge badge-warn" : "badge";
  document.querySelectorAll("[data-mode]").forEach((button) => button.classList.toggle("active", button.dataset.mode === data.mode));
  renderPlan(data.currentPlan || { candidate: data.models[0], reason: "The dashboard is ready to calculate a route.", metrics: data.models[0].telemetry });
  renderCandidates(data.models, data.currentPlan);
  renderEvents(data.events);
  $("#failureToggle").checked = data.forcePreferredFailure;
}

async function refresh() {
  const response = await fetch("/api/status");
  renderStatus(await response.json());
}

function addMessage(role, text) {
  const item = document.createElement("div");
  item.className = `message ${role}`;
  item.innerHTML = `<span>${role === "user" ? "YOU" : "SNAPROUTE"}</span><p></p>`;
  item.querySelector("p").textContent = text;
  $("#chatLog").append(item);
  $("#chatLog").scrollTop = $("#chatLog").scrollHeight;
  return item.querySelector("p");
}

async function submitPrompt(event) {
  event.preventDefault();
  const prompt = $("#prompt").value.trim();
  if (!prompt) return;
  addMessage("user", prompt);
  $("#prompt").value = "";
  $("#apiStatus").textContent = "POST /api/chat streaming";
  const output = addMessage("assistant", "");
  const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "snaproute:qwen3-4b", stream: true, messages: [{ role: "user", content: prompt }] }) });
  if (!response.ok) { output.textContent = `Request failed: ${(await response.json()).error}`; return; }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop();
    for (const line of lines) {
      if (!line) continue;
      const chunk = JSON.parse(line);
      output.textContent += chunk.message.content;
    }
  }
  $("#apiStatus").textContent = "POST /api/chat complete";
  await refresh();
}

document.querySelectorAll("[data-mode]").forEach((button) => button.addEventListener("click", async () => {
  await fetch("/api/route", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode: button.dataset.mode }) });
  await refresh();
}));

$("#failureToggle").addEventListener("change", async (event) => {
  await fetch("/api/demo/failure", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ enabled: event.target.checked }) });
  await refresh();
});
$("#chatForm").addEventListener("submit", submitPrompt);
refresh().catch((error) => { $("#activeReason").textContent = `Unable to load gateway status: ${error.message}`; });
