import { useAuth0 } from "@auth0/auth0-react";

export function useAuth() {
  const {
    isLoading,
    isAuthenticated,
    error,
    user,
    loginWithRedirect,
    logout: auth0Logout,
  } = useAuth0();

  const login = () => loginWithRedirect();
  const signup = () =>
    loginWithRedirect({ authorizationParams: { screen_hint: "signup" } });
  const logout = () =>
    auth0Logout({ logoutParams: { returnTo: window.location.origin } });

  return {
    isLoading,
    isAuthenticated,
    error,
    user,
    login,
    signup,
    logout,
  };
}
