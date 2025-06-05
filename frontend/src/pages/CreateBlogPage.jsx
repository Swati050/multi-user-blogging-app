import { useState } from "react";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Button,    // Button component from Chakra UI
  VStack,
  useToast,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import blogService from "../services/blogService";
import { useAuth } from "../contexts/AuthContext"; // To ensure user is authenticated, though route protection handles this

/**
 * @page CreateBlogPage
 * @description A page component that allows authenticated users to create new blog posts.
 * It includes a form for the blog title, category, content, and an optional image URL.
 * Handles form submission, validation, and displays toast notifications for success or errors.
 */
const CreateBlogPage = () => {
  const [title, setTitle] = useState(""); // State for the blog post title.
  const [category, setCategory] = useState(""); // State for the blog post category.
  const [content, setContent] = useState(""); // State for the blog post content.
  const [image, setImage] = useState(""); // State for the optional image URL.
  const [isSubmitting, setIsSubmitting] = useState(false); // State to track form submission status.

  const toast = useToast(); // Hook for displaying toast notifications.
  const navigate = useNavigate(); // Hook for programmatic navigation.
  const { user } = useAuth(); // Hook to access authenticated user data.

  // Dummy categories - consistent with HomePage for now
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
   * @function handleSubmit
   * @description Handles the form submission for creating a new blog post.
   * Validates required fields (title, category, content).
   * Checks if the user is authenticated.
   * Calls the `blogService.createBlog` to submit the data to the backend.
   * Displays success or error toast notifications.
   * Navigates to the newly created blog post page on success.
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

    if (!user) {
      // Should be caught by ProtectedRoute, but as an extra check
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create a blog post.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      navigate("/login");
      return;
    }

    setIsSubmitting(true);
    try {
      const newBlogData = { title, category, content };
      if (image) newBlogData.image = image; // Add image only if provided

      const createdBlog = await blogService.createBlog(newBlogData);
      toast({
        title: "Blog Post Created!",
        description: "Your new blog post has been published.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      // Navigate to the newly created blog post or My Blogs page
      navigate(`/blog/${createdBlog._id}`);
      // Or navigate('/my-blogs');

      // Clear form (optional, as navigating away)
      setTitle("");
      setCategory("");
      setContent("");
      setImage("");
    } catch (err) {
      toast({
        title: "Error Creating Post",
        description:
          err.toString() || "Could not create the blog post. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
        Create a New Blog Post
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={5}>
          <FormControl id="title" isRequired>
            <FormLabel>Title</FormLabel>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a catchy title"
              isDisabled={isSubmitting}
            />
          </FormControl>

          <FormControl id="category" isRequired>
            <FormLabel>Category</FormLabel>
            <Select
              placeholder="Select a category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              isDisabled={isSubmitting}
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
              placeholder="Write your blog post content here..."
              rows={10}
              isDisabled={isSubmitting}
            />
          </FormControl>

          <FormControl id="image">
            <FormLabel>Image URL (Optional)</FormLabel>
            <Input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/your-image.jpg"
              isDisabled={isSubmitting}
            />
            {image && (
              <Text fontSize="xs" mt={1} color="gray.500">
                Preview (ensure URL is correct and image is accessible):
              </Text>
              // Basic image preview could be added here if desired, but keep it simple for now
            )}
          </FormControl>

          <Button
            type="submit"
            colorScheme="teal"
            width="full"
            isLoading={isSubmitting}
            mt={4}
            size="lg"
          >
            Publish Post
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default CreateBlogPage;
