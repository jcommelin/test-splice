// Test change for label feature Sat Nov 22 09:38:44 AM CET 2025
/**
 * API handlers for HTTP endpoints
 */

export interface Request {
  method: string;
  path: string;
  headers: Record<string, string>;
  query: Record<string, string>;
  body: unknown;
  params: Record<string, string>;
}

export interface Response {
  status: number;
  headers: Record<string, string>;
  body: unknown;
}

export interface Route {
  method: string;
  path: string;
  handler: (req: Request) => Promise<Response>;
  middleware?: string[];
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * Create a success response
 */
export function successResponse(data: unknown, status = 200): Response {
  return {
    status,
    headers: { 'Content-Type': 'application/json' },
    body: { success: true, data },
  };
}

/**
 * Create an error response
 */
export function errorResponse(error: ApiError, status = 400): Response {
  return {
    status,
    headers: { 'Content-Type': 'application/json' },
    body: { success: false, error },
  };
}

/**
 * Parse query string parameters
 */
export function parseQueryString(queryString: string): Record<string, string> {
  const params: Record<string, string> = {};

  if (!queryString) {
    return params;
  }

  const pairs = queryString.split('&');
  for (const pair of pairs) {
    const [key, value] = pair.split('=');
    if (key) {
      params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    }
  }

  return params;
}

/**
 * Extract path parameters from a route pattern
 */
export function extractPathParams(
  pattern: string,
  path: string
): Record<string, string> | null {
  const patternParts = pattern.split('/');
  const pathParts = path.split('/');

  if (patternParts.length !== pathParts.length) {
    return null;
  }

  const params: Record<string, string> = {};

  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i];
    const pathPart = pathParts[i];

    if (patternPart.startsWith(':')) {
      const paramName = patternPart.substring(1);
      params[paramName] = pathPart;
    } else if (patternPart !== pathPart) {
      return null;
    }
  }

  return params;
}

/**
 * Validate request body against a schema
 */
export function validateBody(
  body: unknown,
  requiredFields: string[]
): { valid: boolean; missing: string[] } {
  if (!body || typeof body !== 'object') {
    return { valid: false, missing: requiredFields };
  }

  const missing: string[] = [];
  for (const field of requiredFields) {
    if (!(field in (body as Record<string, unknown>))) {
      missing.push(field);
    }
  }

  return { valid: missing.length === 0, missing };
}

/**
 * Rate limit check (simplified)
 */
export function checkRateLimit(
  clientId: string,
  requestCounts: Map<string, number>,
  limit: number
): boolean {
  const count = requestCounts.get(clientId) || 0;
  if (count >= limit) {
    return false;
  }
  requestCounts.set(clientId, count + 1);
  return true;
}

/**
 * Log API request
 */
export function logRequest(req: Request, res: Response, duration: number): void {
  console.log(
    `${req.method} ${req.path} - ${res.status} (${duration}ms)`
  );
}
