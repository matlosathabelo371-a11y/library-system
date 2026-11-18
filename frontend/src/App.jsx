import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Transactions from "./pages/Transactions";
import Users from "./pages/Users";

function App() {
  // the logged in user is kept here so every page can use it
  const [user, setUser] = useState(null);

  return (
    <div>
      <Navbar user={user} setUser={setUser} />
      <div className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/books" element={<Books user={user} />} />
          <Route path="/transactions" element={<Transactions user={user} />} />
          <Route path="/users" element={<Users user={user} setUser={setUser} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
