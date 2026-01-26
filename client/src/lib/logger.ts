/**
 * Logger utility that can be disabled in production
 * Usage: import { logger } from '@/lib/logger'
 *        logger.debug('Debug message')
 *        logger.info('Info message')
 *        logger.warn('Warning message')
 *        logger.error('Error message') // Always logs, even in production
 */

const isDevelopment = import.meta.env.DEV || import.meta.env.MODE === 'development';
const ENABLE_LOGGING = isDevelopment || import.meta.env.VITE_ENABLE_LOGGING === 'true';

export const logger = {
  debug: (...args: any[]) => {
    if (ENABLE_LOGGING) {
      console.log(...args);
    }
  },
  
  info: (...args: any[]) => {
    if (ENABLE_LOGGING) {
      console.log(...args);
    }
  },
  
  warn: (...args: any[]) => {
    if (ENABLE_LOGGING) {
      console.warn(...args);
    }
  },
  
  // Errors are always logged (useful for production debugging)
  error: (...args: any[]) => {
    console.error(...args);
  },
  
  // Group logs for better organization
  group: (label: string) => {
    if (ENABLE_LOGGING) {
      console.group(label);
    }
  },
  
  groupEnd: () => {
    if (ENABLE_LOGGING) {
      console.groupEnd();
    }
  }
};

// For backwards compatibility or if you want to completely disable
export const disableLogging = () => {
  // This can be called if needed, but by default respects environment
};
