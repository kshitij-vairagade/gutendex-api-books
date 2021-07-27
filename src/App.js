import "bootstrap/dist/css/bootstrap.css";
import { Component } from "react";
import queryString from "query-string";
import { Route, withRouter } from "react-router-dom";
import Homepage from "./component/HomePage";
import Booklist from "./component/BookList";

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
          <Homepage setGenre={this.pushGenre} />
          )}
        />
        <Route path="/books" component={()=>(<Booklist />)} />
      </>
    );
  }
}

export default withRouter(App);
