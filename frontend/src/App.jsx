import { useState } from "react";
import Navbar from "../Navbar";
import NavRoute from "../NavRoute";

const App = () => {
  // logged in user (null = nobody logged in)
  const [user, setUser] = useState(null);

  return (
    <div className="app">
      <Navbar user={user} setUser={setUser} />
      <main className="main">
        <NavRoute user={user} setUser={setUser} />
      </main>
      <footer className="footer">The Book Shelf, a small catalogue of books</footer>
    </div>
  );
};

export default App;
