// Ilustrasi ruang belakang Pawon Lirih untuk /rombongan (buatan sendiri): tampak atas, dua meja panjang, 30 kursi.
// Sesuai teks halaman: "Ruang belakang kami muat tiga puluh orang di dua meja panjang."
//
// Pemakaian (dari akar proyek):
//   node scripts/ilustrasi/ruang-belakang.mjs <folder>            -> <folder>/ruang-belakang.html (font diunduh ke <folder>/fonts)
//   node scripts/ilustrasi/ruang-belakang.mjs <folder> --render   -> public/images/ruang-belakang.webp (1200x750)
// Lalu: node scripts/static-images.mjs . --dirs public/images
import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import path from 'node:path'
import { createRequire } from 'node:module'

const W = 1200, H = 750
const f = (n) => Math.round(n * 10) / 10
function acak(seed) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 } }
const r = acak(7)

// kursi tampak atas: dudukan + sandaran; arah 'atas' = sandaran di sisi atas
const kursi = (x, y, arah) => {
  const rot = { atas: 0, bawah: 180, kiri: -90, kanan: 90 }[arah]
  return `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="-22" y="-20" width="44" height="40" rx="9" fill="url(#kursi)"/><rect x="-24" y="-26" width="48" height="12" rx="6" fill="#7c4a1e"/><rect x="-16" y="-10" width="32" height="22" rx="6" fill="#d9a35a" opacity=".55"/></g>`
}
const piring = (x, y) => `<circle cx="${x}" cy="${y}" r="15" fill="#fffaf0" stroke="#e7dccb" stroke-width="2"/><circle cx="${x}" cy="${y}" r="9" fill="#f3ead9"/>`
const mangkuk = (x, y, rad, isi, tepi = '#f7f0e3') => `<circle cx="${x}" cy="${y + 3}" r="${rad + 2}" fill="#000" opacity=".12"/><circle cx="${x}" cy="${y}" r="${rad}" fill="${tepi}"/><circle cx="${x}" cy="${y}" r="${rad - 5}" fill="${isi}"/>`
const bakul = (x, y) => `<circle cx="${x}" cy="${y + 3}" r="24" fill="#000" opacity=".12"/><circle cx="${x}" cy="${y}" r="23" fill="#c89b5c"/><g stroke="#a8773c" stroke-width="2" fill="none"><circle cx="${x}" cy="${y}" r="17"/><circle cx="${x}" cy="${y}" r="11"/></g><circle cx="${x}" cy="${y}" r="13" fill="#fbf8f1"/>`
const kawung = (x0, y0, w, h) => { let s = ''; for (let x = x0 + 12; x < x0 + w; x += 24) for (let y = y0 + 10; y < y0 + h; y += 20) s += `<g transform="translate(${x} ${y})" fill="#f2c879" opacity=".75"><ellipse cx="0" cy="-3.5" rx="2.6" ry="3.6"/><ellipse cx="0" cy="3.5" rx="2.6" ry="3.6"/><ellipse cx="-3.5" cy="0" rx="3.6" ry="2.6"/><ellipse cx="3.5" cy="0" rx="3.6" ry="2.6"/></g>`; return s }

function meja(y, no) {
  const x0 = 200, x1 = 1000, tinggi = 92, cy = y + tinggi / 2
  let s = `<rect x="${x0 + 6}" y="${y + 10}" width="${x1 - x0}" height="${tinggi}" rx="14" fill="#000" opacity=".14"/>`
  // 7 kursi di tiap sisi panjang + 1 di ujung = 15
  for (let i = 0; i < 7; i++) { const x = x0 + 62 + i * 113; s += kursi(x, y - 26, 'atas') + kursi(x, y + tinggi + 26, 'bawah') }
  s += kursi(x1 + 30, cy, 'kanan')
  s += `<rect x="${x0}" y="${y}" width="${x1 - x0}" height="${tinggi}" rx="14" fill="url(#kayu)"/>`
  s += `<g stroke="#6b3f1a" stroke-opacity=".25">${[0.3, 0.55, 0.8].map((t) => `<line x1="${x0 + 10}" y1="${f(y + tinggi * t)}" x2="${x1 - 10}" y2="${f(y + tinggi * t)}"/>`).join('')}</g>`
  s += `<rect x="${x0 + 30}" y="${cy - 17}" width="${x1 - x0 - 60}" height="34" fill="#7c2d12"/>${kawung(x0 + 30, cy - 17, x1 - x0 - 60, 34)}`
  for (let i = 0; i < 7; i++) { const x = x0 + 62 + i * 113; s += piring(x, y + 15) + piring(x, y + tinggi - 15) }
  s += piring(x1 - 16, cy)
  // hidangan di tengah meja (disajikan bersamaan)
  const isi = ['#7a4a26', '#5f8a3a', '#c0631f', '#8c5a2e', '#d9b04a', '#5f8a3a', '#a33a1f']
  for (let i = 0; i < 6; i++) { const x = x0 + 118 + i * 113; s += i % 3 === 1 ? bakul(x, cy) : mangkuk(x, cy, 17 + (i % 2) * 3, isi[(i + no) % isi.length]) }
  s += `<text x="${x0 - 26}" y="${cy + 9}" text-anchor="end" font-family="Playfair Display" font-weight="700" font-size="26" fill="#7c2d12">Meja ${no}</text>`
  s += `<text x="${x0 - 26}" y="${cy + 34}" text-anchor="end" font-family="Playfair Display" font-style="italic" font-size="19" fill="#92400e">15 kursi</text>`
  return s
}

function tanaman(x, y, s) {
  let d = ''
  for (let i = 0; i < 9; i++) { const a = i * 40 + r() * 14; d += `<path transform="translate(${x} ${y}) rotate(${f(a)}) scale(${s})" d="M0 0C14 -10 40 -10 58 0C40 10 14 10 0 0Z" fill="${i % 2 ? '#4d7c0f' : '#3f6212'}"/>` }
  return `<circle cx="${x}" cy="${y}" r="${f(30 * s)}" fill="#a16207"/>${d}<circle cx="${x}" cy="${y}" r="${f(8 * s)}" fill="#65a30d"/>`
}

function gambar() {
  let papan = ''
  for (let y = 60; y < H - 40; y += 44) papan += `<line x1="40" y1="${y}" x2="${W - 40}" y2="${y}" stroke="#d8bf9a" stroke-width="2"/>`
  for (let y = 60, k = 0; y < H - 40; y += 44, k++) for (let x = 40 + (k % 2) * 110; x < W - 40; x += 220) papan += `<line x1="${x}" y1="${y}" x2="${x}" y2="${y + 44}" stroke="#d8bf9a" stroke-width="2"/>`
  const lampu = [380, 820].flatMap((x) => [258, 512].map((y) => `<circle cx="${x}" cy="${y}" r="190" fill="url(#cahaya)"/>`)).join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="kayu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a86b38"/><stop offset="1" stop-color="#8a5226"/></linearGradient>
    <linearGradient id="kursi" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b9772f"/><stop offset="1" stop-color="#94561e"/></linearGradient>
    <radialGradient id="cahaya"><stop offset="0" stop-color="#ffd98a" stop-opacity=".45"/><stop offset="1" stop-color="#ffd98a" stop-opacity="0"/></radialGradient>
    <filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="4" stitchTiles="stitch"/><feColorMatrix values=".33 .33 .33 0 0  .33 .33 .33 0 0  .33 .33 .33 0 0  0 0 0 0 1"/></filter>
  </defs>
  <rect width="${W}" height="${H}" fill="#f5ede4"/>
  <rect x="40" y="40" width="${W - 80}" height="${H - 80}" fill="#e9d3b4"/>
  ${papan}
  <rect x="40" y="40" width="${W - 80}" height="${H - 80}" fill="none" stroke="#6b4423" stroke-width="16"/>
  <rect x="300" y="28" width="600" height="20" fill="#cfe3ea" stroke="#6b4423" stroke-width="4"/><g stroke="#6b4423" stroke-width="3">${[450, 600, 750].map((x) => `<line x1="${x}" y1="28" x2="${x}" y2="48"/>`).join('')}</g>
  <rect x="${W - 48}" y="300" width="16" height="150" fill="#f5ede4"/><path d="M${W - 48} 300A150 150 0 0 0 ${W - 198} 450" fill="none" stroke="#b45309" stroke-width="3" stroke-dasharray="6 6"/>
  <text x="${W - 70}" y="478" text-anchor="end" font-family="Playfair Display" font-style="italic" font-size="18" fill="#92400e">ke dapur</text>
  ${lampu}
  ${meja(212, 1)}${meja(466, 2)}
  ${tanaman(92, 92, 1)}${tanaman(92, H - 92, 0.9)}${tanaman(W - 92, 92, 0.95)}
  <rect width="${W}" height="${H}" filter="url(#grain)" opacity=".16" style="mix-blend-mode:overlay"/>
</svg>`
}

const akar = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..')
const keluar = path.resolve(process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : path.join(akar, '.ilustrasi-html'))
mkdirSync(keluar, { recursive: true })
const dir = path.join(keluar, 'fonts')
if (!existsSync(path.join(dir, 'fonts.css'))) {
  mkdirSync(dir, { recursive: true })
  const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
  const get = async (u) => { const res = await fetch(u, { headers: { 'User-Agent': UA } }); if (!res.ok) throw new Error(`${res.status} ${u}`); return res }
  let css = await (await get('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&display=block')).text()
  const urls = [...new Set([...css.matchAll(/url\((https:[^)]+)\)/g)].map((m) => m[1]))]
  for (const [i, u] of urls.entries()) { writeFileSync(path.join(dir, `f${i}.woff2`), Buffer.from(await (await get(u)).arrayBuffer())); css = css.split(u).join(`f${i}.woff2`) }
  writeFileSync(path.join(dir, 'fonts.css'), css)
}
const html = path.join(keluar, 'ruang-belakang.html')
writeFileSync(html, `<!doctype html><html><head><meta charset="utf-8"><link href="fonts/fonts.css" rel="stylesheet"><style>html,body{margin:0}svg{display:block}</style></head><body>${gambar()}</body></html>`)
console.log('->', html)
if (process.argv.includes('--render')) {
  const sharp = createRequire(path.join(akar, 'package.json'))('sharp')
  const chrome = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  const png = path.join(keluar, 'ruang-belakang.png')
  execFileSync(chrome, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', `--window-size=${W},${H}`, '--virtual-time-budget=8000', '--allow-file-access-from-files', `--screenshot=${png}`, 'file://' + html], { stdio: 'ignore' })
  await sharp(png).resize(W, H).webp({ quality: 82, effort: 6 }).toFile(path.join(akar, 'public/images/ruang-belakang.webp'))
  console.log('->', path.join(akar, 'public/images/ruang-belakang.webp'))
}
