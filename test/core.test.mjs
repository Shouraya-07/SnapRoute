import test from "node:test";
import assert from "node:assert/strict";
import { choosePlan, initialState, makeOllamaResponse, runRequest } from "../src/core.mjs";

test("balanced mode chooses the QAIRT NPU plan when available", () => {
  const plan = choosePlan(initialState(), { context: 1024 });
  assert.equal(plan.candidate.runtime, "qairt");
  assert.equal(plan.candidate.device, "Hexagon NPU");
});

test("a forced pre-token failure uses the verified fallback", async () => {
  const state = initialState();
  state.forcePreferredFailure = true;
  const execution = await runRequest(state, { prompt: "Explain routing" });
  assert.equal(execution.fallbackUsed, true);
  assert.equal(execution.plan.qualityTier, "fallback");
});

test("Ollama non-streaming responses preserve route telemetry", async () => {
  const execution = await runRequest(initialState(), { prompt: "hello" });
  const body = makeOllamaResponse(execution, false);
  assert.equal(body.done, true);
  assert.equal(body.snaproute.runtime, "qairt");
});
