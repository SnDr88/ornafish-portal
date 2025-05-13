export interface Contact {
    id?: string;
    avatar?: string | null;
    background?: string | null;
    type: string;
    agentId?: string;
    agentName?: string;
    businessRegNr?: string;
    customerNr?: string;
    commission?: number;
    defaultCommission?: number;
    currency?: string;
    defaultAirport?: string;
    website?: string;
    billingCountry?: string;
    discount?: number;
    emails?: {
        email: string;
        label: string;
    }[];
    phoneNumbers?: {
        country: string;
        phoneNumber: string;
        label: string;
    }[];
    company?: string;
    legal_representative?: string;
    addresses?: {
        label: string;
        address: string;
        zip: string;
        city: string;
        country: string;
        longitude: string;
        latitude: string;
        show_on_locator_map?: boolean;
    }[];
    notes?: string | null;
    tags: string[];
    users?: User[];
    active?: boolean;
}

export interface Country {
    id: string;
    iso: string;
    name: string;
    code: string;
    flagImagePos: string;
}

export interface Tag {
    id?: string;
    title?: string;
}

export interface User {
    id?: string;          // Optional bij nieuwe users
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;       // Optioneel
    password?: string;    // Alleen bij aanmaken nodig
    roleId: number;       // Bijvoorbeeld 3 = Contactpersoon
    companyId: string;    // Koppeling naar bedrijf
}