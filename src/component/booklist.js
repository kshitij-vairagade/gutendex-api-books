import React from "react";
import { setupCache } from "axios-cache-adapter";
import { api_path } from "../config.json";
import axios from "axios";
import { Component } from "react";
import _ from "lodash";
import queryString from "query-string";
import { link } from "fs";
import { withRouter } from "react-router-dom";
import "./BookList.css";
import NavBar from "./NavBar";
import BookTiles from "./BookTiles";
import configData from "../config.json";

// Create `axios-cache-adapter` instance
const cache = setupCache({
  maxAge: 15 * 60 * 1000,
});

// Create `axios` instance passing the newly created `cache.adapter`
const api = axios.create({
  adapter: cache.adapter,
});

let isComponentMounted = false;

class booklist extends Component {
  constructor(props) {
    super(props);
    _.bindAll(
      this,
      "loadBooksbyLink",
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
      openframe: false,
      frameSrc: "",
      title: "",
    };
    this.previousBook = null;
  }

  componentDidMount() {
    isComponentMounted = true;
    const {
      location: { search: searchString, pathName },
    } = this.props;

    const { search: searchText, topic } = queryString.parse(searchString);
    this.setState({ searchText, topic });

    const loadLink = `${api_path}${searchString}`;
    this.loadBooksbyLink(loadLink);

    this.loadCallback = _.debounce(this.addMoreBookTiles, 100);
    this.debounceSearch = _.debounce(this.onSeachHandler, 500);
    document.addEventListener("scroll", this.loadCallback);
  }

  componentWillMount() {
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
      document.documentElement.topScroll + window.innerHeight >=
      document.documentElement.offsetHeight
    ) {
      this.loadBooksbyLink(next);
    }
  }

  async loadBooksbyLink(link) {
    // books loading from url
    if (this.state.isLoading) {
      return;
    }
    try {
      this.setState({ isLoading: true });
      const response = await api.get(link);
      const { result, next } = response.data;
      const imageBooksList = result.filter(
        ({ formats }) => !!formats["images/jpeg"]
      );
      const books = _.map(
        imageBooksList,
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
    this.debounceSearch();
  }

  onSeachHandler() {
    const {
      location: { search: searchString, pathName },
    } = this.props;

    const searchObj = {
      ...queryString.parse(searchString),
      search: this.state.searchText,
    };
    if (!this.previousBook) {
      this.previousBook = _.clone(this.state.books);
    }
    this.setState({ books: [] });
    this.loadBooksbyLink(
      `${api_path}${pathName}?${queryString.stringify(searchObj)}`
    );
  }

  navigateBackHandler() {
    if (this.state.openframe) {
      this.setState({ openframe: false, title: "" });
    } else if (this.previousBook) {
      this.setState({
        books: this.previousBook,
      });
    } else {
      const { history } = this.props;
      history.push("/");
    }
    this.previousBook = null;
  }

  async onClickGridItems({ formats, title }) {
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
      openframe: true,
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
      openframe,
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
        {openframe && <iframe title={"myfame"} src={frameSrc}></iframe>}
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

export default withRouter(booklist);
