import React from "react";

const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="text-white text-3xl text-center">
      <div className="search">
        <div>
          <img src="search.svg" alt="" />
          <input
            type="text"
            placeholder="Search through thousands of movies"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <h1 className="text-white text-4xl">{searchTerm}</h1>
    </div>
  );
};

export default Search;
