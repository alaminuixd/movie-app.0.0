import React, { useEffect, useState } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
import { updateSearchCount } from "./appwrite";

// API URL
const API_BASED_URL = "https://api.themoviedb.org/3/";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

function App() {
  // useState Hooks
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 1000, [searchTerm]);
  // initial functon to fetch movie in useEffect
  const fetchMovie = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const endPoint = query
        ? `${API_BASED_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASED_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endPoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error("Failed fetching movies");
      }
      const data = await response.json();
      if (data.response === false) {
        setErrorMessage(data.error || "Failed to fetch movies.");
        setMovies([]);
        return;
      }
      setIsLoading(false);
      // console.log(data); // Logs the data you receive from the API
      setMovies(data.results || []); // Store the movie results in state

      if (query && data.results.length > 0) {
        console.log(data.results);
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      setErrorMessage(`Error fetching movies: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // console.log(debouncedSearchTerm);
    fetchMovie(debouncedSearchTerm); // Call fetchMovie when the component mounts
  }, [debouncedSearchTerm]); //this will only run once when the search value changes
  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1 className="text-5xl">
            Find <span className="text-gradient">Movie</span> You are going to
            enjoy!
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
        <section className="all-movies">
          <h2 className="mt-[3rem]">All Movies</h2>
          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-5000">{errorMessage}</p>
          ) : (
            <ul>
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
