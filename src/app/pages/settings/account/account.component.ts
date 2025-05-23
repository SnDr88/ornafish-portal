import { TextFieldModule } from '@angular/cdk/text-field';
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
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'settings-account',
    templateUrl: './account.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        TextFieldModule,
        MatSelectModule,
        MatOptionModule,
        MatButtonModule,
    ],
})
export class SettingsAccountComponent implements OnInit {
    accountForm: UntypedFormGroup;

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
        // Initieel formulier opzetten
        this.accountForm = this._formBuilder.group({
            first_name: [''],
            last_name: [''],
            email: ['', Validators.email],
            phone: [''],
        });
    
        // Huidige user ophalen en formulier invullen
        this._userService.user$.subscribe((user) => {
            if (user) {
                this.accountForm.patchValue({
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    phone: user.phone || '', // optioneel
                });
            }
        });
    }

    saveAccount(): void {
        if (this.accountForm.invalid) return;

        this._userService.update(this.accountForm.value).subscribe({
            next: () => {
                this._snackBar.open('Your profile has been updated', 'Close', {
                    duration: 3000, horizontalPosition: 'center',
            verticalPosition: 'top'
                });
            },
            error: () => {
                this._snackBar.open('Failed to update profile', 'Close', {
                    duration: 3000, horizontalPosition: 'center',
            verticalPosition: 'top'
                });
            },
        });
    }

    }
