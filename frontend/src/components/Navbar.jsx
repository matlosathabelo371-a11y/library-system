import { Link } from "react-router-dom";

function Navbar({ user, setUser }) {
  return (
    <nav className="navbar">
      <h2>Library System</h2>
      <div className="links">
        <Link to="/">Dashboard</Link>
        <Link to="/books">Books</Link>
        <Link to="/transactions">Transactions</Link>
        <Link to="/users">Users</Link>
      </div>
      <div className="login-info">
        {user ? (
          <span>
            {user.name} ({user.role}){" "}
            <button onClick={() => setUser(null)}>Logout</button>
          </span>
        ) : (
          <span>Not logged in</span>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
