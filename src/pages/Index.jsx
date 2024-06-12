import { useEffect, useState } from "react";
import { Container, Text, VStack, Box, Switch, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { FaMoon, FaSun } from "react-icons/fa";

const Index = () => {
  const [stories, setStories] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch("https://hacker-news.firebaseio.com/v0/topstories.json")
      .then((response) => response.json())
      .then((storyIds) => {
        const top10Ids = storyIds.slice(0, 10);
        return Promise.all(
          top10Ids.map((id) =>
            fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then((response) => response.json())
          )
        );
      })
      .then((stories) => setStories(stories));
  }, []);

  const filteredStories = stories.filter(
    (story) =>
      story.title.toLowerCase().includes(filter.toLowerCase()) ||
      story.text?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Container
      centerContent
      maxW="container.md"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bg={darkMode ? "gray.800" : "gray.100"}
      color={darkMode ? "white" : "black"}
    >
      <VStack spacing={4} width="100%">
        <Box display="flex" justifyContent="space-between" width="100%">
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="dark-mode" mb="0">
              {darkMode ? <FaMoon /> : <FaSun />}
            </FormLabel>
            <Switch id="dark-mode" isChecked={darkMode} onChange={() => setDarkMode(!darkMode)} />
          </FormControl>
          <Input
            placeholder="Filter by keyword (e.g., security, AI)"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            maxW="300px"
          />
        </Box>
        {filteredStories.map((story) => (
          <Box
            key={story.id}
            p={4}
            bg={darkMode ? "gray.700" : "white"}
            borderRadius="md"
            boxShadow="md"
            width="100%"
          >
            <Text fontSize="xl" fontWeight="bold">
              {story.title}
            </Text>
            <Text>{story.by}</Text>
            <Text>{new Date(story.time * 1000).toLocaleString()}</Text>
            <Text>{story.text}</Text>
            <a href={story.url} target="_blank" rel="noopener noreferrer">
              Read more
            </a>
          </Box>
        ))}
      </VStack>
    </Container>
  );
};

export default Index;