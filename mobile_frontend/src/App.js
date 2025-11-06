import React from "react";
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import "./styles.css";
import { RecipesProvider } from "./context/RecipesContext";
import HomePage from "./pages/HomePage";
import FavoritesPage from "./pages/FavoritesPage";
import AddRecipePage from "./pages/AddRecipePage";
import RecipeDetailPage from "./pages/RecipeDetailPage";

/**
 * Root App with routing and provider.
 * Ensures the application is navigable and accessible on mobile web.
 */
function AppShell() {
  const location = useLocation();
  const current = location.pathname;

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/add" element={<AddRecipePage />} />
        <Route path="/recipe/:id" element={<RecipeDetailPage />} />
      </Routes>

      <nav className="tabs" aria-label="Bottom navigation">
        <TabLink to="/" label="Browse" active={current === "/"} />
        <TabLink to="/favorites" label="Favorites" active={current === "/favorites"} />
        <TabLink to="/add" label="Add Recipe" active={current === "/add"} />
      </nav>
    </div>
  );
}

function TabLink({ to, label, active }) {
  return (
    <Link className={`tab ${active ? "active" : ""}`} to={to} aria-current={active ? "page" : undefined} aria-label={label}>
      {label}
    </Link>
  );
}

// PUBLIC_INTERFACE
function App() {
  return (
    <RecipesProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </RecipesProvider>
  );
}

export default App;
