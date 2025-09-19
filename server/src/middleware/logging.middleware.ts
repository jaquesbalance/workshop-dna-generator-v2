import { Request, Response, NextFunction } from 'express';

export interface LogEntry {
  timestamp: string;
  method: string;
  url: string;
  statusCode?: number;
  responseTime?: number;
  userAgent?: string;
  ip: string;
  userId?: string;
}

export const loggingMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();

  // Capture request details
  const logEntry: LogEntry = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    userAgent: req.get('User-Agent'),
    ip: req.ip || req.connection.remoteAddress || 'unknown'
  };

  // Override res.end to capture response details
  const originalEnd = res.end;
  res.end = function(chunk?: any, encoding?: any) {
    const responseTime = Date.now() - startTime;

    logEntry.statusCode = res.statusCode;
    logEntry.responseTime = responseTime;

    // Add user ID if available from JWT
    if ((req as any).user?.id) {
      logEntry.userId = (req as any).user.id;
    }

    // Log the request
    console.log(JSON.stringify(logEntry));

    // Call original end
    originalEnd.call(this, chunk, encoding);
  };

  next();
};

export const securityLogging = (event: string, details: any, req?: Request): void => {
  const securityLogEntry = {
    timestamp: new Date().toISOString(),
    event,
    details,
    ip: req?.ip || 'unknown',
    userAgent: req?.get('User-Agent') || 'unknown',
    userId: (req as any)?.user?.id || 'anonymous'
  };

  console.warn('SECURITY:', JSON.stringify(securityLogEntry));
};