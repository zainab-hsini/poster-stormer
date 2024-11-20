import React, { useState, useEffect } from 'react';
import { Box, Select, Input, Spinner, VStack, Text } from '@chakra-ui/react';
import axios from 'axios';

function AdditionalOptions({ setNumberOfPosters }) {
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const cachedGenres = JSON.parse(localStorage.getItem('genresCache'));
        const cacheTime = localStorage.getItem('genresCacheTime');

        if (cachedGenres && cacheTime && Date.now() - cacheTime < 24 * 60 * 60 * 1000) {
          setGenres(cachedGenres);
        } else {
          const backendUrl = process.env.REACT_APP_BACKEND_URL;
          const response = await axios.get(`${backendUrl}/get_available_genres`);
          setGenres(response.data);

          localStorage.setItem('genresCache', JSON.stringify(response.data));
          localStorage.setItem('genresCacheTime', Date.now());
        }
      } catch (error) {
        console.error('Error fetching genres:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGenres();
  }, []);

  return (
    <Box w="100%" p={4} bg="primary.50" borderRadius="md" boxShadow="sm">
      <VStack align="stretch" spacing={4}>
        <Box>
          <Text fontWeight="bold" mb={2}>Genre:</Text>
          {isLoading ? (
            <Spinner />
          ) : (
            <Select placeholder="Select genre" focusBorderColor="primary.500">
              {genres.map((genre, index) => (
                <option key={index} value={genre}>
                  {genre}
                </option>
              ))}
            </Select>
          )}
        </Box>
        <Box>
          <Text fontWeight="bold" mb={2}>Decade:</Text>
          <Input type="text" placeholder="e.g., 1980s" focusBorderColor="primary.500" />
        </Box>
        <Box>
          <Text fontWeight="bold" mb={2}># of Posters:</Text>
          <Input
            type="number"
            min="1"
            max="10"
            focusBorderColor="primary.500"
            onChange={(e) => setNumberOfPosters(e.target.value)}
          />
        </Box>
        <Box>
          <Text fontWeight="bold" mb={2}>Style:</Text>
          <Input type="text" placeholder="e.g., Retro" focusBorderColor="primary.500" />
        </Box>
      </VStack>
    </Box>
  );
}

export default AdditionalOptions;