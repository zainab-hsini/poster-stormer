import React, { useState, useEffect } from "react";
import { Box, Text } from "@chakra-ui/react";

const TypingAnimation = ({
  sentences,
  typingSpeed = 100,
  delayBetweenSentences = 1500, // Time a sentence stays visible before deletion
  pauseAfterTyping = 1000, // Pause after typing before deletion starts
}) => {
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const sentence = sentences[currentSentenceIndex];
    let timer;

    if (!isDeleting) {
      // Typing effect
      if (displayedText !== sentence) {
        timer = setTimeout(() => {
          setDisplayedText(sentence.slice(0, displayedText.length + 1));
        }, typingSpeed);
      } else {
        // When fully typed, pause before deleting
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, pauseAfterTyping);
      }
    } else {
      // Deleting effect
      if (displayedText !== "") {
        timer = setTimeout(() => {
          setDisplayedText(sentence.slice(0, displayedText.length - 1));
        }, typingSpeed / 2); // Deleting is faster than typing
      } else {
        // When fully deleted, move to the next sentence
        timer = setTimeout(() => {
          setIsDeleting(false);
          setCurrentSentenceIndex((prevIndex) => (prevIndex + 1) % sentences.length);
        }, delayBetweenSentences);
      }
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, sentences, currentSentenceIndex, typingSpeed, pauseAfterTyping, delayBetweenSentences]);

  return (
    <Box>
      <Text minHeight="24px" fontSize="lg" color="gray.200" textAlign="center">
        {displayedText}
      </Text>
    </Box>
  );
};

export default TypingAnimation;
