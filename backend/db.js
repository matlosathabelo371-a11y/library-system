// Connection to the MySQL database
const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",        // change this to your MySQL password
  database: "library_db",
});

module.exports = db;
