// import React from "react";
import Tracklist from "../tracklist/Tracklist";
import "./SearchResults.css";

function SearchResults({ searchResults, onAdd }) {
  return (
    <div className="SearchResults">
      <h2>Search Results</h2>
      <Tracklist
        searchResults={searchResults}
        isRemoval={false}
        onAdd={onAdd}
      />
    </div>
  );
}

export default SearchResults;
