# NiveshDrishti AI

A single-file Streamlit municipal-governance decision-support prototype for regional-language grievance intake, Gemini-assisted policy analysis, and Collector sanction-note drafting.

## Run locally

```powershell
uv sync
$env:GEMINI_API_KEY = "your-google-ai-studio-key"
uv run streamlit run APP.py
```

For Streamlit Community Cloud, configure `GEMINI_API_KEY` under **App settings → Secrets**. At runtime the app resolves credentials in this order: Streamlit secret `GEMINI_API_KEY`, environment variable `GEMINI_API_KEY`, environment variable `GOOGLE_API_KEY`, then the password field in the sidebar. When a managed secret or environment key is present, the key input is omitted. The app uses the official `google-genai` SDK, Gemini 2.5 Flash for text/audio/image intake, and Gemini 3.1 Pro Preview for sequential policy reasoning. Gemini 2.5 Pro is no longer available to new API users. If Pro is unavailable due to quota or a temporary 503, the agent transparently falls back to Gemini 2.5 Flash, then Gemini 3 Flash Preview if Flash is temporarily unavailable; the actual model is shown in each result and recorded in the audit log. Temporary 5xx errors are retried once.

If no key is configured, Gemini actions remain disabled and an administrator-facing warning is shown; the synthetic demo, dashboard, and draft memo remain available. The app does not stop the entire session for missing credentials.

## Workflows

1. **Rural voice gateway** — regional-language complaint text/transcripts, MP3/WAV voice notes, optional field photos, structured JSON, and human-reviewable visual observations.
2. **Governance swarm** — provisional demographic risk synthesis, central/state scheme thematic leads, and an assumption-based cost/financial/social-reach scenario.
3. **Collector executive dashboard** — session-level grievance clusters, explicitly supplied map coordinates, grievance resolution and sanction registers, memo draft download, and JSON audit export.

## Important limitations

- This prototype is not an official Government of India service, authenticated government system, WhatsApp integration, GIS/Census source, scheme database, or sanctioning authority.
- Session state is shared across tabs and reruns for the current Streamlit session; it is not durable storage and does not survive the session/server lifecycle. Use a secured, access-controlled, auditable government datastore before deployment.
- Authorized citizen text, audio, and optional photos are transmitted to Google's Gemini API. Do not submit unnecessary personal or sensitive data. Uploaded media bytes and the API key are not included in the JSON audit export.
- AI visual assessment checks visible consistency only. It cannot authenticate image origin, date, location, edits, or fraud. The displayed agreement metric requires human reviews and is not independently benchmarked model accuracy.
- The app has no official Census or live scheme integration. Risk scores and scheme matches are provisional decision-support signals and not verified demographic facts, active-scheme status, or eligibility determinations.
- Cost, ROI, and family-reach outputs are indicative assumptions—not a DPR, audited estimate, budget commitment, or monetized social-return valuation.
- Sanction-register amounts are entered by an operator who attests to an order reference; this prototype does not authenticate the order or the operator's authority.
- A generated Collector note is a formal **draft**, not a legally binding order. Only the competent public authority can verify, approve, number, and sign a sanction under applicable rules.
- The native Streamlit map uses an external basemap provider. Demo coordinates are synthetic and approximate; manually supplied coordinates require field verification.

## Evaluation mode

Turn on **Live demo / field inspector mode** in the sidebar to prefill a synthetic Hindi water-tank grievance affecting 400 families in the approximate Vanasthali corridor. Click **Run one-click governance swarm** to execute all three Pro reasoning agents. The fixture does not fabricate a photo, voice recording, field verification, human review, resolution, or sanctioned funds.
