import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { of, switchMap } from 'rxjs';

export const AuthGuard: CanActivateFn | CanActivateChildFn = (route, state) => {
    const router: Router = inject(Router);

    return inject(AuthService)
        .check()
        .pipe(
            switchMap((authenticated) => {
                if (!authenticated) {
                    // 👇 Voorkom redirect als we al op de login pagina zitten
                    if (state.url.startsWith('/sign-in')) {
                        return of(true); // laat toegang toe
                    }

                    const redirectURL =
                        state.url === '/sign-out' ? '' : `redirectURL=${state.url}`;
                    const urlTree = router.parseUrl(`sign-in?${redirectURL}`);

                    return of(urlTree);
                }

                return of(true); // ✅ Toegang toestaan
            })
        );
};