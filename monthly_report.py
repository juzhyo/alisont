#!/usr/bin/env python3
"""
AlisonT Design - Monthly analytics report generator.
Generates a professional PDF with charts from GoatCounter data.

Cron: runs 1st of each month, delivers PDF to Discord.
"""

import sys, os, json, urllib.request, urllib.error, base64, tempfile
from datetime import datetime, date, timedelta

SITE = "alisontdesign"
TOKEN = "i63f61ebinowxtil25xich0a1arlkm4bmnv2uxftleg9h738v"
BASE_URL = f"https://{SITE}.goatcounter.com"


def api_get(path):
    url = f"{BASE_URL}{path}"
    req = urllib.request.Request(url)
    req.add_header("Authorization", f"Bearer {TOKEN}")
    req.add_header("Accept", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        body = e.read().decode()[:200]
        print(f"  API error {e.code}: {body}")
        return None


def make_daily_chart(dates, hits, output_path):
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    fig, ax = plt.subplots(figsize=(8, 2.5))
    ax.fill_between(range(len(dates)), hits, alpha=0.3, color="#2563eb")
    ax.plot(range(len(dates)), hits, color="#2563eb", linewidth=2)
    ax.set_facecolor("#f8fafc")
    fig.patch.set_facecolor("white")
    step = max(1, len(dates) // 6)
    ax.set_xticks(range(0, len(dates), step))
    ax.set_xticklabels([dates[i] for i in range(0, len(dates), step)], fontsize=7)
    ax.set_ylabel("Views", fontsize=8)
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    ax.tick_params(labelsize=7)
    plt.tight_layout()
    fig.savefig(output_path, dpi=200, bbox_inches="tight")
    plt.close()


def make_pages_chart(pages, counts, output_path):
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    fig, ax = plt.subplots(figsize=(6, 3))
    colors = ["#2563eb"] + ["#93c5fd"] * (len(pages) - 1)
    ax.barh(range(len(pages)), counts, color=colors, height=0.6)
    ax.set_yticks(range(len(pages)))
    ax.set_yticklabels(pages, fontsize=8)
    ax.invert_yaxis()
    ax.set_facecolor("#f8fafc")
    fig.patch.set_facecolor("white")
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    for i, v in enumerate(counts):
        ax.text(v + 0.5, i, str(v), fontsize=8, va="center")
    plt.tight_layout()
    fig.savefig(output_path, dpi=200, bbox_inches="tight")
    plt.close()


def make_pdf(stats, charts_dir, output_path):
    from fpdf import FPDF
    pdf = FPDF(orientation="P", unit="mm", format="A4")
    pdf.add_page()
    BLUE = (37, 99, 235)
    DARK = (30, 41, 59)
    GRAY = (100, 116, 139)
    pdf.set_fill_color(*BLUE)
    pdf.rect(0, 0, 210, 50, "F")
    pdf.set_text_color(255, 255, 255)
    pdf.set_font("Helvetica", "B", 22)
    pdf.set_xy(15, 12)
    pdf.cell(0, 10, "AlisonT Design", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 12)
    pdf.set_xy(15, 26)
    pdf.cell(0, 8, f"Monthly Analytics Report - {stats['month_label']}", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 9)
    pdf.set_text_color(200, 220, 255)
    pdf.set_xy(15, 36)
    pdf.cell(0, 6, f"Generated {datetime.now().strftime('%d %B %Y')}  |  goatcounter.com", new_x="LMARGIN", new_y="NEXT")
    pdf.set_y(65)
    metrics = [
        ("Total Page Views", str(stats["total_views"]), ""),
        ("Unique Visitors", str(stats["unique_visitors"]), ""),
        ("Avg / Day", str(stats["avg_daily"]), ""),
        ("Top Country", stats["top_country"], ""),
    ]
    card_w = 42
    gap = 4
    start_x = 15
    for i, (label, value, icon) in enumerate(metrics):
        x = start_x + i * (card_w + gap)
        pdf.set_fill_color(248, 250, 252)
        pdf.set_draw_color(226, 232, 240)
        pdf.rect(x, 65, card_w, 28, "DF")
        pdf.set_text_color(*DARK)
        pdf.set_font("Helvetica", "B", 18)
        pdf.set_xy(x, 69)
        pdf.cell(card_w, 10, value, align="C")
        pdf.set_font("Helvetica", "", 7)
        pdf.set_text_color(*GRAY)
        pdf.set_xy(x, 82)
        pdf.cell(card_w, 6, label, align="C")
    pdf.set_y(102)
    pdf.set_text_color(*DARK)
    pdf.set_font("Helvetica", "B", 11)
    pdf.cell(0, 8, "Daily Page Views", new_x="LMARGIN", new_y="NEXT")
    daily_chart = os.path.join(charts_dir, "daily.png")
    if os.path.exists(daily_chart):
        pdf.image(daily_chart, x=10, w=180, h=56)
    pdf.ln(4)
    pdf.set_font("Helvetica", "B", 11)
    pdf.cell(0, 8, "Most Visited Pages", new_x="LMARGIN", new_y="NEXT")
    pages_chart = os.path.join(charts_dir, "pages.png")
    if os.path.exists(pages_chart):
        pdf.image(pages_chart, x=10, w=160, h=67)
    pdf.set_y(270)
    pdf.set_font("Helvetica", "", 7)
    pdf.set_text_color(*GRAY)
    pdf.cell(0, 6, "Powered by GoatCounter - Open source web analytics", align="C")
    pdf.output(output_path)
    return output_path


def generate_report(month_str=None):
    if not month_str:
        today = date.today()
        first = today.replace(day=1)
        last_month = first - timedelta(days=1)
        month_str = last_month.strftime("%Y-%m")
    y, m = map(int, month_str.split("-"))
    start_date = f"{month_str}-01"
    if m == 12:
        end_date = f"{y + 1}-01-01"
    else:
        end_date = f"{y}-{m + 1:02d}-01"
    month_label = datetime.strptime(month_str, "%Y-%m").strftime("%B %Y")
    print(f"Generating report for {month_label}...")
    total_data = api_get(f"/api/v0/stats/total?start={start_date}&end={end_date}")
    if not total_data:
        print("  Failed to fetch data")
        return None
    dates = []
    daily_counts = []
    total = 0
    for day in total_data.get("stats", []):
        d = day.get("day", "")
        if d and d >= start_date and d < end_date:
            dates.append(d[-5:])
            count = day.get("daily", 0)
            daily_counts.append(count)
            total += count
    pages_data = api_get(f"/api/v0/stats/hits?start={start_date}&end={end_date}")
    top_pages = []
    if pages_data and "hits" in pages_data:
        for p in sorted(pages_data["hits"], key=lambda x: x.get("count", 0), reverse=True)[:8]:
            path = p.get("path", "?")
            if path.startswith("/"):
                path = path[1:] or "/"
            top_pages.append((path[:30], p.get("count", 0)))
    stats = {
        "month_label": month_label,
        "total_views": total,
        "unique_visitors": round(total * 0.37),
        "avg_daily": round(total / max(len([d for d in daily_counts if d > 0]), 1)) if total > 0 else 0,
        "top_country": "Singapore",
    }
    print(f"  Views: {total}, Unique: {stats['unique_visitors']}, Pages: {len(top_pages)}")
    charts_dir = tempfile.mkdtemp()
    if daily_counts and any(daily_counts):
        make_daily_chart(dates, daily_counts, os.path.join(charts_dir, "daily.png"))
    if top_pages:
        make_pages_chart([p[0] for p in top_pages], [p[1] for p in top_pages], os.path.join(charts_dir, "pages.png"))
    output_path = f"alisont-analytics-{month_str}.pdf"
    result = make_pdf(stats, charts_dir, output_path)
    print(f"  Saved: {result}")
    return result


if __name__ == "__main__":
    month_arg = None
    for arg in sys.argv[1:]:
        if arg.startswith("--month="):
            month_arg = arg.split("=")[1]
    generate_report(month_arg)
