import assert from "node:assert/strict";
import { choosePlan, initialState, makeOllamaResponse, runRequest } from "../src/core.mjs";

const checks = [];

async function check(name, callback) {
  await callback();
  checks.push(name);
}

await check("balanced mode selects QAIRT NPU plan", () => {
  const plan = choosePlan(initialState(), { context: 1024 });
  assert.equal(plan.candidate.runtime, "qairt");
  assert.equal(plan.candidate.device, "Hexagon NPU");
});

await check("forced pre-token failure selects fallback", async () => {
  const state = initialState();
  state.forcePreferredFailure = true;
  const execution = await runRequest(state, { prompt: "Explain routing" });
  assert.equal(execution.fallbackUsed, true);
  assert.equal(execution.plan.qualityTier, "fallback");
});

await check("non-streaming Ollama response includes route telemetry", async () => {
  const execution = await runRequest(initialState(), { prompt: "hello" });
  const body = makeOllamaResponse(execution, false);
  assert.equal(body.done, true);
  assert.equal(body.snaproute.runtime, "qairt");
});

console.log(`Passed ${checks.length} SnapRoute core checks:`);
for (const item of checks) console.log(`  ✓ ${item}`);
