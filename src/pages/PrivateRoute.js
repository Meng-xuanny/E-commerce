import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import { Checkout } from ".";
import { Navigate } from "react-router-dom";

const PrivateRoute = () => {
  const { user } = useAuth0();
  if (!user) return <Navigate to="/login" />;
  return <Checkout />;
};

export default withAuthenticationRequired(PrivateRoute, {
  // Show a message while the user waits to be redirected to the login page.
  onRedirecting: () => <div>Redirecting you to the login page...</div>,
});
