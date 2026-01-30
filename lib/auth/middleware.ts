import { NextRequest } from 'next/server';
import { verifyAccessToken, JWTPayload } from './jwt';
import { Role } from '@prisma/client';

export async function authenticate(request: NextRequest): Promise<JWTPayload | null> {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const payload = verifyAccessToken(token);
    
    return payload;
  } catch (error) {
    return null;
  }
}

export function authorize(payload: JWTPayload | null, allowedRoles: Role[]): boolean {
  if (!payload) return false;
  return allowedRoles.includes(payload.role);
}

export class AuthError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export function requireAuth(payload: JWTPayload | null): JWTPayload {
  if (!payload) {
    throw new AuthError(401, 'Authentication required');
  }
  return payload;
}

export function requireRole(payload: JWTPayload | null, roles: Role[]): JWTPayload {
  const user = requireAuth(payload);
  if (!roles.includes(user.role)) {
    throw new AuthError(403, 'Insufficient permissions');
  }
  return user;
}
