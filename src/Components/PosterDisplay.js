import React, { useEffect } from 'react';
import { Box, Image, Text } from '@chakra-ui/react';

function PosterDisplay({ poster, posterRef }) {
  // Handle scrolling logic once the image is loaded
  const handleImageLoad = () => {
    if (posterRef && posterRef.current) {
      const posterTop = posterRef.current.getBoundingClientRect().top + window.scrollY;
      const offset = 150;
      window.scrollTo({ top: posterTop - offset, behavior: 'smooth' });
    }
  };

  return (
    <Box
      ref={posterRef}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
      h="100%"
      w="100%"
      mt={8} // Add margin for spacing
    >
      {poster ? (
        <Box textAlign="center">
          <Image
            src={poster.image}
            alt={poster.title || "Generated Poster"}
            onLoad={handleImageLoad} // Trigger scroll after image is loaded
            maxW="90%" // Adjust width to make the poster larger
            maxH="90vh" // Constrain height to avoid overflow
            objectFit="contain"
            borderRadius="md" // Optional: Add rounded corners
            boxShadow="xl" // Optional: Add a shadow for better aesthetics
          />
          {poster.title && <Text mt={4} fontSize="xl">{poster.title}</Text>}
        </Box>
      ) : (
        <Text fontSize="lg">No posters to display. Please generate some!</Text>
      )}
    </Box>
  );
}

export default PosterDisplay;