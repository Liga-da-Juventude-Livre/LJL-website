"use client";

import { useEffect, useRef } from "react";

// The Gadsden rattlesnake ("Don't tread on me", 1775) roams the panel on its own path, over the motto set large
// and faint. When the pointer comes close it stops, faces it and shakes its rattle, and the motto darkens to green.
// Reduced motion gets one settled frame.

const C = { green: "#006332", deep: "#003a1e", yellow: "#fcb431", ink: "#191617", paper: "#f5f3ec" };
const TAU = Math.PI * 2;
const MOTTO = ["NÃO PISE", "EM MIM"];
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const angDiff = (a: number, b: number) => {
  let d = a - b;
  while (d > Math.PI) d -= TAU;
  while (d < -Math.PI) d += TAU;
  return d;
};

type Pointer = { x: number; y: number; active: boolean };

function createSnake(w: number, h: number, ctx: CanvasRenderingContext2D, ptr: Pointer, family: string) {
  const k = Math.min(w, h) / 380;
  const N = 74;
  const gap = 5.4 * k;
  let ang = -0.5;
  let alert = 0;
  const pts = Array.from({ length: N }, (_, i) => ({ x: w * 0.28 - Math.cos(ang) * gap * i, y: h * 0.62 - Math.sin(ang) * gap * i }));
  const radius = (i: number) => {
    const f = i / (N - 1);
    return k * (f < 0.05 ? 10.5 : 2.6 + 9.6 * Math.pow(1 - f, 0.75));
  };

  const font = (size: number) => `900 ${size}px ${family}`;
  ctx.font = font(200);
  const widest = Math.max(...MOTTO.map((l) => ctx.measureText(l).width));
  const mfs = Math.min((200 * w * 0.9) / widest, h * 0.36);

  const step = (t: number, dt: number) => {
    const head = pts[0];
    const near = ptr.active && Math.hypot(ptr.x - head.x, ptr.y - head.y) < 150 * k;
    alert = clamp(alert + (near ? 0.06 : -0.03) * dt, 0, 1);
    if (near) {
      ang += angDiff(Math.atan2(ptr.y - head.y, ptr.x - head.x), ang) * 0.12 * dt;
    } else {
      ang += (Math.sin(t * 0.0009) * 0.022 + Math.sin(t * 0.0021 + 1.3) * 0.014) * dt;
      const m = 80 * k;
      if (head.x < m || head.x > w - m || head.y < m || head.y > h - m - 30 * k) {
        ang += angDiff(Math.atan2(h * 0.45 - head.y, w / 2 - head.x), ang) * 0.05 * dt;
      }
    }
    const speed = 1.55 * k * (1 - alert);
    const wig = Math.sin(t * 0.0075) * 0.55 * (1 - alert);
    head.x += Math.cos(ang + wig) * speed * dt;
    head.y += Math.sin(ang + wig) * speed * dt;
    for (let i = 1; i < N; i++) {
      const a = pts[i - 1];
      const b = pts[i];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const d = Math.hypot(dx, dy) || 0.001;
      if (d > gap) {
        b.x = a.x - (dx / d) * gap;
        b.y = a.y - (dy / d) * gap;
      }
    }
  };

  const draw = (t: number) => {
    ctx.clearRect(0, 0, w, h);

    // motto
    ctx.font = font(mfs);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = `rgba(0,99,50,${0.07 + alert * 0.55})`;
    ctx.fillText(MOTTO[0], w / 2, h * 0.44 - mfs * 0.48);
    ctx.fillText(MOTTO[1], w / 2, h * 0.44 + mfs * 0.48);
    ctx.textAlign = "start";
    ctx.textBaseline = "alphabetic";

    // shadow
    ctx.fillStyle = "rgba(25,22,23,.08)";
    for (let i = N - 1; i >= 0; i--) {
      ctx.beginPath();
      ctx.arc(pts[i].x + 4 * k, pts[i].y + 7 * k, radius(i), 0, TAU);
      ctx.fill();
    }

    // rattle
    const rat = Math.sin(t * 0.09) * 3.2 * k * alert;
    for (let i = N - 1; i >= N - 4; i--) {
      const p = pts[i];
      const q = pts[i - 1];
      const a = Math.atan2(q.y - p.y, q.x - p.x) + Math.PI / 2;
      ctx.fillStyle = i % 2 ? C.yellow : "#e29d1c";
      ctx.beginPath();
      ctx.arc(p.x + Math.cos(a) * rat, p.y + Math.sin(a) * rat, radius(i) + 1.3 * k, 0, TAU);
      ctx.fill();
    }

    // body with bands
    for (let i = N - 5; i >= 1; i--) {
      ctx.fillStyle = i % 7 < 2 ? C.deep : C.green;
      ctx.beginPath();
      ctx.arc(pts[i].x, pts[i].y, radius(i), 0, TAU);
      ctx.fill();
    }

    // dorsal diamonds
    ctx.fillStyle = C.yellow;
    for (let i = 4; i < N - 6; i += 7) {
      const p = pts[i];
      const q = pts[i - 1];
      const s = radius(i) * 0.5;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(Math.atan2(q.y - p.y, q.x - p.x));
      ctx.beginPath();
      ctx.moveTo(s * 1.5, 0);
      ctx.lineTo(0, s);
      ctx.lineTo(-s * 1.5, 0);
      ctx.lineTo(0, -s);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // head, tongue and eyes
    const h0 = pts[0];
    const h1 = pts[2];
    const lift = 1 + alert * 0.18;
    ctx.save();
    ctx.translate(h0.x, h0.y);
    ctx.rotate(Math.atan2(h0.y - h1.y, h0.x - h1.x));
    ctx.scale(lift, lift);
    const flick = alert > 0.5 ? Math.sin(t * 0.03) > 0 : t % 1700 < 260;
    if (flick) {
      ctx.strokeStyle = C.ink;
      ctx.lineWidth = 1.6 * k;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(10 * k, 0);
      ctx.lineTo(20 * k, 0);
      ctx.lineTo(25 * k, -3.5 * k);
      ctx.moveTo(20 * k, 0);
      ctx.lineTo(25 * k, 3.5 * k);
      ctx.stroke();
    }
    ctx.fillStyle = C.deep;
    ctx.beginPath();
    ctx.ellipse(1 * k, 0, 13.5 * k, 10.5 * k, 0, 0, TAU);
    ctx.fill();
    for (const side of [-1, 1]) {
      ctx.fillStyle = C.yellow;
      ctx.beginPath();
      ctx.arc(4 * k, side * 5.6 * k, 2.9 * k, 0, TAU);
      ctx.fill();
      ctx.fillStyle = C.ink;
      ctx.beginPath();
      ctx.ellipse(4.6 * k, side * 5.6 * k, 0.9 * k, 2.2 * k, 0, 0, TAU);
      ctx.fill();
    }
    ctx.restore();
  };

  return { step, draw };
}

export function HeroSnake() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ptr: Pointer = { x: -1e4, y: -1e4, active: false };
    const family = `${getComputedStyle(document.documentElement).getPropertyValue("--font-sans").trim() || "Archivo"}, system-ui, sans-serif`;

    let scene: ReturnType<typeof createSnake> | null = null;
    let raf = 0;
    let visible = true;
    let t0 = 0;
    let last = 0;
    let lastW = 0;
    let dead = false;

    const build = () => {
      const dpr = Math.min(2, devicePixelRatio || 1);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      scene = createSnake(w, h, ctx, ptr, family);
      t0 = performance.now();
      last = t0;
      if (reduced) {
        for (let t = 0; t < 3000; t += 16.67) scene.step(t, 1);
        scene.draw(3000);
      } else {
        scene.draw(0);
      }
    };

    const frame = (now: number) => {
      raf = 0;
      if (!scene) return;
      const dt = Math.min(3, (now - last) / 16.67);
      last = now;
      scene.step(now - t0, dt);
      scene.draw(now - t0);
      if (visible && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const play = () => {
      if (reduced || raf || !visible || document.hidden || !scene) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      play();
    });
    const ro = new ResizeObserver(() => {
      if (Math.abs(canvas.clientWidth - lastW) < 1) return;
      lastW = canvas.clientWidth;
      cancelAnimationFrame(raf);
      raf = 0;
      build();
      play();
    });
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      ptr.x = e.clientX - r.left;
      ptr.y = e.clientY - r.top;
      ptr.active = true;
    };
    const onLeave = () => {
      ptr.active = false;
    };

    // Wait for the web font so the motto is measured in Archivo, not the fallback.
    document.fonts.ready.then(() => {
      if (dead) return;
      io.observe(canvas);
      ro.observe(canvas);
    });
    document.addEventListener("visibilitychange", play);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerdown", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", play);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      className="hero-art"
      role="img"
      aria-label="Animação: uma cobra verde com manchas amarelas, a cascavel da bandeira de Gadsden, desliza livre sobre o lema Não pise em mim e se põe em guarda quando o cursor se aproxima."
    >
      <canvas ref={canvasRef} className="hero-canvas" />
      <p className="hero-caption" aria-hidden="true">
        <b>Não pise em mim.</b> Gadsden, 1775.
      </p>
    </div>
  );
}
