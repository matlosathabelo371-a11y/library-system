import { useState, useEffect } from "react";
import { API } from "../config";
import AddBookForm from "../components/AddBookForm";
import BookList from "../components/BookList";

function Books({ user }) {
  const [books, setBooks] = useState([]);
  const [message, setMessage] = useState("");

  function loadBooks() {
    fetch(API + "/books")
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch(() => setMessage("Could not load books"));
  }

  useEffect(() => {
    loadBooks();
  }, []);

  function addBook(book) {
    fetch(API + "/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(book),
    })
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.error || data.message);
        loadBooks();
      });
  }

  function updateBook(id, book) {
    fetch(API + "/books/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(book),
    })
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.error || data.message);
        loadBooks();
      });
  }

  function deleteBook(id) {
    if (!window.confirm("Are you sure you want to delete this book?")) {
      return;
    }
    fetch(API + "/books/" + id, { method: "DELETE" })
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.error || data.message);
        loadBooks();
      });
  }

  if (!user) {
    return <p>Please login on the Users page to manage books.</p>;
  }

  return (
    <div>
      <h2>Book Management</h2>
      {message && <p className="message">{message}</p>}
      <AddBookForm onAdd={addBook} />
      <BookList books={books} onUpdate={updateBook} onDelete={deleteBook} />
    </div>
  );
}

export default Books;
