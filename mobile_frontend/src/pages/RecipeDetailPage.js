import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RecipeApiClient } from "../api/client";
import { useRecipes } from "../context/RecipesContext";

/** RecipeDetailPage shows a single recipe details with ingredients and instructions */
export default function RecipeDetailPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const { toggleFavorite } = useRecipes();
  const [loading, setLoading] = useState(true);
  const [recipe, setRecipe] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const data = await RecipeApiClient.getRecipe(id);
        if (mounted) setRecipe(data);
      } catch (e) {
        setErr(e?.message || "Failed to load recipe");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  const onToggleFav = async () => {
    if (!recipe) return;
    await toggleFavorite(recipe.id);
    const updated = await RecipeApiClient.getRecipe(id);
    setRecipe(updated);
  };

  if (loading) {
    return (
      <>
        <header className="header">
          <h1 className="header-title">Loading…</h1>
        </header>
        <main className="container" />
      </>
    );
  }

  if (err || !recipe) {
    return (
      <>
        <header className="header">
          <h1 className="header-title">Recipe</h1>
        </header>
        <main className="container">
          <div className="empty" role="alert">{err || "Recipe not found"}</div>
        </main>
      </>
    );
  }

  return (
    <>
      <header className="header">
        <h1 className="header-title">{recipe.title}</h1>
      </header>
      <main className="container">
        {recipe.imageUrl ? (
          <img
            src={recipe.imageUrl}
            alt={`${recipe.title} image`}
            style={{ width: "100%", maxHeight: 240, objectFit: "cover", borderRadius: 12, border: "1px solid var(--border)" }}
          />
        ) : null}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
          <span className="meta">⏱ {recipe.prepTime || 0} min</span>
          <button className="icon-btn" aria-pressed={!!recipe.favorite} aria-label="Toggle favorite" onClick={onToggleFav}>
            {recipe.favorite ? "★" : "☆"}
          </button>
          <button className="icon-btn" aria-label="Back" onClick={() => nav(-1)}>←</button>
        </div>

        {recipe.description ? <p style={{ color: "var(--muted)" }}>{recipe.description}</p> : null}

        <section style={{ marginTop: 16 }}>
          <h3>Ingredients</h3>
          <ul>
            {(recipe.ingredients || []).map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>
        </section>

        <section style={{ marginTop: 16 }}>
          <h3>Instructions</h3>
          <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{recipe.instructions || ""}</p>
        </section>
      </main>
    </>
  );
}
