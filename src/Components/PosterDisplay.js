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
    <VStack align="center" p={9} bg="primary.50" borderRadius="md" boxShadow="sm">
      {poster ? (
        <Box textAlign="center">
          <Image
            src={poster.image}
            alt={poster.title || "Generated Poster"}
            onLoad={handleImageLoad} // Trigger scroll after image is loaded
            maxW="100%" // Adjust width to make the poster larger
            maxH="90vh" // Constrain height to avoid overflow
            objectFit="contain"
            borderRadius="md" // Optional: Add rounded corners
            boxShadow="xl" // Optional: Add a shadow for better aesthetics
          />
          {poster.title && <Text mt={4} fontSize="xl">{poster.title}</Text>}
        </Box>
      ) : (
        <Text fontSize="lg" color="brand.darkGray">No posters to display. Please generate some!</Text>
      )}
    </VStack>
  );
}

export default PosterDisplay;