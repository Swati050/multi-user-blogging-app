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
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/**
 * @page SignupPage
 * @description Provides a form for new users to register for an account.
 * Handles input for name, email, password, and password confirmation.
 * Interacts with `AuthContext` to perform user signup, displays success/error
 * notifications, and manages redirects.
 */
const SignupPage = () => {
  const [name, setName] = useState(""); // State for the name input field.
  const [email, setEmail] = useState(""); // State for the email input field.
  const [password, setPassword] = useState(""); // State for the password input field.
  const [confirmPassword, setConfirmPassword] = useState(""); // State for the confirm password field.

  const navigate = useNavigate(); // Hook for programmatic navigation.
  const toast = useToast(); // Hook for displaying toast notifications.
  const {
    signupUser, // Function from AuthContext to attempt user registration.
    isLoading, // Loading state from AuthContext, true during signup attempt.
    error: authError, // Error message from AuthContext if signup fails.
    clearError, // Function from AuthContext to clear any existing auth errors.
    isAuthenticated, // Boolean from AuthContext indicating if the user is currently authenticated.
  } = useAuth();

  // Effect hook to redirect the user to the home page if they are already authenticated.
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Effect hook to clear any authentication errors when the user types in the form fields.
  // This helps prevent showing stale error messages from previous attempts.
  useEffect(() => {
    clearError();
  }, [name, email, password, confirmPassword, clearError]);

  /**
   * @function handleSubmit
   * @description Handles the signup form submission.
   * Prevents default form action, validates inputs (password match, all fields required),
   * calls `signupUser` from `AuthContext`, displays appropriate toast notifications,
   * and navigates to the login page on successful registration.
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError(); // Clear previous errors before a new submission attempt.

    // Validate that passwords match.
    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    // Validate that all required fields are filled.
    if (!name || !email || !password) {
      toast({
        title: "All fields are required",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await signupUser({ name, email, password });
      toast({
        title: "Account created successfully!",
        description: "You can now log in with your credentials.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/login", { state: { from: "/" } });
    } catch (err) {
      // Display error toast if signup fails. The error message `err` is thrown by signupUser in AuthContext.
      toast({
        title: "Signup Failed",
        description: err || "An unexpected error occurred. Please try again.", // `err` should be string from AuthContext
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
        Create Your Account
      </Heading>
      {/* Signup form */}
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          {/* Name Input Field */}
          <FormControl id="name" isRequired>
            <FormLabel>Full Name</FormLabel>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              isDisabled={isLoading}
            />
          </FormControl>

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
              placeholder="Enter your password (min. 6 characters)"
              isDisabled={isLoading}
            />
          </FormControl>

          {/* Confirm Password Input Field */}
          <FormControl id="confirmPassword" isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              isDisabled={isLoading}
            />
          </FormControl>

          {/* Display authentication error from AuthContext, if any */}
          {authError && (
            <Text color="red.500" textAlign="center">
              {authError}
            </Text>
          )}

          {/* Signup Button */}
          <Button
            type="submit"
            colorScheme="teal"
            width="full"
            isLoading={isLoading}
            mt={4}
          >
            Sign Up
          </Button>

          <Text mt={2}>
            Already have an account?{" "}
            <ChakraLink as={RouterLink} to="/login" color="teal.500" fontWeight="bold">
              Login here
            </ChakraLink>
          </Text>
        </VStack>
      </form>
    </Box>
  );
};

export default SignupPage;
