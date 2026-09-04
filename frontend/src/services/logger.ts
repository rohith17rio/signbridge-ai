type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class FrontendLogger {
  private prefix = '[SIGNBRIDGE AI Client]';

  private formatMessage(level: LogLevel, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    return `${this.prefix} [${timestamp}] [${level.toUpperCase()}]: ${message}`;
  }

  info(message: string, data?: any) {
    console.info(this.formatMessage('info', message), data || '');
  }

  warn(message: string, data?: any) {
    console.warn(this.formatMessage('warn', message), data || '');
  }

  error(message: string, error?: any) {
    console.error(this.formatMessage('error', message), error || '');
  }

  debug(message: string, data?: any) {
    console.debug(this.formatMessage('debug', message), data || '');
  }
}

export const logger = new FrontendLogger();
