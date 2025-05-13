import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

const matchPasswordsValidator: ValidatorFn = (form: AbstractControl): ValidationErrors | null => {
    const newPassword = form.get('newPassword')?.value;
    const confirmNewPassword = form.get('confirmNewPassword')?.value;
    return newPassword && confirmNewPassword && newPassword !== confirmNewPassword
        ? { passwordsMismatch: true }
        : null;
};

@Component({
    selector: 'settings-security',
    templateUrl: './security.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSlideToggleModule,
        MatButtonModule,
    ],
})
export class SettingsSecurityComponent implements OnInit {
    showCurrent: boolean = false;
    showNew: boolean = false;
    showConfirm: boolean = false;
    securityForm: UntypedFormGroup;

    /**
     * Constructor
     */
    constructor(private _formBuilder: UntypedFormBuilder, private _userService: UserService, private _snackBar: MatSnackBar) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.securityForm = this._formBuilder.group(
            {
                currentPassword: ['', Validators.required],
                newPassword: ['', [Validators.required, Validators.minLength(8)]],
                confirmNewPassword: ['', Validators.required],
            },
            { validators: matchPasswordsValidator }
        );
    }
    savePassword(): void {
        if (this.securityForm.invalid) {
            this.securityForm.markAllAsTouched();
            return;
        }
    
        const { currentPassword, newPassword } = this.securityForm.value;
        
        // TODO: API call toevoegen (via UserService of AuthService)
        this._userService.changePassword(currentPassword, newPassword).subscribe({
            next: (res) => {
                this._snackBar.open(res.message, 'Close', { duration: 3000, horizontalPosition: 'center',
                    verticalPosition: 'top' });
                this.securityForm.reset();
            },
            error: (err) => {
                this._snackBar.open(
                    err.error?.message || 'Something went wrong',
                    'Close',
                    { duration: 3000, horizontalPosition: 'center',
                        verticalPosition: 'top' }
                );
            }
        });
    }

    get passwordsDoNotMatch(): boolean {
        return this.securityForm.hasError('passwordsMismatch');
    }
}


