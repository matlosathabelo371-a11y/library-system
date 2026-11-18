import { useState, useEffect } from "react";

// Form used to add a new user OR update an existing one
function UserForm({ onSave, editUser, onCancel }) {
  const [form, setForm] = useState({ name: "", membership_id: "", role: "member" });
  const [error, setError] = useState("");

  // when the admin clicks Update on a user, fill the form with that user
  useEffect(() => {
    if (editUser) {
      setForm(editUser);
    } else {
      setForm({ name: "", membership_id: "", role: "member" });
    }
  }, [editUser]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (form.name.trim() === "" || form.membership_id.trim() === "") {
      setError("Name and membership ID are required");
      return;
    }

    setError("");
    onSave(form);
    setForm({ name: "", membership_id: "", role: "member" });
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <h3>{editUser ? "Update User" : "Add New User"}</h3>
      {error && <p className="error">{error}</p>}
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
      <input name="membership_id" placeholder="Membership ID" value={form.membership_id} onChange={handleChange} />
      <select name="role" value={form.role} onChange={handleChange}>
        <option value="member">Member</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit">{editUser ? "Save Changes" : "Add User"}</button>
      {editUser && <button type="button" onClick={onCancel}>Cancel</button>}
    </form>
  );
}

export default UserForm;
