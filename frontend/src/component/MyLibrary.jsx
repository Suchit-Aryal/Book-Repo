import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import "./MyLibrary.css";
import API_URL from "../config.js";

const MyLibrary = ({ user }) => {
  const [myBooks, setMyBooks] = useState([]);
  const [stats, setStats] = useState(null);
  const [message, setMessage] = useState("");

  // load my borrowed books and the library numbers
  useEffect(() => {
    if (!user) {
      return;
    }
    const getData = async () => {
      try {
        // only the books this user borrowed
        const books = await axios.get(
          `${API_URL}/books?borrowedBy=${user._id}`,
        );
        setMyBooks(books.data.result);
        const result = await axios.get(API_URL + "/books/stats");
        setStats(result.data.result);
      } catch (error) {
        setMessage(error.response ? error.response.data.message : error.message);
      }
    };
    getData();
  }, [user]);

  // give a book back, then take it off my list
  const returnBook = async (book) => {
    try {
      await axios({
        url: `${API_URL}/books/${book._id}/return`,
        method: "POST",
        data: { userId: user._id },
      });
      setMyBooks(myBooks.filter((b) => b._id !== book._id));
      setMessage(`"${book.title}" is back on the shelf.`);
      // load the numbers again
      const result = await axios.get(API_URL + "/books/stats");
      setStats(result.data.result);
    } catch (error) {
      setMessage(error.response ? error.response.data.message : error.message);
    }
  };

  // not logged in: ask to log in first
  if (!user) {
    return (
      <div className="paper empty-card">
        <div className="card-head">
          <h2>My Library</h2>
        </div>
        <p className="ruled">Log in to see the books you have borrowed.</p>
        <NavLink to={"/login"} className="btn btn-primary">
          Log in
        </NavLink>
      </div>
    );
  }

  return (
    <div>
      <header className="catalogue-head">
        <h1>My Library</h1>
        <hr className="double-rule" />
        <p className="count">Reader: {user.name}</p>
      </header>

      {message && <p className="msg msg-ok ledger-msg">{message}</p>}

      <div className="library-grid">
        {/* lending register: my borrowed books */}
        <section className="paper ledger">
          <div className="card-head">
            <h2>On Loan to Me</h2>
          </div>
          {myBooks.length === 0 && (
            <p className="ruled ledger-empty">
              You have not borrowed any books.{" "}
              <NavLink to={"/"}>Visit the shelf</NavLink>
            </p>
          )}
          {myBooks.length > 0 && (
            <table className="ledger-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {myBooks.map((b) => {
                  return (
                    <tr key={b._id}>
                      <td className="ledger-title">{b.title}</td>
                      <td>{b.author}</td>
                      <td className="ledger-action">
                        <button className="btn" onClick={() => returnBook(b)}>
                          Return
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </section>

        {/* library numbers */}
        <section className="paper ledger">
          <div className="card-head">
            <h2>Library Ledger</h2>
          </div>
          {stats && (
            <div className="ruled">
              <p className="stat-row">
                <span>Volumes</span> <span>{stats.total}</span>
              </p>
              <p className="stat-row">
                <span>Read</span> <span>{stats.read}</span>
              </p>
              <p className="stat-row">
                <span>On loan</span> <span>{stats.borrowed}</span>
              </p>
              <p className="stat-sub">By genre</p>
              {/* genres is an object like {Fantasy: 2, Other: 1} */}
              {Object.keys(stats.genres).map((g) => {
                return (
                  <p className="stat-row" key={g}>
                    <span>{g}</span> <span>{stats.genres[g]}</span>
                  </p>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default MyLibrary;
