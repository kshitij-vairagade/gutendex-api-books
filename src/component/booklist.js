
import queryString from "query-string";
import _ from "lodash";
import axios from "axios";

import { api_path } from "../config.json";
import { setupCache } from "axios-cache-adapter";
import { Component } from "react";
import { withRouter } from "react-router-dom";

import "./BookList.css";
import NavBar from "./NavBar";
import BookTiles from "./BookTiles";
import configData from "../config.json";


// Create `axios-cache-adapter` instance
const cache = setupCache({
  maxAge: 15 * 60 * 1000,
});

let isComponentMounted = false;

//  `axios` instance passing the newly created `cache.adapter`
const api = axios.create({
  adapter: cache.adapter,
});

class BookList extends Component {
  constructor(props) {
    super(props);
    _.bindAll(
      this,
      "loadBooksByLink",
      "setSearchTextHandler",
      "onSearchHandler",
      "navigateBackHandler",
      "onClickGridItem",
      "addMoreBookTiles"
    );
    this.state = {
      error: false,
      books: [],
      next: "",
      searchText: "",
      hasMoreData: true,
      isLoading: false,
      topic: "",
      openFrame: false,
      frameSrc: "",
      title: "",
    };
    this.previousBooks = null;
  }

  componentDidMount() {
    isComponentMounted = true;
    const { location: { search: searchString, pathname },
    } = this.props;

    const { search: searchText, topic } = queryString.parse(searchString);
    this.setState({ searchText, topic });

    const loadLink = `${api_path}${pathname}${searchString}`;
    this.loadBooksByLink(loadLink);

    this.loadCallback = _.debounce(this.addMoreBookTiles, 100);
    this.debouncedSearch = _.debounce(this.onSearchHandler, 500);
    document.addEventListener("scroll", this.loadCallback);
  }

  componentWillUnmount() {
    isComponentMounted = false;
    document.removeEventListener("scroll", this.loadCallback);
  }

  addMoreBookTiles() {
    const {
      state: { error, isLoading, hasMoreData, next },
    } = this;

    if (error || isLoading || !hasMoreData) {
      return;
    }

    if (
      document.documentElement.scrollTop + window.innerHeight >=
      document.documentElement.offsetHeight
    ) {
      this.loadBooksByLink(next);
    }
  }

  async loadBooksByLink(link) {
    // loading books by provided url.
    if (this.state.isLoading) {
      // Dont go below if already loading
      return;
    }
    try {
      this.setState({ isLoading: true });
      const response = await api.get(link);
      const { results, next } = response.data;
      const posterImageBooksList = results.filter(
        ({ formats }) => !!formats["image/jpeg"]
      );
      const books = _.map(
        posterImageBooksList,
        ({ title, authors, id, formats }) => ({
          title,
          author: authors[0] ? authors[0].name : "No authors",
          id,
          formats,
          img: formats["image/jpeg"],
        })
      );

      if (isComponentMounted) {
        this.setState({
          next,
          hasMoreData: !!next,
          books: [...this.state.books, ...books],
          isLoading: false,
        });
      }
    } catch (error) {
      this.setState({
        error: error.message,
        isLoading: false,
      });
    }
  }

  setSearchTextHandler(searchText) {
    this.setState({ searchText });
    this.debouncedSearch();
  }

  onSearchHandler() {
    const {
      location: { search: searchString, pathname },
    } = this.props;

    const searchObj = {
      ...queryString.parse(searchString),
      search: this.state.searchText,
    };
    if (!this.previousBooks) {
      this.previousBooks = _.clone(this.state.books);
    }
    this.setState({ books: [] });
    this.loadBooksByLink(
      `${api_path}${pathname}?${queryString.stringify(searchObj)}`
    );
  }

  navigateBackHandler() {
    if (this.state.openFrame) {
      this.setState({ openFrame: false, title: "" });
    } else if (this.previousBooks) {
      this.setState({
        books: this.previousBooks,
      });
    } else {
      const { history } = this.props;
      history.push("/");
    }
    this.previousBooks = null;
  }

  async onClickGridItem({ formats, title }) {
    let link = null;
    _.forEach(configData.extensions, (format) => {
      const formatLink = _.find(_.keys(formats), (bookFormat) => {
        return _.includes(bookFormat, format);
      });
      if (formatLink) {
        link = formats[formatLink];
        return false;
      }
    });
    this.setState({
      frameSrc: link,
      openFrame: true,
      title,
    });
  }

  render() {
    const {
      isLoading,
      books,
      error,
      topic,
      hasMoreData,
      searchText,
      openFrame,
      frameSrc,
      title,
    } = this.state;
    if (error) {
      alert(error);
    }
    return (
      <div>
        <NavBar
          navigateBack={this.navigateBackHandler}
          onChange={this.setSearchTextHandler}
          searchText={searchText}
        />
        <h1>{topic + " " + title}</h1>
        {openFrame && <iframe title={"myfame"} src={frameSrc}></iframe>}
        <BookTiles
          tileData={books}
          onClickGridItem={this.onClickGridItem}
        ></BookTiles>
        {isLoading && (
          <div className="loaderContainer">
            <div className="loader" />
          </div>
        )}
        {!hasMoreData && !isLoading && <div>All books loaded...</div>}
      </div>
    );
  }
}

export default withRouter(BookList);
