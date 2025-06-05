import {
  Box,
  Flex,
  Heading,
  Link as ChakraLink,
  Container,
  Button, // Added Button
  Text, // Added Text
  Spacer, // Added Spacer for better layout
  Menu, // For potential user dropdown menu
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { Link as RouterLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // Import useAuth

/**
 * @component Layout
 * @description Provides the main structure for the application interface, including a navigation bar, content area, and footer.
 * The navigation bar dynamically displays links based on the user's authentication status.
 * It uses `Outlet` from `react-router-dom` to render child routes within the main content area.
 */
const Layout = () => {
  const { isAuthenticated, user, logoutUser } = useAuth(); // Auth context for user status and logout
  const navigate = useNavigate(); // Hook for programmatic navigation

  /**
   * @function handleLogout
   * @description Logs out the user by calling `logoutUser` from AuthContext and navigates to the login page.
   */
  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <Box>
      {/* Navigation Bar */}
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        padding={4}
        bg="teal.500"
        color="white"
      >
        {/* Logo/Brand Name - navigates to home on click */}
        <Flex align="center" mr={5}>
          <Heading
            as="h1"
            size="lg"
            letterSpacing={"tighter"}
            _hover={{ textDecoration: "none", cursor: "pointer" }}
            onClick={() => navigate("/")} // Use navigate for Heading to act like Link
          >
            BlogApp
          </Heading>
        </Flex>

        <Flex align="center">
          <ChakraLink
            as={RouterLink}
            to="/"
            p={2}
            _hover={{ textDecoration: "underline" }}
            mr={2}
          >
            Home
          </ChakraLink>

          {isAuthenticated ? (
            <>
              <ChakraLink
                as={RouterLink}
                to="/my-blogs"
                p={2}
                _hover={{ textDecoration: "underline" }}
                mr={2}
              >
                My Blogs
              </ChakraLink>
              <ChakraLink
                as={RouterLink}
                to="/create-blog"
                p={2}
                _hover={{ textDecoration: "underline" }}
                mr={4}
              >
                Create Post
              </ChakraLink>
              {user && <Text mr={4}>Welcome, {user.name || user.email}!</Text>}
              <Button
                colorScheme="red"
                variant="solid"
                size="sm"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <ChakraLink
                as={RouterLink}
                to="/login"
                p={2}
                _hover={{ textDecoration: "underline" }}
                mr={2}
              >
                Login
              </ChakraLink>
              <ChakraLink
                as={RouterLink}
                to="/signup"
                p={2}
                _hover={{ textDecoration: "underline" }}
              >
                Sign Up
              </ChakraLink>
            </>
          )}
        </Flex>
      </Flex>

      {/* Main Content Area - Renders child routes via Outlet */}
      <Container maxW="container.xl" mt={4} minH="calc(100vh - 200px)">
        {" "}
        {/* Adjust minH as needed for footer - ensures footer is pushed down */}
        <Outlet />
      </Container>

      {/* Footer */}
      <Box
        as="footer"
        py={4}
        textAlign="center"
        borderTopWidth={1}
        borderColor="gray.200"
        mt={8}
      >
        <Text fontSize="sm">
          &copy; {new Date().getFullYear()} BlogApp. All rights reserved.
        </Text>
      </Box>
    </Box>
  );
};

export default Layout;
