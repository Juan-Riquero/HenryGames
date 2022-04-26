import "./create.css";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { postGame, getGenres } from "../../Redux/Actions";
import { useDispatch, useSelector } from "react-redux";

//formulario validad con Javascript, sistema de errores
function validate(input) {
  let errors = {};
  if (!input.name) {
    errors.name = "Se requiere un nombre!";
  }
  if (!input.description) {
    errors.description = "Se debe agregar una descripción!";
  }
  // if (!input.image) {
  //   errors.img = "Agregar Link para la imagen!";
  // }
  if (!input.released) {
    errors.release = "Agregar fecha de lanzamiento";
  }
  if (!input.rating || input.rating > 5 || input.rating < 1) {
    errors.rating = "Rating entre 1 y 5!";
  }
  return errors;
}

//creo la funcion Creadora de VideoJuegos
export default function Create() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const genres = useSelector((state) => state.genres);
  const videogames = useSelector((state) => state.games);
 //console.log(genres)
  //estado local de Errores e Inputs (objetos)
  const [errors, setErrors] = useState({});
  const [input, setInput] = useState({
    name: "",
    description: "",
    image: "",
    released: "",
    rating: "",
    platforms: [],
    genres: [],
  });

  // Me traigo las plataformas como si fuera una action
  const getPlatforms = function () {
    let aux = videogames;
    let aux2 = aux.map((e) => e.platforms).flat(5);
    let aux3 = new Set(aux2);
    let plat = [...aux3];
    return plat;
  };
  const platform = getPlatforms();

  //---------------------------------------------
  //--------------HANDLeRES------------------------
  function handleChange(e) {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });

    setErrors(
      validate({
        ...input,
        [e.target.name]: e.target.value,
      })
    );
  }

  function handleGenre(e) {
    setInput({
      ...input,
      genres: [...input.genres, e.target.value],
    });
  }

  function handlePlataforms(e) {
    setInput({
      ...input,
      platforms: [...input.platforms, e.target.value],
    });
  }

  function handleSubmit(e) {
    if (
      input.name.length &&
      input.description.length &&
      input.platforms.length
      // !input.rating > 5 &&
      // !input.rating < 1
    ) {
      e.preventDefault();
      dispatch(postGame(input));
      alert("Videojuego Creado!!");
      setInput({
        name: "",
        description: "",
        image: "",
        released: "",
        rating: "",
        platforms: [],
        genres: [],
      });
      navigate("/home");
    } else {
      e.preventDefault();
      alert("Formulario incompleto");
    }
  }

  function handleDelete(el) {
    setInput({
      ...input,
      genres: input.genres.filter((gen) => gen !== el),
      platforms: input.platforms.filter((plat) => plat !== el),
    });
  }

  useEffect(() => {
    dispatch(getGenres());
  }, [dispatch]);

  return (
    <div className="addCharacter">
      <h1>Create New Videogame</h1>
      <form onSubmit={(e) => handleSubmit(e)} className="formulario">
        <div>
          <div>
            <div className="form_inputs">
              <label>Name </label>
              <input
                className="inputs"
                type="text"
                value={input.name}
                name="name"
                onChange={handleChange}
              />
              {errors.name && <p className="errorcito">{errors.name}</p>}
            </div>
            <div className="form_inputs">
              <label>Description </label>
              <input
                className="inputs"
                type="text"
                value={input.description}
                name="description"
                onChange={handleChange}
              />
              {errors.description && (
                <p className="errorcito">{errors.description}</p>
              )}
            </div>
            <div className="form_inputs">
              <label>Image </label>
              <input
                className="inputs"
                type="text"
                value={input.image}
                name="image"
                onChange={handleChange}
              />
              {errors.img && <p className="errorcito">{errors.img}</p>}
            </div>
            <div className="form_inputs">
              <label>Release Date </label>
              <input
                className="inputs"
                type="date"
                value={input.released}
                name="released"
                onChange={handleChange}
              />
              {errors.release && <p className="errorcito">{errors.release}</p>}
            </div>
            <div className="form_inputs">
              <label>Rating </label>
              <input
                className="inputs"
                type="number"
                value={input.rating}
                name="rating"
                onChange={handleChange}
                min="0" 
                max="5"
              />
              {errors.rating && <p className="errorcito">{errors.rating}</p>}
            </div>
          </div>
          <div>
            <div className="custom-select">
              <select onChange={handleGenre} className="select-css">
                {genres.map((e) => (
                  <option key={e.name} value={e.name}>
                    {e.name}
                  </option>
                ))}
              </select>
            </div>
            <li>{input.genres.map((el) => el).join(" - ")}</li>
            <div className="custom-select">
              <select onChange={handlePlataforms} className="select-css">
                {platform.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </div>
            <li>{input.platforms.map((el) => el).join(" - ")}</li>
          </div>
        </div>
        <div id="divButtons">
          <button type="submit" className="add_button">
            Create
          </button>
          <Link to="/home">
            <button className="add_button">Back</button>
          </Link>
        </div>
      </form>
      <br />
      <br />
      <div className="conteiner remove">
        <h2>Remove Platforms:</h2>
        {input.platforms.map((el) => (
          <div className="cardRemove" key={el}>
            <p> {el}</p>
            <button className="delete" onClick={() => handleDelete(el)}>
              X
            </button>
          </div>
        ))}
        <h2>Remove Genres:</h2>

        {input.genres.map((el) => (
          <div className="cardRemove" key={el}>
            <p>{el}</p>
            <button className="delete" onClick={() => handleDelete(el)}>
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}