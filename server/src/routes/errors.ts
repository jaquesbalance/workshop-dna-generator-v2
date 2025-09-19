import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/error.middleware.js';

const router = Router();

interface ErrorReport {
  id: string;
  timestamp: string;
  level: 'error' | 'warning' | 'info';
  message: string;
  stack?: string;
  userAgent?: string;
  url?: string;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
}

// In-memory error storage (in production, this would be a database)
const errorReports: ErrorReport[] = [];

// POST /api/errors - Report client-side errors
router.post('/', asyncHandler(async (req: Request, res: Response) => {
  const {
    level = 'error',
    message,
    stack,
    url,
    sessionId,
    metadata
  } = req.body;

  if (!message) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Error message is required'
    });
  }

  const errorReport: ErrorReport = {
    id: generateErrorId(),
    timestamp: new Date().toISOString(),
    level,
    message,
    stack,
    userAgent: req.get('User-Agent'),
    url,
    userId: (req as any).user?.id,
    sessionId,
    metadata
  };

  // Store error report (in production, save to database)
  errorReports.push(errorReport);

  // Log error
  console.error('Client Error Report:', JSON.stringify(errorReport, null, 2));

  res.status(201).json({
    message: 'Error reported successfully',
    errorId: errorReport.id,
    timestamp: errorReport.timestamp
  });
}));

// GET /api/errors - List error reports (for debugging)
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
  const level = req.query.level as string;

  let filteredErrors = errorReports;

  if (level) {
    filteredErrors = errorReports.filter(error => error.level === level);
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedErrors = filteredErrors
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(startIndex, endIndex);

  res.json({
    errors: paginatedErrors,
    pagination: {
      page,
      limit,
      total: filteredErrors.length,
      pages: Math.ceil(filteredErrors.length / limit)
    }
  });
}));

// GET /api/errors/:id - Get specific error report
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const errorReport = errorReports.find(error => error.id === id);

  if (!errorReport) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Error report not found'
    });
  }

  res.json(errorReport);
}));

function generateErrorId(): string {
  return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export default router;