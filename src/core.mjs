const now = () => new Date().toISOString();

export const MODEL_CATALOG = [
  {
    id: "ai-hub-models/Qwen3-4B-Instruct-2507",
    alias: "snaproute:qwen3-4b",
    displayName: "Qwen3-4B-Instruct-2507",
    runtime: "qairt",
    device: "Hexagon NPU",
    precision: "Bundle-defined",
    source: "Qualcomm AI Hub",
    equivalence: "EXACT_REVISION",
    qualityTier: "preferred",
    minMemoryGb: 10,
    maxContext: 4096,
    telemetry: { ttftMs: 240, decodeTps: 18.4, cpuLoad: 12, memoryGb: 5.1, energyIndex: 42, reliability: 0.98 }
  },
  {
    id: "verified/Qwen3-4B-GGUF:Q4_0",
    alias: "snaproute:qwen3-4b",
    displayName: "Qwen3 4B GGUF Q4_0",
    runtime: "llama_cpp",
    device: "Hybrid NPU + CPU",
    precision: "Q4_0",
    source: "Verified GGUF artifact",
    equivalence: "SAME_FAMILY",
    qualityTier: "fallback",
    minMemoryGb: 8,
    maxContext: 4096,
    telemetry: { ttftMs: 360, decodeTps: 13.1, cpuLoad: 27, memoryGb: 4.2, energyIndex: 57, reliability: 0.96 }
  },
  {
    id: "verified/Qwen3-4B-GGUF:Q4_0-cpu",
    alias: "snaproute:qwen3-4b",
    displayName: "Qwen3 4B GGUF CPU fallback",
    runtime: "llama_cpp",
    device: "Oryon CPU",
    precision: "Q4_0",
    source: "Verified GGUF artifact",
    equivalence: "SAME_FAMILY",
    qualityTier: "emergency",
    minMemoryGb: 8,
    maxContext: 4096,
    telemetry: { ttftMs: 710, decodeTps: 7.3, cpuLoad: 78, memoryGb: 4.1, energyIndex: 100, reliability: 0.99 }
  }
];

export const initialState = () => ({
  mode: "balanced",
  device: {
    profile: "Demo workstation",
    chipset: "Snapdragon X Elite (simulated)",
    memoryGb: 16,
    availableMemoryGb: 11.2,
    npu: "AVAILABLE",
    gpu: "AVAILABLE",
    cpu: "AVAILABLE",
    runtime: process.env.GENIEX_BASE_URL ? "GenieX bridge configured" : "Simulation mode"
  },
  forcePreferredFailure: false,
  currentPlan: null,
  activeRequest: null,
  events: [],
  requestCount: 0
});

function modeWeights(mode) {
  const weights = {
    eco: { ttft: 0.10, decode: 0.10, efficiency: 0.40, cpu: 0.20, reliability: 0.15, memory: 0.05 },
    balanced: { ttft: 0.25, decode: 0.20, efficiency: 0.25, cpu: 0.10, reliability: 0.15, memory: 0.05 },
    turbo: { ttft: 0.35, decode: 0.35, efficiency: 0.05, cpu: 0.05, reliability: 0.15, memory: 0.05 },
    manual: { ttft: 0.25, decode: 0.20, efficiency: 0.25, cpu: 0.10, reliability: 0.15, memory: 0.05 }
  };
  return weights[mode] ?? weights.balanced;
}

function compatible(candidate, state, request = {}) {
  if (candidate.minMemoryGb > state.device.availableMemoryGb) return { ok: false, reason: "insufficient free memory" };
  if ((request.context ?? 2048) > candidate.maxContext) return { ok: false, reason: "requested context exceeds model limit" };
  if (candidate.runtime === "qairt" && state.device.npu !== "AVAILABLE") return { ok: false, reason: "NPU is unavailable" };
  if (candidate.device.includes("Hybrid") && state.device.npu === "UNHEALTHY") return { ok: false, reason: "hybrid NPU path is unhealthy" };
  return { ok: true };
}

function score(candidate, mode) {
  const w = modeWeights(mode);
  const t = candidate.telemetry;
  const ttft = Math.max(0, 1 - t.ttftMs / 1000);
  const decode = Math.min(1, t.decodeTps / 20);
  const efficiency = Math.max(0, 1 - t.energyIndex / 110);
  const cpu = Math.max(0, 1 - t.cpuLoad / 100);
  const memory = Math.max(0, 1 - t.memoryGb / 12);
  return Number((w.ttft * ttft + w.decode * decode + w.efficiency * efficiency + w.cpu * cpu + w.reliability * t.reliability + w.memory * memory).toFixed(3));
}

export function choosePlan(state, request = {}) {
  const candidates = MODEL_CATALOG
    .map((candidate) => ({ candidate, check: compatible(candidate, state, request) }))
    .filter(({ check }) => check.ok)
    .map(({ candidate }) => ({ candidate, score: score(candidate, state.mode) }))
    .sort((a, b) => b.score - a.score);

  if (!candidates.length) {
    throw new Error("No compatible execution plan is available for this request.");
  }

  const preferred = candidates[0];
  const fallback = candidates.find(({ candidate }) => candidate.qualityTier === "fallback") ?? candidates[1] ?? candidates[0];
  const selected = request.manualPlan
    ? candidates.find(({ candidate }) => candidate.id === request.manualPlan) ?? preferred
    : preferred;

  const t = selected.candidate.telemetry;
  return {
    ...selected,
    fallback: fallback.candidate,
    candidates: candidates.map(({ candidate, score: candidateScore }) => ({ id: candidate.id, displayName: candidate.displayName, score: candidateScore, device: candidate.device })),
    reason: `Selected ${selected.candidate.displayName} through ${selected.candidate.runtime} on ${selected.candidate.device}. The ${state.mode} policy favored its measured latency, efficiency, CPU load, and reliability profile.`,
    metrics: { ...t, mode: state.mode, measured: false }
  };
}

function responseFor(prompt, plan, fallbackUsed) {
  const compactPrompt = (prompt || "your local AI request").replace(/\s+/g, " ").trim().slice(0, 140);
  return [
    `SnapRoute routed this request through ${plan.runtime} on ${plan.device}.`,
    `The selected model is ${plan.displayName} with ${plan.precision} precision metadata.`,
    fallbackUsed
      ? "The preferred NPU plan failed before generation, so SnapRoute switched to the verified fallback before returning any token."
      : "The gateway verified the selected plan before streaming the response.",
    `Prototype request context: “${compactPrompt}”.`,
    "This response comes from the built-in simulator unless a GenieX bridge is configured on the target Snapdragon PC."
  ].join(" ");
}

async function generateFromGenieX(prompt, plan) {
  const base = process.env.GENIEX_BASE_URL;
  if (!base) return null;
  const url = `${base.replace(/\/$/, "")}/chat/completions`;
  const result = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: plan.id,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
      max_tokens: 220,
      stream: false
    })
  });
  if (!result.ok) throw new Error(`GenieX bridge returned HTTP ${result.status}`);
  const body = await result.json();
  return body?.choices?.[0]?.message?.content ?? null;
}

export async function runRequest(state, request) {
  const plan = choosePlan(state, request);
  const preferredFails = state.forcePreferredFailure && plan.candidate.qualityTier === "preferred";
  const active = preferredFails
    ? { candidate: plan.fallback, score: plan.candidates.find((item) => item.id === plan.fallback.id)?.score ?? 0, fallback: null }
    : { candidate: plan.candidate, score: plan.score, fallback: plan.fallback };
  const fallbackUsed = preferredFails;

  let generated;
  try {
    generated = await generateFromGenieX(request.prompt, active.candidate);
  } catch (error) {
    generated = null;
    state.events.unshift({ at: now(), type: "bridge-error", message: error.message });
  }
  if (!generated) generated = responseFor(request.prompt, active.candidate, fallbackUsed);

  const execution = {
    requestId: `sr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    plan: active.candidate,
    preferredPlan: plan.candidate,
    fallbackUsed,
    reason: fallbackUsed
      ? `Preferred QAIRT plan failed its pre-token health check. Continued with ${active.candidate.displayName}.`
      : plan.reason,
    metrics: {
      ...active.candidate.telemetry,
      mode: state.mode,
      measured: Boolean(process.env.GENIEX_BASE_URL),
      source: process.env.GENIEX_BASE_URL ? "GenieX bridge" : "prototype simulation"
    },
    text: generated,
    createdAt: now()
  };

  state.currentPlan = execution;
  state.requestCount += 1;
  state.events.unshift({ at: execution.createdAt, type: fallbackUsed ? "fallback" : "route", message: execution.reason });
  state.events = state.events.slice(0, 12);
  return execution;
}

export function makeOllamaResponse(execution, stream = true) {
  const base = {
    model: "snaproute:qwen3-4b",
    created_at: execution.createdAt,
    total_duration: execution.metrics.ttftMs * 1_000_000 + 2_000_000_000,
    load_duration: 85_000_000,
    prompt_eval_count: 42,
    prompt_eval_duration: execution.metrics.ttftMs * 1_000_000,
    eval_count: 64,
    eval_duration: Math.round((64 / execution.metrics.decodeTps) * 1_000_000_000),
    snaproute: {
      runtime: execution.plan.runtime,
      device: execution.plan.device,
      fallback_used: execution.fallbackUsed,
      telemetry_source: execution.metrics.source
    }
  };
  if (!stream) {
    return { ...base, response: execution.text, done: true, done_reason: "stop" };
  }
  const words = execution.text.split(/(\s+)/).filter(Boolean);
  return words.map((word, index) => ({
    ...base,
    response: word,
    done: index === words.length - 1,
    done_reason: index === words.length - 1 ? "stop" : undefined
  }));
}

export function makeOllamaChatResponse(execution, stream = true) {
  const generated = makeOllamaResponse(execution, stream);
  const map = (item) => {
    const { response, ...rest } = item;
    return { ...rest, message: { role: "assistant", content: response } };
  };
  return Array.isArray(generated) ? generated.map(map) : map(generated);
}
