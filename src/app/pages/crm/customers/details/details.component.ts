import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { TextFieldModule } from '@angular/cdk/text-field';
import { DatePipe, NgClass, CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    Renderer2,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormArray,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FuseFindByKeyPipe } from '@fuse/pipes/find-by-key/find-by-key.pipe';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ContactsService } from 'app/pages/crm/customers/contacts.service';
import { UsersService } from 'app/pages/crm/customers/users.service';
import {
    Contact,
    Country,
    Tag,
} from 'app/pages/crm/customers/contacts.types';
import {
    User
} from 'app/pages/crm/customers/users.types';
import { ContactsListComponent } from 'app/pages/crm/customers/list/list.component';
import { Subject, debounceTime, takeUntil, forkJoin } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'contacts-details',
    templateUrl: './details.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatButtonModule,
        MatTooltipModule,
        MatIconModule,
        FormsModule,
        MatSlideToggleModule,
        ReactiveFormsModule,
        MatRippleModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        NgClass,
        MatSelectModule,
        MatOptionModule,
        MatDatepickerModule,
        CommonModule,
        TextFieldModule,
        RouterLink,
    ],
})
export class ContactsDetailsComponent implements OnInit, OnDestroy {
    @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;
    @ViewChild('tagsPanel') private _tagsPanel: TemplateRef<any>;
    @ViewChild('tagsPanelOrigin') private _tagsPanelOrigin: ElementRef;

    editMode: boolean = false;
    tags: Tag[];
    tagsEditMode: boolean = false;
    filteredTags: Tag[];
    contact: Contact;
    contactForm: UntypedFormGroup;
    contacts: Contact[];
    countries: Country[];
    private _tagsPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _contactsListComponent: ContactsListComponent,
        private _contactsService: ContactsService,
        private _usersService: UsersService,
        private _formBuilder: UntypedFormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _renderer2: Renderer2,
        private _router: Router,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,
        private _snackBar: MatSnackBar
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */

    generateRandomPassword(length: number = 10): string {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
        let password = '';
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }

        users: User[] = [];
        showUserForm: boolean = false;
        selectedUser: User | null = null;
        userForm: FormGroup;

        /**
         * Open het formulier om een nieuwe gebruiker toe te voegen
         */
        openAddUserPanel(): void {
            this.showUserForm = true;
            this.selectedUser = null;

            this.userForm = this._formBuilder.group({
                firstName: [''],
                lastName: [''],
                email: [''],
                companyId: [this.contact.id],
            });
        }

        /**
         * Open het formulier om een bestaande gebruiker te bewerken
         */
        editUser(user: User): void {
            this.showUserForm = true;
            this.selectedUser = user;

            this.userForm = this._formBuilder.group({
                id: user.id,  // Zorg ervoor dat de id ook wordt gepatched
                firstName: [user.firstName || ''],
                lastName: [user.lastName || ''],
                email: [user.email || ''],
                companyId: [user.companyId],
            });
        }

        /**
         * Annuleer het toevoegen of bewerken van een gebruiker
         */
        cancelUser(): void {
            this.showUserForm = false;
            this.selectedUser = null;
        }

        /**
         * Sla de gebruiker op (nieuw of update)
         */
        saveUser(): void {
            let userData = this.userForm.getRawValue();

            // Automatisch wachtwoord genereren als leeg
            if (!userData.password || userData.password.trim() === '') {
                userData.password = this.generateRandomPassword();
            }

            // 💥 Mapping voor Node.js backend: camelCase ➔ snake_case
            const mappedUserData = {
                id: userData.id,  // Voeg de id toe aan de data
                email: userData.email,
                password: userData.password,
                first_name: userData.firstName,
                last_name: userData.lastName,
                phone: userData.phone,
                role_id: userData.roleId,
                company_id: userData.companyId,
                breeder_id: null, // kun je optioneel meesturen als dat nodig is
            };
        
            if (this.selectedUser) {
                // Update bestaande user
                this._usersService.updateUser(mappedUserData).subscribe({
                    next: () => {
                        this.showUserForm = false;
                        this.loadUsersForCompany(); // Reload de users na update
                    },
                    error: (error) => {
                        console.error('❌ Error updating user:', error);
                    }
                });
            } else {
                // Nieuwe user aanmaken
                this._usersService.createUser(mappedUserData).subscribe({
                    next: () => {
                        this.showUserForm = false;
                        this.loadUsersForCompany(); // Reload de users na create
                    },
                    error: (err) => {
                        console.error('❌ Error creating user:', err);
                        if (err.error.message === 'User already exists') {
                            this._snackBar.open('This email is already in use', 'Close', {
                                duration: 3000, // Snackbar blijft 3 seconden zichtbaar
                                horizontalPosition: 'center',
                                verticalPosition: 'top',
                                panelClass: ['snackbar-error'] // Je kunt hier een CSS-class toevoegen voor stijl
                            });
                        } else {
                            // Toon een andere foutmelding voor andere fouten
                            this._snackBar.open('An error occurred. Please try again.', 'Close', {
                                duration: 3000,
                            });
                        }
                    }
                });
            }


                // Herlaad de lijst
                this._contactsService.getContacts().subscribe();
        }

        deleteUser(userId: string): void {
            // Open de bevestigingsdialoog
            const confirmation = this._fuseConfirmationService.open({
                title: 'Delete user',
                message: 'Are you sure you want to delete this user? This action cannot be undone!',
                actions: {
                    confirm: {
                        label: 'Delete',
                    },
                    cancel: {
                        label: 'Cancel',
                    }
                },
            });
        
            // Nadat de gebruiker op bevestigen heeft geklikt, haal de userId op en voer de verwijdering uit
            confirmation.afterClosed().subscribe((result) => {
                if (result === 'confirmed') {
                    // Voeg je logica toe om de gebruiker te verwijderen
                    this._usersService.deleteUser(userId).subscribe({
                        next: () => {
                            console.log('User deleted successfully');
                            // Eventueel de lijst van users opnieuw ophalen of bijwerken
                            this.loadUsersForCompany(); // Verander naar je eigen methode
                        },
                        error: (err) => {
                            console.error('❌ Error deleting user:', err);
                        },
                    });
                } else {
                    console.log('User deletion canceled');
                }
                
                // Herlaad de lijst
                this._contactsService.getContacts().subscribe();
            });

        }

        loadUsersForCompany(): void {
            if (!this.contact?.id) {
                return;
            }
        
            this._usersService.getUsersByCompanyId(this.contact.id).subscribe({
                next: (users) => {
                    this.users = users;
                    this._changeDetectorRef.markForCheck(); // UI updaten
                },
                error: (error) => {
                    console.error('❌ Error loading users for company:', error);
                }
            });
        }

        toggleContactActive(active: boolean): void {
            if (!this.contact?.id) return;
        
            this._contactsService.updateContactActive(this.contact.id, active).subscribe({
                next: () => {
                    this.contact.active = active;
                    this._snackBar.open(`Contact ${active ? 'activated' : 'deactivated'}`, 'Close', {
                        duration: 3000,
                    });
                },
                error: (err) => {
                    console.error('Failed to update contact status', err);
                    this._snackBar.open('Failed to update status', 'Close', {
                        duration: 3000,
                    });
                },
            });
                // Herlaad de lijst
                this._contactsService.getContacts().subscribe();
        }

        // overige code van de component
    agents: Contact[] = [];
    
    airports = [
        { code: 'NRT', name: 'Tokyo Narita' },
        { code: 'KIX', name: 'Osaka Kansai' },
        { code: 'AMS', name: 'Amsterdam Schiphol' },
    ];
    
    currencies = ['EUR', 'USD', 'JPY', 'GBP'];

    countrySearch: string = '';
    filteredCountries: Country[] = [];

    ngOnInit(): void {

        
       
        // Zet de initiele landenlijst
        this._contactsService.countries$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((codes: Country[]) => {
            this.countries = codes;
            this.filteredCountries = codes; // initieel gelijk
            this._changeDetectorRef.markForCheck();
        });

        // Open the drawer
        this._contactsListComponent.matDrawer.open();

        // Create the contact form
        this.contactForm = this._formBuilder.group({
            id: [''],
            avatar: [null],
            company: [''],
            legal_representative: [''],
            type: ['Dealer'],
            agentId: [null],
            discount: [45],
            commission: [null],
            defaultCommission: [10],
            businessRegNr: [''],
            customerNr: [''],
            website: [
                '',
                [
                  Validators.pattern(
                    /^www\.[a-zA-Z0-9\-]+\.[a-z]{2,}(\/[^\s]*)?$/
                  ),
                ],
              ],
            defaultAirport: [''],
            currency: [''],
            emails: this._formBuilder.array([]),
            phoneNumbers: this._formBuilder.array([]),
            addresses: this._formBuilder.array([
                this._formBuilder.group({
                    label: [''],
                    address: [''],
                    zip: [''],
                    city: [''],
                    country: [''],
                    longitude: [''],
                    latitude: [''],
                    show_on_locator_map: [false], 
                }),
            ]),
            notes: [null],
        });

        this.contactForm.get('agentId')?.valueChanges.subscribe((agentId) => {
            const selectedAgent = this.agents.find(a => a.id === agentId);
            if (selectedAgent) {
                this.contactForm.get('commission')?.setValue(selectedAgent.defaultCommission);
            }
        });

        this.contactForm.get('type')?.valueChanges.subscribe((typeValue) => {
            const agentIdControl = this.contactForm.get('agentId');
        
            if (typeValue === 'Dealer') {
                agentIdControl?.setValidators([Validators.required]);
            } else {
                agentIdControl?.clearValidators();
                agentIdControl?.setValue(null); // eventueel resetten als niet Dealer
            }
        
            agentIdControl?.updateValueAndValidity();
        });
        
        this.contactForm.get('isAgent')?.valueChanges.subscribe((isAgent) => {
            if (isAgent) {
                this.contactForm.get('agentId')?.reset();
            }
        });

        // Trigger ophalen agents uit DB
        this._contactsService.getAgents().subscribe();

        // Subscribe op agents$
        this._contactsService.agents$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((agents) => {
                this.agents = agents || [];
                this._changeDetectorRef.markForCheck();
            });


        // Get the contacts
        this._contactsService.contacts$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((contacts: Contact[]) => {
                this.contacts = contacts;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the contact
        this._contactsService.contact$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((contact: Contact) => {
                if (!contact) {
                    console.warn('❗ Geen contact ontvangen.');
                    return;
                }
                // Open the drawer in case it is closed
                this._contactsListComponent.matDrawer.open();

                // Get the contact
                this.contact = contact;

                // ⬇️ Direct hierna users ophalen
                this._usersService.getUsersByCompanyId(this.contact.id).subscribe((users) => {
                    this.users = users;
                    this._changeDetectorRef.markForCheck(); // even forceren als je OnPush gebruikt
                });


                // Clear the emails and phoneNumbers form arrays
                (this.contactForm.get('emails') as UntypedFormArray).clear();
                (
                    this.contactForm.get('phoneNumbers') as UntypedFormArray
                ).clear();

                // Patch values to the form
                this.contactForm.patchValue({
                    ...contact,
                    type: contact?.type || 'Dealer', // <-- fallback naar 'Dealer' als er geen type is
                });

                // Setup the emails form array
                const emailFormGroups = [];

                // Sorteer e-mails: 'Order' eerst
                const sortedEmails = contact.emails?.sort((a, b) => {
                    const order = ['Order', 'Invoicing'];
                
                    const aIndex = order.indexOf(a.label);
                    const bIndex = order.indexOf(b.label);
                
                    if (aIndex === -1 && bIndex === -1) return 0;
                    if (aIndex === -1) return 1;
                    if (bIndex === -1) return -1;
                    return aIndex - bIndex;
                }) ?? [];

                if (sortedEmails.length > 0) {
                    sortedEmails.forEach((email, index) => {
                        emailFormGroups.push(
                            this._formBuilder.group({
                                email: [email.email, [Validators.required, Validators.email]],
                                label: [email.label ?? (index === 0 ? 'Order' : '')],
                            })
                        );
                    });
                } else {
                    emailFormGroups.push(
                        this._formBuilder.group({
                            email: ['', [Validators.required, Validators.email]], // ✅ e-mailvalidatie
                            label: ['Order'], // Eerste krijgt altijd 'Order'
                        })
                    );
                }

                // Add the email form groups to the emails form array
                emailFormGroups.forEach((emailFormGroup) => {
                    (this.contactForm.get('emails') as UntypedFormArray).push(
                        emailFormGroup
                    );
                });

                // Setup the phone numbers form array
                const phoneNumbersFormGroups = [];

                if (contact.phoneNumbers.length > 0) {
                    // Iterate through them
                    contact.phoneNumbers.forEach((phoneNumber) => {
                        // Create an email form group
                        phoneNumbersFormGroups.push(
                            this._formBuilder.group({
                                country: [phoneNumber.country],
                                phoneNumber: [phoneNumber.phoneNumber],
                                label: [phoneNumber.label],
                            })
                        );
                    });
                } else {
                    // Create a phone number form group
                    phoneNumbersFormGroups.push(
                        this._formBuilder.group({
                            country: ['us'],
                            phoneNumber: [''],
                            label: [''],
                        })
                    );
                }

                // Add the phone numbers form groups to the phone numbers form array
                phoneNumbersFormGroups.forEach((phoneNumbersFormGroup) => {
                    (
                        this.contactForm.get('phoneNumbers') as UntypedFormArray
                    ).push(phoneNumbersFormGroup);
                });

                // Clear existing addresses
                (this.contactForm.get('addresses') as UntypedFormArray).clear();

                // 1. Sorteer de adressen: Billing altijd eerst
                const sortedAddresses = contact.addresses?.sort((a, b) => {
                    if (a.label === 'Billing') return -1;
                    if (b.label === 'Billing') return 1;
                    return 0;
                }) ?? [];

                // Add address form groups
                const addressFormGroups = sortedAddresses?.length
                ? contact.addresses.map((addr, index) => {
                    const group = this._formBuilder.group({
                        label: [addr.label],
                        address: [addr.address, addr.label === 'Billing' ? Validators.required : []],
                        zip: [addr.zip],
                        city: [addr.city],
                        country: [addr.country],
                        longitude: [addr.longitude],
                        latitude: [addr.latitude],
                        show_on_locator_map: [addr.show_on_locator_map ?? false],
                    });

                    console.log(`Adres ${index} - label:`, group.get('label')?.value);
                    console.log(`Type:`, typeof group.get('label')?.value);

                    return group;
                })
                : [
                    this._formBuilder.group({
                        label: ['Billing'],
                        address: ['', Validators.required],
                        zip: [''],
                        city: [''],
                        country: [''],
                        longitude: [''],
                        latitude: [''],
                        show_on_locator_map: [false],
                    }),
                ];

                    

                addressFormGroups.forEach(addr =>
                    (this.contactForm.get('addresses') as UntypedFormArray).push(addr)
                );

                // Toggle the edit mode off
                this.toggleEditMode(false);

                // 👇 Zet hier deze check na je formulier is opgebouwd
                if (!contact.company) {
                    this.toggleEditMode(true); // direct bewerkmodus aan
                } else {
                    this.toggleEditMode(false); // anders normale weergave
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the country telephone codes
        this._contactsService.countries$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((codes: Country[]) => {
                this.countries = codes;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
            

        // Get the tags
        this._contactsService.tags$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((tags: Tag[]) => {
                this.tags = tags;
                this.filteredTags = tags;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    filterCountries(): void {
        const query = this.countrySearch.toLowerCase();
        this.filteredCountries = this.countries.filter((country) =>
            country.name.toLowerCase().includes(query)
        );
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();

        // Dispose the overlays if they are still on the DOM
        if (this._tagsPanelOverlayRef) {
            this._tagsPanelOverlayRef.dispose();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Close the drawer
     */
    async closeDrawer(): Promise<MatDrawerToggleResult> {
        const result = await this._contactsListComponent.matDrawer.close();
        await this._router.navigate(['../'], { relativeTo: this._activatedRoute });
        return result;
    }

    /**
     * Toggle edit mode
     *
     * @param editMode
     */
    toggleEditMode(editMode: boolean | null = null): void {
        if (editMode === null) {
            this.editMode = !this.editMode;
        } else {
            this.editMode = editMode;
        }

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Update the contact
     */

    loadingContact = false;

    updateContact(): void {
        const contact = this.contactForm.getRawValue();
    
        // Filter lege velden
        contact.emails = contact.emails.filter((email) => email.email);
        contact.phoneNumbers = contact.phoneNumbers.filter((phone) => phone.phoneNumber);
    
        const formData = new FormData();
    
        // Voeg avatar toe als gekozen
        if (this.selectedAvatarFile) {
            formData.append('avatar', this.selectedAvatarFile);
        }
    
        // Voeg de rest toe als JSON blob
        formData.append('contact', JSON.stringify(contact)); // <-- geen Blob!
    
        this.loadingContact = true;
    
        this._contactsService.updateContact(contact.id, formData).subscribe({
            next: () => {
                this.toggleEditMode(false);
                forkJoin({
                    list: this._contactsService.getContacts(),
                    detail: this._contactsService.getContactById(contact.id),
                }).subscribe(({ detail }) => {
                    this.contact = detail;
                    this.loadingContact = false;
                });
            },
            error: (err) => {
                console.error('Update failed', err);
                this.loadingContact = false;
            },
        });
    }

    /**
     * Delete the contact
     */
    deleteContact(): void {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete contact',
            message:
                'Are you sure you want to delete this customer? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if (result === 'confirmed') {
                // Get the current contact's id
                const id = this.contact.id;

                // Get the next/previous contact's id
                const currentContactIndex = this.contacts.findIndex(
                    (item) => item.id === id
                );
                const nextContactIndex =
                    currentContactIndex +
                    (currentContactIndex === this.contacts.length - 1 ? -1 : 1);
                const nextContactId =
                    this.contacts.length === 1 && this.contacts[0].id === id
                        ? null
                        : this.contacts[nextContactIndex].id;

                // Delete the contact
                this._contactsService
                    .deleteContact(id)
                    .subscribe((isDeleted) => {
                        // Return if the contact wasn't deleted...
                        if (!isDeleted) {
                            return;
                        }

                        // Navigate to the next contact if available
                        if (nextContactId) {
                            this._router.navigate(['../', nextContactId], {
                                relativeTo: this._activatedRoute,
                            });
                        }
                        // Otherwise, navigate to the parent
                        else {
                            this._router.navigate(['../'], {
                                relativeTo: this._activatedRoute,
                            });
                        }

                        // Toggle the edit mode off
                        this.toggleEditMode(false);
                    });

                // Mark for check
                this._changeDetectorRef.markForCheck();
            }
        });
    }

    /**
     * Upload avatar
     *
     * @param fileList
     */
    selectedAvatarFile: File | null = null;

uploadAvatar(fileList: FileList): void {
    if (!fileList.length) return;

    const file = fileList[0];
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) return;

    this.selectedAvatarFile = file;

    const reader = new FileReader();
    reader.onload = () => {
        this.contact.avatar = reader.result as string; // Preview in UI
    };
    reader.readAsDataURL(file);
}

    /**
     * Remove the avatar
     */
    removeAvatar(): void {
        // Get the form control for 'avatar'
        const avatarFormControl = this.contactForm.get('avatar');

        // Set the avatar as null
        avatarFormControl.setValue(null);

        // Set the file input value as null
        this._avatarFileInput.nativeElement.value = null;

        // Update the contact
        this.contact.avatar = null;
    }

    /**
     * Open tags panel
     */
    openTagsPanel(): void {
        // Create the overlay
        this._tagsPanelOverlayRef = this._overlay.create({
            backdropClass: '',
            hasBackdrop: true,
            scrollStrategy: this._overlay.scrollStrategies.block(),
            positionStrategy: this._overlay
                .position()
                .flexibleConnectedTo(this._tagsPanelOrigin.nativeElement)
                .withFlexibleDimensions(true)
                .withViewportMargin(64)
                .withLockedPosition(true)
                .withPositions([
                    {
                        originX: 'start',
                        originY: 'bottom',
                        overlayX: 'start',
                        overlayY: 'top',
                    },
                ]),
        });

        // Subscribe to the attachments observable
        this._tagsPanelOverlayRef.attachments().subscribe(() => {
            // Add a class to the origin
            this._renderer2.addClass(
                this._tagsPanelOrigin.nativeElement,
                'panel-opened'
            );

            // Focus to the search input once the overlay has been attached
            this._tagsPanelOverlayRef.overlayElement
                .querySelector('input')
                .focus();
        });

        // Create a portal from the template
        const templatePortal = new TemplatePortal(
            this._tagsPanel,
            this._viewContainerRef
        );

        // Attach the portal to the overlay
        this._tagsPanelOverlayRef.attach(templatePortal);

        // Subscribe to the backdrop click
        this._tagsPanelOverlayRef.backdropClick().subscribe(() => {
            // Remove the class from the origin
            this._renderer2.removeClass(
                this._tagsPanelOrigin.nativeElement,
                'panel-opened'
            );

            // If overlay exists and attached...
            if (
                this._tagsPanelOverlayRef &&
                this._tagsPanelOverlayRef.hasAttached()
            ) {
                // Detach it
                this._tagsPanelOverlayRef.detach();

                // Reset the tag filter
                this.filteredTags = this.tags;

                // Toggle the edit mode off
                this.tagsEditMode = false;
            }

            // If template portal exists and attached...
            if (templatePortal && templatePortal.isAttached) {
                // Detach it
                templatePortal.detach();
            }
        });
    }

    /**
     * Toggle the tags edit mode
     */
    toggleTagsEditMode(): void {
        this.tagsEditMode = !this.tagsEditMode;
    }

    /**
     * Filter tags
     *
     * @param event
     */
    filterTags(event): void {
        // Get the value
        const value = event.target.value.toLowerCase();

        // Filter the tags
        this.filteredTags = this.tags.filter((tag) =>
            tag.title.toLowerCase().includes(value)
        );
    }

    /**
     * Filter tags input key down event
     *
     * @param event
     */
    filterTagsInputKeyDown(event): void {
        // Return if the pressed key is not 'Enter'
        if (event.key !== 'Enter') {
            return;
        }

        // If there is no tag available...
        if (this.filteredTags.length === 0) {
            // Create the tag
            this.createTag(event.target.value);

            // Clear the input
            event.target.value = '';

            // Return
            return;
        }

        // If there is a tag...
        const tag = this.filteredTags[0];
        const isTagApplied = this.contact.tags.find((id) => id === tag.id);

        // If the found tag is already applied to the contact...
        if (isTagApplied) {
            // Remove the tag from the contact
            this.removeTagFromContact(tag);
        } else {
            // Otherwise add the tag to the contact
            this.addTagToContact(tag);
        }
    }

    /**
     * Create a new tag
     *
     * @param title
     */
    createTag(title: string): void {
        const tag = {
            title,
        };

        // Create tag on the server
        this._contactsService.createTag(tag).subscribe((response) => {
            // Add the tag to the contact
            this.addTagToContact(response);
        });
    }

    /**
     * Update the tag title
     *
     * @param tag
     * @param event
     */
    updateTagTitle(tag: Tag, event): void {
        // Update the title on the tag
        tag.title = event.target.value;

        // Update the tag on the server
        this._contactsService
            .updateTag(tag.id, tag)
            .pipe(debounceTime(300))
            .subscribe();

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Delete the tag
     *
     * @param tag
     */
    deleteTag(tag: Tag): void {
        // Delete the tag from the server
        this._contactsService.deleteTag(tag.id).subscribe();

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Add tag to the contact
     *
     * @param tag
     */
    addTagToContact(tag: Tag): void {
        // Add the tag
        this.contact.tags.unshift(tag.id);

        // Update the contact form
        this.contactForm.get('tags').patchValue(this.contact.tags);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Remove tag from the contact
     *
     * @param tag
     */
    removeTagFromContact(tag: Tag): void {
        // Remove the tag
        this.contact.tags.splice(
            this.contact.tags.findIndex((item) => item === tag.id),
            1
        );

        // Update the contact form
        this.contactForm.get('tags').patchValue(this.contact.tags);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Toggle contact tag
     *
     * @param tag
     */
    toggleContactTag(tag: Tag): void {
        if (this.contact.tags.includes(tag.id)) {
            this.removeTagFromContact(tag);
        } else {
            this.addTagToContact(tag);
        }
    }

    /**
     * Should the create tag button be visible
     *
     * @param inputValue
     */
    shouldShowCreateTagButton(inputValue: string): boolean {
        return !!!(
            inputValue === '' ||
            this.tags.findIndex(
                (tag) => tag.title.toLowerCase() === inputValue.toLowerCase()
            ) > -1
        );
    }

    /**
     * Add the email field
     */
    addEmailField(): void {
        // Create an empty email form group
        const emailFormGroup = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]], // ✅ correcte validatie
            label: [''],
        });

        // Add the email form group to the emails form array
        (this.contactForm.get('emails') as UntypedFormArray).push(
            emailFormGroup
        );

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Remove the email field
     *
     * @param index
     */
    removeEmailField(index: number): void {
        // Get form array for emails
        const emailsFormArray = this.contactForm.get(
            'emails'
        ) as UntypedFormArray;

        // Remove the email field
        emailsFormArray.removeAt(index);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Add an empty phone number field
     */
    addPhoneNumberField(): void {
        // Create an empty phone number form group
        const phoneNumberFormGroup = this._formBuilder.group({
            country: ['us'],
            phoneNumber: [''],
            label: [''],
        });

        // Add the phone number form group to the phoneNumbers form array
        (this.contactForm.get('phoneNumbers') as UntypedFormArray).push(
            phoneNumberFormGroup
        );

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Remove the phone number field
     *
     * @param index
     */
    removePhoneNumberField(index: number): void {
        // Get form array for phone numbers
        const phoneNumbersFormArray = this.contactForm.get(
            'phoneNumbers'
        ) as UntypedFormArray;

        // Remove the phone number field
        phoneNumbersFormArray.removeAt(index);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    addAddressField(): void {
        const addressFormGroup = this._formBuilder.group({
            label: ['Shop'],
            address: [''],
            zip: [''],
            city: [''],
            country: [''],
            longitude: [''],
            latitude: [''],
        });
    
        (this.contactForm.get('addresses') as UntypedFormArray).push(addressFormGroup);
        this._changeDetectorRef.markForCheck();
    }

    removeAddressField(index: number): void {
        (this.contactForm.get('addresses') as UntypedFormArray).removeAt(index);
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Get country info by iso code
     *
     * @param iso
     */
    getCountryByIso(iso: string): Country {
        return this.countries.find((country) => country.iso === iso);
    }

   

    getCountryByName(name: string): Country | undefined {
        return this.countries.find(
            (country) => country.name.toLowerCase() === name.toLowerCase()
        );
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
