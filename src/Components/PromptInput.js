import React from 'react';
import { Box, Textarea, Button } from '@chakra-ui/react';

function PromptInput({ onInputChange }) {
  const handleMovieDescriptionChange = (event) => {
    onInputChange(event.target.value);
  };

  return (
    <Box w="100%" p={4} bg="primary.50" borderRadius="md" boxShadow="sm">
      <Textarea
        onChange={handleMovieDescriptionChange}
        placeholder="Please write the synopsis of your movie"
        rows={5}
        resize="none"
        focusBorderColor="primary.500"
        mb={4}
      />
      <Button colorScheme="primary" size="sm">
        Edit
      </Button>
    </Box>
  );
}

export default PromptInput;