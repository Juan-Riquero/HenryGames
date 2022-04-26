import React from "react";
import { Link } from "react-router-dom";
import "./Notfound.css";

function Notfound() {
  return (
    <div className="NotFound">
      <h2>404</h2>
      <h1>Game Over</h1>

      <Link to={"/home"}>
        <div className="arrow"></div>
        <p>Continue ?</p>
      </Link>
    </div>
  );
}

export default Notfound;