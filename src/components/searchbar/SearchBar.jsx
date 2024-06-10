// import React from "react";
import { useState } from "react";
import "./SearchBar.css";
function SearchBar({ onSearch }) {
  // Create a state to store what the user is searching for
  const [searchedTerm, setSearchedTerm] = useState("");

  // function handleSearch will trigger onSearch
  function handleSearch(e) {
    onSearch(searchedTerm);
  }

  // function that passes the value from the input to onSearch
  function handleTermChange(e) {
    e.preventDefault();
    e.stopPropagation();
    setSearchedTerm(e.target.value);
  }

  return (
    <div className="SearchBar">
      <input
        placeholder="Enter A Song, Album, or Artist"
        onChange={handleTermChange}
      />
      <button className="SearchButton" onClick={handleSearch}>
        SEARCH
      </button>
    </div>
  );
}

export default SearchBar;
