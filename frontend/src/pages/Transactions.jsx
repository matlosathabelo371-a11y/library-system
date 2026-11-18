import { useState, useEffect } from "react";
import { API } from "../config";

function Transactions({ user }) {
  const [books, setBooks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ book_id: "", type: "add", quantity: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function loadData() {
    fetch(API + "/books")
      .then((res) => res.json())
      .then((data) => setBooks(data));

    fetch(API + "/transactions")
      .then((res) => res.json())
      .then((data) => setTransactions(data));
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    // validation
    if (form.book_id === "") {
      setError("Please choose a book");
      return;
    }
    if (form.quantity === "" || Number(form.quantity) <= 0) {
      setError("Quantity must be more than 0");
      return;
    }
    setError("");

    fetch(API + "/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, user_id: user.id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setMessage(data.message);
          setForm({ book_id: "", type: "add", quantity: "" });
          loadData();
        }
      });
  }

  if (!user) {
    return <p>Please login on the Users page to record transactions.</p>;
  }

  return (
    <div>
      <h2>Transactions</h2>

      <form onSubmit={handleSubmit} className="form">
        <h3>Add / Deduct Stock</h3>
        {error && <p className="error">{error}</p>}
        {message && <p className="message">{message}</p>}

        <select name="book_id" value={form.book_id} onChange={handleChange}>
          <option value="">-- Select a book --</option>
          {books.map((book) => (
            <option key={book.id} value={book.id}>
              {book.title} (in stock: {book.quantity})
            </option>
          ))}
        </select>

        <select name="type" value={form.type} onChange={handleChange}>
          <option value="add">Add stock (new books arrived)</option>
          <option value="deduct">Deduct stock (book borrowed)</option>
        </select>

        <input name="quantity" type="number" placeholder="Quantity" value={form.quantity} onChange={handleChange} />
        <button type="submit">Save Transaction</button>
      </form>

      <h3>Transaction History</h3>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Book</th>
            <th>Type</th>
            <th>Quantity</th>
            <th>User</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td>{new Date(t.created_at).toLocaleString()}</td>
              <td>{t.book_title}</td>
              <td>{t.type === "add" ? "Added" : "Borrowed"}</td>
              <td>{t.quantity}</td>
              <td>{t.user_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Transactions;
