#!/usr/bin/env python3
"""Pull complete GoatCounter data for past month - all endpoints."""
import urllib.request, urllib.error, json, os, re, sys
from datetime import date, timedelta

SITE = "alisontdesign"
BASE = f"https://{SITE}.goatcounter.com"
OUTDIR = "/root/.hermes/scripts/alisont_visitor_analytics/data"

with open("/root/.hermes/scripts/monthly_report.py") as f:
    script = f.read()
m = re.search(r'TOKEN\s*=\s*"([^"]+)"', script)
TOKEN = m.group(1)

def api_get(path):
    req = urllib.request.Request(BASE + path)
    req.add_header("Authorization", f"Bearer {TOKEN}")
    req.add_header("Accept", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        print(f"  ERROR {e.code} {path}")
        return None

def main():
    os.makedirs(OUTDIR, exist_ok=True)

    today = date.today()
    first = today.replace(day=1)
    last_month = first - timedelta(days=1)
    start = last_month.strftime("%Y-%m-01")
    end = today.strftime("%Y-%m-%d")
    print(f"Period: {start} to {end}")

    # 1. Total stats
    print("1. Fetching total stats...")
    total = api_get(f"/api/v0/stats/total?start={start}&end={end}")
    if total:
        with open(os.path.join(OUTDIR, "goatcounter_total.json"), "w") as f:
            json.dump(total, f, indent=2)
        print(f"   ✓ total: {total.get('total')} views")

    # 2. Hits (all paths aggregated)
    print("2. Fetching hits...")
    hits = api_get(f"/api/v0/stats/hits?start={start}&end={end}")
    if hits:
        with open(os.path.join(OUTDIR, "goatcounter_hits.json"), "w") as f:
            json.dump(hits, f, indent=2)
        print(f"   ✓ hits: {len(hits.get('hits', []))} paths")

    # 3. All paths list (no date filter - full list)
    print("3. Fetching paths list...")
    all_paths = api_get("/api/v0/paths?Limit=200")
    if all_paths:
        with open(os.path.join(OUTDIR, "goatcounter_paths.json"), "w") as f:
            json.dump(all_paths, f, indent=2)
        print(f"   ✓ paths: {len(all_paths)} entries")

    # 4. Per-path daily stats for top pages
    print("4. Fetching per-path stats for top pages...")
    top_paths = {}
    if hits and "hits" in hits:
        sorted_hits = sorted(hits["hits"], key=lambda x: x.get("count", 0), reverse=True)[:20]
        for h in sorted_hits:
            pid = h.get("path_id")
            if pid:
                detail = api_get(f"/api/v0/stats/hits/{pid}?start={start}&end={end}")
                if detail:
                    top_paths[h.get("path", "?")] = detail

    if top_paths:
        with open(os.path.join(OUTDIR, "goatcounter_per_path.json"), "w") as f:
            json.dump(top_paths, f, indent=2)
        print(f"   ✓ per-path: {len(top_paths)} paths detailed")

    # 5. Save metadata
    meta = {
        "site": SITE,
        "period_start": start,
        "period_end": end,
        "fetched_at": date.today().isoformat(),
        "total_views": (total or {}).get("total"),
    }
    with open(os.path.join(OUTDIR, "metadata.json"), "w") as f:
        json.dump(meta, f, indent=2)

    print(f"\nAll files in {OUTDIR}")
    for f in sorted(os.listdir(OUTDIR)):
        sz = os.path.getsize(os.path.join(OUTDIR, f))
        print(f"  {f} ({sz} bytes)")

if __name__ == "__main__":
    main()
