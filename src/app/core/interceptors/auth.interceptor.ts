import { HttpInterceptorFn } from '@angular/common/http';
import { PLATFORM_ID, inject } from '@angular/core';
import { isPlatformServer } from '@angular/common';

import { environment } from '../../../environments/environment';

/**
 * Auth is carried by an httpOnly cookie set by the backend, so:
 *  - every request must send credentials (withCredentials)
 *  - in the browser, /api URLs are relative (same-origin → first-party cookie)
 *  - during SSR there is no origin, so prepend the absolute backend URL
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const isServer = isPlatformServer(inject(PLATFORM_ID));

  let url = req.url;
  if (isServer && url.startsWith('/api')) {
    url = `${environment.ssrApiUrl}${url}`;
  }

  return next(req.clone({ url, withCredentials: true }));
};
