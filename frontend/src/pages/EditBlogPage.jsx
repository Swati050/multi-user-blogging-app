import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Button,
  VStack,
  useToast,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import blogService from "../services/blogService";
import { useAuth } from "../contexts/AuthContext";

/**
 * @page EditBlogPage
 * @description Allows authenticated users to edit their existing blog posts.
 * Fetches the blog post data based on the ID from URL parameters, pre-fills a form,
 * and handles the submission of updated data. Includes authorization checks to ensure
 * only the author can edit the post. Manages loading and error states.
 */
const EditBlogPage = () => {
  const { id: blogId } = useParams(); // Extracts blogId from URL parameters.
  const navigate = useNavigate(); // Hook for programmatic navigation.
  const toast = useToast(); // Hook for displaying toast notifications.
  const { user, isAuthenticated } = useAuth(); // Auth context for user data and authentication status.

  // State variables for form fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  // State variables for component logic
  const [isLoading, setIsLoading] = useState(true); // True when fetching initial blog data.
  const [isSubmitting, setIsSubmitting] = useState(false); // True when the form is being submitted.
  const [error, setError] = useState(null); // Stores error messages from API calls.
  const [originalAuthorId, setOriginalAuthorId] = useState(null); // Stores the original author's ID for authorization checks.

  // Static list of categories. Consider fetching from API if dynamic.
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
   * @function fetchBlogData
   * @description Fetches the existing blog post data from the backend using `blogService.getBlogById`.
   * Populates the form fields with the fetched data.
   * Performs an authorization check to ensure the current user is the author of the post.
   * If not authorized, displays a toast and navigates the user away.
   * Wrapped in `useCallback` to memoize the function and prevent unnecessary re-renders.
   */
  const fetchBlogData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await blogService.getBlogById(blogId);
      setTitle(data.title);
      setCategory(data.category);
      setContent(data.content);
      setImage(data.image || "");
      setOriginalAuthorId(data.userId);

      // Authorisation check: although route is protected, ensure user is the author
      if (!isAuthenticated || !user || user._id !== data.userId) {
        toast({
          title: "Unauthorized",
          description: "You are not authorized to edit this blog post.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        navigate("/"); // Redirect to home
        return;
      }
    } catch (err) {
      setError(err.toString() || "Failed to fetch blog post data.");
      toast({
        title: "Error Fetching Data",
        description: err.toString(),
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [blogId, toast, navigate, isAuthenticated, user]);

  // Effect hook to call `fetchBlogData` when the component mounts or when `fetchBlogData` (which depends on blogId) changes.
  useEffect(() => {
    fetchBlogData();
  }, [fetchBlogData]);

  /**
   * @function handleSubmit
   * @description Handles the form submission for updating the blog post.
   * Validates required fields (title, category, content).
   * Performs an authorization check to ensure the current user is still the author.
   * Calls `blogService.updateBlog` to send the updated data to the backend.
   * Displays success or error toast notifications.
   * Navigates to the updated blog post page on success.
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !category || !content) {
      toast({
        title: "Missing Fields",
        description: "Title, category, and content are required.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Double check authorisation before submitting
    if (!isAuthenticated || !user || user._id !== originalAuthorId) {
      toast({
        title: "Unauthorized Action",
        description: "You cannot edit this post.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      navigate("/");
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedBlogData = { title, category, content, image };
      await blogService.updateBlog(blogId, updatedBlogData);
      toast({
        title: "Blog Post Updated!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate(`/blog/${blogId}`); // Navigate to the updated blog post
    } catch (err) {
      toast({
        title: "Error Updating Post",
        description: err.toString() || "Could not update the blog post.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Conditional Rendering: Display a spinner while the initial blog data is loading.
  if (isLoading) {
    return (
      <Center h="60vh">
        <Spinner size="xl" color="teal.500" />
      </Center>
    );
  }

  // Conditional Rendering: Display an error message if fetching data failed and form is not yet populated.
  if (error && !title) {
    return (
      <Alert status="error" mt={5}>
        <AlertIcon />
        <AlertTitle mr={2}>Error!</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Box
      maxWidth="2xl"
      mx="auto"
      mt={10}
      p={6}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="lg"
    >
      <Heading as="h1" mb={6} textAlign="center">
        Edit Your Blog Post
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={5}>
          <FormControl id="title" isRequired>
            <FormLabel>Title</FormLabel>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              isDisabled={isSubmitting || isLoading}
            />
          </FormControl>

          <FormControl id="category" isRequired>
            <FormLabel>Category</FormLabel>
            <Select
              placeholder="Select a category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              isDisabled={isSubmitting || isLoading}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl id="content" isRequired>
            <FormLabel>Content</FormLabel>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              isDisabled={isSubmitting || isLoading}
            />
          </FormControl>

          <FormControl id="image">
            <FormLabel>Image URL (Optional)</FormLabel>
            <Input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/your-image.jpg"
              isDisabled={isSubmitting || isLoading}
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="teal"
            width="full"
            isLoading={isSubmitting}
            isDisabled={isLoading} // Disable if initial data is still loading
            mt={4}
            size="lg"
          >
            Save Changes
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default EditBlogPage;
