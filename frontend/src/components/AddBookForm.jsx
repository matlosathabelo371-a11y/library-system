import { useState } from "react";

// Controlled form for adding a new book
function AddBookForm({ onAdd }) {
  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    isbn: "",
    quantity: "",
  });
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    // validation
    if (form.title.trim() === "" || form.author.trim() === "") {
      setError("Title and author are required");
      return;
    }
    if (form.isbn.trim().length < 10) {
      setError("ISBN must be at least 10 characters");
      return;
    }
    if (form.quantity === "" || Number(form.quantity) < 0) {
      setError("Initial quantity must be 0 or more");
      return;
    }

    setError("");
    onAdd(form);
    setForm({ title: "", author: "", genre: "", isbn: "", quantity: "" });
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <h3>Add New Book</h3>
      {error && <p className="error">{error}</p>}
      <input name="title" placeholder="Title" value={form.title} onChange={handleChange} />
      <input name="author" placeholder="Author" value={form.author} onChange={handleChange} />
      <input name="genre" placeholder="Genre" value={form.genre} onChange={handleChange} />
      <input name="isbn" placeholder="ISBN" value={form.isbn} onChange={handleChange} />
      <input name="quantity" type="number" placeholder="Initial Quantity" value={form.quantity} onChange={handleChange} />
      <button type="submit">Add Book</button>
    </form>
  );
}

export default AddBookForm;
