import { Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'destinations',
    template: `<router-outlet></router-outlet>`,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterOutlet], // <== DIT toevoegen
    standalone: true,        // <== Als dit een standalone component is
})
export class DestinationsComponent {}