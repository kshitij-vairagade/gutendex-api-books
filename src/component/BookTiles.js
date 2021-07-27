import React from "react";
import "./BookTiles.css";

const Tiles = ({ img, title, author }) => {
  return (
    <div>
      <img src={img} alt={title + "image"} className="bookImg" />
      <div className="detail">
        <h2 className="bookData">{title}</h2>
        <p className="bookData">{author}</p>
      </div>
    </div>
  );
};

function BookTiles({ tilesData, onClickGrid }) {
  return (
    <div className="bookWrapper">
      {tilesData.map((tile) => (
        <div
          key={tile.title + tile.author + tile.id}
          onClick={() => onClickGrid(tile)}
          className="detailedContainer"
        >
          <Tiles img={tile.img} title={tile.title} author={tile.author}></Tiles>
        </div>
      ))}
    </div>
  );
}

export default BookTiles;
