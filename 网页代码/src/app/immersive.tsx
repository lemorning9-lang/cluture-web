// ─── 沉浸式质感升级 M1：全站可复用系统 ──────────────────────────────────────────
// 供 App.tsx 与后续里程碑（M2/M3）复用的轻量组件与 hook。
// 原则：零新依赖（WebGL 粒子除外，ogl ~50KB）、全部尊重 prefers-reduced-motion。
// 注意：本文件被 App.tsx 引用，不得反向 import App.tsx（避免循环依赖），
//       因此这里是自包含的，不复用 App.tsx 内的字体常量。

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import Particles from "./components/reactbits/Particles";

// ── 1. prefers-reduced-motion ─────────────────────────────────────────────────

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

// ── 2. 滚动渐显：useInView hook + Reveal 组件 ─────────────────────────────────

export function useInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            io.disconnect(); // 只渐显一次，避免回滚反复触发
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, inView };
}

// className 透传：可直接替换原容器 div（如 <div className="max-w-7xl ..."> → <Reveal className="max-w-7xl ...">）
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = usePrefersReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>();
  const visible = inView || reduced;

  return (
    <div
      ref={ref}
      className={`${className} ${reduced ? "" : "reveal"} ${visible ? "reveal-visible" : ""}`.trim()}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

// ── 3. hero 级标题逐字入场（轻量实现，不引 GSAP） ──────────────────────────────
// aria：sr-only 完整文本保证可访问名；动画字符 aria-hidden 不进入读法。

export function SplitTitle({
  text,
  className = "",
  delay = 150,
  step = 90,
  gilt = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  step?: number;
  gilt?: boolean;
}) {
  const reduced = usePrefersReducedMotion();

  if (reduced) return <span className={className}>{text}</span>;

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {Array.from(text).map((char, i) => (
          <span
            key={`${char}-${i}`}
            className={`split-char ${gilt ? "gilt-text" : ""}`}
            style={{ "--si": i, "--sd": `${delay}ms` } as CSSProperties}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
    </span>
  );
}

// ── 4. 青铜纹样/回纹装饰 ───────────────────────────────────────────────────────

// 回纹横带：ChapterDivider 两侧、分隔线端头复用。颜色跟随 currentColor。
export function MeanderRule({
  width = 88,
  height = 10,
  flip = false,
  className = "",
}: {
  width?: number;
  height?: number;
  flip?: boolean;
  className?: string;
}) {
  const id = useRef(
    `meander-${Math.random().toString(36).slice(2, 9)}`,
  ).current;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      aria-hidden="true"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <defs>
        <pattern
          id={id}
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M0 9 H10 V1 H2 V7 H7 V4 H5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width={width} height={height} fill={`url(#${id})`} />
    </svg>
  );
}

// 卡片回纹四角（延续 CinematicPrologue 手绘三重回纹角语言），hover 时随 group 提亮
export function MeanderCorners({
  size = 22,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  const base = "M0 26 L0 0 L26 0";
  const mid = "M4 22 L4 4 L22 4";
  const inner = "M8 18 L8 8 L18 8";
  const corners: { pos: string; t: string }[] = [
    { pos: "top-0 left-0", t: "" },
    { pos: "top-0 right-0", t: "translate(26,0) scale(-1,1)" },
    { pos: "bottom-0 left-0", t: "translate(0,26) scale(1,-1)" },
    { pos: "bottom-0 right-0", t: "translate(26,26) scale(-1,-1)" },
  ];

  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-0 text-primary/40 transition-colors duration-300 group-hover:text-primary/90 ${className}`}
    >
      {corners.map(({ pos, t }) => (
        <svg
          key={pos}
          className={`absolute ${pos}`}
          width={size}
          height={size}
          viewBox="0 0 26 26"
          fill="none"
        >
          <g transform={t}>
            <path d={base} stroke="currentColor" strokeWidth="1.2" />
            <path d={mid} stroke="currentColor" strokeWidth="0.9" opacity="0.65" />
            <path d={inner} stroke="currentColor" strokeWidth="0.7" opacity="0.4" />
          </g>
        </svg>
      ))}
    </span>
  );
}

// ── 5. hero 金沙粒子（全站唯一 WebGL 层） ─────────────────────────────────────
// react-bits Particles（vendor 至 components/reactbits/）+ 能力检测降级：
// 移动小屏 / 低端设备 / 无 WebGL / prefers-reduced-motion → 返回 null，
// hero 回落到现有壁画 + 深色渐变静态背景。

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

export function HeroDust({ className = "" }: { className?: string }) {
  const [enabled] = useState(() => {
    if (typeof window === "undefined") return false;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return false;
    if (!hasWebGL()) return false;
    const cores = navigator.hardwareConcurrency ?? 8;
    const mobileSmall =
      window.matchMedia("(pointer: coarse)").matches &&
      window.innerWidth < 768;
    return cores > 2 && !mobileSmall;
  });

  if (!enabled) return null;

  return (
    <div className={`dust-layer ${className}`} aria-hidden="true">
      <Particles
        particleCount={140}
        speed={0.22}
        alphaParticles
        particleBaseSize={70}
        sizeRandomness={1.1}
        cameraDistance={18}
        pixelRatio={Math.min(window.devicePixelRatio || 1, 1.5)}
        particleColors={["#C89640", "#c9a227", "#F4E4CC"]}
      />
    </div>
  );
}

// ── 6. M2: 3D 倾斜卡片（鼠标跟随 rotateX/rotateY + 高光定位） ─────────────────
// 仅在「精确指针 + 未开启减少动效」时启用；触屏/降级时是普通 div。
// 通过 CSS 变量 --rx/--ry/--gx/--gy 驱动 transform 与高光位置（见 immersive.css）。
// 其余 props（onClick/role/tabIndex…）原样透传给根元素。

export function TiltCard({
  children,
  className = "",
  max = 6,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [finePointer] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: fine)").matches,
  );
  const active = !reduced && finePointer;

  const onMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!active || !el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${(-py * max).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(px * max).toFixed(2)}deg`);
    el.style.setProperty("--gx", `${((px + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty("--gy", `${((py + 0.5) * 100).toFixed(1)}%`);
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <div
      ref={ref}
      className={`tilt-card ${active ? "" : "tilt-static"} ${className}`.trim()}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      {...rest}
    >
      {active && <span aria-hidden="true" className="tilt-glare" />}
      {children}
    </div>
  );
}

// ── 7. M2: CountUp 数字滚动 ──────────────────────────────────────────────────
// 进入视口才启动、只跑一次；prefers-reduced-motion 时直接显示终值。
// fontVariantNumeric: tabular-nums 防止滚动中数字宽度抖动。

export function CountUp({
  value,
  duration = 1600,
  className = "",
  suffix = "",
  style,
}: {
  value: number;
  duration?: number;
  className?: string;
  suffix?: string;
  style?: CSSProperties;
}) {
  const reduced = usePrefersReducedMotion();
  const { ref, inView } = useInView<HTMLSpanElement>();
  const [display, setDisplay] = useState(reduced ? value : 0);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    if (reduced) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setDisplay(Math.round(eased * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, value, duration]);

  return (
    <span
      ref={ref}
      className={className}
      style={{ fontVariantNumeric: "tabular-nums", ...style }}
    >
      {display}
      {suffix}
    </span>
  );
}
