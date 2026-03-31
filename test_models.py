# test_models.py
import os, requests, json, sys

KEY = os.getenv("OPENROUTER_API_KEY")
if not KEY:
    print("ERROR: OPENROUTER_API_KEY not found in environment. Make sure .env is loaded or key is in env.")
    sys.exit(1)

MODELS = [
    "google/gemini-2.0-flash-lite-001",
    "google/gemini-2.0-flash-001",
    "openai/gpt-4o-mini"
]

URL = "https://api.openrouter.ai/v1/chat/completions"

for model in MODELS:
    print("="*80)
    print("Testing model:", model)
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": "Say hello"}],
        "max_tokens": 60
    }
    headers = {
        "Authorization": f"Bearer {KEY}",
        "Content-Type": "application/json"
    }
    try:
        r = requests.post(URL, headers=headers, json=payload, timeout=30)
    except Exception as e:
        print("Request error:", str(e))
        continue

    print("Status code:", r.status_code)
    try:
        j = r.json()
        print(json.dumps(j, indent=2, ensure_ascii=False))
    except Exception:
        print("Response text:", r.text)
print("="*80)
