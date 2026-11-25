import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import axios from "axios";
import { genres } from "./genres.js";
import "./Form.css";
import API_URL from "../config.js";

const UpdateForm = () => {
  const params = useParams();
  const id = params.id;
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [read, setRead] = useState(false);
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [rating, setRating] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // load this book into the form when page opens
  useEffect(() => {
    const getBook = async () => {
      try {
        const data = await axios({
          url: `${API_URL}/books/${id}`,
          method: "GET",
        });
        setTitle(data.data.result.title);
        setAuthor(data.data.result.author);
        setRead(data.data.result.read);
        // empty text when a field was never filled
        setGenre(data.data.result.genre || "");
        setYear(data.data.result.year || "");
        setRating(data.data.result.rating || "");
        setDescription(data.data.result.description || "");
      } catch (error) {
        setIsError(true);
        setMessage(error.response ? error.response.data.message : error.message);
      }
    };
    getBook();
  }, [id]);

  const handleClick = async (e) => {
    e.preventDefault();
    const data = {
      title: title,
      author: author,
      read: read,
      genre: genre,
      year: year,
      rating: rating,
      description: description,
    };

    try {
      const result = await axios({
        url: `${API_URL}/books/${id}`,
        method: "PATCH",
        data: data,
      });
      setIsError(false);
      setMessage(result.data.message);

      console.log(result.data);
    } catch (error) {
      // show the error message from the api
      setIsError(true);
      setMessage(error.response ? error.response.data.message : error.message);
    }
  };
  return (
    <form className="paper form-card">
      <div className="card-head">
        <h2>Edit Book</h2>
        <p className="form-sub">Correct the catalogue card and save.</p>
      </div>

      <div className="field">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
      </div>

      <div className="field">
        <label htmlFor="author">Author</label>
        <input
          type="text"
          id="author"
          value={author}
          onChange={(e) => {
            setAuthor(e.target.value);
          }}
        />
      </div>

      <div className="field">
        <label htmlFor="genre">Genre</label>
        <select
          id="genre"
          value={genre}
          onChange={(e) => {
            setGenre(e.target.value);
          }}
        >
          <option value="">Choose a genre</option>
          {genres.map((g) => {
            return (
              <option key={g} value={g}>
                {g}
              </option>
            );
          })}
        </select>
      </div>

      <div className="field-pair">
        <div className="field">
          <label htmlFor="year">Year</label>
          <input
            type="number"
            id="year"
            placeholder="e.g. 1937"
            value={year}
            onChange={(e) => {
              setYear(e.target.value);
            }}
          />
        </div>

        <div className="field">
          <label htmlFor="rating">Rating</label>
          <select
            id="rating"
            value={rating}
            onChange={(e) => {
              setRating(e.target.value);
            }}
          >
            <option value="">None</option>
            <option value="1">1 of 5</option>
            <option value="2">2 of 5</option>
            <option value="3">3 of 5</option>
            <option value="4">4 of 5</option>
            <option value="5">5 of 5</option>
          </select>
        </div>
      </div>

      <div className="field field-top">
        <label htmlFor="description">Notes</label>
        <textarea
          id="description"
          rows="3"
          placeholder="A line or two about the book"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        ></textarea>
      </div>

      <label className="check" htmlFor="read">
        <input
          type="checkbox"
          id="read"
          checked={read}
          onChange={(e) => {
            setRead(e.target.checked);
          }}
        />
        I have read this book
      </label>

      <div className="form-buttons">
        <button className="btn btn-primary" onClick={handleClick}>
          Save Changes
        </button>
        <NavLink to={"/"} className="btn">
          Back to shelf
        </NavLink>
      </div>

      {message && <p className={isError ? "msg msg-error" : "msg msg-ok"}>{message}</p>}
    </form>
  );
};

export default UpdateForm;
