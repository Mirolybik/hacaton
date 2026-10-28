export const appConfig = {
  appName: import.meta.env.VITE_APP_NAME ?? 'UI',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api',
} as const;
