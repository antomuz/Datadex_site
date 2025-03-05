import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <!-- The root component just displays whichever route we navigate to -->
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  // Add the 'title' property here
  title = 'DataDex';
}
