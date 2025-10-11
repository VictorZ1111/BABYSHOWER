import { useCallback, useEffect, useMemo, useRef } from 'react';

/**
 * Hook personalizado para optimizar eventos con debounce y throttle
 * Mejora significativamente la responsividad y performance de la aplicación
 */

// Función debounce optimizada
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<number | null>(null);
  
  const debouncedFn = useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  return debouncedFn as T;
}

// Función throttle optimizada
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<number | null>(null);
  const lastCallRef = useRef<number>(0);
  
  const throttledFn = useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    
    if (now - lastCallRef.current >= delay) {
      lastCallRef.current = now;
      callback(...args);
    } else if (!timeoutRef.current) {
      timeoutRef.current = setTimeout(() => {
        lastCallRef.current = Date.now();
        callback(...args);
        timeoutRef.current = null;
      }, delay - (now - lastCallRef.current));
    }
  }, [callback, delay]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  return throttledFn as T;
}

// Hook para optimizar resize events
export function useOptimizedResize(callback: () => void, delay = 150) {
  const throttledCallback = useThrottle(callback, delay);
  
  useEffect(() => {
    window.addEventListener('resize', throttledCallback);
    
    return () => {
      window.removeEventListener('resize', throttledCallback);
    };
  }, [throttledCallback]);
}

// Hook para optimizar scroll events
export function useOptimizedScroll(callback: (event: Event) => void, delay = 100) {
  const throttledCallback = useThrottle(callback, delay);
  
  useEffect(() => {
    const handleScroll = (event: Event) => {
      // Use requestAnimationFrame for smoother scrolling
      requestAnimationFrame(() => {
        throttledCallback(event);
      });
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [throttledCallback]);
}

// Hook para manejar clicks optimizados (evita doble click accidental)
export function useOptimizedClick<T extends (...args: any[]) => any>(
  callback: T,
  delay = 300
): T {
  const debouncedCallback = useDebounce(callback, delay);
  
  return useCallback((...args: Parameters<T>) => {
    // Prevent default double-click behavior
    debouncedCallback(...args);
  }, [debouncedCallback]) as T;
}

// Hook para intersection observer optimizado
export function useOptimizedIntersection(
  targetRef: React.RefObject<Element>,
  callback: (isIntersecting: boolean) => void,
  options?: IntersectionObserverInit
) {
  const callbackRef = useRef(callback);
  
  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  
  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          callbackRef.current(entry.isIntersecting);
        });
      },
      {
        threshold: 0.1,
        ...options,
      }
    );
    
    observer.observe(target);
    
    return () => {
      observer.disconnect();
    };
  }, [targetRef, options]);
}

// Hook para performance monitoring
export function usePerformanceMonitor() {
  const performanceRef = useRef({
    renderCount: 0,
    lastRenderTime: performance.now(),
    averageRenderTime: 0,
  });
  
  useEffect(() => {
    const now = performance.now();
    const renderTime = now - performanceRef.current.lastRenderTime;
    
    performanceRef.current.renderCount++;
    performanceRef.current.averageRenderTime = 
      (performanceRef.current.averageRenderTime * (performanceRef.current.renderCount - 1) + renderTime) / 
      performanceRef.current.renderCount;
    performanceRef.current.lastRenderTime = now;
    
    // Log performance warnings in development
    if (import.meta.env.DEV && renderTime > 16) {
      console.warn(`Slow render detected: ${renderTime.toFixed(2)}ms`);
    }
  });
  
  return useMemo(() => ({
    renderCount: performanceRef.current.renderCount,
    averageRenderTime: performanceRef.current.averageRenderTime,
  }), []);
}