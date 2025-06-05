import React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Spinner, Center } from "@chakra-ui/react";

/**
 * @component ProtectedRoute
 * @description A component that restricts access to its children routes/components based on authentication status.
 *
 * Usage patterns:
 * 1. As an element in a route definition to protect nested routes:
 *    `<Route element={<ProtectedRoute />}> <Route path="dashboard" element={<Dashboard />} /> </Route>`
 *    In this mode, if authenticated, it renders `<Outlet />` to display the matched child route.
 * 2. As a wrapper around a specific component:
 *    `<ProtectedRoute><MySensitiveComponent /></ProtectedRoute>`
 *    In this mode, if authenticated, it renders the `children` prop.
 *
 * If the user is not authenticated, they are redirected to the `/login` page.
 * The original location is passed in state to allow redirection back after successful login.
 * Shows a loading spinner if the authentication status is still being determined.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} [props.children] - Optional child components to render if authenticated (used in wrapper mode).
 * @returns {React.ReactElement} The child component/Outlet if authenticated, a Navigate component to login, or a Spinner.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Show a loading spinner while auth state is being determined, especially on page load
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to. This allows us to send them along to that page after they login,
    // which is a nicer user experience than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If children are provided (e.g. <ProtectedRoute><MyPage /></ProtectedRoute>), render them.
  // Otherwise, if used in <Route element={<ProtectedRoute />}>, Outlet will render the child route elements.
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
