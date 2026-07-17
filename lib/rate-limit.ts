const rateLimitMap = new Map<string, number[]>();

export function rateLimit(ip: string, limit: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now();
  const windowStart = now - windowMs;

  const requestLog = rateLimitMap.get(ip) || [];
  const requestsInWindow = requestLog.filter((timestamp) => timestamp > windowStart);

  if (requestsInWindow.length >= limit) {
    return false;
  }

  requestsInWindow.push(now);
  rateLimitMap.set(ip, requestsInWindow);
  return true;
}
