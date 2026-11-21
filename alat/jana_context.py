#!/usr/bin/env python3
"""Jana fail Context ringkas untuk Projek "Tips Claude" daripada tips.json.

Guna:
  python3 alat/jana_context.py tips.json [peti-masuk-TARIKH.json] > Perpustakaan_Tips_Claude.md

Fail eksport peti masuk (pilihan) membekalkan status belajar terkini dari telefon.
Nota peribadi dan sumber penuh sengaja tidak dimasukkan supaya fail kekal kecil.
"""
import json
import sys

ST = {"belum": "Belum cuba", "cuba": "Sudah cuba", "berguna": "Berguna", "tidak": "Tidak berguna"}
SM = {"sah": "Disahkan", "belum": "Belum disahkan", "salah": "Tidak tepat", "amalan": "Amalan kerja"}


def main():
    data = json.load(open(sys.argv[1], encoding="utf-8"))
    status = {}
    if len(sys.argv) > 2:
        exp = json.load(open(sys.argv[2], encoding="utf-8"))
        status = {k: v.get("status") for k, v in exp.get("status", {}).items()}
    cat = {k["id"]: k["nama"] for k in data["kategori"]}
    tips = data["tips"]
    out = []
    out.append("# Perpustakaan Tips Claude (fail Context)")
    out.append("")
    out.append(f"_Dikemas kini: {data.get('dikemaskini', '')} · {len(tips)} tip · "
               "rekod induk: tips.json dalam repo HAPSMKBII/perpustakaan-tips-claude_")
    out.append("")
    out.append("Jawab soalan pengguna tentang tips Claude berdasarkan fail ini. Status belajar datang "
               "daripada eksport terakhir dari telefon; ia mungkin sudah berubah.")
    out.append("")
    f = data.get("fokus", {})
    if f.get("ids"):
        out.append(f"## Fokus minggu {f.get('minggu', '')}")
        for i in f["ids"]:
            t = next((x for x in tips if x["id"] == i), None)
            if t:
                out.append(f"- {t['tajuk']}")
        if f.get("nota"):
            out.append(f"\n{f['nota']}")
        out.append("")
    for k in data["kategori"]:
        L = [t for t in tips if t["kategori"] == k["id"]]
        if not L:
            continue
        out.append(f"## {cat[k['id']]}")
        out.append("")
        for t in L:
            s = status.get(t["id"]) or t.get("statusAwal") or "belum"
            out.append(f"### {t['tajuk']}  `{t['id']}`")
            out.append(f"Semakan: {SM.get(t.get('semakan'), '?')} · Status: {ST.get(s, s)}")
            if t.get("semakan") == "salah" and t.get("pembetulan"):
                out.append(f"Pembetulan: {t['pembetulan']}")
            out.append(t["ringkasan"])
            for j, l in enumerate(t.get("langkah", []), 1):
                out.append(f"{j}. {l}")
            out.append("")
    sys.stdout.write("\n".join(out))


if __name__ == "__main__":
    main()
