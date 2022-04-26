import { Link, useParams } from "react-router-dom";
import "./detail.css";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDetail } from "../../Redux/Actions";

export default function Detail() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const myGame = useSelector((state) => state.detail);

  /* useEffect(() => {
    setTimeout(() => dispatch(getDetail(id)), 3000);
    return () => dispatch(getDetail());
  }, [dispatch, id]);} */
  useEffect (() => 
    {dispatch(getDetail(id))
    } ,[id,dispatch])

 // console.log(myGame.released);
  return (
    <div className="contenedorDetail">
      {myGame.length === 0 ? (
        <img
          src="https://i.imgur.com/WxAdVOx.gif"
          alt="Loading..."
          className="loaderDetail"
        />
      ) : (
        <div className="detail">
          <h1>{myGame.name}</h1>
          <div className="imagenDetalle">
            <img
              src={
                myGame.image ? myGame.image : "https://i.imgur.com/Xb3J9Cz.png"
              }
              alt=""
              height="300px"
              width="500px"
              className="imgDetalle"
            />
          </div>
          <div className="subtitle">Rating:</div>
          <div className="text">{myGame.rating}</div>
          <div className="subtitle">Released:</div>
          <div className="text">{myGame.released.split("T").shift()}</div>
          <div className="subtitle">Description:</div>
          <div className="text" id="description"> {myGame.description}
          </div>
          <div>
            <div className="subtitle">Genres:</div>
            <div className="text">{myGame.genres.map((el) => el + " ")}</div>
          </div>
          <div>
            <div className="subtitle">Platforms:</div>
            <div className="text">{myGame.platforms}</div>
          </div>
        </div>
      )}
      <div className="botonDetalle">
        <Link to="/home">
          <button id="landButton" className="btnD">
            volver
          </button>
        </Link>
      </div>
    </div>
  );
}
