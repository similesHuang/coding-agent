import { Context } from 'koa';

type SuccessParams<T> = {
  data?: T;
  message?: string;
  code?: number;
};

type ErrorParams = {
  message: string;
  code?: number;
};

// 成功响应
export const successResponse = <T>(
  ctx: Context,
  params: SuccessParams<T> = {},
  statusCode: number = 200
) => {
  ctx.status = statusCode;
  ctx.body = {
    success: true,
    message: params.message || 'success',
    data: params.data,
    code: params.code || statusCode
  };
};

// 错误响应
export const errorResponse = (
  ctx: Context,
  message: string,
  code: number = 400
) => {
  ctx.status = code;
  ctx.body = {
    success: false,
    message,
    code
  };
};