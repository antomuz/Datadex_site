import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationComponent } from './notification/notification.component'; // <-- adjust path

@Component({
  selector: 'app-root',
  standalone: true,
  // Add NotificationComponent to 'imports' so Angular recognizes it
  imports: [RouterOutlet, NotificationComponent],
  template: `
    <router-outlet></router-outlet>
    <!-- Now the NotificationComponent is used in the template -->
    <app-notification></app-notification>
  `,
})
export class AppComponent {
  title = 'DataDex';
}
