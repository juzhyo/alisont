#!/usr/bin/env python3
"""Check GoatCounter API spec for correct paths endpoint params."""
import urllib.request, urllib.error, json, re

with open("/root/.hermes/scripts/monthly_report.py") as f:
    script = f.read()
m = re.search(r'TOKEN\s*=\s*"([^"]+)"', script)
TOKEN = m.group(1)

site = "alisontdesign"
base = f"https://{site}.goatcounter.com"

# Fetch the API spec
req = urllib.request.Request(base + "/api.json")
req.add_header("Authorization", f"Bearer {TOKEN}")
req.add_header("Accept", "application/json")
try:
    with urllib.request.urlopen(req, timeout=15) as resp:
        spec = json.loads(resp.read())
    # Find the paths endpoint definition
    if "paths" in spec:
        for path, methods in spec["paths"].items():
            if "path" in path.lower():
                print(f"\n=== {path} ===")
                for method, detail in methods.items():
                    print(f"  {method.upper()}: {json.dumps(detail.get('parameters', []))[:500]}")
except Exception as e:
    print(f"Error: {e}")
