export const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.API_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  authorizationParams: {
    response_type: "code",
  },
  session: {
    cookie: {
      secure: process.env.NODE_ENV === "production", // Use Secure flag only in production (HTTPS)
      httpOnly: true,
      sameSite: "Lax",
    },
  },
};
