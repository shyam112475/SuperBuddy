/**
 * Mirrors the backend's consistent response envelope
 * (see backend/src/utils/apiResponse.ts) so the frontend
 * and backend contracts stay in sync.
 */
export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors: unknown[];
  statusCode: number;
}

export type HealthStatus = {
  status: 'healthy';
};
