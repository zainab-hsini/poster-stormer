import React from 'react';
import { Box, Image, Text, Button, HStack, VStack } from '@chakra-ui/react';

function PosterDisplay({ poster, onNext, onPrev, canNext, canPrev }) {
  return (
    <VStack align="center" p={9} bg="primary.50" borderRadius="md" boxShadow="sm">
      {poster ? (
        <Box textAlign="center">
          <Image src={poster.image} alt={poster.title} borderRadius="md" mb={4} />
          <Text fontWeight="bold" color="primary.700">{poster.title}</Text>
        </Box>
      ) : (
        <Text>No posters to display</Text>
      )}
      <HStack spacing={4}>
        <Button colorScheme="primary" onClick={onPrev} isDisabled={!canPrev}>
          &lt; Previous
        </Button>
        <Button colorScheme="primary" onClick={onNext} isDisabled={!canNext}>
          Next &gt;
        </Button>
      </HStack>
    </VStack>
  );
}

export default PosterDisplay;