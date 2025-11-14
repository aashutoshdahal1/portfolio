import { useEffect, useState } from "react";

const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let rafId = 0;

    const update = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const height = doc.scrollHeight - doc.clientHeight;
      const pct = height > 0 ? Math.round((scrollTop / height) * 100) : 0;
      setProgress(pct);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    // initialize
    onScroll();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label={`Scroll to top`}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full glass flex items-center justify-center shadow-elegant focus:outline-none focus:ring-2 focus:ring-primary"
    >
      <svg className="transform -rotate-90" width="44" height="44" viewBox="0 0 44 44">
        <defs>
          <linearGradient id="sp-grad" x1="0" x2="1">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
        <circle cx="22" cy="22" r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth="4" fill="transparent" />
        <circle
          cx="22"
          cy="22"
          r={radius}
          stroke="url(#sp-grad)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="transparent"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
        />
      </svg>
    </button>
  );
};

export default ScrollProgress;
