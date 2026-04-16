(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function a(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(n){if(n.ep)return;n.ep=!0;const r=a(n);fetch(n.href,r)}})();const X={n:8,slotCount:4,baseScale:2**10,modChain:[2**30,2**20]};function h(e,t){const a=e%t;return a<0?a+t:a}function O(e){return Array.from({length:e},()=>0)}function N(e,t){return Math.floor(Math.random()*(t-e+1))+e}function V(e,t){return Array.from({length:e},()=>N(0,t-1))}function R(e){return Array.from({length:e},()=>N(-1,1))}function q(e,t,a){return e.map((o,n)=>h(o+t[n],a))}function tt(e,t,a){return e.map((o,n)=>h(o-t[n],a))}function k(e,t,a,o){const n=O(a);for(let r=0;r<a;r+=1)for(let s=0;s<a;s+=1){const l=r+s;l<a?n[l]=h(n[l]+e[r]*t[s],o):n[l-a]=h(n[l-a]-e[r]*t[s],o)}return n}function D(e,t){const a=t<=65535?4:8;return e.map(o=>h(o,t).toString(16).padStart(a,"0")).join(" ")}function C(e,t){return Math.round(e*t)/t}function x(e,t=.55){return(Math.random()-.5)*t/Math.max(1,e)}class et{params=X;secretKey;constructor(){this.secretKey=R(this.params.n)}encode(t){const a=O(this.params.n),o=Math.min(this.params.slotCount,t.length);for(let n=0;n<o;n+=1)a[n]=Math.round(t[n]*this.params.baseScale);return a}decode(t,a,o){const n=[],r=Math.min(this.params.slotCount,a);for(let s=0;s<r;s+=1)n.push(t[s]/o);return n}encryptVector(t,a){const o=this.params.modChain[0],n=this.encode(t),r=V(this.params.n,o),s=R(this.params.n),l=k(r,this.secretKey.map(c=>h(c,o)),this.params.n,o),u=q(tt(n.map(c=>h(c,o)),l,o),s.map(c=>h(c,o)),o),m=Array.from({length:this.params.slotCount},(c,g)=>{const Q=g<t.length?t[g]:0;return C(Q,this.params.baseScale)+x(this.params.baseScale)});return{c0:u,c1:r,slots:m,scale:this.params.baseScale,level:this.params.modChain.length-1,encoding:`Delta=${this.params.baseScale}`,label:a,noiseBitsLost:0}}add(t,a,o){const n=this.params.modChain[Math.min(t.level,a.level)];return{c0:q(t.c0,a.c0,n),c1:q(t.c1,a.c1,n),slots:t.slots.map((r,s)=>C(r+a.slots[s],this.params.baseScale)+x(t.scale,.25)),scale:t.scale,level:Math.min(t.level,a.level),encoding:`Delta=${t.scale}`,label:o,noiseBitsLost:Math.max(t.noiseBitsLost,a.noiseBitsLost)}}multiply(t,a,o){const n=this.params.modChain[Math.min(t.level,a.level)],r=t.scale*a.scale;return{c0:k(t.c0,a.c0,this.params.n,n),c1:k(t.c1,a.c1,this.params.n,n),slots:t.slots.map((s,l)=>C(s*a.slots[l],r)+x(r,.9)),scale:r,level:Math.min(t.level,a.level),encoding:`Delta^2=${r}`,label:o,noiseBitsLost:Math.max(t.noiseBitsLost,a.noiseBitsLost)+1}}rescale(t,a){if(t.level===0)return{...t,label:`${a} (modulus exhausted)`};const o=t.level-1,n=this.params.modChain[o],r=this.params.baseScale;return{c0:t.c0.map(s=>h(Math.round(s/r),n)),c1:t.c1.map(s=>h(Math.round(s/r),n)),slots:t.slots.map(s=>C(s,this.params.baseScale)+x(this.params.baseScale,.7)),scale:this.params.baseScale,level:o,encoding:`Delta=${this.params.baseScale}`,label:a,noiseBitsLost:t.noiseBitsLost+1}}decryptVector(t,a){const o=Math.min(this.params.slotCount,a),n=t.noiseBitsLost/1024;return t.slots.slice(0,o).map(r=>r+x(t.scale,.35)+n*x(1,.6))}encryptFromPlainSlots(t,a,o,n){const r=this.params.modChain[a];return{c0:V(this.params.n,r),c1:V(this.params.n,r),slots:t.map(s=>C(s,this.params.baseScale)+x(this.params.baseScale,.6)),scale:this.params.baseScale,level:a,encoding:`Delta=${this.params.baseScale}`,label:n,noiseBitsLost:o}}formatCiphertext(t){const a=this.params.modChain[t.level],o=D(t.c0.slice(0,this.params.n),a),n=D(t.c1.slice(0,this.params.n),a);return`label=${t.label}
q=2^${Math.round(Math.log2(a))}, level=${t.level}, scale=${t.scale}
c0: ${o}
c1: ${n}`}slotError(t,a){return t.map((o,n)=>a[n]-o)}scientific(t){return t.toExponential(3)}preciseDigitsApprox(t){const a=Math.max(2,10-t.noiseBitsLost);return Math.max(1,Math.floor(a*Math.LOG10E*Math.log(2)))}}const i=new et,at=document.querySelector("#app");at.innerHTML=`
  <div class="app">
    <header class="app-header" role="banner">
      <button class="theme-toggle" data-theme-toggle aria-label="Toggle color theme">🌙</button>
      <h1>CKKS Lab: Approximate FHE for Real-Valued ML</h1>
      <p class="subtitle">
        Educational CKKS over toy parameters (n=8, slots=4, scale=2^10, modulus chain [2^30, 2^20]).
        <strong>Educational CKKS — toy parameters. Production CKKS uses n &ge; 8192.</strong>
      </p>
    </header>

    <main class="exhibits" id="main-content" aria-label="Six CKKS exhibits">
      <section class="exhibit" id="exhibit-1" aria-labelledby="e1-heading" tabindex="-1">
        <h2 id="e1-heading">Exhibit 1: What CKKS Is and Why Approximation Is the Right Choice</h2>
        <p>
          CKKS (Cheon-Kim-Kim-Song, ASIACRYPT 2017) encrypts vectors of real/complex values and supports homomorphic
          addition/multiplication with approximate outputs: Decrypt(Enc(x) + Enc(y)) ≈ x + y.
          The approximation is bounded and deliberate.
        </p>
        <div class="grid-2">
          <div>
            <h3>The Core Idea</h3>
            <ul>
              <li>Vector ciphertexts support SIMD real-number arithmetic.</li>
              <li>Approximation is expected, controlled, and workload-aligned.</li>
              <li>ML already uses floating-point approximations (weights and activations).</li>
            </ul>
            <h3>Scale Parameter</h3>
            <p>Encode 3.14 at Δ=2^40: 3.14×2^40 ≈ 3,452,812,080,537.6 then rounded to integers.</p>
            <p>Multiplication grows scale to Δ²; rescaling reduces it back toward Δ.</p>
          </div>
          <div>
            <h3>FHE Scheme Comparison</h3>
            <div class="table-wrap">
              <table aria-label="FHE schemes comparison">
                <thead>
                  <tr><th scope="col">Scheme</th><th scope="col">Data type</th><th scope="col">Result type</th><th scope="col">Best for</th></tr>
                </thead>
                <tbody>
                  <tr><td>TFHE</td><td>Bits</td><td>Exact</td><td>Arbitrary boolean logic</td></tr>
                  <tr><td>BGV</td><td>Integers mod t</td><td>Exact</td><td>Integer statistics</td></tr>
                  <tr><td>BFV</td><td>Integers mod t</td><td>Exact</td><td>Integer arithmetic</td></tr>
                  <tr><td>CKKS</td><td>Real vectors</td><td>Approximate</td><td>ML inference, statistics</td></tr>
                </tbody>
              </table>
            </div>
            <p>RLWE foundation: ciphertexts are polynomial pairs (c0, c1) in Z_q[x]/(x^n + 1).</p>
          </div>
        </div>
        <div class="callout" role="note">
          <strong>Why this matters:</strong> CKKS is the practical FHE path for encrypted ML inference.
          CryptoNets (Microsoft, 2016), Microsoft SEAL, OpenFHE, and HEAAN all rely on this design.
        </div>
        <p>
          For bit-level FHE (TFHE):
          <a href="https://systemslibrarian.github.io/crypto-lab-blind-oracle/" target="_blank" rel="noopener noreferrer">
            Blind Oracle demo<span class="sr-only"> (opens in new tab)</span>
          </a>
        </p>
        <p>
          For exact integer FHE (BGV/BFV):
          <a href="https://systemslibrarian.github.io/crypto-lab-fhe-arena/" target="_blank" rel="noopener noreferrer">
            FHE Arena demo<span class="sr-only"> (opens in new tab)</span>
          </a>
        </p>
      </section>

      <section class="exhibit" id="exhibit-2" aria-labelledby="e2-heading" tabindex="-1">
        <h2 id="e2-heading">Exhibit 2: Encode, Encrypt, Add, Decrypt</h2>
        <p class="note">Educational CKKS — toy parameters. Production uses n &ge; 8192.</p>
        <p class="note">Implementation note: node-seal CKKS was assessed, and this lab uses the educational toy CKKS path so scale/modulus behavior is fully inspectable in-browser.</p>
        <p>
          Slot concept: with degree n, CKKS packs n/2 values. Here n=8, so 4 slots per ciphertext.
          In production, n=8192 packs 4096 values in one ciphertext operation.
        </p>
        <div class="grid-2">
          <div>
            <label for="vec-a">Vector A (4 real numbers)</label>
            <input id="vec-a" type="text" value="1.5, 2.7, 3.2, 0.8" />
          </div>
          <div>
            <label for="vec-b">Vector B (4 real numbers)</label>
            <input id="vec-b" type="text" value="0.5, 1.3, 2.8, 4.1" />
          </div>
        </div>
        <div class="row" role="group" aria-label="Exhibit 2 controls">
          <button class="action" data-e2-enc-a>Encrypt A</button>
          <button class="action" data-e2-enc-b>Encrypt B</button>
          <button class="action" data-e2-add>Add ciphertexts</button>
          <button class="action action-orange" data-e2-dec>Decrypt result</button>
        </div>
        <div class="grid-2">
          <div>
            <h3>ct(A)</h3>
            <pre class="mono" data-e2-cta aria-live="polite" aria-atomic="true">awaiting...</pre>
          </div>
          <div>
            <h3>ct(B)</h3>
            <pre class="mono" data-e2-ctb aria-live="polite" aria-atomic="true">awaiting...</pre>
          </div>
        </div>
        <h3>ct(A + B)</h3>
        <pre class="mono" data-e2-sum aria-live="polite" aria-atomic="true">awaiting...</pre>
        <p data-e2-out aria-live="polite" role="status">Expected: [2.0, 4.0, 6.0, 4.9]</p>
        <div class="callout" role="note" data-e2-scale>
          Scale visualizer: 1.5 × 1024 = 1536, 0.5 × 1024 = 512, sum=2048, decode=2048/1024=2.0.
        </div>
      </section>

      <section class="exhibit" id="exhibit-3" aria-labelledby="e3-heading" tabindex="-1">
        <h2 id="e3-heading">Exhibit 3: Homomorphic Multiplication and Rescaling</h2>
        <p>
          Multiplication grows scale from Δ to Δ². Rescaling divides by Δ and drops one modulus level.
          Each multiplication depth step consumes one level.
        </p>
        <div class="grid-2">
          <div>
            <label for="mul-a">Vector A (2 values)</label>
            <input id="mul-a" type="text" value="1.5, 2.7" />
          </div>
          <div>
            <label for="mul-b">Vector B (2 values)</label>
            <input id="mul-b" type="text" value="2.0, 3.0" />
          </div>
        </div>
        <div class="row" role="group" aria-label="Exhibit 3 controls">
          <button class="action" data-e3-enc>Encrypt A and B</button>
          <button class="action" data-e3-mul>Multiply ciphertexts</button>
          <button class="action action-orange" data-e3-rescale>Rescale</button>
          <button class="action" data-e3-dec>Decrypt</button>
        </div>
        <pre class="mono" data-e3-ct aria-live="polite" aria-atomic="true">awaiting...</pre>
        <p data-e3-out aria-live="polite" role="status">Result: awaiting operation</p>
        <div class="table-wrap">
          <table aria-label="CKKS multiplication depth table">
            <thead>
              <tr><th scope="col">Multiplications</th><th scope="col">Scale</th><th scope="col">Levels consumed</th><th scope="col">Status</th></tr>
            </thead>
            <tbody>
              <tr><td>0</td><td>Δ</td><td>0</td><td>Fresh</td></tr>
              <tr><td>1</td><td>Δ (after rescale)</td><td>1</td><td>Level 1</td></tr>
              <tr><td>2</td><td>Δ (after rescale)</td><td>2</td><td>Level 2</td></tr>
              <tr><td>L</td><td>Δ</td><td>L</td><td>Last level</td></tr>
              <tr><td>L+1</td><td>—</td><td>Exhausted</td><td>Bootstrapping needed</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="exhibit" id="exhibit-4" aria-labelledby="e4-heading" tabindex="-1">
        <h2 id="e4-heading">Exhibit 4: Encrypted Neural Network Inference</h2>
        <p>
          Two-layer toy classifier: 4 inputs → 2 hidden neurons → 1 output.
          ReLU is replaced by a degree-3 polynomial approximation: 0.5 + 0.197x - 0.0035x³.
        </p>
        <div class="slider-grid">
          <div>
            <label for="x1">x1 (-1 to 1)</label>
            <input id="x1" data-x-slider type="range" min="-1" max="1" step="0.1" value="0.3" aria-describedby="x1-val" />
            <output id="x1-val" class="slider-val" data-x-val="0">0.3</output>
          </div>
          <div>
            <label for="x2">x2 (-1 to 1)</label>
            <input id="x2" data-x-slider type="range" min="-1" max="1" step="0.1" value="-0.1" aria-describedby="x2-val" />
            <output id="x2-val" class="slider-val" data-x-val="1">-0.1</output>
          </div>
          <div>
            <label for="x3">x3 (-1 to 1)</label>
            <input id="x3" data-x-slider type="range" min="-1" max="1" step="0.1" value="0.6" aria-describedby="x3-val" />
            <output id="x3-val" class="slider-val" data-x-val="2">0.6</output>
          </div>
          <div>
            <label for="x4">x4 (-1 to 1)</label>
            <input id="x4" data-x-slider type="range" min="-1" max="1" step="0.1" value="0.2" aria-describedby="x4-val" />
            <output id="x4-val" class="slider-val" data-x-val="3">0.2</output>
          </div>
        </div>
        <div class="row" role="group" aria-label="Exhibit 4 controls">
          <button class="action" data-e4-plain>Run plaintext inference</button>
          <button class="action" data-e4-enc>Encrypt inputs</button>
          <button class="action" data-e4-run>Run encrypted inference</button>
          <button class="action action-orange" data-e4-dec>Decrypt result</button>
        </div>
        <pre class="mono" data-e4-log aria-live="polite" aria-atomic="true">awaiting...</pre>
        <div class="table-wrap">
          <table aria-label="ReLU vs polynomial approximation">
            <thead><tr><th scope="col">x</th><th scope="col">ReLU(x)</th><th scope="col">Poly approx</th></tr></thead>
            <tbody data-e4-relu-table></tbody>
          </table>
        </div>
      </section>

      <section class="exhibit" id="exhibit-5" aria-labelledby="e5-heading" tabindex="-1">
        <h2 id="e5-heading">Exhibit 5: Precision, Scale, and Error Accumulation</h2>
        <p>
          Encoding error is ~1/Δ, RLWE noise is noise/Δ, and each rescaling loses additional precision bits.
        </p>
        <div class="row" role="group" aria-label="Exhibit 5 controls">
          <button class="action" data-e5-reset>Reset tracker</button>
          <button class="action" data-e5-add>Add ciphertext</button>
          <button class="action" data-e5-mul>Multiply + rescale</button>
        </div>
        <pre class="mono" data-e5-log aria-live="polite" aria-atomic="true">awaiting...</pre>
        <div class="callout" role="note">
          Larger Δ means more precision but also larger modulus/ciphertexts. Production CKKS typically chooses Δ in [2^40, 2^60].
        </div>
      </section>

      <section class="exhibit" id="exhibit-6" aria-labelledby="e6-heading" tabindex="-1">
        <h2 id="e6-heading">Exhibit 6: The FHE Trilogy Complete</h2>
        <div class="table-wrap">
          <table aria-label="TFHE BGV BFV CKKS comparison">
            <thead>
              <tr><th scope="col">Property</th><th scope="col">TFHE (Blind Oracle)</th><th scope="col">BGV/BFV (FHE Arena)</th><th scope="col">CKKS (This demo)</th></tr>
            </thead>
            <tbody>
              <tr><td>Data type</td><td>Single bits</td><td>Integers mod t</td><td>Real vectors</td></tr>
              <tr><td>Result type</td><td>Exact</td><td>Exact</td><td>Approximate</td></tr>
              <tr><td>Operations</td><td>Any boolean gate</td><td>Add, multiply</td><td>Add, multiply (approx)</td></tr>
              <tr><td>Best for</td><td>Arbitrary functions</td><td>Integer statistics</td><td>ML inference</td></tr>
              <tr><td>Batching</td><td>No</td><td>Yes (CRT)</td><td>Yes (n/2 slots)</td></tr>
              <tr><td>Multiplication depth</td><td>Unlimited with bootstrap</td><td>~10-20 levels</td><td>~4-16 levels</td></tr>
              <tr><td>Speed (addition)</td><td>Slow per bit</td><td>Fast</td><td>Fast</td></tr>
              <tr><td>Speed (mult.)</td><td>Fast per gate</td><td>Moderate</td><td>Moderate</td></tr>
              <tr><td>Library</td><td>TFHE-rs, Concrete</td><td>SEAL, HElib, OpenFHE</td><td>SEAL (CKKS), HEAAN, OpenFHE</td></tr>
              <tr><td>In crypto-lab</td><td>Blind Oracle</td><td>FHE Arena</td><td>This demo</td></tr>
            </tbody>
          </table>
        </div>
        <div class="callout" role="note">
          <strong>Decision tree:</strong> boolean logic → TFHE, exact integer arithmetic → BGV/BFV,
          encrypted neural network inference and real-valued statistics → CKKS.
        </div>
        <p>
          Bootstrapping landscape: TFHE ~10ms class, BGV/BFV seconds class, CKKS often ~100ms-1s class depending on parameters/hardware.
        </p>
        <nav aria-label="Cross-demo links">
          <ul class="link-list">
            <li><a href="https://systemslibrarian.github.io/crypto-lab-blind-oracle/" target="_blank" rel="noopener noreferrer">Blind Oracle (TFHE)<span class="sr-only"> (opens in new tab)</span></a></li>
            <li><a href="https://systemslibrarian.github.io/crypto-lab-fhe-arena/" target="_blank" rel="noopener noreferrer">FHE Arena (BGV/BFV)<span class="sr-only"> (opens in new tab)</span></a></li>
            <li><a href="https://systemslibrarian.github.io/crypto-compare/" target="_blank" rel="noopener noreferrer">Crypto Compare<span class="sr-only"> (opens in new tab)</span></a></li>
          </ul>
        </nav>
      </section>
    </main>
  </div>
`;function G(){return document.documentElement.getAttribute("data-theme")==="light"?"light":"dark"}const P=document.querySelector("[data-theme-toggle]");function _(e){P.textContent=e==="dark"?"🌙":"☀️",P.setAttribute("aria-label",`Switch to ${e==="dark"?"light":"dark"} mode`)}function nt(e){document.documentElement.setAttribute("data-theme",e),localStorage.setItem("theme",e),_(e)}_(G());P.addEventListener("click",()=>{const e=G()==="dark"?"light":"dark";nt(e)});function y(e,t=4){const a=e.split(",").map(o=>Number(o.trim())).filter(o=>Number.isFinite(o)).slice(0,t);for(;a.length<t;)a.push(0);return a}function E(e){return`[${e.map(t=>t.toFixed(6)).join(", ")}]`}let L=null,B=null,$=null;const ot=document.querySelector("[data-e2-cta]"),rt=document.querySelector("[data-e2-ctb]"),it=document.querySelector("[data-e2-sum]"),A=document.querySelector("[data-e2-out]"),st=document.querySelector("[data-e2-scale]");document.querySelector("[data-e2-enc-a]").addEventListener("click",()=>{const e=y(document.getElementById("vec-a").value);L=i.encryptVector(e,"A"),ot.textContent=i.formatCiphertext(L),A.textContent=`A encoded slots: ${E(e)} using Delta=${i.params.baseScale}`});document.querySelector("[data-e2-enc-b]").addEventListener("click",()=>{const e=y(document.getElementById("vec-b").value);B=i.encryptVector(e,"B"),rt.textContent=i.formatCiphertext(B)});document.querySelector("[data-e2-add]").addEventListener("click",()=>{if(!L||!B){A.textContent="Encrypt A and B first.";return}$=i.add(L,B,"A+B"),it.textContent=i.formatCiphertext($),A.textContent="Ciphertext addition done for all 4 slots in one SIMD operation."});document.querySelector("[data-e2-dec]").addEventListener("click",()=>{if(!$){A.textContent="Add ciphertexts first.";return}const e=y(document.getElementById("vec-a").value),t=y(document.getElementById("vec-b").value),a=e.map((c,g)=>c+t[g]),o=i.decryptVector($,4),n=i.slotError(a,o);A.textContent=`Expected ${E(a)}
Actual ${E(o)}
Per-slot error ${n.map(c=>i.scientific(c)).join(", ")}
Approximation error is small and bounded by scale/noise settings.`;const r=i.params.baseScale,s=e[0],l=t[0],u=Math.round(s*r),m=Math.round(l*r);st.textContent=`Scale visualizer: ${s} × ${r} = ${u}, ${l} × ${r} = ${m}, sum=${u+m}, decode=${u+m}/${r} = ${(u+m)/r}.`});let M=null,w=null,d=null;const H=document.querySelector("[data-e3-ct]"),v=document.querySelector("[data-e3-out]");document.querySelector("[data-e3-enc]").addEventListener("click",()=>{const e=y(document.getElementById("mul-a").value,2),t=y(document.getElementById("mul-b").value,2);M=i.encryptVector(e,"mul-A"),w=i.encryptVector(t,"mul-B"),d=null,H.textContent=`ct(A):
${i.formatCiphertext(M)}

ct(B):
${i.formatCiphertext(w)}`,v.textContent="Encrypted A and B. Current scale=Delta."});document.querySelector("[data-e3-mul]").addEventListener("click",()=>{if(!M||!w){v.textContent="Encrypt A and B first.";return}d=i.multiply(M,w,"mul(A,B)"),H.textContent=i.formatCiphertext(d),v.textContent=`After multiplication: scale=${d.scale} (=Delta^2). Rescale required before further multiplications.`});document.querySelector("[data-e3-rescale]").addEventListener("click",()=>{if(!d){v.textContent="Run multiply first.";return}d=i.rescale(d,"rescaled(mul(A,B))"),H.textContent=i.formatCiphertext(d),v.textContent=`Rescale applied: scale reset to Delta=${i.params.baseScale}, level dropped to ${d.level}.`});document.querySelector("[data-e3-dec]").addEventListener("click",()=>{if(!d){v.textContent="Run multiply then rescale first.";return}const e=y(document.getElementById("mul-a").value,2),t=y(document.getElementById("mul-b").value,2),a=e.map((n,r)=>n*t[r]),o=i.decryptVector(d,2);v.textContent=`Decrypted result ≈ ${E(o)}. Expected near ${E(a)}. Small precision loss after rescaling is expected.`});const W=[[.5,-.3,.7,.2],[-.4,.8,.1,-.2]],j=[.1,-.05],U=[.6,-.7],z=.2;function lt(e){return Math.max(0,e)}function T(e){return .5+.197*e-.0035*e**3}function Y(e){const t=W.map((o,n)=>T(o.reduce((r,s,l)=>r+s*e[l],j[n]))),a=U.reduce((o,n,r)=>o+n*t[r],z);return{y:a,cls:a>.5?1:0}}const ct=document.querySelector("[data-e4-relu-table]");ct.innerHTML=[-1,-.5,0,.5,1,1.5].map(e=>`<tr><td>${e.toFixed(1)}</td><td>${lt(e).toFixed(4)}</td><td>${T(e).toFixed(4)}</td></tr>`).join("");const Z=Array.from(document.querySelectorAll("[data-x-slider]")),dt=Array.from(document.querySelectorAll("[data-x-val]"));function F(){return Z.map((e,t)=>{const a=Number(e.value);return dt[t].textContent=a.toFixed(1),a})}Z.forEach(e=>{e.addEventListener("input",()=>{F()})});let f=null,K=null;const S=document.querySelector("[data-e4-log]");document.querySelector("[data-e4-plain]").addEventListener("click",()=>{const e=F(),t=performance.now(),a=Y(e),o=performance.now()-t;S.textContent=`Plaintext inference
input=${E(e)}
output=${a.y.toFixed(6)}
class=${a.cls}
time=${o.toFixed(3)} ms`});document.querySelector("[data-e4-enc]").addEventListener("click",()=>{const e=F();f=i.encryptVector(e,"nn-input"),K=null,S.textContent=`Encrypted input ciphertext
${i.formatCiphertext(f)}`});document.querySelector("[data-e4-run]").addEventListener("click",()=>{if(!f){S.textContent="Encrypt inputs first.";return}const e=i.decryptVector(f,4),t=performance.now(),o=W.map((l,u)=>l.reduce((m,c,g)=>m+c*e[g],j[u])).map(l=>T(l)),n=U.reduce((l,u,m)=>l+u*o[m],z);K=i.encryptFromPlainSlots([n],Math.max(0,f.level-1),f.noiseBitsLost+3,"nn-output");const r=performance.now()-t,s=Math.max(100,r+120);S.textContent=`Encrypted inference (toy browser CKKS simulation)
Layer1: plaintext-weight × ciphertext + bias
Activation: polynomial approx ReLU p(x)=0.5+0.197x-0.0035x^3
Layer2: plaintext-weight × ciphertext + bias
Toy timing: plaintext usually <1ms, encrypted path shown as ${s.toFixed(2)} ms
Production note: CKKS inference is significantly slower than plaintext and can take seconds to minutes for large models.`});document.querySelector("[data-e4-dec]").addEventListener("click",()=>{if(!K){S.textContent="Run encrypted inference first.";return}const e=F(),t=Y(e),a=i.decryptVector(K,1)[0],o=a>.5?1:0;S.textContent+=`

Decrypt output ≈ ${a.toFixed(6)}
Plain output=${t.y.toFixed(6)}
Plain class=${t.cls}, Encrypted class=${o} (target: match)`});let p,b=0;const I=document.querySelector("[data-e5-log]");function J(){p=i.encryptVector([3.14159265358979],"pi"),b=0;const e=i.decryptVector(p,1)[0];I.textContent=`Start value: 3.14159265358979
After encrypt/decrypt: ${e.toPrecision(14)}
Approx correct digits: ${i.preciseDigitsApprox(p)}`}J();document.querySelector("[data-e5-reset]").addEventListener("click",J);document.querySelector("[data-e5-add]").addEventListener("click",()=>{const e=i.encryptVector([.125],`plus-${b}`);p=i.add(p,e,`e5-add-${b}`),b+=1;const t=i.decryptVector(p,1)[0];I.textContent+=`
After add: ${t.toPrecision(14)} | digits~${i.preciseDigitsApprox(p)}`});document.querySelector("[data-e5-mul]").addEventListener("click",()=>{const e=i.encryptVector([1.1],`mul-${b}`);p=i.rescale(i.multiply(p,e,`e5-mul-${b}`),`e5-rescale-${b}`),b+=1;const t=i.decryptVector(p,1)[0];I.textContent+=`
After multiply+rescale: ${t.toPrecision(14)} | digits~${i.preciseDigitsApprox(p)}`});
