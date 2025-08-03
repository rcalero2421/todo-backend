import { Response } from 'express';
import { ApiResponse } from '@shared/types';

export function successResponse<T>(
  res: Response,
  code: number,
  message: string,
  data?: T
): Response<ApiResponse<T>> {
  return res.status(code).json({
    code,
    status: 'success',
    message,
    ...(data && { data }),
  });
}
