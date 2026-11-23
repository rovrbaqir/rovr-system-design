import { motion, useReducedMotion } from "motion/react";
import { Check } from "lucide-react";
import { springSnappy } from "@/lib/motion-tokens";
import { cn } from "@/lib/utils";

const colors = ["var(--pulse-from)", "var(--pulse-to)", "var(--success)"];
const particles = Array.from({ length: 14 }, (_, i) => ({ angle: (i / 14) * Math.PI * 2, color: colors[i % 3], reach: i % 2 === 0 ? 1 : 0.72 }));

/**
 * The app's celebration for a finished flow: a check pops in, a ring expands
 * and a few brand-coloured particles fly out. Once, at the end of something
 * that took effort (booking, intake, payment). Not for routine saves.
 */
export function SuccessBurst({ size = 72, className }: { size?: number; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <div role="img" aria-label="Done" className={cn("relative grid place-items-center", className)} style={{ width: size * 2, height: size * 2 }}>
      {!reduced &&
        particles.map((p, i) => (
          <motion.span
            key={i}
            className="absolute size-1.5 rounded-full"
            style={{ background: p.color }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
            animate={{ x: Math.cos(p.angle) * size * 0.8 * p.reach, y: Math.sin(p.angle) * size * 0.8 * p.reach, opacity: [0, 1, 0], scale: 1 }}
            transition={{ duration: 0.65, ease: [0.2, 0, 0, 1], delay: 0.06 }}
          />
        ))}
      {!reduced && (
        <motion.span
          className="absolute rounded-full border-2 border-success"
          style={{ width: size, height: size }}
          initial={{ scale: 0.6, opacity: 0.6 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.2, 0, 0, 1] }}
        />
      )}
      <motion.span
        className="grid place-items-center rounded-full bg-success text-white"
        style={{ width: size, height: size }}
        initial={reduced ? false : { scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...springSnappy, delay: 0.06 }}
      >
        <Check style={{ width: size * 0.45, height: size * 0.45 }} strokeWidth={2.5} />
      </motion.span>
    </div>
  );
}
