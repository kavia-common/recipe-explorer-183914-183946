import React from "react";
import RecipeCard from "./RecipeCard";

/** Renders a grid of recipe cards */
export default function RecipeList({ items }) {
  if (!items || items.length === 0) {
    return <div className="empty">No recipes found.</div>;
  }
  return (
    <div className="grid" role="list">
      {items.map((r) => (
        <RecipeCard key={r.id} recipe={r} />
      ))}
    </div>
  );
}
