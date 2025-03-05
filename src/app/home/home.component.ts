import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PokemonService } from '../services/pokemon.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  isLoggedIn = false;
  pokemons: any[] = [];
  currentUser: string | null = null;  // null if not logged in

  constructor(private pokemonService: PokemonService) {}

  ngOnInit() {
    // Check localStorage for username & password
    const user = localStorage.getItem('username');
    const pwd = localStorage.getItem('password');

    this.isLoggedIn = !!user && !!pwd;
    // '!!' just converts a string or null to a boolean

    if (!!user) {
      // Attempt to read the username from localStorage
      this.currentUser = user;
    }

    this.pokemonService.getAllPokemons().subscribe({
      next: (data: any[]) => {
        // Sort by "identifiant unique" ascending
        this.pokemons = data.sort((a, b) =>
          a['identifiant unique'] - b['identifiant unique']
        );
      },
      error: (err) => console.error('Error fetching pokemons: ', err),
    });
  }

  onDisconnect() {
    // Clear localStorage
    localStorage.removeItem('username');
    localStorage.removeItem('password');

    // Update the isLoggedIn state
    this.isLoggedIn = false;
  }

  // A small helper to check if the current user created a given pokemon
  isCreator(pokemon: any): boolean {
    return this.currentUser !== null && pokemon.createur === this.currentUser;
  }
}
