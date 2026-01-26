/**
 * Logger utility that only logs in development mode
 * In production, all logs are disabled for performance and security
 */

const isDevelopment = import.meta.env.DEV || process.env.NODE_ENV === 'development';

export const logger = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  error: (...args: any[]) => {
    // Always log errors, even in production, but only in development format
    if (isDevelopment) {
      console.error(...args);
    }
    // In production, you might want to send to error tracking service
    // Example: Sentry.captureException(args[0])
  },
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },
};
