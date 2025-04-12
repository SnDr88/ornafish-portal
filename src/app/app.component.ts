import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';
console.log('API URL:', environment.apiUrl);
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [RouterOutlet],
})
export class AppComponent {
    /**
     * Constructor
     */
    constructor() {}
}

// in je AppComponent of een zichtbaar component
console.log('✅ Environment:', environment);
