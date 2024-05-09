import { useState} from "react";
import {useMovies} from "./customhooks/useMovies.js"
import {useLocalStorageState} from "./customhooks/useLocalStorageState.js"
import Loader from "./components/Loader.js"
import ErrorMessage from "./components/ErrorMessage.js"
import NavBar from "./components/NavBar.js"
import Search from "./components/Search.js"
import NumResults from "./components/NumResults.js"
import Main from "./components/Main.js"
import Box from "./components/Box.js"
import MovieList from "./components/MovieList.js"
import MovieDetails from "./components/MovieDetails.js"
import WatchedSummary from "./components/WachedSummary.js"
import WatchedMoviesList from "./components/WatchedMoviesList.js";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const { movies, isLoading, error } = useMovies(query.toLowerCase());

  const [watched, setWatched] = useLocalStorageState([], "watched");

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {(!query) && <InitialPage/>}
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
function InitialPage(){
  return (
    <div className="initial-page">
      <p className="prime-text">
        Lights✨...Camera🎥...Action🎭
      </p>
      
      <p className="secondary-text"> Explore Movies... 'nd Add it to your Watched Movie List</p>
    </div>
  )
}