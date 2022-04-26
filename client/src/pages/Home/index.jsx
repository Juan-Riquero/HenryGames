import React from "react";
import "./home.css";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getGames,
  orderByName,
  orderByRating,
  filterCreated,
  filterByGenres,
 /*  reload, */
} from "../../Redux/Actions";

import Card from "../../Components/Card";
import Pagination from "../../Components/Pagination";
import SearchBar from "../../Components/SearchBar";

export default function Home() {
  const dispatch = useDispatch();

  // const genres = useSelector((state) => state.genres);
  const fullGames = useSelector((state) => state.games);
  const [order, setOrder] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [gamesPerPage, setGamesPerPage] = useState(15);
  const indexOfLastGame = currentPage * gamesPerPage; //15
  const indexOfFirstGame = indexOfLastGame - gamesPerPage; // 0

  const currentGames = fullGames.slice(indexOfFirstGame, indexOfLastGame);
  
  const [abc,setAbc]= useState('aal')
  
  const[ratingorder,setRatingorder]=useState('luc')
  const[gamer,setGamer]=useState('game')
  const [generes,setGeneres]= useState('genres')
 
 
  const paginado = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    dispatch(getGames());
  }, [dispatch]);

  function handleClick(e) {
    e.preventDefault();
    
   dispatch(getGames());
 /*   dispatch(reload()); */
   setAbc('aal')
   setRatingorder('luc')
   setGamer('game')
   setGeneres('genres')
  }

  function handleFilterGenres(e) {
    setCurrentPage(1);
    dispatch(filterByGenres(e.target.value));
    setGeneres(e.target.value)    
  }

  function handleFilterCreated(e) {
    e.preventDefault();
    setCurrentPage(1);
    dispatch(filterCreated(e.target.value));
    setGamer(e.target.value);
  }

  function handleSortName(e) {
    dispatch(orderByName(e.target.value));
    setCurrentPage(1);
   // setOrder(`ordenado ${e.target.value}`);
    setAbc(e.target.value)
    setRatingorder('luc')
  }

  function handleSortRating(e) {
    dispatch(orderByRating(e.target.value));
    setCurrentPage(1);
    //1setOrder(`ordenado ${e.target.value}`);
    setRatingorder(e.target.value);
    setAbc('aal')
  }
  
  console.log(currentGames)
  return (
    <div className="fondoo">
      <div className="navBar">
        <NavLink to="/" style={{ textDecoration: "none", color: "black" }}>
          <img src="https://i.imgur.com/OBjeGYI.png" alt="loguito" />
        </NavLink>
        <button className="btnI" id="botonIzquierdo"
          onClick={(e) => { handleClick(e);}}
        > Recargar Juegos
        </button>
        <NavLink
          to="/create"
          style={{ textDecoration: "none", color: "black" }}
        >
          <button className="btnI">Crear Juego!</button>
        </NavLink>
        <div className="search">
          <SearchBar setCurrentPage={setCurrentPage} />
        </div>
      </div>
      <div className="viewport">
        <div className="custom-select">
        
          <select value={abc} className="select-css"
            onChange={(e) => {handleSortName(e); }}>
                    <option disabled value="aal" >Order Alphabetically</option>
                    <option value="asc">Ascendent(A-Z)</option> {/*necesito pasarle un value para poder mandar las cosas por payload*/}
                    <option value="desc">Descendent(Z-A)</option>{/*me permite acceder y preg el valor de las opciones, haga la logica con ese valor y lo entienda la accion  */}
         </select>

          <select value={ratingorder} onChange={e => handleSortRating(e)} className="select-css">
                    <option disabled value="luc" >Score</option>
                    <option value="asc">High score</option>
                    <option value="desc">Low score</option>
          </select>
          <select  value={gamer} onChange={e => handleFilterCreated(e)} className="select-css">
                   <option disabled value="game">All</option>
                   <option value="created">Created</option>
                   <option value="api">Apigames</option>
          </select>
          
          
         
          <select value={generes} onChange={handleFilterGenres} className="select-css">

            <option disabled value="genres"> Genres </option>
            <option value="Action">Action</option>
            <option value="Indie">Indie</option>
            <option value="Strategy">Strategy</option>
            <option value="Adventure">Adventure</option>
            <option value="RPG">RPG</option>
            <option value="Shooter">Shooter</option>
            <option value="Casual">Casual</option>
            <option value="Simulation">Simulation</option>
            <option value="Arcade">Arcade</option>
            <option value="Puzzle">Puzzle</option>
            <option value="Platformer">Platformer</option>
            <option value="Racing">Racing</option>
            <option value="Massively Multiplayer">Massively Multiplayer</option>
            <option value="Fighting">Fighting</option>
            <option value="Sports">Sports</option>
            <option value="Family">Family</option>
            <option value="Board Games">Board Games</option>
            <option value="Educational">Educational</option>
            <option value="Card">Card</option>
          </select>
        </div>

        <Pagination
          gamesPerPage={gamesPerPage}
          fullGames={fullGames.length}
          paginado={paginado}
        />

        <div className="cards">
          {
         currentGames.length&& currentGames[0].msg ? 
         <p className="noencontre"> {currentGames[0].msg }</p>
          :currentGames.length === 0 ? (
            <div>
              <h2 className="h2">CARGANDO VIDEOJUEGOS...</h2>
              <img
                src="https://i.imgur.com/p9dsQtE.gif"
                alt="Loading..."
                className="loaderHome"
              />
            </div>
          ) : (
            currentGames.map((el) => {
              return (
                <div key={el.id}>
                  <Card
                    key={el.id}
                    id={el.id}
                    name={el.name}
                    image={el.image}
                    rating={el.rating}
                    genres={ 
                      !currentGames[0].createdInDb
                        ? el.genres
                        : currentGames[0].genres.join(" - ")
                    }
                  />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}