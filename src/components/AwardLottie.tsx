import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

interface LottieAnimationInstance {
  totalFrames: number;
  play: () => void;
  pause: () => void;
  goToAndStop: (value: number, isFrame?: boolean) => void;
  destroy: () => void;
  addEventListener: (eventName: string, callback: () => void) => void;
  removeEventListener: (eventName: string, callback: () => void) => void;
}

interface LottieGlobal {
  loadAnimation: (params: {
    container: Element;
    renderer: 'svg' | 'canvas' | 'html';
    loop: boolean;
    autoplay: boolean;
    path: string;
    rendererSettings?: {
      preserveAspectRatio?: string;
    };
  }) => LottieAnimationInstance;
}

declare global {
  interface Window {
    lottie?: LottieGlobal;
  }
}

export interface AwardLottieProps {
  src: string;
  paused?: boolean;
  settledProgress?: number;
  fallback: ReactNode;
  className?: string;
}

function getSettledFrame(
  anim: LottieAnimationInstance,
  settledProgress: number,
): number {
  const clamped = Math.min(1, Math.max(0, settledProgress));
  const total = Number.isFinite(anim.totalFrames) ? Math.floor(anim.totalFrames) : 0;
  const maxFrame = Math.max(0, total - 1);
  return Math.min(maxFrame, Math.max(0, Math.round(maxFrame * clamped)));
}

export default function AwardLottie({
  src,
  paused = false,
  settledProgress = 0.65,
  fallback,
  className = '',
}: AwardLottieProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animRef = useRef<LottieAnimationInstance | null>(null);
  const pausedRef = useRef(paused);
  const settledProgressRef = useRef(settledProgress);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);

  const isReady = loadedSrc === src;

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    settledProgressRef.current = settledProgress;
  }, [settledProgress]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let anim: LottieAnimationInstance | null = null;
    let scriptEl: HTMLScriptElement | null = null;
    let attachedWindowLoad = false;

    const handleDomLoaded = () => {
      if (cancelled || !anim) return;
      if (pausedRef.current) {
        anim.goToAndStop(getSettledFrame(anim, settledProgressRef.current), true);
      }
      setLoadedSrc(src);
    };

    const handleLoadError = () => {
      if (cancelled) return;
      setLoadedSrc((prev) => (prev === src ? null : prev));
    };

    const cleanupAnim = () => {
      if (!anim) return;
      anim.removeEventListener('DOMLoaded', handleDomLoaded);
      anim.removeEventListener('data_failed', handleLoadError);
      anim.removeEventListener('error', handleLoadError);
      anim.destroy();
      if (animRef.current === anim) {
        animRef.current = null;
      }
      anim = null;
    };

    const initAnimation = () => {
      if (cancelled || anim || !window.lottie) return;
      const instance = window.lottie.loadAnimation({
        container,
        renderer: 'svg',
        loop: true,
        autoplay: !pausedRef.current,
        path: src,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid meet',
        },
      });
      anim = instance;
      animRef.current = instance;
      instance.addEventListener('DOMLoaded', handleDomLoaded);
      instance.addEventListener('data_failed', handleLoadError);
      instance.addEventListener('error', handleLoadError);
    };

    const handleScriptLoad = () => {
      initAnimation();
    };

    if (window.lottie) {
      initAnimation();
    } else {
      scriptEl = document.querySelector<HTMLScriptElement>('script[src*="lottie"]');
      if (scriptEl) {
        scriptEl.addEventListener('load', handleScriptLoad, { once: true });
        scriptEl.addEventListener('error', handleLoadError, { once: true });
      }
      if (document.readyState !== 'complete') {
        attachedWindowLoad = true;
        window.addEventListener('load', handleScriptLoad, { once: true });
      }
    }

    return () => {
      cancelled = true;
      if (scriptEl) {
        scriptEl.removeEventListener('load', handleScriptLoad);
        scriptEl.removeEventListener('error', handleLoadError);
      }
      if (attachedWindowLoad) {
        window.removeEventListener('load', handleScriptLoad);
      }
      cleanupAnim();
    };
  }, [src]);

  useEffect(() => {
    const anim = animRef.current;
    if (!anim || !isReady) return;
    if (paused) {
      anim.goToAndStop(getSettledFrame(anim, settledProgress), true);
    } else {
      anim.play();
    }
  }, [paused, settledProgress, isReady]);

  const wrapperClass = className
    ? `award-lottie-wrapper ${className}`
    : 'award-lottie-wrapper';

  return (
    <div className={wrapperClass} aria-hidden="true">
      <div
        ref={containerRef}
        className={`award-lottie-canvas${isReady ? ' is-ready' : ''}`}
      />
      {!isReady && fallback}
    </div>
  );
}

