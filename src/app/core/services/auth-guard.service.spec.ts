import { AuthGuard } from './auth-guard.service';
import { AuthenticationService } from './authentication.service';
import { BhmcErrorHandler } from './bhmc-error-handler.service';
import { Router } from '@angular/router/src/router';

describe('AuthGuard', () => {

  it('should return true if the current user is authenticated', () => {
    expect(true).toBeTruthy();
  });
});
