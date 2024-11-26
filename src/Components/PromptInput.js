import React from "react";
import { Box, Input, Textarea } from "@chakra-ui/react";

function PromptInput({onPlotChange, onTitleChange}) {
  const handlePlotChange = (event) => {
    onPlotChange(event.target.value)
  }
  const handleTitleChange = (event) => {
    onTitleChange(event.target.value)
  }

  
  return (
    <Box>
      <Input
        placeholder="Enter the Movie Title"
        mb={4}
        onChange={(e) => onTitleChange(e.target.value)}
        focusBorderColor="brand.primary"
        color="gray.700"
      />
      <Textarea
        placeholder="Enter the Plot of the Movie"
        rows={5}
        onChange={(e) => onPlotChange(e.target.value)}
        focusBorderColor="brand.primary"
        color="gray.700"
      />
    </Box>
  );
}

export default PromptInput;
