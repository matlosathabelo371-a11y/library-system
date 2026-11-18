import { useState, useEffect } from "react";
import { API } from "../config";
import LoginForm from "../components/LoginForm";
import UserForm from "../components/UserForm";

function Users({ user, setUser }) {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [message, setMessage] = useState("");

  function loadUsers() {
    fetch(API + "/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch(() => setMessage("Could not load users"));
  }

  // only load the user list when an admin is logged in
  useEffect(() => {
    if (user && user.role === "admin") {
      loadUsers();
    }
  }, [user]);

  function saveUser(form) {
    // if editUser has a value we update, otherwise we add a new user
    const url = editUser ? API + "/users/" + editUser.id : API + "/users";
    const method = editUser ? "PUT" : "POST";

    fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.error || data.message);
        setEditUser(null);
        loadUsers();
      });
  }

  function deleteUser(id) {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }
    fetch(API + "/users/" + id, { method: "DELETE" })
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.error || data.message);
        loadUsers();
      });
  }

  // not logged in -> show the login form
  if (!user) {
    return (
      <div>
        <h2>User Management</h2>
        <LoginForm setUser={setUser} />
      </div>
    );
  }

  // logged in but not an admin
  if (user.role !== "admin") {
    return (
      <div>
        <h2>User Management</h2>
        <p>Welcome, {user.name}. Only admins can manage users.</p>
      </div>
    );
  }

  // admin view
  return (
    <div>
      <h2>User Management (Admin)</h2>
      {message && <p className="message">{message}</p>}

      <UserForm onSave={saveUser} editUser={editUser} onCancel={() => setEditUser(null)} />

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Membership ID</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.membership_id}</td>
              <td>{u.role}</td>
              <td>
                <button onClick={() => setEditUser(u)}>Update</button>
                <button className="danger" onClick={() => deleteUser(u.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Users;
