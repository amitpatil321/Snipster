import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "store/auth/authSlice";

export function useAuth() {
  const {
    isLoading,
    isAuthenticated,
    error,
    user,
    loginWithRedirect,
    logout: auth0Logout,
  } = useAuth0();

  const dispatch = useDispatch();

  const login = async () => {
    try {
      await loginWithRedirect();
    } catch (error) {
      console.log("Login failed:", error);
    }
  };

  const signup = async () => {
    try {
      await loginWithRedirect({
        authorizationParams: { screen_hint: "signup" },
      });
    } catch (error) {
      console.log("Signup failed:", error);
    }
  };

  const logout = async () => {
    try {
      await auth0Logout({ logoutParams: { returnTo: window.location.origin } });
    } catch (error) {
      console.log("Logout failed:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(setUser(user));
    }
  }, [isAuthenticated, user, dispatch]);

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
