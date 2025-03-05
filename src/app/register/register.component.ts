import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Register</h2>
    <div>
      <label for="username">Nom d'utilisateur:</label>
      <input id="username" [(ngModel)]="username" type="text" />
    </div>
    <div>
      <label for="password">Mot de passe:</label>
      <input id="password" [(ngModel)]="password" type="password" />
    </div>
    <div>
      <label for="roles">Roles:</label>
      <input id="roles" [(ngModel)]="roles" type="text" />
    </div>
    <button (click)="onRegister()">Register</button>

    <p>{{ message }}</p>
  `,
})
export class RegisterComponent {
  username = '';
  password = '';
  roles = 'USER'; // or 'ADMIN'
  message = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    const userData = {
      user: this.username,
      password: this.password,
      id: 'OK',
      roles: this.roles,
    };

    this.authService.register(userData).subscribe({
      next: (response) => {
        localStorage.setItem('username', userData.user);
        localStorage.setItem('password', userData.password);
        this.message = 'Registration successful! ' + JSON.stringify(response);

        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.message = 'Registration error!';
        console.error(err);
      },
    });
  }
}
