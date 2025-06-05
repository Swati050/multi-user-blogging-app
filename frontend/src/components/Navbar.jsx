import {
  Box,
  Flex,
  Button,
  Link as ChakraLink,
  Heading,
  Spacer,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { isAuthenticated, logoutUser, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <Box bg="teal.500" px={4} py={3} color="white">
      <Flex maxW="container.xl" mx="auto" align="center">
        <Heading as="h1" size="md">
          <ChakraLink
            as={RouterLink}
            to="/"
            _hover={{ textDecoration: "none" }}
          >
            Blog App
          </ChakraLink>
        </Heading>
        <Spacer />
        <Flex gap={4}>
          {isAuthenticated ? (
            <>
              <Button
                as={RouterLink}
                to="/create-blog"
                colorScheme="whiteAlpha"
                variant="outline"
              >
                Create Blog
              </Button>
              <Button
                as={RouterLink}
                to="/my-blogs"
                colorScheme="whiteAlpha"
                variant="outline"
              >
                My Blogs
              </Button>
              <Button
                onClick={handleLogout}
                colorScheme="whiteAlpha"
                variant="outline"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                as={RouterLink}
                to="/login"
                colorScheme="whiteAlpha"
                variant="outline"
              >
                Login
              </Button>
              <Button
                as={RouterLink}
                to="/signup"
                colorScheme="whiteAlpha"
                variant="outline"
              >
                Sign Up
              </Button>
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
