import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { User } from './users.types'; // jouw user interface

@Injectable({ providedIn: 'root' })
export class UsersService {
    constructor(private _httpClient: HttpClient) {}

    getUsersByCompanyId(companyId: string): Observable<User[]> {
        return this._httpClient.get<any[]>(`/api/users/company/${companyId}`).pipe(
            map(users =>
                users.map(user => ({
                    id: user.id,
                    email: user.email,
                    phone: user.phone,
                    roleId: user.role_id,
                    companyId: user.company_id,
                    firstName: user.first_name || '', // 👈 veilig mappen
                    lastName: user.last_name || '',   // 👈 veilig mappen
                }))
            )
        );
    }

    createUser(user: Partial<User>): Observable<any> {
        return this._httpClient.post('/api/users', user);
    }

    updateUser(user: Partial<User>): Observable<any> {
        return this._httpClient.put(`/api/users/${user.id}`, user); // PUT endpoint moet je nog maken
    }

    deleteUser(userId: string): Observable<any> {
        return this._httpClient.delete(`/api/users/${userId}`);
    }
}