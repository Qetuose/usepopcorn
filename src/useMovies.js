import { useState, useEffect } from "react";

const KEY = `345cf934`;

export function useMovies(query, callback) {
  const [movies, setMovies] = useState([]);
  const [isLoadig, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(
    function () {
      callback?.();
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");

          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok) throw new Error("Someting went wrong! :/");

          const data = await res.json();

          if (data.Response === "False")
            throw new Error("Movie not found ＞︿＜");

          setMovies(data.Search);
        } catch (err) {
          if (err.name !== "AbortError") setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      fetchMovies();

      return () => controller.abort();
    },
    [query]
  );

  return { movies, isLoadig, error };
}
