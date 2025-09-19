import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/error.middleware.js';

const router = Router();

interface HealthCheck {
  status: 'ok' | 'error';
  latency?: number;
  error?: string;
}

interface HealthResponse {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  version: string;
  uptime: number;
  checks: {
    server: HealthCheck;
    memory: HealthCheck;
    // database: HealthCheck; // Will be added when database is implemented
    // websocket: HealthCheck; // Will be added when WebSocket is implemented
    // ai_service: HealthCheck; // Will be added when AI service is implemented
  };
}

// GET /api/health
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const startTime = Date.now();

  // Check server health
  const serverCheck: HealthCheck = {
    status: 'ok',
    latency: Date.now() - startTime
  };

  // Check memory usage
  const memoryUsage = process.memoryUsage();
  const memoryCheck: HealthCheck = {
    status: memoryUsage.heapUsed < 100 * 1024 * 1024 ? 'ok' : 'error', // 100MB threshold
    latency: 0
  };

  const allChecksOk = serverCheck.status === 'ok' && memoryCheck.status === 'ok';

  const healthResponse: HealthResponse = {
    status: allChecksOk ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    uptime: process.uptime(),
    checks: {
      server: serverCheck,
      memory: memoryCheck
    }
  };

  const statusCode = healthResponse.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(healthResponse);
}));

// GET /api/health/deep
router.get('/deep', asyncHandler(async (req: Request, res: Response) => {
  const healthResponse = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    system: {
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.version,
      pid: process.pid,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpuUsage: process.cpuUsage()
    },
    environment: {
      nodeEnv: process.env.NODE_ENV || 'development',
      port: process.env.PORT || 3001
    }
  };

  res.json(healthResponse);
}));

export default router;