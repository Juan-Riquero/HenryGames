import "./landing.css";
import React from "react";
import { useEffect } from "react";
import {useDispatch } from "react-redux";
import{getGames} from "../../Redux/Actions"
import { NavLink } from "react-router-dom";

function Landing() {
  const dispatch = useDispatch();
    
  useEffect(() => {
      dispatch(getGames())
    }, []);
  return (
    <div className="contenedor">
      <br />
      <NavLink to="/home">
        <button id="landButton">ENTER</button>
      </NavLink>
    </div>
  );
}



/* export default function Landing(){
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(getVideoGames())
      }, []);

      return (
        <div className="contenedor">
          <br />
          <NavLink to="/home">
            <button id="landButton">ENTER</button>
          </NavLink>
        </div>
      ); */
  /*   return (
        <div>
            <h1>Welcom to videogames </h1>
            <Link to='/home'>
               <button>Ingresar</button>
            </Link>
        </div>
    ) */
 
export default Landing;
