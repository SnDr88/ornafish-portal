import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    Contact,
    Country,
    Tag,
} from 'app/pages/crm/customers/contacts.types';
import {
    BehaviorSubject,
    Observable,
    filter,
    map,
    of,
    switchMap,
    take,
    tap,
    throwError,
} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ContactsService {
    // Private
    private _contact: BehaviorSubject<Contact | null> = new BehaviorSubject(
        null
    );

    private _agents: BehaviorSubject<Contact[] | null> = new BehaviorSubject(null);

    private _contacts: BehaviorSubject<Contact[] | null> = new BehaviorSubject(
        null
    );
    private _countries: BehaviorSubject<Country[] | null> = new BehaviorSubject(
        null
    );
    private _tags: BehaviorSubject<Tag[] | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for contact
     */
    get contact$(): Observable<Contact> {
        return this._contact.asObservable();
    }

    /**
     * Getter for contacts
     */
    get contacts$(): Observable<Contact[]> {
        return this._contacts.asObservable();
    }

    /**
     * Getter for countries
     */
    get countries$(): Observable<Country[]> {
        return this._countries.asObservable();
    }

    /**
     * Getter for tags
     */
    get tags$(): Observable<Tag[]> {
        return this._tags.asObservable();
    }

    // Getter for agents
    get agents$(): Observable<Contact[]> {
        return this._agents.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get contacts
     */
    getContacts(): Observable<Contact[]> {
        return this._httpClient.get<Contact[]>('/api/contacts').pipe(
            tap((contacts) => {
                this._contacts.next(contacts);
            })
        );
    }

    /**
     * Search contacts with given query
     *
     * @param query
     */
    searchContacts(query: string): Observable<Contact[]> {
        return this._httpClient
            .get<Contact[]>('/api/contacts/search', {
                params: { query },
            })
            .pipe(
                tap((contacts) => {
                    this._contacts.next(contacts);
                })
            );
    }

    setContact(contact: Contact): void {
        this._contact.next(contact);
    }

    updateContactActive(id: string, active: boolean) {
        return this._httpClient.put(`/api/contacts/${id}/active`, { active });
      }


    /**
     * Get contact by id
     */
    getContactById(id: string): Observable<Contact> {
        const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
    
        if (!isValidUUID) {
            return throwError(() => new Error('Invalid contact ID format'));
        }
    
        return this._httpClient.get<any>(`/api/contacts/${id}`).pipe(
            map((apiResponse) => {
                const mapped: Contact = {
                    id: apiResponse.id,
                    avatar: apiResponse.avatar || null,
                    type: apiResponse.type || 'Dealer',
                    emails: apiResponse.emails || [],
                    phoneNumbers: apiResponse.phoneNumbers?.map((p) => ({
                        country: p.country,
                        phoneNumber: p.phone_number,
                        label: p.label,
                    })) || [],
                    company: apiResponse.company || '',
                    legal_representative: apiResponse.legal_representative || '',
                    agentName: apiResponse.agentName || '',
                    addresses: apiResponse.addresses || [],
                    billingCountry: apiResponse.billingCountry || null,
                    notes: apiResponse.notes || '',
                    tags: apiResponse.tags || [],
                    // Eventuele extra mapping (indien je interface uitbreidt):
                    agentId: apiResponse.agent_id,
                    businessRegNr: apiResponse.business_reg_nr,
                    active: apiResponse.active,
                    customerNr: apiResponse.customer_nr,
                    website: apiResponse.website,
                    currency: apiResponse.currency,
                    defaultAirport: apiResponse.default_airport || null,
                    discount: apiResponse.discount,
                    commission: apiResponse.commission,
                    defaultCommission: apiResponse.default_commission,
                };
    
                this._contact.next(mapped);
                return mapped;
            })
        );
    }
    

    /**
     * Create contact
     */
    createContact(): Observable<Contact> {
        return this.contacts$.pipe(
            take(1),
            switchMap((contacts) =>
                this._httpClient
                    .post<Contact>('api/apps/contacts/contact', {})
                    .pipe(
                        map((newContact) => {
                            // Update the contacts with the new contact
                            this._contacts.next([newContact, ...contacts]);

                            // Return the new contact
                            return newContact;
                        })
                    )
            )
        );
    }

    setEmptyContactWithId(id: string): void {
        const emptyContact: Contact = {
            id,
            company: '',
            type: 'Dealer',
            tags: [],
            emails: [],
            phoneNumbers: [],
            addresses: [],
        };
    
        this._contact.next(emptyContact);
    }

    /**
     * Update contact
     *
     * @param id
     * @param contact
     */
    updateContact(id: string, payload: Contact | FormData): Observable<Contact> {
        return this.contacts$.pipe(
            take(1),
            switchMap((contacts) =>
                this._httpClient
                    .patch<Contact>(`/api/contacts/${id}`, payload, {
                        headers:
                            payload instanceof FormData
                                ? undefined // <-- laat browser automatisch multipart-header kiezen
                                : { 'Content-Type': 'application/json' },
                    })
                    .pipe(
                        map((updatedContact) => {
                            const index = contacts.findIndex((item) => item.id === id);
                            if (index > -1) {
                                contacts[index] = updatedContact;
                            }
                            this._contacts.next(contacts);
                            return updatedContact;
                        }),
                        tap((updatedContact) => {
                            this._contact.next(updatedContact);
                        })
                    )
            )
        );
    }

    /**
     * Delete the contact
     *
     * @param id
     */
    deleteContact(id: string): Observable<boolean> {
        return this._httpClient.delete<boolean>(`/api/contacts/${id}`).pipe(
            tap(() => {
                // Update de lokale BehaviorSubject na delete
                const current = this._contacts.getValue();
                const updated = current.filter(contact => contact.id !== id);
                this._contacts.next(updated);
            })
        );
    }

    /**
     * Get Agents
     */
    getAgents(): Observable<Contact[]> {
        return this._httpClient.get<Contact[]>('/api/contacts/agents').pipe(
            map((agents: any[]) =>
                agents.map((agent) => ({
                    ...agent,
                    defaultCommission: agent.default_commission,
                }))
            ),
            tap((agents) => {
                this._agents.next(agents); // als je BehaviorSubject hebt
            })
        );
    }

    /**
     * Get countries
     */
    getCountries(): Observable<Country[]> {
        return this._httpClient
            .get<Country[]>('api/apps/contacts/countries')
            .pipe(
                tap((countries) => {
                    this._countries.next(countries);
                })
            );
    }

    /**
     * Get tags
     */
    getTags(): Observable<Tag[]> {
        return this._httpClient.get<Tag[]>('api/apps/contacts/tags').pipe(
            tap((tags) => {
                this._tags.next(tags);
            })
        );
    }

    /**
     * Create tag
     *
     * @param tag
     */
    createTag(tag: Tag): Observable<Tag> {
        return this.tags$.pipe(
            take(1),
            switchMap((tags) =>
                this._httpClient
                    .post<Tag>('api/apps/contacts/tag', { tag })
                    .pipe(
                        map((newTag) => {
                            // Update the tags with the new tag
                            this._tags.next([...tags, newTag]);

                            // Return new tag from observable
                            return newTag;
                        })
                    )
            )
        );
    }

    /**
     * Update the tag
     *
     * @param id
     * @param tag
     */
    updateTag(id: string, tag: Tag): Observable<Tag> {
        return this.tags$.pipe(
            take(1),
            switchMap((tags) =>
                this._httpClient
                    .patch<Tag>('api/apps/contacts/tag', {
                        id,
                        tag,
                    })
                    .pipe(
                        map((updatedTag) => {
                            // Find the index of the updated tag
                            const index = tags.findIndex(
                                (item) => item.id === id
                            );

                            // Update the tag
                            tags[index] = updatedTag;

                            // Update the tags
                            this._tags.next(tags);

                            // Return the updated tag
                            return updatedTag;
                        })
                    )
            )
        );
    }

    /**
     * Delete the tag
     *
     * @param id
     */
    deleteTag(id: string): Observable<boolean> {
        return this.tags$.pipe(
            take(1),
            switchMap((tags) =>
                this._httpClient
                    .delete('api/apps/contacts/tag', { params: { id } })
                    .pipe(
                        map((isDeleted: boolean) => {
                            // Find the index of the deleted tag
                            const index = tags.findIndex(
                                (item) => item.id === id
                            );

                            // Delete the tag
                            tags.splice(index, 1);

                            // Update the tags
                            this._tags.next(tags);

                            // Return the deleted status
                            return isDeleted;
                        }),
                        filter((isDeleted) => isDeleted),
                        switchMap((isDeleted) =>
                            this.contacts$.pipe(
                                take(1),
                                map((contacts) => {
                                    // Iterate through the contacts
                                    contacts.forEach((contact) => {
                                        const tagIndex = contact.tags.findIndex(
                                            (tag) => tag === id
                                        );

                                        // If the contact has the tag, remove it
                                        if (tagIndex > -1) {
                                            contact.tags.splice(tagIndex, 1);
                                        }
                                    });

                                    // Return the deleted status
                                    return isDeleted;
                                })
                            )
                        )
                    )
            )
        );
    }

    /**
     * Update the avatar of the given contact
     *
     * @param id
     * @param avatar
     */
    uploadAvatar(id: string, avatar: File): Observable<Contact> {
        return this.contacts$.pipe(
            take(1),
            switchMap((contacts) =>
                this._httpClient
                    .post<Contact>(
                        'api/apps/contacts/avatar',
                        {
                            id,
                            avatar,
                        },
                        {
                            headers: {
                                // eslint-disable-next-line @typescript-eslint/naming-convention
                                'Content-Type': avatar.type,
                            },
                        }
                    )
                    .pipe(
                        map((updatedContact) => {
                            // Find the index of the updated contact
                            const index = contacts.findIndex(
                                (item) => item.id === id
                            );

                            // Update the contact
                            contacts[index] = updatedContact;

                            // Update the contacts
                            this._contacts.next(contacts);

                            // Return the updated contact
                            return updatedContact;
                        }),
                        switchMap((updatedContact) =>
                            this.contact$.pipe(
                                take(1),
                                filter((item) => item && item.id === id),
                                tap(() => {
                                    // Update the contact if it's selected
                                    this._contact.next(updatedContact);

                                    // Return the updated contact
                                    return updatedContact;
                                })
                            )
                        )
                    )
            )
        );
    }
}
