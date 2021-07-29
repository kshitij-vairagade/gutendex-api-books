import React from "react";
import configData from "../config.json";
import svgIcons from "../New Assets/icon/indexData";
import "bootstrap/dist/css/bootstrap.css";
import "./HomePage.css"

function ListItem({ items, onSelect }) {
  return (
    <div style={{ padding: "10px", margin: "10px" }}>
      {items.map((item) => (
        <div
          className="catList"
          key={`/books/${item}`}
          onClick={() => onSelect(item)}
        >
          <div
            className="catIcon"
            style={{ backgroundImage: `url(${svgIcons[item]})` }}
          ></div>
          <h5>{item.toLocaleUpperCase()}</h5>
          <div
            className="next"
            style={{ backgroundImage: `url(${svgIcons["Next"]})` }}
          ></div>
        </div>
      ))}
    </div>
  );
}

const homepage = ({ setGenre }) => {
  return (
    <div>
      <h4 className="title">{configData.title}</h4>
      <h2 className="subtitle">{configData.subtitle}</h2>
      <ListItem items = {configData.category} onSelect={setGenre}/>
    </div>
  );
};

export default homepage;
