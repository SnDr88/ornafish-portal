import { AsyncPipe, DOCUMENT, I18nPluralPipe, NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormControl,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import {
    ActivatedRoute,
    Router,
    RouterLink,
    RouterOutlet,
} from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { ContactsService } from 'app/pages/crm/customers/contacts.service';
import {
    Contact,
    Country,
} from 'app/pages/crm/customers/contacts.types';
import {
    Observable,
    Subject,
    filter,
    fromEvent,
    switchMap,
    takeUntil,
    BehaviorSubject, 
    combineLatest,
    map, 
    startWith
} from 'rxjs';

@Component({
    selector: 'contacts-list',
    templateUrl: './list.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatSidenavModule,
        RouterOutlet,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        NgClass,
        RouterLink,
        AsyncPipe,
        I18nPluralPipe,
    ],
})
export class ContactsListComponent implements OnInit, OnDestroy {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;

    get filter(): 'all' | 'Agent' | 'Dealer' {
        return this._filter$.value;
    }
    
    setFilter(type: 'all' | 'Agent' | 'Dealer'): void {
        this._filter$.next(type);
        this._changeDetectorRef.markForCheck();
    }

    

    contacts$: Observable<Contact[]>;
    
    filteredContacts$: Observable<Contact[]>;
    private _filter$: BehaviorSubject<'all' | 'Agent' | 'Dealer'> = new BehaviorSubject<'all' | 'Agent' | 'Dealer'>('all');
    
    contactsCount: number = 0;
    contactsTableColumns: string[] = ['name', 'email', 'phoneNumber', 'job'];
    countries: Country[];
    drawerMode: 'side' | 'over';
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedContact: Contact;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _contactsService: ContactsService,
        @Inject(DOCUMENT) private _document: any,
        private _router: Router,
        private _fuseMediaWatcherService: FuseMediaWatcherService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    contact: any; // Zorg ervoor dat dit het juiste type is voor je contact object

  
    getUserNames(contact: Contact): string {
        if (contact && contact.users && contact.users.length > 0) {
            return contact.users.map(user => `${user.first_name} ${user.last_name}`).join(', ');
        }
        return ''; // Lege string als er geen gebruikers zijn
    }
    normalize(value: string = ''): string {
        return value
            .trim()
            .toUpperCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, ''); // haalt accenten weg
    }
    
    
    /**
     * On init
     */
    ngOnInit(): void {
        
        // Get the contacts
        this.contacts$ = this._contactsService.contacts$;
        this._contactsService.contacts$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((contacts: Contact[]) => {
                // Update the counts
                this.contactsCount = contacts.length;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the contact
        this._contactsService.contact$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((contact: Contact) => {
                // Update the selected contact
                this.selectedContact = contact;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the countries
        this._contactsService.countries$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((countries: Country[]) => {
                // Update the countries
                this.countries = countries;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                switchMap((query) =>
                    // Search
                    this._contactsService.searchContacts(query)
                )
            )
            .subscribe();

        // Subscribe to MatDrawer opened change
        this.matDrawer.openedChange.subscribe((opened) => {
            if (!opened) {
                // Remove the selected contact when drawer closed
                this.selectedContact = null;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            }
        });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Set the drawerMode if the given breakpoint is active
                if (matchingAliases.includes('lg')) {
                    this.drawerMode = 'side';
                } else {
                    this.drawerMode = 'over';
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Listen for shortcuts
        fromEvent(this._document, 'keydown')
            .pipe(
                takeUntil(this._unsubscribeAll),
                filter<KeyboardEvent>(
                    (event) =>
                        (event.ctrlKey === true || event.metaKey) && // Ctrl or Cmd
                        event.key === '/' // '/'
                )
            )
            .subscribe(() => {
                this.createContact();
            });

            this.filteredContacts$ = combineLatest([
                this._contactsService.contacts$,
                this.searchInputControl.valueChanges.pipe(startWith('')),
                this._filter$
            ]).pipe(
                map(([contacts, search, filter]) => {
                    return contacts
                        .filter((contact) =>
                            filter === 'all' ? true : contact.type === filter
                        )
                        .filter((contact) =>
                            contact.company?.toLowerCase().includes(search.toLowerCase())
                        )
                        .sort((a, b) =>
                            this.normalize(a.company).localeCompare(this.normalize(b.company))
                        );
                })
            );
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * On backdrop clicked
     */
    onBackdropClicked(): void {
        // Go back to the list
        this._router.navigate(['./'], { relativeTo: this._activatedRoute });

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Create contact
     */
    createContact(): void {
        const newContact: Contact = {
            company: 'New Company',
            type: 'Dealer',
            addresses: [{ label: 'Billing', address: '', zip: '', city: '', country: '', longitude: '', latitude: '' }],
            phoneNumbers: [],
            emails: [],
            tags: []
        };
        // Create the contact
        this._contactsService.createContact().subscribe((newContact) => {
            // Go to the new contact
            this._router.navigate(['./', newContact.id], {
                relativeTo: this._activatedRoute,
            });

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
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



    getCountryByName(name: string): Country | undefined {
        return this.countries.find(
            (country) => country.name.toLowerCase() === name.toLowerCase()
        );
    }
}
