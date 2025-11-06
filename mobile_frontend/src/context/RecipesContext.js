import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { RecipeApiClient } from "../api/client";

// PUBLIC_INTERFACE
export const RecipesContext = createContext(null);

// PUBLIC_INTERFACE
export function useRecipes() {
  const ctx = useContext(RecipesContext);
  if (!ctx) throw new Error("useRecipes must be used within RecipesProvider");
  return ctx;
}

/**
 * RecipesProvider manages:
 * - recipe listing cache for current query
 * - favorites toggling
 * - add recipe flow in local fallback mode
 */
export function RecipesProvider({ children }) {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const hasBackend = RecipeApiClient.hasBackend;

  const refresh = async (q = query) => {
    setLoading(true);
    setErr(null);
    try {
      const data = await RecipeApiClient.listRecipes(q);
      setRecipes(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e?.message || "Failed to load recipes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({
      query,
      setQuery,
      recipes,
      loading,
      err,
      hasBackend,
      refresh,
      // PUBLIC_INTERFACE
      async toggleFavorite(id) {
        await RecipeApiClient.toggleFavorite(id);
        await refresh(query);
      },
      // PUBLIC_INTERFACE
      async addRecipe(payload) {
        await RecipeApiClient.createRecipe(payload);
        await refresh(query);
      }
    }),
    [query, recipes, loading, err, hasBackend]
  );

  return <RecipesContext.Provider value={value}>{children}</RecipesContext.Provider>;
}
