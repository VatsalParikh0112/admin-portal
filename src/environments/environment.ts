export const environment = {
  production: false,
  // Browser uses a relative URL → same-origin → cookie is first-party.
  // In dev, ng serve proxies /api to the backend (see proxy.conf.json).
  apiUrl: '',
  // Used only during server-side rendering, where relative URLs can't resolve.
  ssrApiUrl: 'http://localhost:5000',
};
