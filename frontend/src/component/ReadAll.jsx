import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { genres } from "./genres.js";
import "./ReadAll.css";
import API_URL from "../config.js";

const ReadAll = ({ user }) => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [error, setError] = useState("");
  // the book shown in the index card (null = card closed)
  const [selected, setSelected] = useState(null);

  // put the changed book back in the list and in the open card
  const replaceBook = (newBook) => {
    setSelected(newBook);
    setBooks(books.map((b) => (b._id === newBook._id ? newBook : b)));
  };

  // delete one book, close the card, remove it from the list
  const deleteBook = async (id) => {
    try {
      await axios({
        url: `${API_URL}/books/${id}`,
        method: "DELETE",
      });
      setSelected(null);
      setBooks(books.filter((b) => b._id !== id));
    } catch (error) {
      setError(error.response ? error.response.data.message : error.message);
    }
  };

  // flip read true/false
  const toggleRead = async (book) => {
    try {
      const result = await axios({
        url: `${API_URL}/books/${book._id}`,
        method: "PATCH",
        data: { read: !book.read },
      });
      replaceBook(result.data.result);
    } catch (error) {
      setError(error.response ? error.response.data.message : error.message);
    }
  };

  // borrow a book for the logged in user
  const borrowBook = async (book) => {
    try {
      const result = await axios({
        url: `${API_URL}/books/${book._id}/borrow`,
        method: "POST",
        data: { userId: user._id },
      });
      replaceBook(result.data.result);
    } catch (error) {
      setError(error.response ? error.response.data.message : error.message);
    }
  };

  // give a borrowed book back
  const returnBook = async (book) => {
    try {
      const result = await axios({
        url: `${API_URL}/books/${book._id}/return`,
        method: "POST",
        data: { userId: user._id },
      });
      replaceBook(result.data.result);
    } catch (error) {
      setError(error.response ? error.response.data.message : error.message);
    }
  };

  // load books once when page opens
  useEffect(() => {
    const getBooks = async () => {
      try {
        const result = await axios.get(API_URL + "/books");
        setBooks(result.data.result);
      } catch (error) {
        console.log(error.message);
        setError("Could not load books. Is the server running on port 8000?");
      }
    };
    getBooks();
  }, []);

  // only books whose title or author matches the search, and the chosen genre
  const shown = books.filter((b) => {
    const text = search.toLowerCase();
    const searchOk =
      b.title.toLowerCase().includes(text) ||
      b.author.toLowerCase().includes(text);
    const genreOk = genre === "" || b.genre === genre;
    return searchOk && genreOk;
  });
  const readCount = books.filter((b) => b.read).length;
  const loanCount = books.filter((b) => b.borrowedBy).length;
  // true when the open book is borrowed by the logged in user
  const mine = selected && user && selected.borrowedBy === user._id;

  return (
    <div>
      <header className="catalogue-head">
        <h1>Catalogue of Books</h1>
        <hr className="double-rule" />
        <p className="count">
          A catalogue of {books.length}{" "}
          {books.length === 1 ? "volume" : "volumes"}, {readCount} read,{" "}
          {loanCount} on loan
        </p>
      </header>

      {error && (
        <p className="error-box" onClick={() => setError("")}>
          {error}
        </p>
      )}

      {books.length === 0 && !error && (
        <div className="paper empty">
          <div className="card-head">
            <h2>No books yet</h2>
          </div>
          <p className="ruled">
            The shelf is empty. Add your first book to the catalogue.
          </p>
          <NavLink to={"/create"} className="btn btn-primary">
            Add your first book
          </NavLink>
        </div>
      )}

      {books.length > 0 && (
        <div className="filters">
          <input
            type="text"
            className="search"
            placeholder="Search by title or author"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
          <select
            className="search genre-filter"
            value={genre}
            onChange={(e) => {
              setGenre(e.target.value);
            }}
          >
            <option value="">All genres</option>
            {genres.map((g) => {
              return (
                <option key={g} value={g}>
                  {g}
                </option>
              );
            })}
          </select>
        </div>
      )}

      {books.length > 0 && shown.length === 0 && (
        <p className="no-match">No book on the shelf matches your search.</p>
      )}

      {shown.length > 0 && (
        <div className="shelf">
          {shown.map((b, index) => {
            return (
              <div
                key={b._id}
                className={`book cover-${index % 6} ${b.read ? "is-read" : ""} ${b.borrowedBy ? "is-borrowed" : ""}`}
                onClick={() => {
                  setSelected(b);
                  setError("");
                }}
              >
                <div className="book-frame">
                  <p className="book-title">{b.title}</p>
                  <p className="book-author">{b.author}</p>
                </div>
                <p className="book-status">
                  {b.borrowedBy ? "on loan" : b.read ? "read" : "unread"}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* index card with details, click outside or x to close */}
      {selected && (
        <div className="overlay" onClick={() => setSelected(null)}>
          <div
            className="paper index-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close" onClick={() => setSelected(null)}>
              x
            </button>
            <div className="card-head">
              <p className="card-no">
                No. {selected._id.slice(-6).toUpperCase()}
              </p>
              <h2>{selected.title}</h2>
            </div>
            <div className="card-body ruled">
              <div className="card-row">
                <span className="card-label">Author</span>
                <span>{selected.author}</span>
              </div>
              <div className="card-row">
                <span className="card-label">Genre</span>
                <span>{selected.genre || "-"}</span>
              </div>
              <div className="card-row">
                <span className="card-label">Year</span>
                <span>{selected.year || "-"}</span>
              </div>
              <div className="card-row">
                <span className="card-label">Rating</span>
                <span>{selected.rating ? selected.rating + " of 5" : "-"}</span>
              </div>
              <div className="card-row">
                <span className="card-label">Status</span>
                <span className={selected.read ? "stamp-read" : "stamp-unread"}>
                  {selected.read ? "Read" : "Not yet read"}
                </span>
              </div>
              <div className="card-row">
                <span className="card-label">Loan</span>
                <span>
                  {!selected.borrowedBy && "On the shelf"}
                  {mine && "Borrowed by you"}
                  {selected.borrowedBy && !mine && "On loan to another reader"}
                </span>
              </div>
              {selected.description && (
                <div className="card-row">
                  <span className="card-label">Notes</span>
                  <span className="card-notes">{selected.description}</span>
                </div>
              )}
              {selected.createdAt && (
                <div className="card-row">
                  <span className="card-label">Added</span>
                  <span>
                    {new Date(selected.createdAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
            <div className="card-actions">
              {!selected.borrowedBy && user && (
                <button
                  className="btn btn-primary"
                  onClick={() => borrowBook(selected)}
                >
                  Borrow
                </button>
              )}
              {mine && (
                <button
                  className="btn btn-primary"
                  onClick={() => returnBook(selected)}
                >
                  Return
                </button>
              )}
              <button className="btn" onClick={() => toggleRead(selected)}>
                {selected.read ? "Mark unread" : "Mark read"}
              </button>
              <NavLink to={`/update/${selected._id}`} className="btn">
                Edit
              </NavLink>
              <button
                className="btn btn-danger"
                onClick={() => deleteBook(selected._id)}
              >
                Delete
              </button>
            </div>
            {error && <p className="msg msg-error">{error}</p>}
            {!user && !selected.borrowedBy && (
              <p className="card-hint">
                <NavLink to={"/login"}>Log in</NavLink> to borrow this book.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadAll;
