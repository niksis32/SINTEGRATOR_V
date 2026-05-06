import { useEffect, useRef } from 'react';

/**
 * Процедурная «картинка»: сетка, узлы и лучи — визуально «идут работы».
 */
export default function MaintenanceWorkCanvas({ className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    let raf = 0;
    let t0 = performance.now();

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      const { clientWidth, clientHeight } = canvas;
      canvas.width = Math.max(1, Math.floor(clientWidth * dpr));
      canvas.height = Math.max(1, Math.floor(clientHeight * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    function draw(now) {
      const t = (now - t0) / 1000;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      const cx = w * 0.5;
      const cy = h * 0.48;
      const rBase = Math.min(w, h) * 0.34;

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rBase * 1.4);
      grad.addColorStop(0, 'rgba(127, 146, 183, 0.22)');
      grad.addColorStop(0.45, 'rgba(84, 95, 115, 0.08)');
      grad.addColorStop(1, 'rgba(13, 28, 46, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
      ctx.lineWidth = 1;
      const step = 28;
      const offX = (t * 18) % step;
      const offY = (t * 12) % step;
      for (let x = -step + offX; x < w + step; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = -step + offY; y < h + step; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      const nodes = 9;
      for (let i = 0; i < nodes; i += 1) {
        const a = (i / nodes) * Math.PI * 2 + t * 0.55;
        const pulse = 0.72 + 0.28 * Math.sin(t * 2.2 + i * 0.7);
        const r = rBase * (0.35 + (i % 3) * 0.12) * pulse;
        const x = cx + Math.cos(a) * r * 1.05;
        const y = cy + Math.sin(a) * r * 0.95;

        ctx.beginPath();
        ctx.arc(x, y, 4 + pulse * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(183, 197, 230, ${0.35 + pulse * 0.25})`;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x, y);
        ctx.strokeStyle = `rgba(166, 178, 201, ${0.12 + 0.08 * pulse})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(cx, cy, 10 + Math.sin(t * 3) * 2, 0, Math.PI * 2);
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, 16);
      core.addColorStop(0, 'rgba(234, 241, 255, 0.95)');
      core.addColorStop(1, 'rgba(127, 146, 183, 0.35)');
      ctx.fillStyle = core;
      ctx.fill();

      const sweep = (t * 0.9) % (Math.PI * 2);
      ctx.beginPath();
      ctx.arc(cx, cy, rBase * 0.92, sweep, sweep + 0.55);
      ctx.strokeStyle = 'rgba(183, 197, 230, 0.45)';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.stroke();

      raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
