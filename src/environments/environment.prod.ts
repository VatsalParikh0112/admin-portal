export const environment = {
  production: true,
  // Browser uses a relative URL → same-origin → cookie is first-party.
  // Vercel rewrites /api/* to the backend (see vercel.json).
  apiUrl: '',
  // Used only during server-side rendering, where relative URLs can't resolve.
  ssrApiUrl: 'https://find-pharma-backend.vercel.app',
};
