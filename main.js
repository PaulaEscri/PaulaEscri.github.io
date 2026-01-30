// hola
(() => {
  const hero = document.querySelector(".Inicio");
  const canvas = document.querySelector(".scalesCanvas");
  if (!hero || !canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });

  // Mouse suavizado
  let mx = 0, my = 0;
  let tx = 1, ty = 1; // target en % (0..1)

  const state = {
    dpr: Math.max(1, Math.min(2, window.devicePixelRatio || 1)),
    w: 0,
    h: 0,
    t: 0,
  };

  function resize() {
    const r = hero.getBoundingClientRect();
    state.w = Math.max(1, Math.floor(r.width));
    state.h = Math.max(1, Math.floor(r.height));

    canvas.width = Math.floor(state.w * state.dpr);
    canvas.height = Math.floor(state.h * state.dpr);
    canvas.style.width = state.w + "px";
    canvas.style.height = state.h + "px";

    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
  }

  hero.addEventListener("mousemove", (e) => {
    const r = hero.getBoundingClientRect();
    tx = (e.clientX - r.left) / r.width;
    ty = (e.clientY - r.top) / r.height;
  });

  hero.addEventListener("mouseleave", () => {
    // vuelve al centro suavemente
    tx = 0.5;
    ty = 0.4;
  });

  function draw() {
    state.t += 0.016; // ~60fps base
    // suavizado del ratón
    mx += (tx - mx) * 0.06;
    my += (ty - my) * 0.06;

    ctx.clearRect(0, 0, state.w, state.h);

    // PARAMETROS “PRO” (ajusta si quieres)
    const scale = 34;          // tamaño escama
    const amp = 10;            // fuerza ola
    const waveLen = 120;       // “radio” de influencia
    const speed = 1.2;         // velocidad animación
    const lineAlpha = 0.16;    // intensidad líneas

    const cx = mx * state.w;
    const cy = my * state.h;

    // Color muy neutro (grisáceo) que encaja con tu fondo
    ctx.strokeStyle = `rgba(240,240,240,${lineAlpha})`;
    ctx.lineWidth = 1;

    // Dibujamos “escamas” como arcos repetidos (fish-scale)
    // En vez de mover todo brusco, aplicamos un offset ondulado según distancia al ratón + tiempo
    const cols = Math.ceil(state.w / scale) + 2;
    const rows = Math.ceil(state.h / (scale * 0.75)) + 3;

    for (let row = -1; row < rows; row++) {
      const yBase = row * (scale * 0.75);
      const xOffsetRow = (row % 2) * (scale / 2);

      for (let col = -1; col < cols; col++) {
        const xBase = col * scale + xOffsetRow;

        // Distancia al ratón
        const dx = xBase - cx;
        const dy = yBase - cy;
        const dist = Math.hypot(dx, dy);

        // Influencia suave (0..1)
        const influence = Math.max(0, 1 - dist / waveLen);

        // Onda: fase depende de distancia + tiempo
        const phase = (dist / 18) - state.t * speed;
        const wobble = Math.sin(phase) * amp * influence;

        // Offset final (muy suave)
        const x = xBase + (dx / (dist + 1)) * wobble;
        const y = yBase + (dy / (dist + 1)) * wobble;

        // Arco (media circunferencia) = “escama”
        ctx.beginPath();
        ctx.arc(x, y, scale * 0.5, Math.PI, 0);
        ctx.stroke();
      }
    }

    requestAnimationFrame(draw);
  }

  // init
  resize();
  window.addEventListener("resize", resize, { passive: true });
  requestAnimationFrame(draw);
})();
