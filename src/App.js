import "bootstrap/dist/css/bootstrap.css";
import { Component } from "react";
import queryString from "query-string";
import { Route, withRouter } from "react-router-dom";
import HomePage from "./component/HomePage";
import BookList from "./component/BookList";

class App extends Component {
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
  };

  render() {
    return (
      <>
        <Route
          exact
          path="/"
          component={() => (
          <HomePage setGenre={this.pushGenre} />
          )}
        />
        <Route path="/books" component={()=>(<BookList />)} />
      </>
    );
  }
}

export default withRouter(App);
