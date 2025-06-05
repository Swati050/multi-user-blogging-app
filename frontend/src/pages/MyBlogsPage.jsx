import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Heading,
  SimpleGrid,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Text,
  Button,
  HStack,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import blogService from "../services/blogService";
import BlogCard from "../components/BlogCard";
import { useAuth } from "../contexts/AuthContext";

/**
 * @page MyBlogsPage
 * @description Displays a list of blog posts created by the currently authenticated user.
 * Fetches blogs filtered by the user's name and supports pagination.
 * Handles loading states, error display, and prompts user to create posts if none exist.
 */
const MyBlogsPage = () => {
  const { user, isAuthenticated } = useAuth(); // Hook to access authenticated user data and status.
  // State for storing fetched blog data, including blogs array, current page, total pages, and total count.
  const [blogsData, setBlogsData] = useState({
    blogs: [],
    page: 1,
    pages: 1,
    count: 0,
  });
  const [isLoading, setIsLoading] = useState(true); // Loading state for API requests.
  const [error, setError] = useState(null); // Error state for API requests.
  const [currentPage, setCurrentPage] = useState(1); // Current page number for pagination.
  const postsPerPage = 6; // Configuration for how many posts to display per page.

  /**
   * @function fetchMyBlogs
   * @description Fetches blog posts authored by the current user from the backend.
   * Uses `blogService.getAllBlogs` with `authorName` filter and pagination parameters.
   * Updates component state with fetched data, loading, and error status.
   * Wrapped in `useCallback` for memoization, optimizing performance by preventing re-creation on every render
   * unless its dependencies (`user`, `isAuthenticated`, `postsPerPage`) change.
   * @param {number} [page=1] - The page number to fetch.
   */
  const fetchMyBlogs = useCallback(
    async (page = 1) => {
      // Ensure user is authenticated and user data (especially name) is available.
      if (!isAuthenticated || !user || !user.name) {
        setError("User not authenticated or user name not available.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const params = {
          authorName: user.name, // Filter by the logged-in user's name
          page,
          limit: postsPerPage,
        };
        const data = await blogService.getAllBlogs(params);
        setBlogsData(data);
        setCurrentPage(data.page);
      } catch (err) {
        setError(err.toString() || "Failed to fetch your blog posts.");
      }
      setIsLoading(false);
    },
    [user, isAuthenticated, postsPerPage]
  );

  // Effect hook to fetch the user's blogs when the component mounts or when relevant dependencies change.
  // Dependencies include `fetchMyBlogs` (which itself depends on user details) and `currentPage` for pagination.
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchMyBlogs(currentPage);
    }
  }, [fetchMyBlogs, isAuthenticated, user, currentPage]);

  /**
   * @function handlePageChange
   * @description Handles pagination by updating the `currentPage` state.
   * This triggers the `useEffect` hook to fetch blogs for the new page.
   * @param {number} newPage - The new page number to navigate to.
   */
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= blogsData.pages) {
      setCurrentPage(newPage);
      // useEffect will trigger fetchMyBlogs due to currentPage change
    }
  };

  // Conditional Rendering: If user is not authenticated, display a message to log in.
  if (!isAuthenticated || !user) {
    return (
      <Center py={10}>
        <Alert status="warning">
          <AlertIcon />
          <AlertTitle>Not Logged In</AlertTitle>
          <AlertDescription>
            Please login to view your blog posts.
          </AlertDescription>
        </Alert>
      </Center>
    );
  }

  // Conditional Rendering: Display a full-page spinner during the initial data load.
  if (isLoading && blogsData.blogs.length === 0) {
    return (
      <Center h="60vh">
        <Spinner size="xl" color="teal.500" />
      </Center>
    );
  }

  // Conditional Rendering: Display an error message if fetching data failed.
  if (error) {
    return (
      <Alert status="error" mt={5}>
        <AlertIcon />
        <AlertTitle mr={2}>Error Fetching Your Blogs!</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Box p={5}>
      <Heading as="h1" mb={6} textAlign="center">
        My Blog Posts
      </Heading>

      {/* Inline spinner for re-fetches when blogs are already displayed but loading new page data. */}
      {isLoading && blogsData.blogs.length > 0 && (
        <Center my={4}>
          <Spinner color="teal.500" />
        </Center>
      )}

      {/* Conditional Rendering: If no blogs are found and not loading, prompt user to create one. Otherwise, display blog cards. */}
      {blogsData.blogs.length === 0 && !isLoading ? (
        <Center py={10} flexDirection="column">
          <Text fontSize="lg" mb={4}>
            You haven't created any blog posts yet.
          </Text>
          <Button as={RouterLink} to="/create-blog" colorScheme="teal">
            Create Your First Post!
          </Button>
        </Center>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {blogsData.blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </SimpleGrid>
      )}

      {/* Pagination Controls: Display if there is more than one page of blogs. */}
      {blogsData.pages > 1 && (
        <HStack justifyContent="center" mt={8} spacing={4}>
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            isDisabled={currentPage === 1 || isLoading}
            colorScheme="teal"
            variant="outline"
          >
            Previous
          </Button>
          <Text>
            Page {currentPage} of {blogsData.pages}
          </Text>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            isDisabled={currentPage === blogsData.pages || isLoading}
            colorScheme="teal"
            variant="outline"
          >
            Next
          </Button>
        </HStack>
      )}
    </Box>
  );
};

export default MyBlogsPage;
