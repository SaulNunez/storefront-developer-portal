import { loginUrl } from './auth-interceptor';

describe('loginUrl', () => {
  it('points at the Identity login page and returns to the current page', () => {
    expect(loginUrl('/application/register?x=1')).toBe(
      '/Identity/Account/Login?ReturnUrl=%2Fapplication%2Fregister%3Fx%3D1',
    );
  });
});
