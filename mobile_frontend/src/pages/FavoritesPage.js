import React from "react";
import { useRecipes } from "../context/RecipesContext";
import RecipeList from "../components/RecipeList";

/** FavoritesPage shows only recipes marked as favorite */
export default function FavoritesPage() {
  const { recipes, loading, err } = useRecipes();
  const favs = (recipes || []).filter((r) => r.favorite);

  return (
    <>
      <header className="header">
        <h1 className="header-title">Favorites</h1>
      </header>
      <main className="container" role="main">
        {loading && <div className="empty">Loading…</div>}
        {err && <div className="empty" role="alert">{err}</div>}
        {!loading && !err && favs.length === 0 && <div className="empty">No favorites yet.</div>}
        {!loading && !err && favs.length > 0 && <RecipeList items={favs} />}
      </main>
    </>
  );
}
