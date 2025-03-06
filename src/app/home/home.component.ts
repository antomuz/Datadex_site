import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PokemonService } from '../services/pokemon.service';
import { NotificationService } from '../services/notification.service';

declare var bootstrap: any; // Required for Bootstrap modal support

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  isAdmin = localStorage.getItem('Role') == "ADMIN";
  isLoggedIn = false;
  pokemons: any[] = [];
  currentUser: string | null = null;  // null if not logged in
  newPokemon: any = {};
  newType: string = ""; // This holds the user input for a new type

  // Predefined lists for dropdowns
  pokemonTypes: string[] = [
    "NORMAL", "FEU", "EAU", "PLANTE", "ELECTRIK", "GLACE", "COMBAT", "POISON", 
    "SOL", "VOL", "PSY", "INSECTE", "ROCHE", "SPECTRE", "DRAGON", "TENEBRES", 
    "ACIER", "FEE"
  ];

  natures: string[] = [
    "RIGIDE", "SOLO", "BRAVE", "ADAMANT", "MAUVAIS", "ASSURE", "DOCILE", "RELAX", 
    "MALIN", "LACHE", "TIMIDE", "PRESSE", "SERIEUX", "JOVIAL", "NAIF", "MODESTE", 
    "DOUX", "DISCRET", "PUDIQUE", "FOUGUEUX", "CALME", "GENTIL", "MALPOLI", 
    "PRUDENT", "BIZARRE"
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


  attackCategories: string[] = ["PHYSIQUE", "SPECIALE", "STATUT"];

  sexes: string[] = ["MALE", "FEMELLE", "INCONNU"];


  constructor(
    private pokemonService: PokemonService,
    private notificationService: NotificationService
  ) {}

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

    this.loadPokemons();
  }

  loadPokemons() {
    this.pokemonService.getAllPokemons().subscribe({
      next: (data: any[]) => {
        this.pokemons = data.sort((a, b) => 
          a['identifiant unique'] - b['identifiant unique']
        );
      },
      error: (err) => {
        this.notificationService.showError('Échec du chargement des Pokémon !');
        console.error('Error fetching pokemons:', err);
      }
    });
  }
  
  onAddPokemon() {
    this.newPokemon = {
      nom: "",
      image: "",
      types: [],
      region_origine: "",
      evolution: "",
      nature: "",
      sexe: "",
      niveau: 1,
      points_de_vie: 1,
      vitesse: 1,
      attaque: 1,
      attaque_special: 1,
      defense: 1,
      defense_special: 1,
      capacites: [] // Initialize empty array for capacities
    };
    this.newType = ""; // Reset type input field
    const modal = new bootstrap.Modal(document.getElementById('addPokemonModal'));
    modal.show();
  }

  // Handle adding a new type
  addType() {
    if (this.newType.trim() !== "" && !this.newPokemon.types.includes(this.newType.trim().toUpperCase())) {
      this.newPokemon.types.push(this.newType.trim().toUpperCase()); // Store types in uppercase
      this.newType = ""; // Clear input after adding
    }
  }

  // Handle removing a type
  removeType(index: number) {
    this.newPokemon.types.splice(index, 1);
  }

  addCapacite() {
    this.newPokemon.capacites.push({
      nom: "",
      type_attaque: "",
      description: "",
      pouvoir: 1,
      total_utilisation: 5,
      precision: 1,
      categorie_attaque: "",
      effet_secondaire: ""
    });
  }

  saveNewPokemon() {
    const user = localStorage.getItem('username');
    const pwd = localStorage.getItem('password');
  
    if (!user || !pwd) {
      alert("Vous devez être connecté pour ajouter un Pokémon.");
      return;
    }
  
    this.pokemonService.addPokemon(this.newPokemon, user, pwd).subscribe({
      next: () => {
        alert('Pokémon ajouté avec succès !');
        this.loadPokemons(); 
        const modal = bootstrap.Modal.getInstance(document.getElementById('addPokemonModal'));
        modal.hide();
      },
      error: (err) => {
        console.error('Error adding Pokémon:', err);
  
        // If the backend returns an array of validation messages:
        if (Array.isArray(err.error)) {
          // For each message in the array, show a separate error notification
          err.error.forEach((msg: string) => {
            this.notificationService.showError(msg);
          });
        } else {
          // Fallback if it's not an array
          this.notificationService.showError('Erreur lors de l\'ajout du Pokémon : ' + err.message);
        }
      }
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
    return (this.currentUser !== null && pokemon.createur === this.currentUser) || this.isAdmin;
  }

  removeCapacite(index: number) {
    if (this.newPokemon.capacites.length > 1) {
      this.newPokemon.capacites.splice(index, 1);
    } else {
      alert("Un Pokémon doit avoir au moins une capacité.");
    }
  }

  onDeletePokemon(id: number) {
    if (confirm('Voulez-vous vraiment supprimer ce Pokémon ?')) {
      this.pokemonService.deletePokemon(id).subscribe({
        next: (res) => {
          alert('Pokémon supprimé avec succès.');
          // Re-fetch or update local array
          this.loadPokemons();
        },
        error: (err) => {
          alert('Erreur lors de la suppression du Pokémon : ' + err.message);
          console.error(err);
        }
      });
    }
  }
}
