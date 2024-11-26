import React, { useState, useEffect } from "react";
import { Select, Box } from "@chakra-ui/react";
import axios from "axios";


function AdditionalOptions({ setNumberOfPosters, onGenreChange }) {
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleGenreSelection = (event) => {
    onGenreChange(event.target.value)
  }


  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const cachedGenres = JSON.parse(localStorage.getItem("genresCache"));
        const cacheTime = localStorage.getItem("genresCacheTime");

        // Check if the cache exists and is still valid (e.g., within 24 hours)
        if (cachedGenres && cacheTime && Date.now() - cacheTime < 24 * 60 * 60 * 1000) {
          setGenres(cachedGenres);
        } else {
          // Fetch from API if no valid cache
          const backendUrl = process.env.REACT_APP_BACKEND_URL;
          const response = await axios.get(`${backendUrl}/get_available_genres`);
          setGenres(response.data);
          if (response.data && response.data.length){ //sets the default genre to the first value in the genre array(which is Action)
            onGenreChange(response.data[0])
          }

          // Cache the genres and current timestamp
          localStorage.setItem("genresCache", JSON.stringify(response.data));
          localStorage.setItem("genresCacheTime", Date.now());
        }
      } catch (error) {
        console.error("Error fetching genres:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGenres();
  }, []);

  return (
    <Box mt={4}>
      <Select
        placeholder="Select Genre"
        onChange={(e) => onGenreChange(e.target.value)}
        focusBorderColor="brand.primary"
        color="gray.700"
      >
        {genres.map((genre) => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </Select>
    </Box>
  );
}

export default AdditionalOptions;
