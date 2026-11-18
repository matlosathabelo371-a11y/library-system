# Library Management System

**Course:** BIWA2110 – Web Application Development (Individual Assignment)
**Stack:** React (frontend) · Express.js (backend) · MySQL (database)

A library management system where staff can manage books, track stock, record transactions and manage users. The React app talks to an Express REST API using the Fetch API, and the API stores everything in MySQL.

---

## 1. Features (mapped to the assignment brief)

| Requirement | Where to find it |
|---|---|
| Add new books (title, author, genre, ISBN, initial quantity) | Books page · `AddBookForm.jsx` · `POST /books` |
| Update existing book details | Books page · `BookList.jsx` · `PUT /books/:id` |
| Delete books | Books page · `BookList.jsx` · `DELETE /books/:id` |
| Track quantity of each book in stock | `quantity` column in `books` table, shown on Dashboard |
| Add stock when new books arrive | Transactions page · type "Add stock" |
| Deduct stock when books are borrowed | Transactions page · type "Deduct stock" |
| Transaction history log | Transactions page · `GET /transactions` |
| Borrowing history (who, which book, when) | `transactions` table, shown in the history log |
| Login form | Users page · `LoginForm.jsx` · `POST /users/login` |
| Add / update / delete users (name, membership ID, role) | Users page (admin only) · `UserForm.jsx` |
| Dashboard with availability table | Dashboard page · `Dashboard.jsx` |
| Highlight low stock (fewer than 2 copies) | Dashboard rows turn red and show "Low stock!" |
| React hooks (`useState`, `useEffect`) | Used in every page and form component |
| Component composition | `Navbar`, `BookList`, `AddBookForm`, `UserForm`, `LoginForm` |
| Controlled forms with validation | All forms validate before submitting |
| React Router navigation | `App.jsx` and `Navbar.jsx` |
| Fetch API (React → Express → Database) | All pages |
| RESTful Express API with CRUD for books, transactions, users | `backend/routes/` |
| `express.json()` and `cors` middleware | `backend/server.js` |
| MySQL database | `database/schema.sql` |
| CSS styling | `frontend/src/App.css` |

---

## 2. Project structure

```
library-system/
├── README.md
├── database/
│   └── schema.sql             creates the database, tables and sample data
├── backend/
│   ├── package.json
│   ├── server.js              Express app, middleware, routes
│   ├── db.js                  MySQL connection
│   └── routes/
│       ├── books.js           /books
│       ├── users.js           /users
│       └── transactions.js    /transactions
└── frontend/
    ├── package.json
    ├── index.html
    └── src/
        ├── main.jsx           React entry point + Router
        ├── App.jsx            routes and logged-in user state
        ├── App.css            styling
        ├── config.js          backend address
        ├── components/        Navbar, BookList, AddBookForm, UserForm, LoginForm
        └── pages/             Dashboard, Books, Transactions, Users
```

---

## 3. Database design

**books**: `id`, `title`, `author`, `genre`, `isbn` (unique), `quantity`
**users**: `id`, `name`, `membership_id` (unique), `role` (`admin` or `member`)
**transactions**: `id`, `book_id`, `user_id`, `type` (`add` or `deduct`), `quantity`, `created_at`

`transactions` is linked to `books` and `users` with foreign keys. Deleting a book or user also deletes their transaction records.

---

## 4. How to run the project

### Requirements
- **Node.js** (LTS version) – https://nodejs.org
- **MySQL**: either **XAMPP** (easiest, https://www.apachefriends.org) or MySQL Server

### Step 1: Create the database

**Option A: XAMPP + phpMyAdmin**
1. Open the XAMPP Control Panel and click **Start** next to **MySQL**.
2. Click **Admin** next to MySQL (phpMyAdmin opens in the browser).
3. Click the **Import** tab, choose `database/schema.sql`, and click **Import**.
4. The database `library_db` now appears with 3 tables.

**Option B: MySQL command line** (Command Prompt, or macOS/Linux terminal)
```
mysql -u root -p < database/schema.sql
```
In Windows PowerShell the `<` symbol does not work. Instead run `mysql -u root -p`, then type `source database/schema.sql`.

**Option C: MySQL Workbench**
File → Open SQL Script → choose `database/schema.sql` → click the lightning bolt.

### Step 2: Set the database password
Open `backend/db.js`. The password is empty by default, which works for XAMPP. If your MySQL root user has a password, put it here:
```js
password: "your-password",
```

### Step 3: Start the backend (port 5000)
```
cd backend
npm install
npm start
```
You should see: `Server running on http://localhost:5000`. Keep this terminal open.

### Step 4: Start the frontend (port 5173)
Open a second terminal:
```
cd frontend
npm install
npm run dev
```
Open the link it prints, normally **http://localhost:5173**.

---

## 5. Login details for testing

| Name | Membership ID | Role |
|---|---|---|
| Admin | ADMIN001 | admin |
| John Member | MEM001 | member |

- Log in on the **Users** page (name + membership ID).
- The **Dashboard** can be viewed without logging in.
- **Books** and **Transactions** need a login (any role).
- Only an **admin** can add, update and delete users.
- Every transaction is saved with the name of the logged-in user.

---

## 6. How to test each feature

1. **Dashboard:** see all books. "Clean Code" has 1 copy, so it is highlighted as low stock.
2. **Login:** go to Users and log in as Admin. A wrong membership ID shows an error.
3. **Books:** add a book (leave the title empty to see validation), update a book, delete a book.
4. **Transactions:** add stock, deduct stock, and check the history log. Deducting more than the stock is refused.
5. **Users:** as Admin add, update and delete a user. Log in as John Member to see that user management is blocked for members.

---

## 7. API endpoints

| Method | URL | Description |
|---|---|---|
| GET | `/books` | get all books |
| GET | `/books/:id` | get one book |
| POST | `/books` | add a book |
| PUT | `/books/:id` | update a book |
| DELETE | `/books/:id` | delete a book |
| GET | `/users` | get all users |
| POST | `/users` | add a user |
| PUT | `/users/:id` | update a user |
| DELETE | `/users/:id` | delete a user |
| POST | `/users/login` | log in with name + membership ID |
| GET | `/transactions` | get transaction history |
| POST | `/transactions` | add or deduct stock |

---

## 8. Validation rules

- **Book:** title and author required, ISBN at least 10 characters and unique, quantity 0 or more.
- **User:** name and membership ID required, membership ID unique.
- **Transaction:** a book must be chosen, quantity above 0, and stock cannot go below 0.
- **Login:** both fields required; wrong details are rejected by the server.

---

## 9. Troubleshooting

| Problem | Fix |
|---|---|
| `npm` blocked by "running scripts is disabled" (PowerShell) | Run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`, or use Command Prompt |
| "Access denied for user root" | Wrong password in `backend/db.js` |
| "Unknown database library_db" | Run `database/schema.sql` again |
| Pages show "Could not load books" | The backend is not running, or MySQL is not started |
| Port 5000 already in use | Close the other program using that port |

---

## 10. Screenshots

Screenshots of every page are in the `screenshots/` folder.

---

## 11. Notes
- Login uses name and membership ID because the brief lists only name, membership ID and role for users (no password field).
- The database is created from `database/schema.sql`, which also adds sample users and books so the app can be tested straight away.
