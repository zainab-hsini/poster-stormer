import React, { useState, useRef } from 'react';
import { Box, Heading, Button, VStack, HStack, Progress, Text, Center, Image } from '@chakra-ui/react';
import "./App.css";
import PromptInput from './Components/PromptInput';
import AdditionalOptions from './Components/AdditionalOptions';
import PosterDisplay from './Components/PosterDisplay';
import { fal } from "@fal-ai/client";
import TypingAnimation from './Components/TypingAnimation';

function App() {
  const [numberOfPosters, setNumberOfPosters] = useState(0);
  const [postersToDisplay, setPostersToDisplay] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [plotValue, setPlotValue] = useState('');
  const [titleValue, setTitleValue] = useState('');
  const [genreValue, setGenreValue] = useState('');
  const [styleValue, setStyleValue] = useState('');
  const [isRetroValue, setIsRetroValue] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loadingPercentage, setLoadingPercentage] = useState(0);
  const [loadingMovies, setLoadingMovies] = useState([]);
  const posterRef = useRef(null);

  const handlePlotChange = (value) => {
    setPlotValue(value);
  };
  const handleTitleChange = (value) => {
    setTitleValue(value);
  };
  const handleGenreChange = (value) => {
    setGenreValue(value);
  };
  const handleStyleChange = (value) => {
    console.log("Style value in App.js:", value);
    setStyleValue(value);
  };
  const handleRetroChange = (value) => {
    const isRetro = value === "True"; // Convert string to boolean
    console.log("Retro value in App.js (converted):", isRetro);
    setIsRetroValue(isRetro);
  };

  const getPosterDescription = async () => {
    try {
      console.log("Sending to API:", {
        title: titleValue,
        plot: plotValue,
        genre: genreValue,
        style: styleValue,
        isRetro: isRetroValue,
      });

      const response = await fetch("http://127.0.0.1:8000/generate_prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: titleValue,
          plot: plotValue,
          genre: genreValue,
          style: styleValue,
          isRetro: isRetroValue,
        }),
      });

      if (!response.ok) throw new Error("Failed to get poster description");
      const result = await response.json();
      
      console.log("Response from API:", result);

      // Handle loading updates
      const updates = result.loadingUpdates || [];
      for (let i = 0; i < updates.length; i++) {
        setTimeout(() => {
          setLoadingMovies((prev) => [...prev, updates[i]]);
          setLoadingPercentage(Math.min((i + 1) * (100 / updates.length), 100));
        }, i * 500); // Adjust delay for updates
      }

      return result;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setLoadingMovies([]);
    setLoadingPercentage(0);

    setLoadingPercentage(null);

    const description = await getPosterDescription();
    if (!description || !description.prompt) {
      alert("Failed to get description.");
      setLoading(false);
      return;
    }

    const FAL_KEY = process.env.REACT_APP_FAL_KEY;
    fal.config({
      credentials: FAL_KEY,
    });
    
    // Start the loading bar after the prompt has been generated
    let progress = 0; // Initialize progress
    const interval = setInterval(() => {
      if (progress < 90) {
        progress += 10; // Increment progress by 10%
        setLoadingPercentage(progress);
      }
    }, 300); // Update every 300ms

    const result = await fal.subscribe("fal-ai/flux/dev", {
      input: {
        prompt: description.prompt,
        num_images: 3,
        image_size: "portrait_4_3",
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });

    clearInterval(interval); // Stop the interval once the API call is done

    if (result.data && result.data.images && result.data.images.length) {
      const posters = result.data.images.map((item) => {
        return { image: item.url };
      });
      setPostersToDisplay(posters);
      setCurrentIndex(0);
    }
    setLoading(false);
    setLoadingPercentage(100);
  };

  return (
    <Box bg="brand.secondary" minH="100vh" color="brand.lightGray">
      {/* Header */}
      <Box
        bgImage="url('/assets/posterStormerBanner.png')" // Update with the correct path to the backdrop image
        bgSize="cover"
        bgPosition="center"
        w="100%"
        h="500px" // Adjust the height as per your design
        display="flex"
        alignItems="center"
        justifyContent="center"
        mb={8}
        position="relative"
      >
        {/* Overlay */}
        <Box
          position="absolute"
          top="0"
          left="0"
          w="100%"
          h="100%"
          bg="rgba(0, 0, 0, 0.8)" // Black overlay with reduced opacity
          zIndex="1"
        />
        {/* Logo */}
        <Image
          src="/assets/poster stormer logo.png" // Update with the correct path to the logo image
          alt="Poster Stormer"
          maxH="150px"
          objectFit="contain"
          zIndex="2"
        />
      </Box>

      {/* Main Content */}
      <VStack spacing={6} mt={8} px={6}>
        {/* Input Section */}
        <HStack
          spacing={8}
          align="stretch"
          w="full"
          maxW="1000px"
          bg="rgba(256, 256, 256, 0.8)"
          p={6}
          borderRadius="md"
          boxShadow="lg"
        >
          <Box bg="brand.lightGray" p={6} borderRadius="md" boxShadow="lg" w="full" maxW="800px">
            <PromptInput onPlotChange={handlePlotChange} onTitleChange={handleTitleChange} />
          </Box>
          <Box bg="brand.lightGray" p={6} borderRadius="md" boxShadow="lg" w="full" maxW="800px">
            <AdditionalOptions 
              onGenreChange={handleGenreChange}
              onStyleChange={handleStyleChange}
              // onRetroChange={(value) => console.log(`Retro selected: ${value}`)}
              onRetroChange={handleRetroChange}
            />
            <Button
              mt={4}
              colorScheme="red"
              onClick={handleGenerate}
              isDisabled={!titleValue || !plotValue}
            >
              Generate
            </Button>
          </Box>
        </HStack>

        {/* Loading Section */}
        {loading && (
          <Box w="full" maxW="1000px" px={6}>
            {/* To display "Generating Prompt" animation before the prompt generates */}
            {loadingPercentage === null ? (
              <TypingAnimation
                sentences={[
                  "Generating Prompt...",
                  "This might take a while, but we promise it's worth the wait!",
                  "Finding the best matches for your movie plot...",
                  "Hang tight, we're creating something amazing for you!"
                ]}
                typingSpeed={100} // Adjust typing speed
                pauseAfterTyping={1000} // Sentence stays visible for 1.5 seconds after typing
                delayBetweenSentences={1500} // Pause for 2 seconds before typing the next sentence
              />
            ) : (
              <Progress
                value={loadingPercentage}
                size="lg"
                colorScheme="red"
                borderRadius="md"
                isAnimated
                hasStripe
              />
            )}
          </Box>
        )}

        {/* Poster Display Section */}
        <Box 
          bg="rgba(256, 256, 256, 0.8)" 
          p={6} 
          borderRadius="md" 
          boxShadow="lg" 
          w="full" 
          maxW="1000px" 
          minH="1000px" 
          display="flex" 
          justifyContent="center" 
          alignItems="center"
          position="relative"
        >
          {loading ? (
            <>
              <Progress value={loadingPercentage} size="lg" colorScheme="red" />
              {/* <Text mt={4}>Generating Poster...</Text> */}
              <Text mt={4}>Loading movies: {loadingMovies.join(", ")}</Text>
            </>
          ) : (
            <PosterDisplay
              poster={postersToDisplay[currentIndex]}
              posterRef={posterRef}
            />
          )}
        </Box>

        {/* Navigation Buttons */}
        {postersToDisplay.length > 0 && (
          <HStack spacing={4}>
            <Button
              onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
              isDisabled={currentIndex === 0}
            >
              Previous
            </Button>
            <Button
              onClick={() =>
                setCurrentIndex((prev) => Math.min(prev + 1, postersToDisplay.length - 1))
              }
              isDisabled={currentIndex === postersToDisplay.length - 1}
            >
              Next
            </Button>
          </HStack>
        )}
      </VStack>
    </Box>
  );
}

export default App;
