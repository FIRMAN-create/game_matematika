import React from 'react'
import './InfoPage.css'

export default function MathMaterial({ onBack }) {
  return (
    <div className="info-page grid-bg">
      <div className="info-header">
        <button className="btn btn-secondary" id="btn-back-math" onClick={onBack}>← KEMBALI</button>
        <h2 className="neon-title info-title">MATERI MATEMATIKA</h2>
        <div style={{width:'100px'}} />
      </div>

      <div className="info-content scrollable">

        <div className="info-section glass-card">
          <h3 className="section-heading">📌 1. Pengertian Fungsi</h3>
          <p className="info-text">
            Fungsi adalah aturan yang menghubungkan setiap anggota himpunan asal (domain)
            dengan tepat satu anggota himpunan daerah hasil (kodomain).
          </p>
          <div className="math-box">
            <span className="formula">f(x) = 2x + 3</span>{' '}
            berarti setiap nilai x dipetakan ke <span className="formula">2x + 3</span>
          </div>
        </div>

        <div className="info-section glass-card">
          <h3 className="section-heading">📌 2. Menghitung Nilai Fungsi</h3>
          <p className="info-text">Substitusikan nilai x yang diberikan ke dalam ekspresi fungsi.</p>
          <div className="math-box">
            <div>f(x) = 2x + 3</div>
            <div>f(4) = 2<span className="formula">(4)</span> + 3 = 8 + 3 = <span className="formula">11</span></div>
          </div>
        </div>

        <div className="info-section glass-card">
          <h3 className="section-heading">📌 3. Komposisi Fungsi</h3>
          <p className="info-text">
            Komposisi fungsi (f∘g)(x) berarti output dari g(x) menjadi input untuk f(x).
          </p>
          <div className="math-box">
            <div>(f∘g)(x) = f(g(x))</div>
            <div style={{marginTop:'8px', color:'var(--text-dim)'}}>Kerjakan fungsi <span className="formula">g</span> terlebih dahulu, lalu masukkan hasilnya ke <span className="formula">f</span>.</div>
          </div>
          <div className="math-example">
            <p className="example-label">Contoh:</p>
            <div className="math-box">
              <div>f(x) = 3x + 1, g(x) = x + 2</div>
              <div>(f∘g)(x) = f(g(x)) = f(x+2)</div>
              <div>= 3<span className="formula">(x+2)</span> + 1 = 3x + 6 + 1</div>
              <div>= <span className="formula">3x + 7</span></div>
            </div>
          </div>
        </div>

        <div className="info-section glass-card">
          <h3 className="section-heading">⚠️ Urutan Pengerjaan Penting!</h3>
          <div className="math-box">
            <div><span className="formula">(f∘g)(x) ≠ (g∘f)(x)</span> secara umum</div>
            <div style={{marginTop:'8px', color:'var(--text-dim)'}}>
              (f∘g)(x) = f(g(x)) → g dikerjakan dulu<br/>
              (g∘f)(x) = g(f(x)) → f dikerjakan dulu
            </div>
          </div>
        </div>

        <div className="info-section glass-card">
          <h3 className="section-heading">📌 4. Fungsi Invers</h3>
          <p className="info-text">
            Invers fungsi f⁻¹ adalah fungsi yang membalik aksi f.
            Jika f(a) = b, maka f⁻¹(b) = a.
          </p>
          <div className="math-example">
            <p className="example-label">Langkah menentukan invers:</p>
            <div className="math-box">
              <div>1. Misalkan <span className="formula">y = f(x)</span></div>
              <div>2. Tukar variabel: <span className="formula">x = f(y)</span></div>
              <div>3. Isolasi y → itu adalah <span className="formula">f⁻¹(x)</span></div>
            </div>
          </div>
          <div className="math-example">
            <p className="example-label">Contoh:</p>
            <div className="math-box">
              <div>f(x) = 6x + 5</div>
              <div>y = 6x + 5 → x = 6y + 5</div>
              <div>6y = x - 5 → y = <span className="formula">(x-5)/6</span></div>
              <div>Jadi f⁻¹(x) = <span className="formula">(x-5)/6</span></div>
            </div>
          </div>
        </div>

        <div className="info-section glass-card">
          <h3 className="section-heading">📌 5. Enkripsi & Dekripsi</h3>
          <p className="info-text">
            Fungsi dapat digunakan untuk mengenkripsi (menyandikan) pesan. Fungsi invers
            digunakan untuk mendekripsi (memulihkan) pesan asli.
          </p>
          <div className="math-box">
            <div>Enkripsi: <span className="formula">E(x) = (f∘g)(x)</span></div>
            <div>Dekripsi: <span className="formula">D(x) = E⁻¹(x)</span></div>
            <div style={{marginTop:'8px', color:'var(--text-dim)'}}>E(E⁻¹(x)) = x</div>
          </div>
        </div>

        <div className="info-section glass-card">
          <h3 className="section-heading">📌 6. Konversi Huruf ↔ Angka</h3>
          <p className="info-text">Sistem konversi: A = 1, B = 2, C = 3, ..., Z = 26</p>
          <div className="alphabet-grid">
            {Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ').map((ch, i) => (
              <div key={ch} className="alpha-cell">
                <span className="alpha-letter">{ch}</span>
                <span className="alpha-num">{i + 1}</span>
              </div>
            ))}
          </div>
          <div className="math-example">
            <p className="example-label">Contoh: KUNCI</p>
            <div className="math-box">
              <div>K=11, U=21, N=14, C=3, I=9</div>
              <div>Enkripsi dengan E(x)=6x+5:</div>
              <div>E(11)=71 → <span style={{color:'var(--orange)'}}>71</span> (contoh)</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
