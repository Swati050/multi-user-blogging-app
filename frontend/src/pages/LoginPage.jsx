import { useState, useEffect } from "react";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  useToast,
  Text,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/**
 * @page LoginPage
 * @description Provides a form for users to log in to the application.
 * It handles user input for email and password, interacts with the `AuthContext`
 * to perform login, displays success/error notifications, and manages redirects.
 */
const LoginPage = () => {
  const [email, setEmail] = useState(""); // State for the email input field.
  const [password, setPassword] = useState(""); // State for the password input field.

  const navigate = useNavigate(); // Hook for programmatic navigation.
  const location = useLocation();
  const toast = useToast(); // Hook for displaying toast notifications.
  const {
    loginUser, // Function from AuthContext to attempt user login.
    isLoading, // Loading state from AuthContext, true during login attempt.
    error: authError, // Error message from AuthContext if login fails.
    clearError, // Function from AuthContext to clear any existing auth errors.
    isAuthenticated, // Boolean from AuthContext indicating if the user is currently authenticated.
  } = useAuth();

  // Get the redirect path from location state or default to home
  const from = location.state?.from?.pathname || "/";

  // Effect hook to redirect the user to the home page if they are already authenticated.
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Effect hook to clear any authentication errors when the user types in the form fields.
  useEffect(() => {
    clearError();
  }, [email, password, clearError]);

  /**
   * @function handleSubmit
   * @description Handles the login form submission.
   * Prevents default form action, validates inputs, calls `loginUser` from `AuthContext`,
   * displays appropriate toast notifications, and navigates on successful login.
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError(); // Clear previous errors before a new attempt.

    // Basic validation for email and password fields.
    if (!email || !password) {
      toast({
        title: "Email and Password are required",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await loginUser({ email, password });
      toast({
        title: "Login Successful!",
        description: "Welcome back!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      // Display error toast if login fails. The error message `err` is thrown by loginUser in AuthContext.
      toast({
        title: "Login Failed",
        description:
          err || "Invalid credentials or server error. Please try again.", // `err` should be string from AuthContext
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      maxWidth="md"
      mx="auto"
      mt={10}
      p={6}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="lg"
    >
      <Heading as="h1" mb={6} textAlign="center">
        Login to Your Account
      </Heading>
      {/* Login form */}
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          {/* Email Input Field */}
          <FormControl id="email" isRequired>
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              isDisabled={isLoading}
            />
          </FormControl>

          {/* Password Input Field */}
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              isDisabled={isLoading}
            />
          </FormControl>

          {/* Display authentication error from AuthContext, if any */}
          {authError && (
            <Text color="red.500" textAlign="center">
              {authError}
            </Text>
          )}

          {/* Login Button */}
          <Button
            type="submit"
            colorScheme="teal"
            width="full"
            isLoading={isLoading}
            mt={4}
          >
            Login
          </Button>

          <Text mt={2}>
            Don't have an account?{" "}
            <ChakraLink
              as={RouterLink}
              to="/signup"
              color="teal.500"
              fontWeight="bold"
            >
              Sign up here
            </ChakraLink>
          </Text>
        </VStack>
      </form>
    </Box>
  );
};

export default LoginPage;
