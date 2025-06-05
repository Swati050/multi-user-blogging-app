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
  Input,
  Select,
  Button,
  HStack,
  VStack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useSearchParams } from "react-router-dom";
import blogService from "../services/blogService";
import BlogCard from "../components/BlogCard";

/**
 * @page HomePage
 * @description The main landing page that displays all blog posts with filtering and pagination capabilities.
 * Supports filtering by category and author name, and includes pagination controls.
 */
const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogsData, setBlogsData] = useState({
    blogs: [],
    page: 1,
    pages: 1,
    count: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [authorName, setAuthorName] = useState(
    searchParams.get("authorName") || ""
  );
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1")
  );
  const postsPerPage = 6;
  const toast = useToast();

  // Categories for the filter dropdown
  const categories = [
    "Career",
    "Finance",
    "Travel",
    "Technology",
    "Lifestyle",
    "Health",
    "Education",
    "Other",
  ];

  /**
   * @function fetchBlogs
   * @description Fetches blogs from the backend with current filter and pagination parameters.
   * Updates the URL search params to reflect the current filters.
   */
  const fetchBlogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // Update URL search params
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (authorName) params.set("authorName", authorName);
    if (currentPage > 1) params.set("page", currentPage.toString());
    setSearchParams(params);

    try {
      const data = await blogService.getAllBlogs({
        category,
        authorName,
        page: currentPage,
        limit: postsPerPage,
      });
      setBlogsData(data);
    } catch (err) {
      setError(err.toString() || "Failed to fetch blogs.");
      toast({
        title: "Error",
        description: "Failed to fetch blogs. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [category, authorName, currentPage, postsPerPage, setSearchParams, toast]);

  // Fetch blogs when filters or page changes
  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  /**
   * @function handleCategoryChange
   * @description Handles changes to the category filter.
   * Resets to page 1 when filter changes.
   */
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setCurrentPage(1);
  };

  /**
   * @function handleAuthorNameChange
   * @description Handles changes to the author name filter input.
   */
  const handleAuthorNameChange = (e) => {
    setAuthorName(e.target.value);
  };

  /**
   * @function handleAuthorFilterSubmit
   * @description Handles submission of the author name filter.
   * Resets to page 1 when filter changes.
   */
  const handleAuthorFilterSubmit = () => {
    setCurrentPage(1);
  };

  /**
   * @function handlePageChange
   * @description Handles pagination by updating the current page.
   */
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= blogsData.pages) {
      setCurrentPage(newPage);
    }
  };

  /**
   * @function handleResetFilters
   * @description Resets all filters to their default values.
   */
  const handleResetFilters = () => {
    setCategory("");
    setAuthorName("");
    setCurrentPage(1);
  };

  return (
    <Box p={5}>
      <Heading as="h1" mb={6} textAlign="center">
        Blog Posts
      </Heading>

      {/* Filters Section */}
      <VStack spacing={4} mb={8} align="stretch">
        <HStack spacing={4} wrap="wrap">
          <Select
            placeholder="Filter by category"
            value={category}
            onChange={handleCategoryChange}
            maxW="200px"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Select>

          <HStack>
            <Input
              placeholder="Filter by author name"
              value={authorName}
              onChange={handleAuthorNameChange}
              maxW="200px"
            />
            <Button
              colorScheme="teal"
              onClick={handleAuthorFilterSubmit}
              isDisabled={isLoading}
            >
              Search
            </Button>
          </HStack>

          <Button
            variant="outline"
            onClick={handleResetFilters}
            isDisabled={isLoading}
          >
            Reset Filters
          </Button>
        </HStack>

        {/* Active Filters Display */}
        {(category || authorName) && (
          <Text fontSize="sm" color="gray.600">
            Active filters:{" "}
            {category && <Text as="span">Category: {category}</Text>}
            {category && authorName && " | "}
            {authorName && <Text as="span">Author: {authorName}</Text>}
          </Text>
        )}
      </VStack>

      {/* Loading State */}
      {isLoading && blogsData.blogs.length === 0 ? (
        <Center h="60vh">
          <Spinner size="xl" color="teal.500" />
        </Center>
      ) : error ? (
        <Alert status="error" mt={5}>
          <AlertIcon />
          <AlertTitle mr={2}>Error Loading Blogs!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : blogsData.blogs.length === 0 ? (
        <Center py={10}>
          <Text fontSize="lg">No blog posts found.</Text>
        </Center>
      ) : (
        <>
          {/* Blog Grid */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {blogsData.blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </SimpleGrid>

          {/* Pagination Controls */}
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
        </>
      )}
    </Box>
  );
};

export default HomePage;
