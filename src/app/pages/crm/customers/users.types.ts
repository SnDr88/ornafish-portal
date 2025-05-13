export interface User {
    id?: string;          // Optional bij nieuwe users
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;       // Optioneel
    password?: string;    // Alleen bij aanmaken nodig
    roleId: number;       // Bijvoorbeeld 3 = Contactpersoon
    companyId: string;    // Koppeling naar bedrijf
}