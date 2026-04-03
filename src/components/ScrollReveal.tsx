'use client';

import { useEffect, useRef, CSSProperties, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'none';
  threshold?: number;
  once?: boolean;
  style?: CSSProperties;
  as?: keyof JSX.IntrinsicElements;
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  threshold = 0.12,
  once = true,
  style,
  as: Tag = 'div',
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const initial: CSSProperties = {
      opacity: '0',
      transition: `opacity 0.7s cubic-bezier(.22,1,.36,1) ${delay}ms, transform 0.7s cubic-bezier(.22,1,.36,1) ${delay}ms`,
    } as CSSProperties;

    const transforms: Record<string, string> = {
      up: 'translateY(32px)',
      left: 'translateX(-32px)',
      right: 'translateX(32px)',
      none: 'none',
    };

    Object.assign(el.style, initial);
    el.style.transform = transforms[direction];

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1';
          el.style.transform = 'translate(0)';
          if (once) observer.unobserve(el);
        } else if (!once) {
          el.style.opacity = '0';
          el.style.transform = transforms[direction];
        }
      },
      { threshold, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, direction, threshold, once]);

  // @ts-expect-error dynamic tag
  return <Tag ref={ref} className={className} style={style}>{children}</Tag>;
}
