import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { ease } from "@/lib/motion-tokens";
import { cn } from "@/lib/utils";

/** Series colours in fixed order. Colour follows the series, never its rank. */
export const chartColors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"] as const;

function useWidth<T extends HTMLElement>() {
  const ref = React.useRef<T>(null);
  const [width, setWidth] = React.useState(0);
  React.useLayoutEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, width] as const;
}

/** Round the top of a scale up to a clean number and return evenly spaced ticks. */
function niceTicks(max: number, count = 4) {
  const raw = max / count || 1;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? raw;
  return Array.from({ length: count + 1 }, (_, i) => +(i * step).toFixed(6));
}

const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });

function Tooltip({ x, flip, title, rows }: { x: number; flip: boolean; title: string; rows: { color: string; label: string; value: string }[] }) {
  return (
    <div
      className="pointer-events-none absolute top-2 z-10 min-w-32 rounded-lg rovr-glass px-3 py-2 text-caption transition-[left] duration-(--dur-instant) ease-out"
      style={{ left: x, transform: flip ? "translateX(calc(-100% - 12px))" : "translateX(12px)" }}
    >
      <p className="mb-1 font-semibold">{title}</p>
      {rows.map((row) => (
        <p key={row.label} className="flex items-center justify-between gap-4 text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full" style={{ background: row.color }} />
            {row.label}
          </span>
          <span className="font-semibold text-foreground text-data">{row.value}</span>
        </p>
      ))}
    </div>
  );
}

function Legend({ series }: { series: { label: string; color: string }[] }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-caption text-muted-foreground">
      {series.map((s) => (
        <li key={s.label} className="flex items-center gap-1.5">
          <span className="size-2 rounded-full" style={{ background: s.color }} />
          {s.label}
        </li>
      ))}
    </ul>
  );
}

export interface LineChartProps {
  /** Category labels along the x axis, e.g. dates. */
  labels: string[];
  series: { label: string; data: number[] }[];
  height?: number;
  /** Formats values in the tooltip and on the axis. */
  format?: (value: number) => string;
  /** Soft wash under a single series. */
  area?: boolean;
  /** Names the chart for assistive tech. Say what it shows, not that it is a chart. */
  "aria-label": string;
  className?: string;
}

/** Change over time. A crosshair and tooltip follow the pointer; lines draw in once. */
export function LineChart({ labels, series, height = 220, format = (v) => compact.format(v), area = series.length === 1, className, ...props }: LineChartProps) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [active, setActive] = React.useState<number | null>(null);
  const reduced = useReducedMotion();
  const pad = { top: 12, right: 12, bottom: 24, left: 40 };
  const w = Math.max(0, width - pad.left - pad.right);
  const h = height - pad.top - pad.bottom;
  const ticks = niceTicks(Math.max(...series.flatMap((s) => s.data), 1));
  const top = ticks[ticks.length - 1];
  const x = (i: number) => pad.left + (labels.length > 1 ? (i / (labels.length - 1)) * w : w / 2);
  const y = (v: number) => pad.top + h - (v / top) * h;
  const every = Math.ceil(labels.length / Math.max(2, Math.floor(w / 64)));

  return (
    <div className={cn("flex w-full flex-col gap-3", className)}>
      {series.length > 1 && <Legend series={series.map((s, i) => ({ label: s.label, color: chartColors[i] }))} />}
      <div ref={ref} className="relative w-full" style={{ height }}>
        {width > 0 && (
          <svg
            width={width}
            height={height}
            role="img"
            aria-label={props["aria-label"]}
            onPointerMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const ratio = (e.clientX - rect.left - pad.left) / (w || 1);
              setActive(Math.min(labels.length - 1, Math.max(0, Math.round(ratio * (labels.length - 1)))));
            }}
            onPointerLeave={() => setActive(null)}
            className="touch-pan-y"
          >
            {ticks.map((t) => (
              <g key={t}>
                <line x1={pad.left} x2={width - pad.right} y1={y(t)} y2={y(t)} stroke="var(--border)" />
                <text x={pad.left - 8} y={y(t)} dy="0.32em" textAnchor="end" className="fill-(--subtle-foreground) text-[11px] text-data">
                  {format(t)}
                </text>
              </g>
            ))}
            {labels.map((label, i) =>
              i % every === 0 ? (
                <text key={label + i} x={x(i)} y={height - 6} textAnchor="middle" className="fill-(--subtle-foreground) text-[11px]">
                  {label}
                </text>
              ) : null,
            )}
            {active !== null && <line x1={x(active)} x2={x(active)} y1={pad.top} y2={pad.top + h} stroke="var(--border-strong)" />}
            {series.map((s, si) => {
              const d = s.data.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join("");
              return (
                <g key={s.label}>
                  {area && si === 0 && (
                    <motion.path
                      d={`${d}L${x(s.data.length - 1)},${pad.top + h}L${x(0)},${pad.top + h}Z`}
                      fill={chartColors[si]}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.1 }}
                      transition={{ duration: 0.6, delay: reduced ? 0 : 0.3 }}
                    />
                  )}
                  <motion.path
                    d={d}
                    fill="none"
                    stroke={chartColors[si]}
                    strokeWidth={2}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    initial={reduced ? false : { pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.9, ease: ease.out, delay: si * 0.08 }}
                  />
                  {active !== null && <circle cx={x(active)} cy={y(s.data[active])} r={4.5} fill={chartColors[si]} stroke="var(--surface)" strokeWidth={2} />}
                </g>
              );
            })}
          </svg>
        )}
        {active !== null && (
          <Tooltip
            x={x(active)}
            flip={x(active) > width * 0.6}
            title={labels[active]}
            rows={series.map((s, i) => ({ color: chartColors[i], label: s.label, value: format(s.data[active]) }))}
          />
        )}
      </div>
    </div>
  );
}

export interface BarChartProps {
  data: { label: string; value: number }[];
  height?: number;
  format?: (value: number) => string;
  /** Index of the one bar to emphasise; the rest recede. */
  highlight?: number;
  "aria-label": string;
  className?: string;
}

/** Magnitude across categories. Bars rise from the baseline once, in sequence. */
export function BarChart({ data, height = 200, format = (v) => compact.format(v), highlight, className, ...props }: BarChartProps) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [active, setActive] = React.useState<number | null>(null);
  const reduced = useReducedMotion();
  const pad = { top: 12, right: 8, bottom: 24, left: 40 };
  const w = Math.max(0, width - pad.left - pad.right);
  const h = height - pad.top - pad.bottom;
  const ticks = niceTicks(Math.max(...data.map((d) => d.value), 1));
  const top = ticks[ticks.length - 1];
  const band = w / data.length;
  const bar = Math.min(24, band * 0.6);
  return (
    <div ref={ref} className={cn("relative w-full", className)} style={{ height }}>
      {width > 0 && (
        <svg width={width} height={height} role="img" aria-label={props["aria-label"]} onPointerLeave={() => setActive(null)}>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={pad.left} x2={width - pad.right} y1={pad.top + h - (t / top) * h} y2={pad.top + h - (t / top) * h} stroke="var(--border)" />
              <text x={pad.left - 8} y={pad.top + h - (t / top) * h} dy="0.32em" textAnchor="end" className="fill-(--subtle-foreground) text-[11px] text-data">
                {format(t)}
              </text>
            </g>
          ))}
          {data.map((d, i) => {
            const bh = (d.value / top) * h;
            const bx = pad.left + band * i + (band - bar) / 2;
            const dim = (active !== null && active !== i) || (active === null && highlight !== undefined && highlight !== i);
            return (
              <g key={d.label} onPointerEnter={() => setActive(i)}>
                <rect x={pad.left + band * i} y={pad.top} width={band} height={h} fill="transparent" />
                <motion.path
                  d={`M${bx},${pad.top + h}v${-Math.max(0, bh - 4)}q0,-4 4,-4h${bar - 8}q4,0 4,4v${Math.max(0, bh - 4)}z`}
                  fill="var(--chart-1)"
                  style={{ transformOrigin: `${bx}px ${pad.top + h}px`, transformBox: "view-box" }}
                  initial={reduced ? false : { scaleY: 0 }}
                  animate={{ scaleY: 1, opacity: dim ? 0.35 : 1 }}
                  transition={{ scaleY: { type: "spring", damping: 26, mass: 0.9, stiffness: 180, delay: i * 0.03 }, opacity: { duration: 0.15 } }}
                />
                <text x={pad.left + band * i + band / 2} y={height - 6} textAnchor="middle" className="fill-(--subtle-foreground) text-[11px]">
                  {d.label}
                </text>
              </g>
            );
          })}
        </svg>
      )}
      {active !== null && (
        <Tooltip
          x={pad.left + band * active + band / 2}
          flip={active > data.length / 2}
          title={data[active].label}
          rows={[{ color: "var(--chart-1)", label: props["aria-label"], value: format(data[active].value) }]}
        />
      )}
    </div>
  );
}

export interface DonutChartProps {
  /** Two to five parts of one whole. */
  data: { label: string; value: number }[];
  size?: number;
  /** Shown in the centre: the total or the headline share. */
  children?: React.ReactNode;
  format?: (value: number) => string;
  "aria-label": string;
  className?: string;
}

/** Parts of a whole. The legend carries names and values, so identity is never colour alone. */
export function DonutChart({ data, size = 148, children, format = (v) => compact.format(v), className, ...props }: DonutChartProps) {
  const reduced = useReducedMotion();
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  const stroke = 16;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const gap = 3;
  let offset = 0;
  return (
    <div className={cn("flex flex-wrap items-center gap-6", className)}>
      <div className="relative grid shrink-0 place-items-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} role="img" aria-label={props["aria-label"]} className="-rotate-90">
          {data.map((d, i) => {
            const len = Math.max(0, (d.value / total) * c - gap);
            const dash = `${len} ${c - len}`;
            const el = (
              <motion.circle
                key={d.label}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={chartColors[i]}
                strokeWidth={stroke}
                strokeDasharray={dash}
                strokeDashoffset={-offset}
                initial={reduced ? false : { opacity: 0, strokeDasharray: `0 ${c}` }}
                animate={{ opacity: 1, strokeDasharray: dash }}
                transition={{ duration: 0.7, ease: ease.out, delay: i * 0.08 }}
              />
            );
            offset += (d.value / total) * c;
            return el;
          })}
        </svg>
        <div className="absolute text-center">{children}</div>
      </div>
      <ul className="flex min-w-36 flex-1 flex-col gap-2 text-body-sm">
        {data.map((d, i) => (
          <li key={d.label} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2 text-muted-foreground">
              <span className="size-2 rounded-full" style={{ background: chartColors[i] }} />
              {d.label}
            </span>
            <span className="font-semibold text-data">
              {format(d.value)} <span className="font-normal text-subtle-foreground">{Math.round((d.value / total) * 100)}%</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export interface SparklineProps extends React.SVGAttributes<SVGSVGElement> {
  data: number[];
  width?: number;
  height?: number;
  /** A sentence describing the trend, e.g. "Resting heart rate, falling over 30 days". */
  "aria-label": string;
}

/** A trend at a glance, beside a number. No axes, no tooltip: the number carries the value. */
export function Sparkline({ data, width = 96, height = 28, className, ...props }: SparklineProps) {
  const min = Math.min(...data);
  const span = Math.max(...data) - min || 1;
  const px = (i: number) => 3 + (i / (data.length - 1)) * (width - 6);
  const py = (v: number) => 3 + (1 - (v - min) / span) * (height - 6);
  const d = data.map((v, i) => `${i ? "L" : "M"}${px(i)},${py(v)}`).join("");
  return (
    <svg width={width} height={height} role="img" className={cn("shrink-0 text-(--chart-1)", className)} {...props}>
      <path d={d} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={px(data.length - 1)} cy={py(data[data.length - 1])} r={3} fill="currentColor" stroke="var(--surface)" strokeWidth={1.5} />
    </svg>
  );
}
