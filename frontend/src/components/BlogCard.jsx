import React from "react";
import {
  Box,
  Image,
  Heading,
  Text,
  Tag,
  VStack,
  HStack,
  LinkBox,
  LinkOverlay,
  Button,
  AspectRatio,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

/**
 * @function formatDate
 * @description Formats a date string into a more readable format (e.g., "January 1, 2023").
 * @param {string} dateString - The date string to format.
 * @returns {string} The formatted date string or "N/A" if the input is invalid.
 */
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * @function createSnippet
 * @description Creates a short snippet from a given text, truncated to a maximum length and appended with "...".
 * Tries to truncate at the last space before the maxLength to avoid cutting words.
 * @param {string} text - The text to create a snippet from.
 * @param {number} [maxLength=100] - The maximum length of the snippet before appending "...".
 * @returns {string} The generated snippet or an empty string if input text is null/undefined.
 */
const createSnippet = (text, maxLength = 100) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, text.lastIndexOf(" ", maxLength)) + "...";
};

/**
 * @component BlogCard
 * @description A reusable UI component to display a summary of a blog post.
 * It shows the blog's image (if available), title, category, author, publication date, and a content snippet.
 * Includes a "Read More" button that links to the full blog post page.
 * @param {object} props - The component props.
 * @param {object} props.blog - The blog post object containing details like title, image, category, authorName, createdAt, content, and _id.
 * @returns {React.ReactElement|null} The BlogCard component or null if no blog data is provided.
 */
const BlogCard = ({ blog }) => {
  if (!blog) return null;

  return (
    <LinkBox
      as="article"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      _hover={{ boxShadow: "xl" }}
      transition="box-shadow 0.2s ease-in-out"
      w="100%"
    >
      {blog.image && (
        <AspectRatio ratio={16 / 9}>
          <Image src={blog.image} alt={blog.title} objectFit="cover" />
        </AspectRatio>
      )}
      <VStack p={5} align="start" spacing={3}>
        <Heading as="h3" size="md" noOfLines={2}>
          <LinkOverlay as={RouterLink} to={`/blog/${blog._id}`}>
            {blog.title || "Untitled Blog Post"}
          </LinkOverlay>
        </Heading>

        <HStack spacing={2} wrap="wrap">
          <Tag size="sm" colorScheme="teal" variant="solid">
            {blog.category || "Uncategorized"}
          </Tag>
          <Text fontSize="sm" color="gray.600">
            By {blog.authorName || "Unknown Author"}
          </Text>
        </HStack>

        <Text fontSize="sm" color="gray.500">
          Published on {formatDate(blog.createdAt)}
        </Text>

        <Text fontSize="md" noOfLines={3} color="gray.700">
          {createSnippet(blog.content, 150)}
        </Text>

        <Button
          as={RouterLink}
          to={`/blog/${blog._id}`}
          colorScheme="teal"
          variant="outline"
          size="sm"
          alignSelf="flex-start"
        >
          Read More
        </Button>
      </VStack>
    </LinkBox>
  );
};

export default BlogCard;
