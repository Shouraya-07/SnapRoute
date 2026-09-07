# Manus AI prompt for the SnapRoute short pitch deck

## Task

Create a polished, editable PowerPoint pitch deck for a Qualcomm Snapdragon AI Lab hackathon submission.

The project is called **SnapRoute**.

Use the exact narrative, technical framing, visual direction, and factual guardrails below. Produce a concise deck that a solo participant can present in approximately **5 minutes**.

## Required deliverables

1. An editable `.pptx` file in 16:9 widescreen format.
2. Exactly **8 slides**, including the title and closing slide.
3. Speaker notes for every slide, written as a natural talk track.
4. Editable native diagrams and charts. Do not flatten technical diagrams into screenshots.
5. A PDF preview if the platform can export one.
6. All external factual sources recorded in the relevant slide's speaker notes. Use the short visible source footers specified below.

Do not add an appendix, agenda slide, team slide, or standalone references slide. The deck is intentionally short.

---

## Audience and presentation objective

The audience consists of technical and product judges from a Qualcomm-focused AI challenge. They will assess:

- technical implementation;
- application use case and innovation;
- deployment and accessibility;
- presentation and documentation.

The presentation must establish five points quickly:

1. Snapdragon AI PCs have capable NPUs, but many existing local-AI applications use the Ollama interface and do not offer a clear Qualcomm acceleration path.
2. Qualcomm GenieX now solves the low-level inference problem across QAIRT and `llama.cpp`, so the proposal must not pretend that NPU inference is still impossible.
3. A genuine adoption gap remains around Ollama API compatibility, model migration, runtime selection, observability, and failure recovery.
4. SnapRoute fills that gap through an Ollama-compatible local gateway powered by GenieX.
5. The prototype will prove its value with real device telemetry and controlled benchmarks rather than invented performance claims.

The tone should feel technically credible, practical, and honest. Avoid startup hype and exaggerated sustainability claims.

---

## Core product definition

Use this definition consistently:

> SnapRoute is an Ollama-compatible, energy-aware local AI gateway for Snapdragon PCs. It imports familiar model configuration, resolves a compatible AI Hub or GGUF model, selects a verified GenieX execution path, and exposes the active backend and measured performance to the user.

### One-line pitch

> Existing Ollama applications can use Snapdragon acceleration through one local endpoint, with automatic model resolution, explainable routing, and safe fallback.

### Core hypothesis

> On a supported Snapdragon HP PC, SnapRoute can preserve an Ollama-compatible workflow while selecting a verified execution plan that reduces CPU contention and improves measured performance or efficiency without unacceptable task-quality loss.

Treat this as a hypothesis until measured on the target hardware.

---

## Important factual guardrails

These rules are mandatory:

- Do not say that GGUF models can never run on the Snapdragon NPU.
- Do not say that Qualcomm NPUs require every model to be converted to ONNX.
- Do not say that GenieX is missing or unavailable.
- Do not present SnapRoute as a new inference engine.
- Do not claim full Ollama compatibility. Say **core Ollama API compatibility** or **contract-tested compatibility for selected endpoints**.
- Do not claim that the NPU is always faster than the CPU or GPU.
- Do not invent tokens per second, battery-life gains, wattage, percentages, user counts, market size, or benchmark results.
- Never display a number such as `2x faster` or `40% less power` unless the presenter supplies a measured value.
- Treat W4A16 as a preferred/common QAIRT precision only when the downloaded bundle metadata confirms it.
- Make clear that the reference AI Hub model must be validated on the exact Snapdragon HP device.
- Make clear that QAIRT bundles and GGUF files are different artifacts and may produce different outputs.
- Do not imply endorsement, partnership, or employment by Qualcomm.
- Do not copy the Qualcomm or Snapdragon brand identity. A small event or sponsor logo may appear only if the user supplies an official asset and its use is permitted.

Where a measured result is required but unavailable, show a neutral placeholder such as `Measured on target device: pending` or use the placeholders listed later. Never estimate a result visually.

---

## Visual theme

### Overall direction

Use a **dark technical editorial theme** inspired by silicon, signal routing, and efficient on-device computing. The presentation should resemble a premium engineering product launch, not a gaming deck or a generic AI startup pitch.

The design concept is **“the visible inference path.”** A thin signal line travels through the deck and changes destination from CPU-only execution to a verified CPU/GPU/NPU route. Use this motif sparingly to connect slides.

### Canvas and spacing

- 16:9 widescreen.
- Use a generous outer margin of approximately 0.5 inches.
- Keep one dominant composition per slide.
- Avoid dense card grids and dashboard-style collections of small boxes.
- Use flat layouts, large diagrams, and strong whitespace.
- Keep the slide number and a short source footer aligned consistently at the bottom.

### Color palette

- Background: midnight navy `#07111D`.
- Secondary surface: deep slate `#111F2E`.
- Primary text: cool white `#F4F7FA`.
- Secondary text: blue gray `#A9B7C6`.
- Snapdragon/NPU accent: signal red `#EF4B4B`.
- Data-path accent: electric cyan `#37C8FF`.
- Verified/success state: restrained green `#45D19A`.
- Warning/fallback state: amber `#F2B84B`.

Do not use large red backgrounds. Red should indicate the NPU path or a critical point. Cyan should indicate data flow and measured telemetry.

### Typography

Use **Inter**, **Aptos**, or **Manrope**. Prefer one family throughout.

- Cover title: 46 to 54 pt, semibold.
- Slide titles: 30 to 34 pt, semibold.
- Body: 18 to 22 pt.
- Diagram labels: at least 16 pt.
- Source footer: 9 to 10 pt.

Use sentence case. Avoid all-caps paragraphs. Keep slide titles short and direct. Do not end short titles with periods.

### Visual language

- Use clean system diagrams with orthogonal connectors.
- Use simple editable icons for laptop, model file, API, NPU, GPU, CPU, shield, and telemetry.
- Use a subtle circuit-grid or chip-trace texture on at most two slides.
- Prefer one strong diagram over multiple decorative elements.
- Use device or chip imagery only when it improves comprehension.
- If generating a decorative image, use an abstract close-up of a laptop motherboard or silicon traces. Do not generate a fake Qualcomm chip or fake product photograph.
- Do not reuse the same decorative image on multiple slides.
- Do not use stock photographs of people typing at laptops.
- Avoid robots, glowing brains, humanoid AI art, cloud icons, neon cityscapes, and generic handshake imagery.

### Product wordmark

Create a simple text-only `SnapRoute` wordmark. Emphasize `Route` with the cyan data-path accent or use a small routing-node symbol. Do not create a logo that resembles the Snapdragon flame mark.

---

## Writing rules

- Use direct, natural language.
- Keep each slide to one main idea.
- Keep body copy under approximately 45 words per slide, excluding diagram labels and source footer.
- Prefer short phrases over paragraphs.
- Do not use em dashes in visible slide text.
- Avoid semicolons, slogan-like three-part lists, vague claims, and excessive adjectives.
- Avoid phrases such as “revolutionary,” “game-changing,” “next-generation,” “seamless ecosystem,” and “unlocking potential.”
- Do not use “It is not X, it is Y” constructions.
- Do not use a repeated card layout across the deck.
- Write speaker notes in a conversational first-person voice for a solo presenter.

---

## Slide-by-slide specification

### Slide 1: SnapRoute

**Purpose:** Establish the product and the single most important benefit.

**Title:**

> SnapRoute

**Subtitle:**

> Ollama-compatible local AI that can use the Snapdragon NPU

**Supporting line:**

> Automatic model resolution, verified execution, and measurable efficiency

**Presenter details:**

> {{PARTICIPANT_NAME}}  
> Snapdragon AI Lab Build & Present Challenge

**Visual:**

Use a minimal composition. Place the SnapRoute wordmark on the left. On the right, show a stylized Snapdragon-class laptop silhouette with one thin cyan request line entering it and a red NPU path lighting up inside. Keep the visual abstract and editable where practical.

**Speaker notes, approximately 20 seconds:**

“SnapRoute helps existing Ollama-compatible applications use Snapdragon acceleration through one local endpoint. It selects a compatible model and runtime, verifies where inference runs, and shows the result to the user. Everything stays on the PC.”

Do not include a source footer on the cover.

---

### Slide 2: The idle NPU problem

**Purpose:** Explain the user problem without relying on outdated format claims.

**Title:**

> The idle NPU problem

**Main copy:**

> A user buys an AI PC, installs a familiar local-AI tool, and still cannot tell whether the Snapdragon NPU is helping.

**Three labels around one visual path:**

- Existing apps expect the Ollama API
- Model and runtime choices stay hidden
- CPU fallback competes with foreground work

**Visual:**

Show one horizontal request path:

`Local AI app` to `Ollama interface` to `CPU-heavy execution`

Below it, show an underused NPU as a dim red chip outline. Do not state that every Ollama request always uses the CPU. Add a small qualifier near the diagram:

> Qualcomm acceleration is not a documented Ollama Windows path today

**Visible source footer:**

> Sources: Ollama Windows docs and Ollama issue #5360, accessed September 2026

**Speaker notes, approximately 35 seconds:**

Explain that Ollama's current Windows documentation lists NVIDIA and AMD acceleration but does not list Qualcomm Hexagon or Adreno support. An open Ollama request tracks Snapdragon X Elite GPU/NPU support. Phrase this as the current documented state, not a permanent limitation. Explain that CPU-heavy inference can compete with foreground applications, but do not claim an exact battery drain.

Sources for notes:

- https://github.com/ollama/ollama/blob/main/docs/windows.mdx
- https://github.com/ollama/ollama/issues/5360

---

### Slide 3: Inference exists, adoption remains difficult

**Purpose:** Demonstrate technical honesty and define the remaining gap after GenieX.

**Title:**

> Inference exists, adoption remains difficult

**Layout:**

Use one clean two-layer diagram, not a comparison-card grid.

Top layer, labeled `Qualcomm GenieX today`:

- GGUF through `llama.cpp`
- AI Hub bundles through QAIRT
- Hexagon NPU, Adreno GPU, and CPU paths
- OpenAI-compatible local server

Bottom layer, labeled `What Ollama users still need`:

- Ollama endpoint compatibility
- Model and Modelfile migration
- Verified device selection
- Measured fallback behavior

Connect the layers with a highlighted bracket labeled `SnapRoute product gap`.

**Key statement:**

> GenieX provides the inference foundation. SnapRoute makes it usable from the existing Ollama workflow.

**Visible source footer:**

> Source: Qualcomm GenieX documentation, accessed September 2026

**Speaker notes, approximately 40 seconds:**

Explicitly correct the old assumption that GGUF cannot use the NPU. GenieX now supports GGUF through its `llama_cpp` plugin and compiled AI Hub bundles through QAIRT. Both can target the Hexagon NPU through different stacks. GenieX already has an OpenAI-compatible server. The proposed innovation therefore focuses on Ollama protocol compatibility, migration, policy, verification, and recovery.

Sources for notes:

- https://github.com/qualcomm/GenieX
- https://github.com/qualcomm/GenieX/blob/main/notes/run.md
- https://github.com/qualcomm/GenieX/blob/main/docs/en/models/supported.mdx

---

### Slide 4: SnapRoute user experience

**Purpose:** Show the product in a simple before-and-after workflow.

**Title:**

> SnapRoute user experience

**Visual:**

Use a four-step horizontal flow with large editable icons and very little text:

1. **Connect**  
   Existing client calls the core Ollama API

2. **Resolve**  
   Match the alias to a verified AI Hub or GGUF candidate

3. **Route**  
   Choose QAIRT, `llama.cpp`, NPU, GPU, CPU, or hybrid

4. **Prove**  
   Show the active backend and measured result

Under the flow, show one short failure branch:

`NPU load fails before first token` to `verified GGUF fallback`

Use amber for the fallback branch.

**Small compatibility line:**

> MVP endpoints: `/api/chat`, `/api/generate`, `/api/tags`

**Speaker notes, approximately 40 seconds:**

Explain that a user can point an Ollama-compatible application to SnapRoute or let SnapRoute use port 11434 after stopping Ollama. SnapRoute imports one model alias and system prompt in the MVP, validates available plans, streams an Ollama-shaped response, and falls back only before any response token has been emitted. It does not claim complete API coverage.

---

### Slide 5: Request-to-hardware architecture

**Purpose:** Establish technical depth.

**Title:**

> Request-to-hardware architecture

**Editable architecture diagram:**

Build one left-to-right diagram using native shapes and orthogonal connectors:

`Ollama-compatible client`

to

`SnapRoute gateway`

to

`Request normalizer`

to

`Model resolver`

to

`Policy and health engine`

Then branch into:

- `GenieX QAIRT` to `Hexagon NPU`
- `GenieX llama.cpp` to `NPU / Adreno GPU / Oryon CPU`

Both branches return through:

`Streaming response adapter`

Place `Device profiler` and `Benchmark store` underneath the policy engine with upward connectors. Add `Local dashboard` above the gateway with a two-way connector.

Use cyan for request flow, red for the selected NPU path, gray for available but unselected paths, and amber for fallback.

**Small technical labels:**

- Loopback only
- One active generation in the MVP
- No prompt logging by default

**Speaker notes, approximately 55 seconds:**

Explain each layer briefly. The resolver ranks verified candidate artifacts, while the policy engine removes incompatible plans before scoring performance. The resource manager keeps one model loaded and one generation active to avoid memory oversubscription. SnapRoute uses GenieX rather than rebuilding inference kernels. The local gateway validates host and CORS behavior, limits request sizes, and verifies model provenance/checksums where available.

Source for notes:

- https://github.com/qualcomm/GenieX/blob/main/bindings/python/README.md
- https://github.com/qualcomm/GenieX/blob/main/sdk/README.md

---

### Slide 6: Model and routing strategy

**Purpose:** Explain the chosen model and why routing is more than a simple proxy.

**Title:**

> Model and routing strategy

**Primary model statement:**

> Reference model: Qwen3-4B-Instruct-2507 from Qualcomm AI Hub, deployed through a compatible QAIRT bundle on the Hexagon NPU

**Fallback statement:**

> Fallback: a verified Qwen3 4B-family GGUF Q4_0 model through GenieX `llama_cpp`

**Visual:**

Use one funnel or decision path:

`Request requirements`

to

`Hard filters: chipset, memory, context, modality, license, health`

to

`Measured score: TTFT, decode rate, CPU load, memory, efficiency, reliability`

to

`Eco / Balanced / Turbo / Manual plan`

Beside the model names, show an editable equivalence badge:

- Exact revision
- Same family with consent
- Substitute with manual opt-in

Highlight `Exact revision` as the desired mapping. Do not imply that every GGUF is equivalent to the AI Hub artifact.

**Small qualifier:**

> Bundle precision and device support are verified at installation

**Visible source footer:**

> Sources: Qualcomm AI Hub and GenieX supported-model documentation

**Speaker notes, approximately 50 seconds:**

Explain that Qwen3-4B-Instruct-2507 is a compact multilingual instruction model suitable for summarization and local chat. The exact QAIRT precision comes from the downloaded bundle metadata. GenieX recommends GGUF Q4_0 for the Hexagon path, but the official Qwen3-4B GGUF repository does not currently list Q4_0. The team must therefore create that quantization from official weights or pin and verify a reputable third-party artifact. The router remains deterministic in the MVP because hard constraints and a small candidate set do not justify another neural model.

Sources for notes:

- https://aihub.qualcomm.com/compute/models/qwen3_4b_instruct_2507
- https://github.com/qualcomm/GenieX/blob/main/docs/en/models/supported.mdx
- https://huggingface.co/Qwen/Qwen3-4B-GGUF

---

### Slide 7: Proof on the target device

**Purpose:** Show the prototype scope and fair evaluation plan.

**Title:**

> Proof on the target device

**Layout:**

Use one large benchmark comparison area with empty values that can be updated later. Do not create fake bars before measurements exist.

Columns:

- Ollama observed baseline
- GenieX GGUF CPU
- GenieX GGUF NPU or hybrid
- GenieX QAIRT NPU

Rows:

- Time to first token
- Prompt processing rate
- Decode rate
- Average CPU load
- Peak memory
- Comparative energy index
- Task-quality result

Use placeholders:

- `{{TTFT_RESULT}}`
- `{{PREFILL_RESULT}}`
- `{{DECODE_RESULT}}`
- `{{CPU_LOAD_RESULT}}`
- `{{MEMORY_RESULT}}`
- `{{ENERGY_INDEX_RESULT}}`
- `{{QUALITY_RESULT}}`

Until the presenter supplies results, render `Pending target-device test` in each result area.

Add a small footer band labeled `Demo sequence`:

`Import alias` to `Stream on NPU` to `Show telemetry` to `Inject failure` to `Fallback before first token`

**Method note on slide:**

> Same GGUF file for CPU versus accelerator attribution. Separate end-to-end comparison for Ollama versus SnapRoute.

**Speaker notes, approximately 55 seconds:**

Explain that the controlled experiment uses the same GGUF Q4_0 file and GenieX build across CPU, GPU if available, and NPU/hybrid plans. A separate product experiment compares the user's observed Ollama workflow with SnapRoute's selected path. Use fixed prompts and output length, warmups, randomized run order, at least 20 measured repetitions per prompt bin, and median/p95 reporting. Evaluate answer quality separately because QAIRT and GGUF quantizations can differ. Energy is a comparative estimate unless validated with reliable battery or external power measurement.

Do not show a positive conclusion until real data is available.

---

### Slide 8: A practical bridge to Snapdragon AI

**Purpose:** Close with product value, delivery scope, and a memorable final statement.

**Title:**

> A practical bridge to Snapdragon AI

**Main visual:**

Show a single clean path from `Existing local-AI apps` through the `SnapRoute` wordmark to `Verified Snapdragon execution`.

**Four concise proof points:**

- Familiar Ollama-facing workflow
- Qualcomm AI Hub model on the Hexagon NPU
- Explainable device and runtime selection
- Measured results with safe fallback

**Closing statement:**

> GenieX makes accelerated inference possible. SnapRoute makes the existing local-AI workflow compatible, observable, and resilient.

**Small delivery line:**

> MVP: one device, one verified AI Hub model, three core endpoints, two execution plans, and one reproducible benchmark

**Call to action:**

> Build once for the workflow users already have

**Speaker notes, approximately 30 seconds:**

“The prototype stays focused. It supports one validated Snapdragon HP PC, one AI Hub Qwen model, the three essential Ollama endpoints, controlled CPU and NPU plans, and a reproducible comparison. The goal is to make Snapdragon acceleration usable from tools people already rely on, while proving every performance claim on the device.”

Visible source footer:

> Snapdragon AI Lab evaluation: implementation, use case, deployment, presentation

Source for notes:

- https://api.unstop.com/competitions/crp-snapdragon-ai-lab-build-present-challenge-qualcomm-1748893

---

## Diagram and chart requirements

- Keep every architecture diagram editable.
- Use straight or right-angle connectors. Do not run connectors through labels.
- Use consistent labels: `Hexagon NPU`, `Adreno GPU`, `Oryon CPU`, `QAIRT`, and `llama.cpp`.
- Use red only for the selected NPU path and cyan for the main request/response flow.
- On the benchmark slide, do not generate bars, percentages, or rankings until measured values are supplied.
- When results become available, use a dot plot or aligned numeric table instead of a decorative gauge.
- Label energy results as `comparative energy index` unless genuine energy units were measured with a documented method.

---

## Speaker-note requirements

Each slide's notes must include:

1. a natural talk track that fits the allotted time;
2. factual caveats that would clutter the visible slide;
3. full URLs for the external sources used on that slide;
4. pronunciation help once, if needed: QAIRT is spoken as “Q-A-I-R-T” unless the presenter prefers Qualcomm's current usage;
5. no stage directions such as “click next” or “pause dramatically.”

Keep the complete presentation between 4 minutes 30 seconds and 5 minutes 30 seconds.

---

## Placeholders Manus must preserve

Do not invent values for these fields:

- `{{PARTICIPANT_NAME}}`
- `{{COLLEGE_OR_ORGANIZATION}}`
- `{{TARGET_HP_MODEL}}`
- `{{SNAPDRAGON_CHIPSET}}`
- `{{WINDOWS_BUILD}}`
- `{{GENIEX_VERSION}}`
- `{{QAIRT_VERSION}}`
- `{{OLLAMA_VERSION}}`
- `{{TTFT_RESULT}}`
- `{{PREFILL_RESULT}}`
- `{{DECODE_RESULT}}`
- `{{CPU_LOAD_RESULT}}`
- `{{MEMORY_RESULT}}`
- `{{ENERGY_INDEX_RESULT}}`
- `{{QUALITY_RESULT}}`
- `{{DEMO_VIDEO_OR_REPOSITORY_LINK}}`

If a placeholder has not been populated, show `Pending target-device test` only where a visible result is necessary. Do not expose unused placeholders on the final slides.

---

## Quality-control checklist

Before delivering the deck, verify all of the following:

- The deck contains exactly eight slides.
- The presentation fits a five-minute pitch.
- Slide 3 clearly acknowledges that GenieX already exists.
- No slide repeats the outdated “GGUF cannot use the NPU” claim.
- No benchmark number or battery claim has been invented.
- The title slide remains minimal.
- Every slide has one dominant visual composition.
- Body text remains at least 18 pt and diagram labels at least 16 pt.
- No text or object overflows the slide boundary.
- Diagram connectors do not cross labels.
- Ollama compatibility is described as a tested subset.
- The reference model and fallback appear as different artifacts.
- The QAIRT precision comes from verified bundle metadata.
- The architecture makes clear that GenieX performs inference.
- The benchmark slide separates hardware attribution from the end-to-end product comparison.
- Security and privacy claims stay limited to local binding, content-free telemetry, and the stated controls.
- All source URLs appear in speaker notes.
- All editable text, diagrams, and result fields remain editable in PowerPoint.
- The deck does not visually imply that SnapRoute is an official Qualcomm product.

---

## Final instruction to Manus AI

Build the deck exactly around this narrative. Optimize for clarity at presentation distance. Reduce visible text before reducing font size. Keep technical detail in speaker notes when it cannot fit cleanly on a slide. The final deck should leave judges with one clear idea:

> SnapRoute connects the Ollama workflow users already have to verified, measurable Snapdragon execution through Qualcomm GenieX.

