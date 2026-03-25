import json
import os
import re

from dotenv import load_dotenv
from flask import Flask, jsonify, render_template, request
import requests

load_dotenv(override=True)

app = Flask(__name__)


def _is_demo_mode() -> bool:
    return os.getenv("DEMO_MODE", "").strip().lower() in ("1", "true", "yes", "on")


def _demo_only() -> bool:
    """When true (e.g. on public demo hosting), never call Anthropic even if a key is set."""
    return os.getenv("DEMO_ONLY", "").strip().lower() in ("1", "true", "yes", "on")


def _serves_demo() -> bool:
    return _is_demo_mode() or _demo_only()


def _extract_line(text: str, label: str) -> str | None:
    if not text:
        return None
    m = re.search(rf"{re.escape(label)}\s*([^\n]+)", text, re.IGNORECASE)
    return m.group(1).strip() if m else None


def _demo_report_text(user_content: str) -> str:
    wo = _extract_line(user_content, "Work Order ID:") or "WO-DEMO"
    title = _extract_line(user_content, "Title:") or "Sample shutdown"
    req_by = _extract_line(user_content, "Requested By:") or "Facilities"
    systems = _extract_line(user_content, "Systems Being Shut Down:") or "See form"

    report = {
        "overallRisk": "HIGH",
        "riskScore": 72,
        "executiveSummary": (
            f"DEMO MODE — This is sample output for pitches and UI testing; no API credits used. "
            f"Shutdown “{title}” ({wo}) may affect dependent loads. Coordinate isolation and "
            f"notifications before work begins."
        ),
        "primaryConcerns": [
            "Downstream air handling and exhaust interlocks with isolated equipment",
            "Temporary loss of redundancy for critical branch circuits during window",
            "Coordination with BAS/alarms and life-safety monitoring",
        ],
        "impactedEquipment": [
            {
                "name": "AHU-03",
                "id": "AHU-03",
                "system": "HVAC / Air Handling",
                "severity": "high",
                "impact": "Reduced supply air to east wing during outage",
                "mitigation": "Stage work; verify backup paths; notify occupants",
                "tags": ["HVAC", "demo"],
            },
            {
                "name": "Panel MDP-B",
                "id": "MDP-B",
                "system": "Normal Power (Utility)",
                "severity": "medium",
                "impact": "Partial de-energization of feeder during lockout",
                "mitigation": "LOTO per procedure; verify zero energy before work",
                "tags": ["electrical", "demo"],
            },
        ],
        "impactedSpaces": [
            {
                "name": "East Wing — Level 2",
                "floor": "L2",
                "severity": "medium",
                "impact": "Comfort and ventilation changes during shutdown",
                "affectedSystems": ["HVAC", "BAS"],
            },
        ],
        "downstreamSystems": [
            {
                "system": "Exhaust / Ventilation",
                "dependency": "Interlocked with AHU-03 supply",
                "impact": "Possible alarm or flow imbalance if not sequenced",
                "severity": "medium",
            },
        ],
        "recommendations": [
            {
                "title": "Pre-shutdown walkthrough",
                "description": "Walk the affected zones with operations and confirm BAS points.",
                "priority": "before-shutdown",
            },
            {
                "title": "Communication plan",
                "description": f"Notify stakeholders listed for {req_by}; document start/stop times.",
                "priority": "immediate",
            },
        ],
        "requiredNotifications": [
            "Building operations",
            "Security / after-hours",
            "Clinical or tenant reps if applicable",
        ],
        "sequenceOfOperations": [
            "Confirm isolation points and LOTO boundaries",
            "Notify BAS; place relevant points in override or test as approved",
            "Execute work; verify restoration sequence",
            "Remove LOTO; restore normal operation; validate alarms",
        ],
        "estimatedRecoveryTime": "2–6 hours (illustrative)",
        "drawingGapsIdentified": [
            "As-built single-line not verified in demo data",
            f"Systems noted in form: {systems}",
        ],
    }
    return json.dumps(report, indent=2)


@app.get("/")
def home():
    return render_template("index.html")


@app.get("/api/config")
def api_config():
    return jsonify({"demoMode": _serves_demo()})


@app.post("/api/claude")
def call_claude():
    body = request.get_json(silent=True) or {}
    messages = body.get("messages")

    if _serves_demo():
        if not isinstance(messages, list) or not messages:
            return jsonify({"error": "messages must be a non-empty array"}), 400
        user_content = ""
        for m in messages:
            if isinstance(m, dict) and m.get("role") == "user":
                c = m.get("content")
                if isinstance(c, str):
                    user_content = c
                    break
        text = _demo_report_text(user_content)
        return jsonify({"text": text, "demo": True})

    anthropic_api_key = os.getenv("ANTHROPIC_API_KEY", "").strip()
    anthropic_model = os.getenv("ANTHROPIC_MODEL", "claude-sonnet-4-20250514")

    if not anthropic_api_key:
        return jsonify({"error": "Missing ANTHROPIC_API_KEY in .env (or set DEMO_MODE=true)"}), 500

    if not isinstance(messages, list) or not messages:
        return jsonify({"error": "messages must be a non-empty array"}), 400

    system_prompt = body.get("systemPrompt", "")
    max_tokens = body.get("maxTokens", 1500)

    try:
        resp = requests.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "x-api-key": anthropic_api_key,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
            json={
                "model": anthropic_model,
                "max_tokens": max_tokens,
                "system": system_prompt,
                "messages": messages,
            },
            timeout=120,
        )
        data = resp.json()
    except requests.RequestException as exc:
        return jsonify({"error": f"Anthropic request failed: {exc}"}), 502
    except ValueError:
        return jsonify({"error": "Invalid JSON from Anthropic"}), 502

    if resp.status_code >= 400:
        return jsonify({"error": data}), resp.status_code

    text = "".join(
        block.get("text", "")
        for block in data.get("content", [])
        if isinstance(block, dict)
    )
    return jsonify({"text": text, "raw": data})


if __name__ == "__main__":
    # 0.0.0.0: works with http://127.0.0.1:5000 and http://localhost:5000 (e.g. Cursor Simple Browser)
    app.run(host="0.0.0.0", port=5000, debug=True)

