
// Performance monitoring utilities for mobile optimization
export class PerformanceMonitor {
  private static marks: Map<string, number> = new Map();
  
  static startTiming(label: string): void {
    this.marks.set(label, performance.now());
    console.log(`⏱️ PERF: Started timing ${label}`);
  }
  
  static endTiming(label: string): number {
    const startTime = this.marks.get(label);
    if (!startTime) {
      console.warn(`⏱️ PERF: No start time found for ${label}`);
      return 0;
    }
    
    const duration = performance.now() - startTime;
    this.marks.delete(label);
    
    console.log(`⏱️ PERF: ${label} took ${duration.toFixed(2)}ms`);
    
    // Log slow operations
    if (duration > 1000) {
      console.warn(`🐌 PERF: Slow operation detected - ${label} took ${duration.toFixed(2)}ms`);
    }
    
    return duration;
  }
  
  static measureAsync<T>(label: string, asyncOperation: () => Promise<T>): Promise<T> {
    this.startTiming(label);
    return asyncOperation().finally(() => {
      this.endTiming(label);
    });
  }
  
  static debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
  
  static throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }
  
  static preloadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = src;
    });
  }
  
  static lazy<T>(factory: () => T): () => T {
    let cached: T;
    let hasValue = false;
    
    return () => {
      if (!hasValue) {
        cached = factory();
        hasValue = true;
      }
      return cached;
    };
  }
  
  // Mobile-specific optimizations
  static isMobile(): boolean {
    return window.innerWidth < 768;
  }
  
  static isSlowConnection(): boolean {
    // @ts-ignore
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!connection) return false;
    
    return connection.effectiveType === 'slow-2g' || 
           connection.effectiveType === '2g' ||
           connection.downlink < 1.5;
  }
  
  static shouldReduceAnimations(): boolean {
    return this.isMobile() && this.isSlowConnection();
  }
  
  static getOptimalImageSize(): { width: number; height: number } {
    const isMobile = this.isMobile();
    return {
      width: isMobile ? 400 : 600,
      height: isMobile ? 240 : 360
    };
  }
}

// Usage tracking for SEO and analytics
export class UsageTracker {
  static trackPageView(page: string): void {
    console.log(`📊 ANALYTICS: Page view - ${page}`);
    // Add Google Analytics or other tracking here
  }
  
  static trackUserAction(action: string, category: string, label?: string): void {
    console.log(`📊 ANALYTICS: Action - ${category}/${action}${label ? `/${label}` : ''}`);
    // Add event tracking here
  }
  
  static trackPerformance(metric: string, value: number, unit: string): void {
    console.log(`📊 ANALYTICS: Performance - ${metric}: ${value}${unit}`);
    // Add performance tracking here
  }
  
  static trackError(error: Error, context: string): void {
    console.error(`📊 ANALYTICS: Error in ${context}:`, error);
    // Add error tracking here
  }
}
