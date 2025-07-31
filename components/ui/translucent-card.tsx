'use client';

import React, {
  FC,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';

const ANIMATION_CONFIG = {
  SMOOTH_DURATION: 800,
  INITIAL_DURATION: 2000,
};

const clamp = (val: number, min = 0, max = 100) => Math.min(Math.max(val, min), max);
const round = (val: number, p = 3) => parseFloat(val.toFixed(p));
const adjust = (val: number, fromMin: number, fromMax: number, toMin: number, toMax: number) =>
  round(toMin + ((toMax - toMin) * (val - fromMin)) / (fromMax - fromMin));
const easeInOutCubic = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

interface TranslucentCardProps {
  children: ReactNode;
  enableHover?: boolean;
  className?: string;
}

const TranslucentCard: FC<TranslucentCardProps> = ({
  children,
  enableHover = true,
  className = '',
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const animationHandlers = useMemo(() => {
    if (!enableHover) return null;

    let rafId: number | null = null;

    const updateTransform = (offsetX: number, offsetY: number, card: HTMLElement, wrap: HTMLElement) => {
      const { clientWidth: width, clientHeight: height } = card;
      const percentX = clamp((100 / width) * offsetX);
      const percentY = clamp((100 / height) * offsetY);
      const centerX = percentX - 50;
      const centerY = percentY - 50;

      const props: Record<string, string> = {
        '--pointer-x': `${percentX}%`,
        '--pointer-y': `${percentY}%`,
        '--gradient-x': `${adjust(percentX, 0, 100, 20, 80)}%`,
        '--gradient-y': `${adjust(percentY, 0, 100, 20, 80)}%`,
        '--pointer-from-center': `${clamp(Math.hypot(centerY, centerX) / 50, 0, 1)}`,
        '--rotate-x': `${round(-(centerY / 8))}deg`,
        '--rotate-y': `${round(centerX / 6)}deg`,
      };
      Object.entries(props).forEach(([p, v]) => wrap.style.setProperty(p, v));
    };

    const smoothAnimation = (duration: number, startX: number, startY: number, card: HTMLElement, wrap: HTMLElement) => {
      const startTime = performance.now();
      const targetX = wrap.clientWidth / 2;
      const targetY = wrap.clientHeight / 2;

      const loop = (currentTime: number) => {
        const progress = clamp((currentTime - startTime) / duration);
        const eased = easeInOutCubic(progress);
        const currentX = adjust(eased, 0, 1, startX, targetX);
        const currentY = adjust(eased, 0, 1, startY, targetY);
        updateTransform(currentX, currentY, card, wrap);
        if (progress < 1) rafId = requestAnimationFrame(loop);
      };
      rafId = requestAnimationFrame(loop);
    };

    return {
      updateTransform,
      smoothAnimation,
      cancel: () => rafId && cancelAnimationFrame(rafId),
    };
  }, [enableHover]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!cardRef.current || !wrapRef.current || !animationHandlers) return;
    const rect = cardRef.current.getBoundingClientRect();
    animationHandlers.updateTransform(e.clientX - rect.left, e.clientY - rect.top, cardRef.current, wrapRef.current);
  }, [animationHandlers]);

  const handlePointerEnter = useCallback(() => {
    if (!wrapRef.current || !cardRef.current || !animationHandlers) return;
    animationHandlers.cancel();
    wrapRef.current.classList.add('active');
    cardRef.current.classList.add('active');
  }, [animationHandlers]);

  const handlePointerLeave = useCallback((e: React.PointerEvent) => {
    if (!wrapRef.current || !cardRef.current || !animationHandlers) return;
    wrapRef.current.classList.remove('active');
    cardRef.current.classList.remove('active');
    animationHandlers.smoothAnimation(ANIMATION_CONFIG.SMOOTH_DURATION, e.nativeEvent.offsetX, e.nativeEvent.offsetY, cardRef.current, wrapRef.current);
  }, [animationHandlers]);
  
  useEffect(() => {
    if (!enableHover || !animationHandlers || !wrapRef.current || !cardRef.current) return;

    const wrap = wrapRef.current;
    const card = cardRef.current;
    const { INITIAL_DURATION } = ANIMATION_CONFIG;
    
    const initialX = wrap.clientWidth / 2;
    const initialY = wrap.clientHeight / 2;

    animationHandlers.updateTransform(initialX, initialY, card, wrap);
    animationHandlers.smoothAnimation(INITIAL_DURATION, initialX, initialY, card, wrap);

  }, [enableHover, animationHandlers]);

  return (
    <div
      ref={wrapRef}
      className={`tc-wrapper ${className}`}
    >
      <div
        ref={cardRef}
        className="tc-card"
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <div className="tc-inside">
          <div className="tc-gradient" />
          <div className="tc-shimmer" />
          <div className="tc-content-wrapper">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranslucentCard;