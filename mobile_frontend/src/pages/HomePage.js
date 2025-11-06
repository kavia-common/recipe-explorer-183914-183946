import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRecipes } from "../context/RecipesContext";
import RecipeList from "../components/RecipeList";

/**
 * HomePage shows header, search, and full recipe list.
 * Debounce search to reduce re-renders and network calls.
 */
export default function HomePage() {
  const { query, setQuery, refresh, recipes, loading, err } = useRecipes();
  const [input, setInput] = useState(query || "");
  const timer = useRef(null);

  useEffect(() => {
    setInput(query || "");
  }, [query]);

  const onChange = (e) => {
    setInput(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setQuery(input);
    refresh(input);
  };

  // Debounce change
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setQuery(input);
      refresh(input);
    }, 350);
    return () => clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  return (
    <>
      <header className="header">
        <h1 className="header-title" aria-label="App title">Recipe Explorer</h1>
        <form className="search" role="search" aria-label="Search recipes" onSubmit={onSubmit}>
          <input
            value={input}
            onChange={onChange}
            placeholder="Search by name or ingredient"
            aria-label="Search input"
          />
          <button type="submit" aria-label="Search">Search</button>
        </form>
      </header>

      <main className="container" role="main">
        {loading && <div className="empty">Loading…</div>}
        {err && <div className="empty" role="alert">{err}</div>}
        {!loading && !err && <RecipeList items={recipes} />}
      </main>
    </>
  );
}
