import React from "react";
import "./paginado.css";

function Paginado({ gamesPerPage, fullGames, paginado }) {
  const pageNumber = [];
 
  for (let i = 1; i <= Math.ceil(fullGames/ gamesPerPage); i++) {
    pageNumber.push(i);
  }

  return (
    <nav>
      <ul className="pagination">
        {pageNumber?.map((number) => {
          return (
            <li className="number" key={number}>
              <a onClick={() => paginado(number)} href="#">
                {number}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
/* function handleNext(e) {
  e.preventDefault();
  if(currentPage < paginas ){
  setCurrentPage(currentPage + 1);
}
}
function handlePrev(e) {
  e.preventDefault();
  if(currentPage > 1){
  setCurrentPage(currentPage - 1);
}
} */
export default Paginado;