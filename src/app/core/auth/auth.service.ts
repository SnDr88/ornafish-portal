import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { map, catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { environment } from 'environments/environment';


@Injectable({ providedIn: 'root' })
export class AuthService {
    private _authenticated: boolean = false;
    private _httpClient = inject(HttpClient);
    private _userService = inject(UserService);

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any> {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string }): Observable<any> {
        // Throw error, if the user is already logged in
        if (this._authenticated) {
            return throwError(() => new Error('User is already logged in.'));
        }
    
        return this._httpClient.post(`${environment.apiUrl}/api/users/login`, credentials).pipe(
            switchMap((response: any) => {
                // ✅ JWT opslaan
                localStorage.setItem('accessToken', response.token);
    
                // ✅ authenticated zetten
                this._authenticated = true;
    
                // ✅ eventueel user opslaan
                this._userService.user = response.user || { email: credentials.email };
    
                return of(response);
            })
        );
    }

    /**
     * Sign in using the access token
     */
    
    signInUsingToken(): Observable<boolean> {
        console.log('[AuthService] signInUsingToken() gestart met token:', this.accessToken);

        return this._httpClient
            .post(`${environment.apiUrl}/api/auth/sign-in-with-token`, {
                accessToken: this.accessToken,
            })
            .pipe(
                catchError(() => {
                    console.warn('[AuthService] Token verificatie faalde');
                    return of(false);
                }),
                switchMap((response: any) => {
                    if (response.accessToken) {
                        this.accessToken = response.accessToken;
                        localStorage.setItem('accessToken', response.accessToken);
                        console.log('[AuthService] Token vernieuwd en opgeslagen');
                    }

                    // ✅ authenticated zetten
                    this._authenticated = true;

                    // ✅ user in de service opslaan
                    this._userService.user = response.user;

                    return of(true);
                })
            );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');

        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: {
        name: string;
        email: string;
        password: string;
        company: string;
    }): Observable<any> {
        return this._httpClient.post('api/auth/sign-up', user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: {
        email: string;
        password: string;
    }): Observable<any> {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        console.log('[AuthService] check() gestart');
        // Check if the user is logged in
        if (this._authenticated) {
            return of(true);
        }

        // Check the access token availability
        if (!this.accessToken) {
            const token = localStorage.getItem('accessToken');
            console.log('[AuthService] Token uit localStorage:', token);
            if (!token) return of(false);
            this.accessToken = token;
        }

        // Check the access token expire date
        if (AuthUtils.isTokenExpired(this.accessToken)) {
            return of(false);
        }

        // If the access token exists, and it didn't expire, sign in using it
        return this.signInUsingToken();
    }
}
