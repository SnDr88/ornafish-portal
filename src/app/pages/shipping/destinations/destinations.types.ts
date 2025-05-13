export interface Destination {
    id?: string;
    iata: string;
    city: string;
    country: string;
    airportName: string;
    carrier: string;
    flights: number; // tijdelijk mock-data
}