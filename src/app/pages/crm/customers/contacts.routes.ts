import { inject } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Router,
    RouterStateSnapshot,
    Routes,
} from '@angular/router';
import { ContactsComponent } from 'app/pages/crm/customers/contacts.component';
import { ContactsService } from 'app/pages/crm/customers/contacts.service';
import { ContactsDetailsComponent } from 'app/pages/crm/customers/details/details.component';
import { ContactsListComponent } from 'app/pages/crm/customers/list/list.component';
import { catchError, throwError, of } from 'rxjs';

/**
 * Contact resolver
 *
 * @param route
 * @param state
 */
const contactResolver = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const contactsService = inject(ContactsService);
    const id = route.paramMap.get('id');

    const isValidUUID =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

    if (!isValidUUID) {
        console.warn('⛔ Ongeldig UUID-formaat:', id);
        return throwError(() => new Error('Invalid contact ID format'));
    }

    return contactsService.getContactById(id).pipe(
        catchError((error) => {
            console.warn(`ℹ️ Contact met id ${id} niet gevonden, nieuw contact wordt aangemaakt`);
            contactsService.setEmptyContactWithId(id); // deze functie voeg je toe aan je service
            return of(null); // laat de route toch doorgaan
        })
    );
};

/**
 * Can deactivate contacts details
 *
 * @param component
 * @param currentRoute
 * @param currentState
 * @param nextState
 */
const canDeactivateContactsDetails = (
    component: ContactsDetailsComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
) => {
    // Get the next route
    let nextRoute: ActivatedRouteSnapshot = nextState.root;
    while (nextRoute.firstChild) {
        nextRoute = nextRoute.firstChild;
    }

    // If the next state doesn't contain '/contacts'
    // it means we are navigating away from the
    // contacts app
    if (!nextState.url.includes('/contacts')) {
        // Let it navigate
        return true;
    }

    // If we are navigating to another contact...
    if (nextRoute.paramMap.get('id')) {
        // Just navigate
        return true;
    }

    // Otherwise, close the drawer first, and then navigate
    return component.closeDrawer().then(() => true);
};

export default [
    {
        path: '',
        component: ContactsComponent,
        resolve: {
            tags: () => inject(ContactsService).getTags(),
        },
        children: [
            {
                path: '',
                component: ContactsListComponent,
                resolve: {
                    contacts: () => inject(ContactsService).getContacts(),
                    countries: () => inject(ContactsService).getCountries(),
                },
                children: [
                    {
                        path: ':id',
                        component: ContactsDetailsComponent,
                        resolve: {
                            contact: contactResolver,
                            countries: () =>
                                inject(ContactsService).getCountries(),
                        },
                        canDeactivate: [canDeactivateContactsDetails],
                    },
                ],
            },
        ],
    },
] as Routes;
