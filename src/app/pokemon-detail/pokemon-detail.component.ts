import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PokemonService } from '../services/pokemon.service';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.css'], 
})
export class PokemonDetailComponent implements OnInit {
  pokemon: any = null;
  mode: 'view' | 'edit' = 'view';
  id!: number;
  errorMessages: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pokemonService: PokemonService
  ) {}

  ngOnInit(): void {
    // Retrieve the ID from the route
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    // Determine mode from the route path:
    // If the path starts with 'pokemon/edit', we are in edit mode; else, view mode.
    const path = this.route.snapshot.routeConfig?.path || '';
    if (path.indexOf('edit') !== -1) {
      this.mode = 'edit';
    } else {
      this.mode = 'view';
    }
    this.loadPokemon();
  }

  loadPokemon() {
    this.pokemonService.getPokemonById(this.id).subscribe({
      next: data => {
        this.pokemon = data;
      },
      error: err => {
        console.error('Error loading pokemon:', err);
      }
    });
  }

  deleteCapacite(index: number) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette capacité ?")) {
      this.pokemon.capacites.splice(index, 1);
    }
  }
  
  addCapacite() {
    this.pokemon.capacites.push({
      nom: "",
      type_attaque: "",
      description: "",
      pouvoir: 0,
      total_utilisation: 0,
      precision: 0,
      categorie_attaque: "",
      effet_secondaire: ""
    });
  }

  onSave() {
    // Call the update API with the modified pokemon data
    this.pokemonService.updatePokemon(this.pokemon).subscribe({
      next: data => {
        // On success, navigate back to the home page
        this.router.navigate(['/home']);
      },
      error: err => {
        // If the error response is a JSON array, use it to display an error popup.
        if (Array.isArray(err.error)) {
          this.errorMessages = err.error;
          alert(this.errorMessages.join('\n'));
        } else {
          console.error('Update error:', err);
        }
      }
    });
  }

  onRetour() {
    this.router.navigate(['/home']);
  }
}
