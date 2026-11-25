import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

/** Where the backend's Identity UI signs people in. It shares this origin, so the cookie it sets reaches /api. */
export const loginPath = '/Identity/Account/Login';

export function loginUrl(returnUrl: string) {
  return `${loginPath}?ReturnUrl=${encodeURIComponent(returnUrl)}`;
}

/**
 * Sends a signed-out user to the Identity login page and back here afterwards.
 * Any other error, including 403 (signed in but not a developer), is left to the caller.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        const { pathname, search, hash } = window.location;
        window.location.assign(loginUrl(pathname + search + hash));
      }
      return throwError(() => error);
    }),
  );
