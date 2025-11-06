import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecipes } from "../context/RecipesContext";

/** AddRecipePage provides a form to create a new recipe */
export default function AddRecipePage() {
  const { addRecipe } = useRecipes();
  const nav = useNavigate();
  const [form, setForm] = useState({
    title: "",
    imageUrl: "",
    description: "",
    prepTime: "",
    ingredients: "",
    instructions: ""
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  const update = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    try {
      const payload = {
        title: form.title.trim(),
        imageUrl: form.imageUrl.trim(),
        description: form.description.trim(),
        prepTime: Number(form.prepTime) || 0,
        ingredients: form.ingredients
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        instructions: form.instructions
      };
      if (!payload.title) throw new Error("Title is required");
      await addRecipe(payload);
      nav("/");
    } catch (ex) {
      setErr(ex?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <header className="header">
        <h1 className="header-title">Add Recipe</h1>
      </header>
      <main className="form">
        {err && <div className="empty" role="alert">{err}</div>}
        <form onSubmit={onSubmit}>
          <div style={{ display: "grid", gap: 8 }}>
            <label htmlFor="title">Title</label>
            <input id="title" name="title" value={form.title} onChange={update} placeholder="e.g., Pancakes" required />
          </div>

          <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
            <label htmlFor="imageUrl">Image URL</label>
            <input id="imageUrl" name="imageUrl" value={form.imageUrl} onChange={update} placeholder="https://…" />
          </div>

          <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
            <label htmlFor="description">Short Description</label>
            <input id="description" name="description" value={form.description} onChange={update} placeholder="A quick tasty dish" />
          </div>

          <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
            <label htmlFor="prepTime">Prep time (minutes)</label>
            <input id="prepTime" name="prepTime" type="number" inputMode="numeric" value={form.prepTime} onChange={update} placeholder="15" />
          </div>

          <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
            <label htmlFor="ingredients">Ingredients (one per line)</label>
            <textarea id="ingredients" name="ingredients" value={form.ingredients} onChange={update} placeholder={"Eggs\nFlour\nMilk"} />
          </div>

          <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
            <label htmlFor="instructions">Instructions</label>
            <textarea id="instructions" name="instructions" value={form.instructions} onChange={update} placeholder="Write the steps…" />
          </div>

          <div style={{ marginTop: 16, display: "grid", gap: 8 }}>
            <button className="btn-primary" type="submit" disabled={saving} aria-label="Save recipe">
              {saving ? "Saving…" : "Save Recipe"}
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
