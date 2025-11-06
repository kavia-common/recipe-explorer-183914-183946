//
// Simple API client with environment-based configuration and localStorage fallback.
// Uses REACT_APP_API_BASE or REACT_APP_BACKEND_URL if present. Otherwise, mocks CRUD using localStorage.
//
// PUBLIC_INTERFACE
export class RecipeApiClient {
  /** Determine base URL from env */
  static get baseUrl() {
    const envBase = process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL || "";
    return (envBase || "").replace(/\/+$/, ""); // trim trailing slash
  }

  /** Whether we have a backend configured */
  static get hasBackend() {
    return Boolean(this.baseUrl);
  }

  /** Initialize local storage if missing */
  static initLocal() {
    if (!localStorage.getItem("recipes")) {
      const seed = [
        {
          id: "1",
          title: "Classic Margherita Pizza",
          imageUrl: "https://images.unsplash.com/photo-1548365328-9f547fb0953b",
          description: "Fresh tomatoes, mozzarella, and basil.",
          prepTime: 25,
          ingredients: ["Pizza dough", "Tomato sauce", "Mozzarella", "Basil", "Olive oil", "Salt"],
          instructions:
            "1) Preheat oven to 475°F. 2) Spread sauce, add mozzarella. 3) Bake 10-12 min. 4) Top with basil and olive oil.",
          favorite: false
        },
        {
          id: "2",
          title: "Avocado Toast",
          imageUrl: "https://images.unsplash.com/photo-1558036117-15d82a90b9b6",
          description: "Creamy avocado with a squeeze of lemon.",
          prepTime: 10,
          ingredients: ["Bread", "Avocado", "Lemon", "Salt", "Pepper", "Chili flakes"],
          instructions:
            "1) Toast bread. 2) Mash avocado with lemon, salt, and pepper. 3) Spread and top with chili flakes.",
          favorite: true
        }
      ];
      localStorage.setItem("recipes", JSON.stringify(seed));
    }
  }

  // PUBLIC_INTERFACE
  static async listRecipes(query = "") {
    if (this.hasBackend) {
      const url = query ? `${this.baseUrl}/recipes?search=${encodeURIComponent(query)}` : `${this.baseUrl}/recipes`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch recipes: ${res.status}`);
      return res.json();
    }
    this.initLocal();
    const all = JSON.parse(localStorage.getItem("recipes") || "[]");
    if (!query) return all;
    const q = query.toLowerCase();
    return all.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        (r.description || "").toLowerCase().includes(q) ||
        (r.ingredients || []).some((ing) => (ing || "").toLowerCase().includes(q))
    );
  }

  // PUBLIC_INTERFACE
  static async getRecipe(id) {
    if (this.hasBackend) {
      const res = await fetch(`${this.baseUrl}/recipes/${encodeURIComponent(id)}`);
      if (!res.ok) throw new Error(`Failed to fetch recipe: ${res.status}`);
      return res.json();
    }
    this.initLocal();
    const all = JSON.parse(localStorage.getItem("recipes") || "[]");
    return all.find((r) => r.id === id);
  }

  // PUBLIC_INTERFACE
  static async createRecipe(recipe) {
    if (this.hasBackend) {
      const res = await fetch(`${this.baseUrl}/recipes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipe)
      });
      if (!res.ok) throw new Error(`Failed to create recipe: ${res.status}`);
      return res.json();
    }
    this.initLocal();
    const all = JSON.parse(localStorage.getItem("recipes") || "[]");
    const newItem = { ...recipe, id: String(Date.now()), favorite: false };
    all.push(newItem);
    localStorage.setItem("recipes", JSON.stringify(all));
    return newItem;
  }

  // PUBLIC_INTERFACE
  static async updateRecipe(id, patch) {
    if (this.hasBackend) {
      const res = await fetch(`${this.baseUrl}/recipes/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch)
      });
      if (!res.ok) throw new Error(`Failed to update recipe: ${res.status}`);
      return res.json();
    }
    this.initLocal();
    const all = JSON.parse(localStorage.getItem("recipes") || "[]");
    const idx = all.findIndex((r) => r.id === id);
    if (idx !== -1) {
      all[idx] = { ...all[idx], ...patch };
      localStorage.setItem("recipes", JSON.stringify(all));
      return all[idx];
    }
    throw new Error("Recipe not found");
  }

  // PUBLIC_INTERFACE
  static async toggleFavorite(id) {
    if (this.hasBackend) {
      // Assuming PATCH favorite toggle, otherwise consumers can call updateRecipe
      const res = await fetch(`${this.baseUrl}/recipes/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toggleFavorite: true })
      });
      if (!res.ok) throw new Error(`Failed to toggle favorite: ${res.status}`);
      return res.json();
    }
    const recipe = await this.getRecipe(id);
    if (!recipe) throw new Error("Recipe not found");
    return this.updateRecipe(id, { favorite: !recipe.favorite });
  }
}
