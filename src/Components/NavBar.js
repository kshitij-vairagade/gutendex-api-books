import React, { Component } from "react";
import _ from "lodash";
import svgIcons from "../New Assets/icon/indexData";
import "./NavBar.css"
import backIcon from "../New Assets/icon/Back.svg"
import Search from "../New Assets/icon/Search.svg";

class NavBar extends Component {
  constructor(props) {
    super(props);
    _.bindAll(this, "valueInput");
  }


  valueInput(event) {
    const {
      target: { value },
    } = event;
    this.props.onChange(value);
    event.preventDefault();
  }

  render() {
    return (
        
        <nav className={"navbar  navbar-expand-lg navbar-light bg-light"}>
        <button
          type="button"
          className="back"
          onClick={this.props.navigateBack}
          style={{ backgroundImage: backIcon }}
        >
            Back
        </button>
        
        <form className="form-search">
          <input
            className="search"
            type="search"
            placeholder="Search"
            aria-label="search"
            style={{ backgroundImage: Search }}
            onChange={this.valueInput}
          />
        </form>
      </nav>
    );
  }
}

export default NavBar;