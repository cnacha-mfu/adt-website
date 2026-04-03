'use client';

import { useEffect, useRef, RefObject } from 'react';

interface Options {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export function useScrollReveal<T extends HTMLElement>(
  options: Options = {}
): RefObject<T> {
  const ref = useRef<T>(null);
  const { threshold = 0.15, rootMargin = '0px 0px -60px 0px', once = true } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            entry.target.classList.remove('visible');
          }
        });
      },
      { threshold, rootMargin }
    );

    // Observe the element itself
    observer.observe(el);

    // Also observe all child [data-reveal] elements
    const children = el.querySelectorAll('[data-reveal]');
    children.forEach(child => observer.observe(child));

    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return ref;
}

export function useCounterAnimation(
  target: number,
  duration = 2000,
  startOnVisible = true
) {
  const ref = useRef<HTMLSpanElement>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const run = () => {
      if (hasRun.current) return;
      hasRun.current = true;
      const start = performance.now();
      const tick = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const value = Math.round(eased * target);
        el.textContent = value.toLocaleString();
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if (!startOnVisible) { run(); return; }

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { run(); observer.disconnect(); } },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration, startOnVisible]);

  return ref;
}
