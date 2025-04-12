import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    FormsModule,
    NgForm,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    imports: [
        RouterLink,
        FuseAlertComponent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
    ],
})
export class AuthSignInComponent implements OnInit {
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    signInForm: UntypedFormGroup;
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private _snackBar: MatSnackBar
    ) {}

    showError(message: string): void {
        this._snackBar.open(message, 'Close', {
            duration: 4000,
            panelClass: ['bg-red-600', 'text-white'],
            horizontalPosition: 'center',
            verticalPosition: 'top'
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.signInForm = this._formBuilder.group({
            email: [
                'hughes.brian@company.com',
                [Validators.required, Validators.email],
            ],
            password: ['admin', Validators.required],
            rememberMe: [''],
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    signIn(): void {
        if (this.signInForm.invalid) {
            const email = this.signInForm.get('email');
            const password = this.signInForm.get('password');
    
            if (email?.hasError('required')) {
                this.showError('Email is required');
            } else if (email?.hasError('email')) {
                this.showError('Please enter a valid email address');
            } else if (password?.hasError('required')) {
                this.showError('Password is required');
            } else {
                this.showError('Please fill in all required fields');
            }
            return;
        }
    
        this.signInForm.disable();
    
        this._authService.signIn(this.signInForm.value).subscribe(
            () => {
                const redirectURL =
                    this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
    
                this._router.navigateByUrl(redirectURL);
            },
            (error) => {
                this.signInForm.enable();
                //this.signInNgForm.resetForm();
    
                this.showError('Login failed: Wrong email or password');
            }
        );
    }
}
