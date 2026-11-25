import { useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import "./Form.css";
import API_URL from "../config.js";

const LoginForm = ({ user, setUser }) => {
  // true = register form, false = login form
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        const data = {
          name: name,
          email: email,
          password: password,
        };
        const result = await axios({
          url: API_URL + "/user/register",
          method: "POST",
          data: data,
        });
        // account made, now let them log in
        setIsError(false);
        setMessage(result.data.message + ". You can log in now.");
        setIsRegister(false);
        setPassword("");
      } else {
        const data = {
          email: email,
          password: password,
        };
        const result = await axios({
          url: API_URL + "/user/login",
          method: "POST",
          data: data,
        });
        console.log(result.data);
        setIsError(false);
        setMessage("");
        setUser(result.data.result.user);
        setName("");
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      // show the error message from the api
      setIsError(true);
      setMessage(error.response ? error.response.data.message : error.message);
    }
  };

  // already logged in: show a small reader's card instead of the form
  if (user) {
    return (
      <div className="paper form-card">
        <div className="card-head">
          <h2>Reader's Card</h2>
          <p className="form-sub">You are signed in.</p>
        </div>
        <div className="ruled reader-lines">
          <p>
            <span className="reader-label">Name</span> {user.name}
          </p>
          <p>
            <span className="reader-label">Email</span> {user.email}
          </p>
        </div>
        <div className="form-buttons">
          <NavLink to={"/"} className="btn btn-primary">
            Browse the shelf
          </NavLink>
          <NavLink to={"/mylibrary"} className="btn">
            My Library
          </NavLink>
          <button className="btn btn-danger" onClick={() => setUser(null)}>
            Log out
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="paper form-card">
      <div className="card-head">
        <h2>{isRegister ? "New Reader" : "Log In"}</h2>
        <p className="form-sub">
          {isRegister
            ? "Fill in a card to join the library."
            : "Show your reader's card to borrow books."}
        </p>
      </div>

      {isRegister && (
        <div className="field">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
      )}

      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </div>

      <div className="field">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </div>

      <div className="form-buttons">
        <button className="btn btn-primary" onClick={handleClick}>
          {isRegister ? "Register" : "Log In"}
        </button>
      </div>

      <p className="switch">
        {isRegister ? "Already have a card?" : "No reader's card yet?"}
        <button
          type="button"
          className="link-btn"
          onClick={() => {
            setIsRegister(!isRegister);
            setMessage("");
          }}
        >
          {isRegister ? "Log in" : "Register"}
        </button>
      </p>

      {message && <p className={isError ? "msg msg-error" : "msg msg-ok"}>{message}</p>}
    </form>
  );
};

export default LoginForm;
