import http from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import {
  MODEL_CATALOG,
  initialState,
  choosePlan,
  runRequest,
  makeOllamaResponse,
  makeOllamaChatResponse
} from "./core.mjs";

const PORT = Number(process.env.PORT || 11435);
const HOST = process.env.HOST || "127.0.0.1";
const PUBLIC_DIR = join(process.cwd(), "public");
const state = initialState();

const MIME = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".svg": "image/svg+xml", ".json": "application/json; charset=utf-8" };

function sendJson(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" });
  res.end(JSON.stringify(body));
}

async function readJson(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 1024 * 1024) throw new Error("Request exceeds 1 MB limit.");
    chunks.push(chunk);
  }
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function hostAllowed(req) {
  const host = (req.headers.host || "").split(":")[0];
  return host === "127.0.0.1" || host === "localhost" || host === "[::1]";
}

function statusPayload() {
  return {
    product: "SnapRoute Prototype",
    version: "0.1.0",
    compatibility: "Contract-tested subset: /api/chat, /api/generate, /api/tags, /api/ps",
    mode: state.mode,
    device: state.device,
    forcePreferredFailure: state.forcePreferredFailure,
    currentPlan: state.currentPlan,
    events: state.events,
    models: MODEL_CATALOG
  };
}

function writeNdjson(res, records) {
  res.writeHead(200, { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" });
  let index = 0;
  const interval = setInterval(() => {
    res.write(`${JSON.stringify(records[index])}\n`);
    index += 1;
    if (index >= records.length) {
      clearInterval(interval);
      res.end();
    }
  }, 22);
}

async function serveStatic(req, res) {
  const requestPath = req.url === "/" ? "/index.html" : new URL(req.url, `http://${req.headers.host}`).pathname;
  const safePath = normalize(requestPath).replace(/^(\.\.([\\/]|$))+/, "");
  const filePath = join(PUBLIC_DIR, safePath);
  if (!filePath.startsWith(PUBLIC_DIR)) return sendJson(res, 403, { error: "Forbidden" });
  try {
    const data = await readFile(filePath);
    res.writeHead(200, { "Content-Type": MIME[extname(filePath)] || "application/octet-stream", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" });
    res.end(data);
  } catch {
    sendJson(res, 404, { error: "Not found" });
  }
}

const server = http.createServer(async (req, res) => {
  try {
    if (!hostAllowed(req)) return sendJson(res, 403, { error: "Localhost host header required." });
    if (req.method === "OPTIONS") {
      res.writeHead(204, { "Access-Control-Allow-Origin": "http://127.0.0.1:11435", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" });
      return res.end();
    }

    const path = new URL(req.url, `http://${req.headers.host}`).pathname;
    if (req.method === "GET" && path === "/api/status") return sendJson(res, 200, statusPayload());
    if (req.method === "GET" && path === "/api/version") return sendJson(res, 200, { version: "0.1.0", compatibility: "SnapRoute Ollama subset" });
    if (req.method === "GET" && path === "/api/tags") {
      return sendJson(res, 200, { models: [{ name: "snaproute:qwen3-4b", model: "snaproute:qwen3-4b", size: 0, digest: "snaproute-prototype", details: { format: "routed", family: "qwen3", parameter_size: "4B", quantization_level: "bundle-selected" } }] });
    }
    if (req.method === "GET" && path === "/api/ps") {
      const current = state.currentPlan;
      return sendJson(res, 200, { models: current ? [{ name: "snaproute:qwen3-4b", model: current.plan.id, size: 0, size_vram: 0, context_length: current.plan.maxContext, details: { format: current.plan.runtime, family: "qwen3", quantization_level: current.plan.precision, device: current.plan.device } }] : [] });
    }
    if (req.method === "POST" && path === "/api/route") {
      const body = await readJson(req);
      if (body.mode) state.mode = body.mode;
      const plan = choosePlan(state, body);
      return sendJson(res, 200, plan);
    }
    if (req.method === "POST" && path === "/api/demo/failure") {
      const body = await readJson(req);
      state.forcePreferredFailure = Boolean(body.enabled);
      return sendJson(res, 200, { enabled: state.forcePreferredFailure });
    }
    if (req.method === "POST" && (path === "/api/generate" || path === "/api/chat")) {
      const body = await readJson(req);
      if (body.options?.num_ctx && body.options.num_ctx > 4096) return sendJson(res, 422, { error: "Prototype supports up to 4096 context tokens." });
      if (body.model && body.model !== "snaproute:qwen3-4b") return sendJson(res, 404, { error: `Unknown SnapRoute alias: ${body.model}` });
      const prompt = path === "/api/chat"
        ? (body.messages || []).map((message) => `${message.role}: ${message.content}`).join("\n")
        : body.prompt;
      const execution = await runRequest(state, { prompt, context: body.options?.num_ctx, manualPlan: body.options?.snaproute_plan });
      const payload = path === "/api/chat" ? makeOllamaChatResponse(execution, body.stream !== false) : makeOllamaResponse(execution, body.stream !== false);
      if (body.stream === false) return sendJson(res, 200, payload);
      return writeNdjson(res, payload);
    }

    return serveStatic(req, res);
  } catch (error) {
    return sendJson(res, 500, { error: error.message || "Unexpected server error" });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`SnapRoute prototype running at http://${HOST}:${PORT}`);
  console.log(process.env.GENIEX_BASE_URL ? `GenieX bridge configured: ${process.env.GENIEX_BASE_URL}` : "Simulation mode: set GENIEX_BASE_URL to a running GenieX server on target hardware.");
});
