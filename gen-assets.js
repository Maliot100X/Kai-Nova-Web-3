// Generates properly-sized Farcaster-compliant placeholder images
// logo.png: 1024x1024 (no alpha, square icon)
// splash.png: 200x200 (boot screen, centered on #050505)
// og.png: 1200x630 (hero / OG embed, 1.91:1)

const { createCanvas } = require("canvas");
const fs = require("fs");
const path = require("path");

function goldGradient(ctx, x, y, w, h) {
  const g = ctx.createLinearGradient(x, y, x + w, y + h);
  g.addColorStop(0, "#FFD700");
  g.addColorStop(0.5, "#FFE44D");
  g.addColorStop(1, "#B8860B");
  return g;
}

function drawBackground(ctx, w, h) {
  // Deep obsidian radial glow background
  ctx.fillStyle = "#050505";
  ctx.fillRect(0, 0, w, h);
  const radial = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.6);
  radial.addColorStop(0, "rgba(255,215,0,0.07)");
  radial.addColorStop(1, "rgba(255,215,0,0)");
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, w, h);
}

// --- LOGO 1024x1024 ---
{
  const S = 1024;
  const canvas = createCanvas(S, S);
  const ctx = canvas.getContext("2d");

  drawBackground(ctx, S, S);

  // Outer ring
  ctx.strokeStyle = goldGradient(ctx, 0, 0, S, S);
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(S / 2, S / 2, S * 0.44, 0, Math.PI * 2);
  ctx.stroke();

  // Crown shape
  const cx = S / 2, cy = S / 2;
  const cr = S * 0.22;
  ctx.fillStyle = goldGradient(ctx, cx - cr, cy - cr, cr * 2, cr * 2);
  ctx.beginPath();
  // Crown base rect
  ctx.rect(cx - cr, cy + cr * 0.1, cr * 2, cr * 0.7);
  ctx.fill();

  // Crown spikes (3 points)
  ctx.beginPath();
  ctx.moveTo(cx - cr, cy + cr * 0.1);
  ctx.lineTo(cx - cr, cy - cr * 0.5);
  ctx.lineTo(cx - cr * 0.4, cy + cr * 0.1);
  ctx.lineTo(cx, cy - cr);
  ctx.lineTo(cx + cr * 0.4, cy + cr * 0.1);
  ctx.lineTo(cx + cr, cy - cr * 0.5);
  ctx.lineTo(cx + cr, cy + cr * 0.1);
  ctx.closePath();
  ctx.fillStyle = goldGradient(ctx, cx - cr, cy - cr, cr * 2, cr * 2);
  ctx.fill();

  // KNTWS text
  ctx.fillStyle = "#050505";
  ctx.font = `bold ${S * 0.075}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("KNTWS", cx, cy + cr * 0.45);

  // Bottom text
  ctx.fillStyle = "rgba(255,215,0,0.5)";
  ctx.font = `${S * 0.04}px sans-serif`;
  ctx.fillText("KAI-NOVA", cx, S * 0.88);

  fs.writeFileSync(path.join("public", "logo.png"), canvas.toBuffer("image/png"));
  console.log("logo.png written (1024x1024)");
}

// --- SPLASH 200x200 ---
{
  const S = 200;
  const canvas = createCanvas(S, S);
  const ctx = canvas.getContext("2d");

  // Transparent-friendly: just the crown on clear bg
  ctx.clearRect(0, 0, S, S);
  ctx.fillStyle = "#050505";
  ctx.fillRect(0, 0, S, S);

  const cx = S / 2, cy = S / 2;
  const cr = S * 0.32;

  ctx.fillStyle = goldGradient(ctx, cx - cr, cy - cr, cr * 2, cr * 2);
  ctx.beginPath();
  ctx.rect(cx - cr, cy + cr * 0.1, cr * 2, cr * 0.65);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(cx - cr, cy + cr * 0.1);
  ctx.lineTo(cx - cr, cy - cr * 0.5);
  ctx.lineTo(cx - cr * 0.35, cy + cr * 0.1);
  ctx.lineTo(cx, cy - cr);
  ctx.lineTo(cx + cr * 0.35, cy + cr * 0.1);
  ctx.lineTo(cx + cr, cy - cr * 0.5);
  ctx.lineTo(cx + cr, cy + cr * 0.1);
  ctx.closePath();
  ctx.fillStyle = goldGradient(ctx, cx - cr, cy - cr, cr * 2, cr * 2);
  ctx.fill();

  fs.writeFileSync(path.join("public", "splash.png"), canvas.toBuffer("image/png"));
  console.log("splash.png written (200x200)");
}

// --- OG 1200x630 ---
{
  const W = 1200, H = 630;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");

  drawBackground(ctx, W, H);

  // Horizontal gold line top
  ctx.fillStyle = goldGradient(ctx, 0, 0, W, 4);
  ctx.fillRect(0, 0, W, 4);

  // Crown icon (small, left side)
  const cr = 80;
  const cx = W / 2, cy = H / 2 - 40;
  ctx.fillStyle = goldGradient(ctx, cx - cr, cy - cr, cr * 2, cr * 2);
  ctx.beginPath();
  ctx.rect(cx - cr, cy + cr * 0.1, cr * 2, cr * 0.65);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx - cr, cy + cr * 0.1);
  ctx.lineTo(cx - cr, cy - cr * 0.5);
  ctx.lineTo(cx - cr * 0.35, cy + cr * 0.1);
  ctx.lineTo(cx, cy - cr);
  ctx.lineTo(cx + cr * 0.35, cy + cr * 0.1);
  ctx.lineTo(cx + cr, cy - cr * 0.5);
  ctx.lineTo(cx + cr, cy + cr * 0.1);
  ctx.closePath();
  ctx.fillStyle = goldGradient(ctx, cx - cr, cy - cr, cr * 2, cr * 2);
  ctx.fill();

  // Title
  ctx.fillStyle = "#FFD700";
  ctx.font = "bold 72px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText("KNTWS", cx, cy + cr + 20);

  // Subtitle
  ctx.fillStyle = "rgba(255,215,0,0.55)";
  ctx.font = "28px sans-serif";
  ctx.fillText("Sovereign Farcaster Client on Base", cx, cy + cr + 110);

  // Domain
  ctx.fillStyle = "rgba(255,215,0,0.3)";
  ctx.font = "22px sans-serif";
  ctx.fillText("kainova.xyz", cx, H - 50);

  // Gold line bottom
  ctx.fillStyle = goldGradient(ctx, 0, H - 4, W, 4);
  ctx.fillRect(0, H - 4, W, 4);

  fs.writeFileSync(path.join("public", "og.png"), canvas.toBuffer("image/png"));
  console.log("og.png written (1200x630)");
}

console.log("ALL ASSETS GENERATED");
