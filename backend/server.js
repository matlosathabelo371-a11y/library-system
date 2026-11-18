const express = require("express");
const cors = require("cors");

const booksRoutes = require("./routes/books");
const usersRoutes = require("./routes/users");
const transactionsRoutes = require("./routes/transactions");

const app = express();

// Middleware
app.use(cors());           // allow the React app to call this API
app.use(express.json());   // read JSON sent in the request body

// Routes
app.use("/books", booksRoutes);
app.use("/users", usersRoutes);
app.use("/transactions", transactionsRoutes);

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
