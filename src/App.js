import "./App.css";
import { Component } from "react";
import queryString from "query-string";
import { Route, withRouter } from "react-router-dom";
import homepage from "./component/homepage";
import booklist from "./component/booklist";

class App extends Component() {
  constructor(props) {
    super(props);
    this.pushGenre = this.genreHistory.bind(this);
  }

  genreHistory(topic) {
    const search = {
      topic,
      mime_type: "image/jpeg",
    };

    const query = queryString.stringify(search);
    this.props.history.push(`/books?${query}`);
  }

  render() {
    return (
      <>
        <Route
          exact
          path="/"
          component={() => <homepage setGenre={this.pushGenre} />}
        />
        <Route path="/books" component={() => <booklist />} />
      </>
    );
  }
}

export default withRouter(App);
