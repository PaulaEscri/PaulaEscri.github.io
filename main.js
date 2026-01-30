(() => {
  const hero = document.querySelector(".Inicio");
  const canvas = document.querySelector(".scalesCanvas");
  if (!hero || !canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });

  const S = {
    dpr: Math.max(1, Math.min(2, window.devicePixelRatio || 1)),
    w: 0,
    h: 0,
    t: 0,
    mouse: { x: 0, y: 0, tx: 0, ty: 0, inside: false },
    orb: { x: 0, y: 0, vx: 0, vy: 0, r: 120 },
    pts: []
  };

  function resize() {
    const r = hero.getBoundingClientRect();
    S.w = Math.max(1, Math.floor(r.width));
    S.h = Math.max(1, Math.floor(r.height));

    canvas.width = Math.floor(S.w * S.dpr);
    canvas.height = Math.floor(S.h * S.dpr);
    canvas.style.width = S.w + "px";
    canvas.style.height = S.h + "px";
    ctx.setTransform(S.dpr, 0, 0, S.dpr, 0, 0);

    S.mouse.x = S.orb.x = S.w * 0.5;
    S.mouse.y = S.orb.y = S.h * 0.42;
    S.mouse.tx = S.mouse.x;
    S.mouse.ty = S.mouse.y;

    S.orb.r = Math.min(S.w, S.h) * 0.25;
    seed();
  }

  hero.addEventListener("mousemove", (e) => {
    const r = hero.getBoundingClientRect();
    S.mouse.tx = e.clientX - r.left;
    S.mouse.ty = e.clientY - r.top;
    S.mouse.inside = true;
  });

  hero.addEventListener("mouseleave", () => {
    S.mouse.inside = false;
    S.mouse.tx = S.w * 0.5;
    S.mouse.ty = S.h * 0.42;
  });

  function seed() {
    S.pts.length = 0;

    // config particles
    const count = Math.round((S.orb.r * S.orb.r) / 18);
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const u = Math.random();
      const rad = Math.pow(u, 0.55) * S.orb.r;

      S.pts.push({
        a,
        rad,
        z: Math.random(),
        ph: Math.random() * Math.PI * 2
      });
    }
  }

  function orbColor(strength) {
    const r = Math.round(210 + 45 * strength);
    const g = Math.round(170 + 55 * strength);
    const b = Math.round(255);
    return `rgba(${r},${g},${b},`;
  }

  function frame() {
    S.t += 0.016;

    // background
    ctx.fillStyle = "rgba(0,0,0,0.16)";
    ctx.fillRect(0, 0, S.w, S.h);

    // smooth mouse
    S.mouse.x += (S.mouse.tx - S.mouse.x) * 0.08;
    S.mouse.y += (S.mouse.ty - S.mouse.y) * 0.08;

    // inertia and breathing
    const o = S.orb;
    const dx = S.mouse.x - o.x;
    const dy = S.mouse.y - o.y;
    o.vx = (o.vx + dx * 0.018) * 0.84;
    o.vy = (o.vy + dy * 0.018) * 0.84;
    o.x += o.vx;
    o.y += o.vy;

    const R = o.r * (1 + Math.sin(S.t * 1.3) * 0.03);

    // draw particles
    for (const p of S.pts) {
      const wob = Math.sin(S.t * 1.6 + p.ph + p.rad * 0.03) * (R * 0.04);

      const ang = p.a + Math.sin(S.t * 0.7 + p.ph) * 0.08;
      const rr = p.rad + wob;

      const x = o.x + Math.cos(ang) * rr;
      const y = o.y + Math.sin(ang) * rr;

      const centerK = 1 - (p.rad / R);
      const alpha = 0.06 + centerK * 0.22;

      const col = orbColor(centerK);
      ctx.fillStyle = `${col}${alpha})`;

      const size = 1.2 + centerK * 2.5 + p.z * 1.0;

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(frame);
  }

  resize();
  window.addEventListener("resize", resize, { passive: true });
  requestAnimationFrame(frame);
})();



(() => {
  const animeLib = window.anime;

  const cards = document.querySelectorAll("#skills-grid .item");
  if (!cards.length) return;

  // Dialog setup
  let dialog = document.querySelector("#skills-dialog");
  if (!dialog) {
    dialog = document.createElement("dialog");
    dialog.id = "skills-dialog";
    document.body.appendChild(dialog);
  }

  const buildBarsHTML = (skillValue) => {
    const v = Math.max(0, Math.min(100, Number(skillValue || 0)));
    return `
      <div class="skillBars">
        <div class="barRow">
          <div>Nivel</div>
          <div class="barTrack"><div class="barFill" data-pct="${v}"></div></div>
          <div class="barPct">${v}%</div>
        </div>
      </div>
    `;
  };

  const animateBars = (root) => {
    if (!animeLib) return;
    const fill = root.querySelector(".barFill");
    if (!fill) return;
    const pct = Number(fill.dataset.pct || 0);

    // Reset width
    fill.style.width = "0%";

    animeLib({
      targets: fill,
      width: [`0%`, `${pct}%`],
      duration: 1000,
      easing: "easeOutQuart",
      delay: 200,
    });
  };

  const openModal = (e) => {
    const item = e.currentTarget;
    const clone = item.cloneNode(true);

    clone.classList.remove("item");
    clone.classList.add("item-modal");
    clone.classList.add("item");
    // Add X button
    clone.insertAdjacentHTML("afterbegin", `<button class="close-modal-btn">&times;</button>`);

    // Extract data
    const meta = clone.querySelector(".skillMeta");
    const pct = meta?.dataset?.skill || 0;

    // Add bars
    clone.insertAdjacentHTML("beforeend", buildBarsHTML(pct));

    // Clear and Append
    dialog.innerHTML = "";
    dialog.appendChild(clone);

    // Initial listener for the X button inside the clone
    const closeBtn = clone.querySelector(".close-modal-btn");
    closeBtn.addEventListener("click", (ev) => {
      ev.stopPropagation(); // prevent bubbling if confusing
      dialog.close();
    });

    dialog.showModal();

    if (animeLib) {
      animeLib({
        targets: clone,
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 400,
        easing: 'easeOutBack'
      });
    }

    animateBars(clone);
  };

  const closeModal = (e) => {
    // Close on backdrop click
    const rect = dialog.getBoundingClientRect();
    const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height
      && rect.left <= e.clientX && e.clientX <= rect.left + rect.width);

    if (!isInDialog) {
      dialog.close();
    }
  };

  cards.forEach((c) => c.addEventListener("click", openModal));
  dialog.addEventListener("click", closeModal);
})();

