import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  private user = localStorage.getItem('username');
  private pwd = localStorage.getItem('password');

  getAllPokemons(): Observable<any> {
    var pokemonList = this.http.get<any>(`${this.baseUrl}/pokemons`);
    return pokemonList;
  }
  
  getPokemonById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/pokemons/${id}`);
  }

  updatePokemon(pokemon: any): Observable<any> {
    // Create the Base64-encoded Basic Auth token
    const authToken = btoa(`${this.user}:${this.pwd}`);

    // Construct the headers
    const headers = new HttpHeaders({
      Authorization: `Basic ${authToken}`
    });

    // Remove the "identifiant unique" property before sending the update.
    // This creates a new object "pokemonWithoutId" that contains all properties except "identifiant unique".
    const { ["identifiant unique"]: removed, ...pokemonWithoutId } = pokemon;

    return this.http.put<any>(`${this.baseUrl}/pokemons`, pokemonWithoutId, { headers });
  }
}
