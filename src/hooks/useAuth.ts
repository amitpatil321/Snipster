import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "store/auth/authSlice";

import { getAuthenticatedUser } from "../services/user.service.ts";

import type { RootState } from "src/store/index.ts";

export function useAuth() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const user = useSelector((state: RootState) => state.auth.user);

  const dispatch = useDispatch();

  const fetchUser = useCallback(async () => {
    try {
      setIsLoading(true);
      try {
        const res = await getAuthenticatedUser();
        dispatch(setUser(res.data));
      } catch (error) {
        console.log("Error fetching user details", error);
      }
    } catch (err) {
      console.error("Auth error:", err);
      if (err instanceof Error) setError(err);
      else setError(new Error(String(err)));
      dispatch(setUser(null));
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  const login = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE}/auth/login`;
  };

  const signup = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE}/auth/login?screen_hint=signup`;
  };

  const logout = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE}/auth/logout`;
  };

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    isLoading,
    isAuthenticated: !!user,
    error,
    login,
    logout,
    signup,
    user,
  };
}
