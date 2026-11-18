import { useState, useEffect } from "react";
import { API } from "../config";

function Dashboard() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch(API + "/books")
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch(() => alert("Could not load books"));
  }, []);

  const lowStockCount = books.filter((b) => b.quantity < 2).length;

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Total books: {books.length}</p>
      <p>Low stock books (fewer than 2 copies): {lowStockCount}</p>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Genre</th>
            <th>In Stock</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id} className={book.quantity < 2 ? "low-stock" : ""}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.genre}</td>
              <td>
                {book.quantity} {book.quantity < 2 && <strong>(Low stock!)</strong>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
