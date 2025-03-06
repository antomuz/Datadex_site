import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Login</h2>
    <div>
      <label for="username">Nom d'utilisateur:</label>
      <input id="username" [(ngModel)]="username" name="username" type="text" />
    </div>
    <div>
      <label for="password">Mot de passe:</label>
      <input id="password" [(ngModel)]="password" name="password" type="password" />
    </div>
    <button (click)="onLogin()">Login</button>

    <p>{{ message }}</p>
  `,
})
export class LoginComponent {
  username = '';
  password = '';
  message = '';

  constructor(
    private authService: AuthService, 
    private router: Router,
    private notificationService: NotificationService
  ) {}

  onLogin() {
    this.authService.login(this.username, this.password).subscribe({
      next: (res) => {
        // If the server accepts the credentials, handle success
        this.message = 'Login successful!';
        localStorage.setItem('username', this.username);
        localStorage.setItem('password', this.password);
        console.log('Response from /api/users:', res);

        const match = res.match(/\[(.+)\]/); 

        if (match && match[1]) {
          const role = match[1];  // e.g. "ADMIN"
          // Store in localStorage
          localStorage.setItem('Role', role);
        }

        this.router.navigate(['/home']);
      },
      error: (err) => {
        // If 401 unauthorized, or some other error, handle it
        this.message = 'Login failed!';
        this.notificationService.showError('Échec de la connexion : ' + err.message);
        console.error(err);
      }
    });
  }
}
