# Perpustakaan Tips Claude — arahan untuk Claude

Repo ini ialah PWA "Tips Claude" milik guru Matematik SMK Bugaya II Semporna (akaun HAPSMKBII),
diterbitkan melalui GitHub Pages. Jawab pengguna dalam **Bahasa Melayu baku**.

## Fail
- `tips.json` — **rekod induk isi tip**. Satu-satunya fail yang berubah setiap minggu.
- `index.html`, `sw.js`, `manifest.webmanifest`, ikon — aplikasi. Jika diubah, **tukar `VERSI` dalam `sw.js`**.
- `alat/jana_context.py` — menjana fail Context ringkas untuk Projek "Tips Claude".
- Status belajar, nota dan peti masuk **disimpan dalam telefon pengguna sahaja**, bukan dalam repo.

## Rutin mingguan (pengguna memuat naik `peti-masuk-TARIKH.json`)
1. Baca fail eksport: `peti` (teks, pautan, gambar base64) dan `status` (status + nota setiap tip).
2. Bagi setiap item peti masuk: ekstrak tip (baca teks dalam gambar). Abaikan item yang bukan tip.
3. **Gabung pendua**: jika tip sama dengan entri sedia ada, tambah sumber pada entri itu, jangan cipta entri baharu.
4. **Semakan terpilih**: semak dengan web hanya tip yang membuat dakwaan fakta (ciri, harga, had, pembuat).
   `semakan`: `sah` | `belum` | `salah` (+ `pembetulan`) | `amalan` (tiada dakwaan fakta).
5. Kata kunci tanpa konteks: cari di web, bina entri lengkap, sumber `{"jenis":"web", ...}`.
6. Medan entri: `id` (t-…), `tajuk`, `kategori` (id kategori sedia ada), `ringkasan` (2–3 ayat BM baku,
   istilah Inggeris dalam kurungan), `langkah` (senarai), `kataKunci`, `sumber` (jenis threads/web/claude;
   threads = nama akaun sahaja, tiada petikan panjang), `tarikh` (YYYY-MM-DD postingan; kosong jika tidak pasti).
7. Pilih `fokus.ids` (3 tip) daripada yang statusnya `belum` dan paling berguna untuk guru; tulis `fokus.nota`.
8. Kemas kini `versi`, `dikemaskini`, `fokus.minggu`. Sahkan JSON sah.
9. Commit + push ke `main`. Jana Context:
   `python3 alat/jana_context.py tips.json peti-masuk-TARIKH.json > Perpustakaan_Tips_Claude.md`
   dan hantar fail itu kepada pengguna untuk menggantikan fail lama dalam Context Projek.
10. Beritahu pengguna untuk menekan **Kosongkan peti masuk** dalam aplikasi.

Jangan simpan fail eksport, gambar atau nota peribadi dalam repo (repo awam).

## Kategori
skill · kuota · prompt · projek · artifact · agent · connector · code · lain
