import { NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ user, setUser }) => {
  return (
    <nav className="navbar">
      <NavLink to={"/"} className="brand">
        The Book Shelf
      </NavLink>
      <div className="nav-links">
        <NavLink to={"/"} end className="nav-link">
          Shelf
        </NavLink>
        <NavLink to={"/create"} className="nav-link">
          Add a Book
        </NavLink>
        <NavLink to={"/mylibrary"} className="nav-link">
          My Library
        </NavLink>
        {user ? (
          <span className="nav-user">
            {user.name}
            <button className="link-btn" onClick={() => setUser(null)}>
              Log out
            </button>
          </span>
        ) : (
          <NavLink to={"/login"} className="nav-link">
            Log in
          </NavLink>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
