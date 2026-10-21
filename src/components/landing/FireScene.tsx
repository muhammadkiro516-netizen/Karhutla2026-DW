"use client";
import { useEffect, useRef } from "react";

// Animated cartoon fire scene using canvas
export function FireScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx!.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    resize();
    window.addEventListener("resize", resize);

    // Smoke particles
    type Particle = { x: number; y: number; r: number; vx: number; vy: number; alpha: number; color: string };
    const particles: Particle[] = [];
    const smokeColors = ["#9ca3af", "#6b7280", "#d1d5db", "#b0b8c4"];

    function spawnParticle(x: number, y: number) {
      particles.push({
        x, y,
        r: 8 + Math.random() * 18,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -(0.4 + Math.random() * 0.8),
        alpha: 0.55 + Math.random() * 0.25,
        color: smokeColors[Math.floor(Math.random() * smokeColors.length)],
      });
    }

    // Tree stumps positions
    const trees = [
      { x: 0.08, dead: true },
      { x: 0.18, dead: false },
      { x: 0.28, dead: true },
      { x: 0.72, dead: false },
      { x: 0.82, dead: true },
      { x: 0.92, dead: false },
    ];

    // Fire sources
    const fires = [
      { x: 0.12, scale: 1.1 },
      { x: 0.35, scale: 0.85 },
      { x: 0.55, scale: 1.3 },
      { x: 0.78, scale: 0.9 },
    ];

    function drawFlame(cx: number, cy: number, scale: number, phase: number, w: number, h: number) {
      const bx = cx * w;
      const by = cy * h;
      const fw = 28 * scale;
      const fh = 48 * scale;

      // Outer flame (orange)
      ctx!.save();
      ctx!.beginPath();
      const wob = Math.sin(phase * 2.5) * 4 * scale;
      ctx!.moveTo(bx, by);
      ctx!.bezierCurveTo(bx - fw * 0.6, by - fh * 0.4, bx - fw * 0.3 + wob, by - fh * 0.75, bx, by - fh);
      ctx!.bezierCurveTo(bx + fw * 0.3 - wob, by - fh * 0.75, bx + fw * 0.6, by - fh * 0.4, bx, by);
      const gOuter = ctx!.createRadialGradient(bx, by - fh * 0.3, 2, bx, by, fw * 0.8);
      gOuter.addColorStop(0, "rgba(255,80,0,0.95)");
      gOuter.addColorStop(0.5, "rgba(255,140,0,0.85)");
      gOuter.addColorStop(1, "rgba(255,60,0,0.4)");
      ctx!.fillStyle = gOuter;
      ctx!.fill();
      ctx!.restore();

      // Inner flame (yellow)
      ctx!.save();
      ctx!.beginPath();
      const wob2 = Math.sin(phase * 3 + 1) * 3 * scale;
      ctx!.moveTo(bx, by - 4 * scale);
      ctx!.bezierCurveTo(bx - fw * 0.35, by - fh * 0.45, bx - fw * 0.15 + wob2, by - fh * 0.72, bx, by - fh * 0.85);
      ctx!.bezierCurveTo(bx + fw * 0.15 - wob2, by - fh * 0.72, bx + fw * 0.35, by - fh * 0.45, bx, by - 4 * scale);
      const gInner = ctx!.createRadialGradient(bx, by - fh * 0.5, 1, bx, by - fh * 0.2, fw * 0.5);
      gInner.addColorStop(0, "rgba(255,255,100,0.95)");
      gInner.addColorStop(0.6, "rgba(255,200,0,0.8)");
      gInner.addColorStop(1, "rgba(255,120,0,0.3)");
      ctx!.fillStyle = gInner;
      ctx!.fill();
      ctx!.restore();

      // Glow under flame
      ctx!.save();
      ctx!.beginPath();
      ctx!.ellipse(bx, by, fw * 0.9, 8 * scale, 0, 0, Math.PI * 2);
      const gGlow = ctx!.createRadialGradient(bx, by, 0, bx, by, fw * 0.9);
      gGlow.addColorStop(0, "rgba(255,100,0,0.5)");
      gGlow.addColorStop(1, "rgba(255,80,0,0)");
      ctx!.fillStyle = gGlow;
      ctx!.fill();
      ctx!.restore();
    }

    function drawTree(xRatio: number, dead: boolean, w: number, h: number) {
      const x = xRatio * w;
      const groundY = h * 0.72;
      const trunkH = dead ? 30 : 55;
      const trunkW = dead ? 7 : 9;

      // Trunk
      ctx!.save();
      ctx!.fillStyle = dead ? "#5c3d1e" : "#6b4423";
      ctx!.beginPath();
      ctx!.rect(x - trunkW / 2, groundY - trunkH, trunkW, trunkH);
      ctx!.fill();

      if (!dead) {
        // Foliage (cartoon tree)
        ctx!.fillStyle = "#2d6a4f";
        ctx!.beginPath();
        ctx!.arc(x, groundY - trunkH - 18, 22, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.fillStyle = "#40916c";
        ctx!.beginPath();
        ctx!.arc(x - 10, groundY - trunkH - 24, 14, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.beginPath();
        ctx!.arc(x + 8, groundY - trunkH - 20, 12, 0, Math.PI * 2);
        ctx!.fill();
      } else {
        // Dead branches
        ctx!.strokeStyle = "#5c3d1e";
        ctx!.lineWidth = 3;
        ctx!.beginPath();
        ctx!.moveTo(x, groundY - trunkH);
        ctx!.lineTo(x - 12, groundY - trunkH - 18);
        ctx!.moveTo(x, groundY - trunkH + 6);
        ctx!.lineTo(x + 10, groundY - trunkH - 12);
        ctx!.stroke();
      }
      ctx!.restore();
    }

    function draw() {
      const W = canvas!.offsetWidth;
      const H = canvas!.offsetHeight;
      t += 0.035;

      // Sky gradient — sunset/fire sky
      const sky = ctx!.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, "#1a0a00");
      sky.addColorStop(0.35, "#7c2d12");
      sky.addColorStop(0.65, "#ea580c");
      sky.addColorStop(0.85, "#fbbf24");
      sky.addColorStop(1, "#fde68a");
      ctx!.fillStyle = sky;
      ctx!.fillRect(0, 0, W, H);

      // Haze / smoke layer near horizon
      const haze = ctx!.createLinearGradient(0, H * 0.55, 0, H * 0.75);
      haze.addColorStop(0, "rgba(150,100,50,0)");
      haze.addColorStop(0.5, "rgba(120,80,30,0.35)");
      haze.addColorStop(1, "rgba(80,50,20,0)");
      ctx!.fillStyle = haze;
      ctx!.fillRect(0, H * 0.55, W, H * 0.2);

      // Ground
      const ground = ctx!.createLinearGradient(0, H * 0.7, 0, H);
      ground.addColorStop(0, "#5c1a00");
      ground.addColorStop(0.4, "#3d1300");
      ground.addColorStop(1, "#1a0800");
      ctx!.fillStyle = ground;
      ctx!.beginPath();
      ctx!.moveTo(0, H * 0.72);
      ctx!.lineTo(W, H * 0.72);
      ctx!.lineTo(W, H);
      ctx!.lineTo(0, H);
      ctx!.fill();

      // Embers flying
      for (let i = 0; i < 18; i++) {
        const ex = ((i * 137.5 + t * 60) % W);
        const ey = H * 0.3 + Math.sin(t * 1.3 + i) * H * 0.15 - (t * 20 + i * 15) % (H * 0.6);
        if (ey < 0) continue;
        const es = 1.5 + Math.sin(t * 2 + i) * 1;
        ctx!.save();
        ctx!.globalAlpha = 0.7 + Math.sin(t * 4 + i) * 0.3;
        ctx!.fillStyle = Math.random() > 0.5 ? "#fbbf24" : "#f97316";
        ctx!.beginPath();
        ctx!.arc(ex, ey, es, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.restore();
      }

      // Trees (background layer)
      trees.forEach(tr => drawTree(tr.x, tr.dead, W, H));

      // Smoke particles update + draw
      if (t % 0.07 < 0.035) {
        fires.forEach(f => spawnParticle(f.x * W, H * 0.68));
        // Extra smoke from general fire line
        spawnParticle(W * 0.5 + (Math.random() - 0.5) * W * 0.6, H * 0.7);
      }

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.004;
        p.r += 0.2;
        ctx!.save();
        ctx!.globalAlpha = Math.max(0, p.alpha);
        ctx!.fillStyle = p.color;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.restore();
        if (p.alpha <= 0) particles.splice(i, 1);
      });

      // Fires
      fires.forEach(f => drawFlame(f.x, 0.72, f.scale, t, W, H));

      // Bottom fire line across ground
      for (let i = 0; i < 10; i++) {
        drawFlame(0.05 + i * 0.1, 0.72, 0.5 + Math.sin(t + i) * 0.15, t + i * 0.4, W, H);
      }

      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
    />
  );
}
