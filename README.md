# SnapRoute prototype

SnapRoute is a runnable prototype of an Ollama-compatible local AI gateway for Snapdragon PCs. It demonstrates the product layer around Qualcomm GenieX: model resolution, explainable routing, telemetry, and safe pre-token fallback.

## Run locally

```powershell
npm start
```

Open [http://127.0.0.1:11435](http://127.0.0.1:11435).

The prototype uses a clear simulator by default so it can be demonstrated without Snapdragon hardware. The dashboard labels this state as **Simulation mode**.

## Test the Ollama-compatible subset

```powershell
Invoke-RestMethod -Uri http://127.0.0.1:11435/api/tags

Invoke-RestMethod -Uri http://127.0.0.1:11435/api/generate -Method Post -ContentType "application/json" -Body '{"model":"snaproute:qwen3-4b","prompt":"Explain SnapRoute in one paragraph.","stream":false}'
```

Implemented endpoints:

- `POST /api/chat`
- `POST /api/generate`
- `GET /api/tags`
- `GET /api/ps`
- `GET /api/version`
- `GET /api/status` for the dashboard

## Target Snapdragon device

On a supported Snapdragon PC, start the GenieX OpenAI-compatible server and supply its base URL before starting SnapRoute:

```powershell
$env:GENIEX_BASE_URL = "http://127.0.0.1:18181/v1"
npm start
```

SnapRoute then attempts the configured GenieX bridge. The dashboard will report `GenieX bridge configured`; if the bridge fails, it logs the bridge error and uses the simulator so the prototype remains demonstrable. Before a real submission, replace this development fallback with a strict production health gate and run the benchmark plan in [solution.md](Submission/solution.md).

## Important limitations

- This is a prototype, not a production inference runtime.
- Its default replies are simulated and intentionally say so.
- The QAIRT model precision must come from the downloaded bundle metadata, not this code.
- Only a small Ollama-compatible endpoint subset is implemented.
- The visual telemetry values are deterministic demo profiles until collected from the target device.

## Verify

```powershell
npm test
```
