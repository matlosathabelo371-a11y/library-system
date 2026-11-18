import { useState } from "react";

// Shows all books. Each row can be edited with the Update button.
function BookList({ books, onUpdate, onDelete }) {
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [error, setError] = useState("");

  function startEdit(book) {
    setEditId(book.id);
    setEditData(book);
    setError("");
  }

  function handleChange(e) {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  }

  function handleSave() {
    // validation
    if (editData.title.trim() === "" || editData.author.trim() === "") {
      setError("Title and author cannot be empty");
      return;
    }
    if (editData.quantity === "" || Number(editData.quantity) < 0) {
      setError("Quantity must be 0 or more");
      return;
    }
    onUpdate(editId, editData);
    setEditId(null);
  }

  return (
    <div>
      {error && <p className="error">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Genre</th>
            <th>ISBN</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) =>
            editId === book.id ? (
              <tr key={book.id}>
                <td><input name="title" value={editData.title} onChange={handleChange} /></td>
                <td><input name="author" value={editData.author} onChange={handleChange} /></td>
                <td><input name="genre" value={editData.genre || ""} onChange={handleChange} /></td>
                <td><input name="isbn" value={editData.isbn} onChange={handleChange} /></td>
                <td><input name="quantity" type="number" value={editData.quantity} onChange={handleChange} /></td>
                <td>
                  <button onClick={handleSave}>Save</button>
                  <button onClick={() => setEditId(null)}>Cancel</button>
                </td>
              </tr>
            ) : (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.genre}</td>
                <td>{book.isbn}</td>
                <td>{book.quantity}</td>
                <td>
                  <button onClick={() => startEdit(book)}>Update</button>
                  <button className="danger" onClick={() => onDelete(book.id)}>Delete</button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

export default BookList;
