import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Image,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Tag,
  HStack,
  VStack,
  Divider,
  Button,
  AspectRatio,
  useToast,
} from "@chakra-ui/react";
import { useParams, Link as RouterLink, useNavigate } from "react-router-dom";
import blogService from "../services/blogService";
import { useAuth } from "../contexts/AuthContext"; // For Edit/Delete buttons

/**
 * @function formatDate
 * @description Formats a date string into a detailed, readable format (e.g., "January 1, 2023, 03:45 PM").
 * Note: This is a candidate for moving to a shared utils file if used in multiple places.
 * @param {string} dateString - The date string to format.
 * @returns {string} The formatted date string or "N/A" if the input is invalid.
 */
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * @page SingleBlogPage
 * @description Displays the full content of a single blog post.
 * Fetches blog data based on the ID from the URL parameters.
 * Provides options to edit or delete the post if the logged-in user is the author.
 * Manages loading and error states during data fetching.
 */
const SingleBlogPage = () => {
  const { id: blogId } = useParams(); // Get blog ID from URL parameters.
  const [blog, setBlog] = useState(null); // State to store the fetched blog post data.
  const [isLoading, setIsLoading] = useState(true); // Loading state for API request.
  const [error, setError] = useState(null); // Error state for API request.
  const { user, isAuthenticated } = useAuth(); // Auth context to check if user is author.
  const navigate = useNavigate(); // Hook for programmatic navigation.
  const toast = useToast(); // Hook for displaying toast notifications (e.g., on delete).

  // Effect hook to fetch the blog post data when the component mounts or blogId changes.
  useEffect(() => {
    const fetchBlog = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await blogService.getBlogById(blogId);
        setBlog(data);
      } catch (err) {
        setError(err.toString() || "Failed to fetch blog post.");
      }
      setIsLoading(false);
    };

    if (blogId) {
      fetchBlog();
    }
  }, [blogId]);

  /**
   * @function handleDelete
   * @description Handles the deletion of the blog post.
   * Prompts the user for confirmation before proceeding.
   * Calls the blog service to delete the post and navigates away on success.
   * Displays toast notifications for success or failure.
   */
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this blog post?"))
      return;

    try {
      await blogService.deleteBlog(blogId);
      toast({
        title: "Blog Post Deleted",
        description: "The blog post has been successfully deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/"); // Navigate to home or /my-blogs after deletion
    } catch (err) {
      toast({
        title: "Error Deleting Post",
        description: err.toString() || "Could not delete the blog post.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Conditional rendering: Show spinner while data is loading.
  if (isLoading) {
    return (
      <Center h="60vh">
        <Spinner size="xl" color="teal.500" />
      </Center>
    );
  }

  // Conditional rendering: Show error message if fetching failed.
  if (error) {
    return (
      <Alert status="error" mt={5}>
        <AlertIcon />
        <AlertTitle mr={2}>Error Loading Blog Post!</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // Conditional rendering: Show message if blog post is not found (e.g., after deletion or invalid ID).
  if (!blog) {
    return (
      <Center h="60vh">
        <Text fontSize="xl">Blog post not found.</Text>
      </Center>
    );
  }

  // Determine if the currently authenticated user is the author of the blog post.
  const isAuthor = isAuthenticated && user && user._id === blog.userId;

  return (
    <Box
      maxWidth="3xl"
      mx="auto"
      mt={10}
      p={{ base: 4, md: 6 }}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="lg"
    >
      <VStack spacing={5} align="stretch">
        {/* Blog Post Title */}
        <Heading as="h1" size="2xl" textAlign="center" color="teal.600">
          {blog.title}
        </Heading>

        {/* Blog Metadata: Author and Category */}
        <HStack justifyContent="space-between" wrap="wrap">
          <Text fontSize="md" color="gray.600">
            By{" "}
            <Text as="span" fontWeight="bold">
              {blog.authorName || "Unknown Author"}
            </Text>
          </Text>
          <Tag size="md" colorScheme="teal" variant="solid">
            {blog.category || "Uncategorized"}
          </Tag>
        </HStack>

        {/* Publication and Update Dates */}
        <Text fontSize="sm" color="gray.500" textAlign="center">
          Published on: {formatDate(blog.createdAt)}
          {blog.updatedAt && blog.createdAt !== blog.updatedAt && (
            <Text as="span" ml={2}>
              (Last updated: {formatDate(blog.updatedAt)})
            </Text>
          )}
        </Text>

        {/* Author Actions: Edit and Delete buttons (visible only to the author) */}
        {isAuthor && (
          <HStack spacing={4} justifyContent="flex-end" mt={2} mb={2}>
            <Button
              as={RouterLink}
              to={`/edit-blog/${blog._id}`}
              colorScheme="blue"
              size="sm"
            >
              Edit Post
            </Button>
            <Button colorScheme="red" size="sm" onClick={handleDelete}>
              Delete Post
            </Button>
          </HStack>
        )}

        <Divider my={4} />

        {/* Blog Image (if available) */}
        {blog.image && (
          <AspectRatio
            ratio={16 / 9}
            mb={5}
            borderRadius="md"
            overflow="hidden"
          >
            <Image src={blog.image} alt={blog.title} objectFit="cover" />
          </AspectRatio>
        )}

        {/* Blog Content Area */}
        <Box className="blog-content" fontSize="lg" lineHeight="tall">
          {/* Render HTML content safely if it comes from a trusted WYSIWYG editor */}
          {/* For plain text with newlines: */}
          <Text whiteSpace="pre-wrap">{blog.content}</Text>
        </Box>

        <Divider mt={6} />
        {/* Back to All Blogs Button */}
        <Button
          as={RouterLink}
          to="/"
          colorScheme="teal"
          variant="outline"
          mt={4}
          alignSelf="center"
        >
          &larr; Back to All Blogs
        </Button>
      </VStack>
    </Box>
  );
};

export default SingleBlogPage;
