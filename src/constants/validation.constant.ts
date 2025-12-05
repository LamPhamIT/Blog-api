export const ValidationTarget = {
  BODY: 'body',
  QUERY: 'query',
  PARAMS: 'params',
} as const;

export type ValidationTargetType =
  (typeof ValidationTarget)[keyof typeof ValidationTarget];
