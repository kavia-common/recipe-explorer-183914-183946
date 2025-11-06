import React from "react";
import { Link } from "react-router-dom";
import { useRecipes } from "../context/RecipesContext";

/** A single recipe card */
export default function RecipeCard({ recipe }) {
  const { toggleFavorite } = useRecipes();
  const onFav = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleFavorite(recipe.id);
  };

  return (
    <Link to={`/recipe/${encodeURIComponent(recipe.id)}`} className="card" role="listitem" aria-label={`Open ${recipe.title}`}>
      <img
        src={recipe.imageUrl || "https://via.placeholder.com/96?text=🍽"}
        alt={recipe.imageUrl ? `${recipe.title} image` : "Placeholder recipe image"}
      />
      <div className="card-content">
        <div className="card-title">
          <h3 title={recipe.title}>{recipe.title}</h3>
          <button className="icon-btn" aria-pressed={!!recipe.favorite} aria-label="Toggle favorite" onClick={onFav}>
            {recipe.favorite ? "★" : "☆"}
          </button>
        </div>
        {recipe.description ? <p className="card-desc">{recipe.description}</p> : <p className="card-desc">No description</p>}
        <div className="meta">⏱ {recipe.prepTime || 0} min</div>
      </div>
    </Link>
  );
}
