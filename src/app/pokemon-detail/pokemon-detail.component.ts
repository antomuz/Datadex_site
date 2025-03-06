import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PokemonService } from '../services/pokemon.service';
import { NotificationService } from '../services/notification.service';

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
  name!: string;
  errorMessages: string[] = [];
  newType: string = ""; // Temporary storage for selected type
  sousEvolution: any = null; // Store fetched sous-evolution

  // Predefined lists for dropdowns
  pokemonTypes: string[] = [
    "NORMAL", "FEU", "EAU", "PLANTE", "ELECTRIK", "GLACE", "COMBAT", "POISON", 
    "SOL", "VOL", "PSY", "INSECTE", "ROCHE", "SPECTRE", "DRAGON", "TENEBRES", 
    "ACIER", "FEE"
  ];
  typeColors: { [key: string]: string } = {
    INSECTE:  "#A8B820",  // bug-green
    TENEBRES: "#705848",  // dark-brownish
    DRAGON:   "#7038F8",  // purple-blue
    ELECTRIK: "#F8D030",  // electric-yellow
    FEE:      "#EE99AC",  // fairy-pink
    COMBAT:   "#C03028",  // fighting-reddish
    FEU:      "#F08030",  // fire-orange
    VOL:      "#A890F0",  // flying-purple/blue
    SPECTRE:  "#705898",  // ghost-purple
    PLANTE:   "#78C850",  // grass-green
    SOL:      "#E0C068",  // ground-tan
    GLACE:    "#98D8D8",  // ice-cyan
    NORMAL:   "#A8A878",  // normal-grayish
    POISON:   "#A040A0",  // poison-purple
    PSY:      "#F85888",  // psychic-pink
    ROCHE:    "#B8A038",  // rock-brown
    ACIER:    "#B8B8D0",  // steel-gray
    EAU:      "#6890F0"   // water-blue
  };

  natures: string[] = [
    "RIGIDE", "SOLO", "BRAVE", "ADAMANT", "MAUVAIS", "ASSURE", "DOCILE", "RELAX", 
    "MALIN", "LACHE", "TIMIDE", "PRESSE", "SERIEUX", "JOVIAL", "NAIF", "MODESTE", 
    "DOUX", "DISCRET", "PUDIQUE", "FOUGUEUX", "CALME", "GENTIL", "MALPOLI", 
    "PRUDENT", "BIZARRE"
  ];


  attackCategories: string[] = ["PHYSIQUE", "SPECIALE", "STATUT"];

  sexes: string[] = ["MALE", "FEMELLE", "INCONNU"];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pokemonService: PokemonService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    // Detect if we are in edit mode or view mode
    const path = this.route.snapshot.routeConfig?.path || '';
    this.mode = path.includes('edit') ? 'edit' : 'view';

    // Get ID or Name from the URL
    const idParam = this.route.snapshot.paramMap.get('id');
    const nameParam = this.route.snapshot.paramMap.get('name');

    if (idParam) {
      this.id = Number(idParam);
      this.loadPokemonById(this.id);
    } else if (nameParam) {
      this.name = nameParam;
      this.loadPokemonByName(this.name);
    }
  }

  /**
   * Load Pokémon using its ID (API requires `/id/{id}`)
   */
  loadPokemonById(id: number) {
    this.pokemonService.getPokemonById(id).subscribe({
      next: data => {
        this.pokemon = data;
      },
      error: err => {
        this.notificationService.showError('Impossible de charger ce Pokémon !');
        console.error('Error loading Pokémon by ID:', err);
      }
    });
  }
  /**
   * Load Pokémon using its Name (API allows `/name/{name}`)
   */
    loadPokemonByName(name: string) {
      this.pokemonService.getPokemonByName(name).subscribe({
        next: data => {
          this.pokemon = data;
        },
        error: err => {
          this.notificationService.showError('Impossible de charger ce Pokémon !');
          console.error('Error loading Pokémon by Name:', err);
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

  addType() {
    if (!this.pokemon.types) {
      this.pokemon.types = [];
    }
  
    if (this.newType.trim() !== "" && this.pokemon.types.length < 2 && !this.pokemon.types.includes(this.newType.trim().toUpperCase())) {
      this.pokemon.types = [...this.pokemon.types, this.newType.trim().toUpperCase()]; // Trigger change detection
      this.newType = ""; // Clear selection
    }
  }

  removeType(index: number) {
    console.log("Removing type at index:", index); // Debugging log
    this.pokemon.types.splice(index, 1); // This works the same way and avoids the issue
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
          this.notificationService.showError(this.errorMessages.join('\n'));
        } else {
          this.notificationService.showError('Erreur de mise à jour !');
          console.error('Update error:', err);
        }
      }
    });
  }

  onRetour() {
    this.router.navigate(['/home']);
  }
}
