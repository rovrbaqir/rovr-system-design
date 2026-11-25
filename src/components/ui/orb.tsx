import * as React from "react";
import { cn } from "@/lib/utils";

/*
 * Orb: the RoVR particle sphere, drawn on a canvas. It is the face of Pulse.
 *
 * Modes
 *   scattered  rest: points drift loosely around the sphere.
 *   resolved   points settle into an even lattice with a glow and a bright core.
 *   heartbeat  resolved, plus a soft double beat every 1.35s.
 *   complete   "Ignite": light spreads from the front, then the heartbeat loops.
 *   auto       scattered until the pointer rests on it, then resolved, then heartbeat.
 *
 * Activity (voice, layered on the mode)
 *   user       the person is talking: the lattice brightens and the core lights up.
 *   pulse      Pulse is talking: the sphere swells and glows with its voice.
 *   thinking   Pulse is working on an answer: the glow breathes slowly.
 * Muted loosens the sphere into a dim drift.
 */

export type OrbTheme = "dark" | "light";
export type OrbMode =
  | "auto"
  | "scattered"
  | "resolved"
  | "heartbeat"
  | "complete";
export type OrbActivity = "idle" | "user" | "pulse" | "thinking";

export type OrbLayout = {
  /** Centre X as a fraction of canvas width. */
  cx: number;
  /** Centre Y as a fraction of canvas height. */
  cy: number;
  /** Radius as a fraction of min(width, height). */
  size: number;
};

export type OrbOptions = Partial<OrbLayout> & {
  theme?: OrbTheme;
  /** Seconds of continuous hover before the heartbeat starts. */
  hbDelay?: number;
  /** false = no pointer handling (static states, thumbnails). */
  interactive?: boolean;
  count?: number;
  /** Read every frame while a speaker is active; 0–1 loudness. */
  getEnergy?: () => number;
};

export type OrbState = {
  morph: number;
  heartbeat: number;
  hover: boolean;
  dragging: boolean;
  complete: boolean;
  igniteProgress: number;
};

export type OrbInstance = {
  setTheme: (theme: OrbTheme) => void;
  setLayout: (layout: Partial<OrbLayout>) => void;
  setMode: (mode: OrbMode) => void;
  setComplete: (on: boolean) => void;
  setActivity: (activity: OrbActivity) => void;
  setMuted: (muted: boolean) => void;
  replay: () => void;
  getState: () => OrbState;
  destroy: () => void;
};

type Rgb = [number, number, number];

const TAU = Math.PI * 2;
const ACCENT: Rgb = [84, 110, 255];
const UI_SELECTOR = "button, input, label, a, select, textarea";
const HB_PERIOD = 1.35;
const IGNITE = 2.8;
/** Below this radius (px) dots shrink with the sphere. */
const SMALL_ORB_RADIUS = 90;

/** Per-activity gains driven by loudness (swell, glow, shine, core) + spin rad/s. */
const ACTIVITY = {
  idle: { swell: 0, glow: 0, shine: 0, core: 0, spin: 0.75 },
  user: { swell: 0.04, glow: 0.5, shine: 0.9, core: 1, spin: 0.12 },
  pulse: { swell: 0.18, glow: 3, shine: 0, core: 0, spin: 1.15 },
  thinking: { swell: 0, glow: 0, shine: 0, core: 0, spin: 1 },
} as const;
/** Thinking: glow breathes at this rate (rad/s) and by this much. */
const THINK_RATE = 2.6;
const THINK_GLOW = 1.1;
const THINK_SWELL = 0.03;

const THEMES: Record<OrbTheme, { particle: Rgb; glow: number; core: Rgb }> =
  {
    dark: { particle: [198, 210, 247], glow: 0.3, core: [255, 255, 255] },
    light: { particle: [21, 33, 99], glow: 0.12, core: [84, 110, 255] },
  };

const rgba = (c: Rgb, a: number) =>
  `rgba(${c[0]},${c[1]},${c[2]},${Math.max(0, Math.min(1, a)).toFixed(3)})`;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
/** Frame-rate-independent easing factor: `rate` is what remains after 1s. */
const ease = (rate: number, dt: number) => 1 - Math.pow(rate, dt);

const fibonacciSphere = (n: number): Rgb[] => {
  const out: Rgb[] = [];
  const g = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = g * i;
    out.push([Math.cos(th) * r, y, Math.sin(th) * r]);
  }
  return out;
};

export const mountOrb = (
  canvas: HTMLCanvasElement,
  opts: OrbOptions = {},
): OrbInstance => {
  const N = opts.count ?? 1300;
  const HB_DELAY = opts.hbDelay ?? 2;
  const interactive = opts.interactive !== false;
  const reduce =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const ctx = canvas.getContext("2d");
  const ordered = fibonacciSphere(N);
  const wild = ordered.map(() => {
    const a = Math.random() * TAU;
    const z = Math.random() * 2 - 1;
    const r = Math.sqrt(1 - z * z) * (1 + (Math.random() - 0.5) * 0.22);
    return {
      x: r * Math.cos(a),
      y: z,
      z: r * Math.sin(a),
      s: Math.random() * TAU,
    };
  });

  let theme = THEMES[opts.theme ?? "light"];
  const layout: OrbLayout = {
    cx: opts.cx ?? 0.5,
    cy: opts.cy ?? 0.5,
    size: opts.size ?? 0.3,
  };
  let mode: OrbMode = "auto";
  let activity: OrbActivity = "idle";
  let muted = false;
  let W = 0;
  let H = 0;
  let raf = 0;
  let last = performance.now();
  const st = {
    t: 0,
    morph: 0,
    hold: 0,
    hbA: 0,
    hbPh: 0,
    touchUntil: 0,
    cpT: 0,
    cp: 0,
    cpE: 0,
    spin: 0,
    spinRate: ACTIVITY.idle.spin,
    // Voice layer: 0–1 eased amounts plus smoothed speaker loudness.
    mute: 0,
    voice: 0,
    think: 0,
    energy: 0,
    swellGain: 0,
    glowGain: 0,
    shineGain: 0,
    coreGain: 0,
  };
  const g = {
    hover: false,
    drag: false,
    lx: 0,
    ly: 0,
    rx: 0,
    ry: 0,
    vx: 0,
    vy: 0,
  };

  const resize = () => {
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width = Math.max(1, W * dpr);
    canvas.height = Math.max(1, H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  // Hit testing stays correct when a parent is CSS-scaled.
  const inOrb = (ev: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    if (!W || !r.width) return false;
    const sc = r.width / W;
    const ox = r.left + layout.cx * r.width;
    const oy = r.top + layout.cy * r.height;
    const rad = Math.min(W, H) * layout.size * sc * 1.15;
    return Math.hypot(ev.clientX - ox, ev.clientY - oy) < rad;
  };
  const onUI = (ev: PointerEvent) =>
    ev.target instanceof Element && Boolean(ev.target.closest(UI_SELECTOR));
  const setCursor = (c: string) => {
    document.documentElement.style.cursor = c;
  };

  const onMove = (ev: PointerEvent) => {
    if (g.drag) {
      const dx = ev.clientX - g.lx;
      const dy = ev.clientY - g.ly;
      g.lx = ev.clientX;
      g.ly = ev.clientY;
      g.ry += dx * 0.009;
      g.rx += dy * 0.009;
      g.vx = (dy * 0.009) / 0.016;
      g.vy = (dx * 0.009) / 0.016;
      return;
    }
    if (ev.pointerType !== "mouse") return;
    const h = !onUI(ev) && inOrb(ev);
    if (h !== g.hover) {
      g.hover = h;
      setCursor(h ? "grab" : "");
    }
  };
  const onDown = (ev: PointerEvent) => {
    if (onUI(ev) || !inOrb(ev)) return;
    g.drag = true;
    g.lx = ev.clientX;
    g.ly = ev.clientY;
    g.vx = 0;
    g.vy = 0;
    setCursor("grabbing");
    // A tap on touch screens resolves briefly.
    if (ev.pointerType !== "mouse") st.touchUntil = st.t + 1.35;
    ev.preventDefault();
  };
  const onUp = () => {
    if (!g.drag) return;
    g.drag = false;
    setCursor(g.hover ? "grab" : "");
  };
  const onLeave = () => {
    if (g.hover) {
      g.hover = false;
      setCursor("");
    }
  };

  if (interactive) {
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown, { passive: false });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    document.addEventListener("pointerleave", onLeave);
  }

  type Frame = {
    /** heartbeat swell this frame */
    hb: number;
    /** voice/thinking swell, as a fraction of the radius */
    swell: number;
    /** extra ambient glow on top of the theme's base */
    glowBoost: number;
    /** 0–1 extra particle brightness (listening) */
    shine: number;
    /** 0–1 centre light kept after Ignite (listening) */
    core: number;
  };

  const draw = ({ hb, swell, glowBoost, shine, core }: Frame) => {
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    const S0 = Math.min(W, H) * layout.size;
    const S = S0 * (1 + hb * 0.7 + swell);
    const cx = layout.cx * W;
    const cy = layout.cy * H;
    const m = st.morph;
    const calm = 1 - m;
    const f = st.t * 60;
    const k = S / 380;
    const cp = st.cp;
    const ceU = st.cpT && st.cpE < IGNITE ? st.cpE / IGNITE : -1;

    // Ambient glow
    if (m > 0.01) {
      const R1 = 276 * k;
      const gr = ctx.createRadialGradient(cx, cy, 0, cx, cy, R1);
      gr.addColorStop(
        0,
        rgba(ACCENT, theme.glow * (1 + hb * 4 + cp * 1.6 + glowBoost)),
      );
      gr.addColorStop(1, rgba(ACCENT, 0));
      ctx.globalAlpha = m;
      ctx.fillStyle = gr;
      ctx.beginPath();
      ctx.arc(cx, cy, R1, 0, TAU);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    const ang = f * 0.0018 + g.ry + st.spin;
    const cA = Math.cos(ang);
    const sA = Math.sin(ang);
    const cX = Math.cos(g.rx);
    const sX = Math.sin(g.rx);
    // Small orbs get finer dots, so the lattice reads as light, not stippled.
    const dot =
      S < SMALL_ORB_RADIUS
        ? Math.max(0.4, (0.75 * S) / SMALL_ORB_RADIUS)
        : Math.max(0.75, Math.min(1.2, k));
    const muteFade = 1 - 0.45 * st.mute;
    ctx.fillStyle = rgba(theme.particle, 1);

    for (let i = 0; i < N; i++) {
      const q = ordered[i];
      const w = wild[i];
      const jx =
        calm *
        (Math.sin(f * 0.012 + w.s) * 0.035 +
          Math.sin(f * 0.005 + w.s * 2) * 0.02);
      const jy = calm * Math.cos(f * 0.01 + w.s * 1.3) * 0.035;
      const x0 = w.x + (q[0] - w.x) * m + jx;
      const y0 = w.y + (q[1] - w.y) * m + jy;
      const z0 = w.z + (q[2] - w.z) * m;
      const x = x0 * cA - z0 * sA;
      let z = x0 * sA + z0 * cA;
      let y = y0;
      const y2 = y * cX - z * sX;
      z = y * sX + z * cX;
      y = y2;
      const wave = calm * Math.sin(5 * x + 3 * y + f * 0.0008) * 0.055;

      // Ignite: dim the lattice, then light spreads from the front pole with a brief flash
      let ig = 1;
      let igS = 1;
      let hot = false;
      if (ceU >= 0) {
        const d =
          0.42 + (Math.acos(Math.max(-1, Math.min(1, q[2]))) / Math.PI) * 0.45;
        const lit =
          1 - Math.pow(1 - Math.max(0, Math.min(1, (ceU - d) / 0.15)), 3);
        const fl = Math.sin(Math.PI * lit);
        ig =
          lerp(
            1,
            0.12 + 0.88 * lit,
            1 - Math.pow(1 - Math.min(1, ceU / 0.15), 3),
          ) +
          fl * 0.8;
        igS = 1 + fl * 0.6;
        hot = lit > 0.1 && lit < 0.9;
      }

      const depth = 0.5 + z * 0.5;
      ctx.globalAlpha = Math.min(
        1,
        (0.12 + depth * 0.48 + m * (0.13 + depth * 0.17) + cp * 0.12) *
          (1 + shine * 0.7 * depth) *
          ig *
          muteFade,
      );
      if (hot) ctx.fillStyle = rgba(theme.core, 1);
      ctx.beginPath();
      ctx.arc(
        cx + (x + wave) * S,
        cy + y * S,
        Math.max(0.5, (1.1 + z * 0.65) * dot * igS),
        0,
        TAU,
      );
      ctx.fill();
      if (hot) ctx.fillStyle = rgba(theme.particle, 1);
    }
    ctx.globalAlpha = 1;

    // Bright core: fades out on completion, comes back while listening.
    const coreAlpha = m * Math.max(1 - cp, core);
    if (coreAlpha > 0.01) {
      const R2 = 41 * k * (1 + core * 0.35);
      const gc = ctx.createRadialGradient(cx, cy, 0, cx, cy, R2);
      gc.addColorStop(0, rgba(theme.core, 1));
      gc.addColorStop(1, rgba(ACCENT, 0));
      ctx.globalAlpha = Math.min(1, coreAlpha);
      ctx.fillStyle = gc;
      ctx.beginPath();
      ctx.arc(cx, cy, R2, 0, TAU);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  };

  const frame = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!reduce) st.t += dt;

    // Drag inertia
    if (!g.drag) {
      g.rx += g.vx * dt;
      g.ry += g.vy * dt;
      const decay = Math.pow(0.08, dt);
      g.vx *= decay;
      g.vy *= decay;
    }

    const engaged = g.hover || g.drag || st.t < st.touchUntil;
    let wantMorph: number;
    let wantBeat: number;
    st.mute += ((muted ? 1 : 0) - st.mute) * ease(0.08, dt);
    if (muted) {
      // Muted overrides the mode: dim drift, no beat, no Ignite.
      wantMorph = 0;
      wantBeat = 0;
    } else if (mode === "scattered") {
      wantMorph = 0;
      wantBeat = 0;
    } else if (mode === "resolved") {
      wantMorph = 1;
      wantBeat = 0;
    } else if (mode === "heartbeat") {
      wantMorph = 1;
      wantBeat = 1;
      st.hold = HB_DELAY + 1;
    } else if (mode === "complete" || st.cpT) {
      wantMorph = 1;
      wantBeat = st.cpE > IGNITE ? 1 : 0;
    } else {
      st.hold = engaged ? st.hold + dt : 0;
      wantMorph = engaged ? 1 : 0;
      wantBeat = engaged && st.hold >= HB_DELAY ? 1 : 0;
    }
    if (mode === "complete") st.cpT = 1;

    // Activity: ease the gains so switching speaker never jumps.
    const target = ACTIVITY[activity];
    const talking = activity === "user" || activity === "pulse" ? 1 : 0;
    st.think += ((activity === "thinking" ? 1 : 0) - st.think) * ease(0.1, dt);
    st.voice += (talking - st.voice) * ease(0.05, dt);
    // A voice swell replaces the heartbeat rather than stacking on it.
    wantBeat *= 1 - st.voice;
    const rawEnergy = talking && opts.getEnergy ? clamp01(opts.getEnergy()) : 0;
    // Fast attack, slower release, so syllables read as breaths, not jitter.
    st.energy +=
      (rawEnergy - st.energy) * ease(rawEnergy > st.energy ? 1e-4 : 0.02, dt);
    st.swellGain += (target.swell - st.swellGain) * ease(0.05, dt);
    st.glowGain += (target.glow - st.glowGain) * ease(0.05, dt);
    st.shineGain += (target.shine - st.shineGain) * ease(0.05, dt);
    st.coreGain += (target.core - st.coreGain) * ease(0.05, dt);
    st.spinRate += (target.spin - st.spinRate) * ease(0.1, dt);

    // Muting pauses Ignite so unmuting replays it.
    const igniteOn = st.cpT && !muted ? 1 : 0;
    const idleWobble = activity === "idle" ? 0.12 * Math.sin(st.t * 0.6) : 0;
    if (reduce) {
      // Reduced motion: skip Ignite and hold a still completed orb.
      st.cp = igniteOn;
      st.cpE = igniteOn ? IGNITE + 1 : 0;
    } else {
      st.cp += (igniteOn - st.cp) * ease(0.15, dt);
      st.cpE = igniteOn ? st.cpE + dt : 0;
      st.spin += dt * st.cp * (st.spinRate + idleWobble);
    }
    st.morph += (wantMorph - st.morph) * (1 - Math.pow(0.21, dt));
    if (Math.abs(wantMorph - st.morph) < 0.002) st.morph = wantMorph;
    if (wantBeat && st.hbA < 0.02) st.hbPh = 0.02;
    st.hbA = lerp(st.hbA, wantBeat, 1 - Math.pow(wantBeat ? 0.12 : 0.25, dt));
    if (!reduce) st.hbPh = (st.hbPh + dt / HB_PERIOD) % 1;
    const ph = st.hbPh;
    const hb = reduce
      ? 0
      : st.hbA *
        0.09 *
        (Math.exp(-Math.pow((ph - 0.2) / 0.1, 2)) +
          0.55 * Math.exp(-Math.pow((ph - 0.46) / 0.11, 2)));

    const breath = 0.5 + 0.5 * Math.sin(st.t * THINK_RATE);
    draw({
      hb,
      swell: st.energy * st.swellGain + st.think * THINK_SWELL * breath,
      glowBoost: st.energy * st.glowGain + st.think * THINK_GLOW * breath,
      shine: st.energy * st.shineGain,
      // Listening: the core stays lit and brightens with the voice.
      core: st.coreGain * (0.45 + 0.55 * st.energy),
    });
    raf = requestAnimationFrame(frame);
  };

  raf = requestAnimationFrame(frame);

  // Pause drawing while the canvas is hidden (display:none) or off-screen.
  const io =
    typeof IntersectionObserver === "function"
      ? new IntersectionObserver(([entry]) => {
          if (!entry) return;
          if (!entry.isIntersecting) {
            cancelAnimationFrame(raf);
            raf = 0;
          } else if (!raf) {
            last = performance.now();
            raf = requestAnimationFrame(frame);
          }
        })
      : null;
  io?.observe(canvas);

  return {
    setTheme: (name) => {
      theme = THEMES[name] ?? THEMES.dark;
    },
    setLayout: (next) => {
      (Object.keys(next) as (keyof OrbLayout)[]).forEach((key) => {
        const value = next[key];
        if (value != null) layout[key] = value;
      });
    },
    setMode: (next) => {
      mode = next || "auto";
      if (mode === "auto") st.hold = 0;
      if (mode !== "complete") st.cpT = 0;
      else st.cpE = 0;
    },
    setComplete: (on) => {
      if (on && !st.cpT) st.cpE = 0;
      st.cpT = on ? 1 : 0;
    },
    setActivity: (next) => {
      activity = next;
    },
    setMuted: (next) => {
      muted = next;
    },
    replay: () => {
      st.cpE = 0;
      st.cp = 0;
    },
    getState: () => ({
      morph: st.morph,
      heartbeat: st.hbA,
      hover: g.hover,
      dragging: g.drag,
      complete: Boolean(st.cpT),
      igniteProgress: st.cpT ? Math.min(1, st.cpE / IGNITE) : 0,
    }),
    destroy: () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io?.disconnect();
      if (interactive) {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);
        document.removeEventListener("pointerleave", onLeave);
        setCursor("");
      }
    },
  };
};

export interface OrbProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Width and height of the box in px. Leave it out to fill the parent. */
  size?: number;
  /** Sphere radius as a fraction of the box. The rest is room for the glow and the swell. */
  fill?: number;
  mode?: OrbMode;
  /** Who is talking, for voice screens. */
  activity?: OrbActivity;
  muted?: boolean;
  /** 0 to 1 loudness of whoever is talking, read every frame. */
  getEnergy?: () => number;
  /** Lets the pointer resolve and drag the sphere. Off by default, so it is safe inside buttons and lists. */
  interactive?: boolean;
  /** Follows the page theme unless set. */
  theme?: OrbTheme;
  /** Number of points. Fewer for very small orbs. */
  count?: number;
  /** Read by screen readers. Leave it out when the orb is decoration. */
  label?: string;
}

const pageTheme = (): OrbTheme => (typeof document !== "undefined" && document.documentElement.classList.contains("dark") ? "dark" : "light");

/** The RoVR particle sphere. One per screen area: remounting restarts its animation. */
export function Orb({ size, fill = 0.38, mode = "heartbeat", activity = "idle", muted = false, getEnergy, interactive = false, theme, count, label, className, style, ...props }: OrbProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const orbRef = React.useRef<OrbInstance | null>(null);
  const energyRef = React.useRef(getEnergy);
  energyRef.current = getEnergy;
  const points = count ?? (size != null && size < 96 ? 520 : 1300);

  // Engine options are fixed for the life of the canvas.
  React.useEffect(() => {
    if (!canvasRef.current) return;
    const orb = mountOrb(canvasRef.current, { theme: theme ?? pageTheme(), size: fill, interactive, count: points, getEnergy: () => energyRef.current?.() ?? 0 });
    orbRef.current = orb;
    return () => {
      orb.destroy();
      orbRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactive, points]);

  React.useEffect(() => {
    if (theme) {
      orbRef.current?.setTheme(theme);
      return;
    }
    orbRef.current?.setTheme(pageTheme());
    const watch = new MutationObserver(() => orbRef.current?.setTheme(pageTheme()));
    watch.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => watch.disconnect();
  }, [theme]);
  React.useEffect(() => orbRef.current?.setLayout({ size: fill }), [fill]);
  React.useEffect(() => orbRef.current?.setMode(mode), [mode]);
  React.useEffect(() => orbRef.current?.setActivity(activity), [activity]);
  React.useEffect(() => orbRef.current?.setMuted(muted), [muted]);

  return (
    <div
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("relative shrink-0", size == null && "size-full", className)}
      style={size == null ? style : { width: size, height: size, ...style }}
      {...props}
    >
      <canvas ref={canvasRef} className={cn("block size-full", !interactive && "pointer-events-none")} />
    </div>
  );
}
