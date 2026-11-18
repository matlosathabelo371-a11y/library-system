import { useState } from "react";
import { API } from "../config";

function LoginForm({ setUser }) {
  const [name, setName] = useState("");
  const [membershipId, setMembershipId] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (name.trim() === "" || membershipId.trim() === "") {
      setError("Please enter your name and membership ID");
      return;
    }

    fetch(API + "/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name, membership_id: membershipId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setUser(data);
        }
      })
      .catch(() => setError("Could not reach the server"));
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <h3>Login</h3>
      {error && <p className="error">{error}</p>}
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Membership ID" value={membershipId} onChange={(e) => setMembershipId(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
}

export default LoginForm;
