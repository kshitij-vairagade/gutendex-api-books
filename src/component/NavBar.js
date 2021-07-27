import React, { Component } from "react";
import _ from "lodash";
import backIcon from "../New Assets/icon/Back.svg";

class navbar extends Component {
  constructor(props) {
    super(props);
    _.bindAll(this, "vauleInput");
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
      <nav className={"navbar navbar-expand-lg navbar-light bg-light"}>
        <button
          type="button"
          className="btn btn-primry"
          onClick={this.props.backNavigation}
          style={{ backgroundImage: backIcon }}
        ></button>
        <form className="form-inline my-2 my-lg-0 d-inline-block align-top">
          <input
            className="form-control mr-sm-2"
            type="search"
            placeholder="search"
            aria-label="search"
            onChange={this.valueInput}
          />
        </form>
      </nav>
    );
  }
}

export default navbar;
