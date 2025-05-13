import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Destination } from './destinations.types';

@Injectable({ providedIn: 'root' })
export class DestinationsService {
    private _mockDestinations: Destination[] = [
        {
            iata: 'AMS',
            city: 'Amsterdam',
            country: 'Netherlands',
            airportName: 'Schiphol Airport',
            carrier: 'KLM',
            flights: 45
        },
        {
            iata: 'NRT',
            city: 'Tokyo',
            country: 'Japan',
            airportName: 'Narita International',
            carrier: 'ANA',
            flights: 60
        }
    ];

    getDestinations(): Observable<Destination[]> {
        return of(this._mockDestinations);
    }
}
