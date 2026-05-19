// This file defines the AuthContext and AuthProvider components, which manage the authentication state using React Context API.
// This file is used to manage user authentication in a React application using the Context API. 
// Its goal is to let the entire application know if a user is logged in, what their token is, and to automatically handle expired tokens.

import {
  useState,
  useEffect,
  useContext,
  createContext,
  useLayoutEffect,
} from "react";

import api from "@/api";

const AuthContext = createContext(undefined);
// we are defining AuthContext = a React context that holds the authentication state (token) and related functions (setToken, isAuthenticated) 
// = a global “repository” for auth data (token, setToken, isAuthenticated) that can be accessed by all components.
// Any component wrapped in the AuthProvider can have access to this context, by using the useAuth-hook:

// useAuth = custom hook that allows components to access the authentication-context.
export const useAuth = () => {
  const authContext = useContext(AuthContext);
  // useAuth-custom-hook uses the useContext-hook to get the current value of the AuthContext. 

  // if the hook is used outside of an AuthProvider, it will throw an error to ensure that components are properly wrapped in the provider.
  if (!authContext) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  // useAuth-custom-hook returns the authentication context, which includes the token, setToken-function, and isAuthenticated (boolean):
  return authContext;  
};

const AuthProvider = ({ children }) => {   // AuthProvider is a component (wrapper) that provides the authentication context to its children-components.
  const [token, setToken] = useState(); 
  // useState holds the access-token as a state, but access-token is initially undefined () during loading-state, while the login-status is being checked.
  // state can also be null, if user is not logged in, or a string (the actual token) if the user is logged in.

  useEffect(() => {
    // definition of the fetchMe-function, which tries to fetch the current user's information from the backend using the /api/me endpoint:
    const fetchMe = async () => {
      // On component mount, we try to fetch the current user's information from the backend using the /api/me endpoint.
      try {
        const response = await api.get("/api/me");
        // api.get("/api/me") is a request to the backend to get the current user's information.
        setToken(response.data.accessToken);
        // If the request was successful, we set the token (fetched in backend-response) as the current state, using the setToken-function.
      } catch {
        setToken(null); // sets token to null if the user is not authenticated
      }
    };

    // we call the fetchMe-function to check if the user is currently authenticated, when the AuthProvider component mounts.
    fetchMe();
    // This useEffect runs once when the AuthProvider component mounts, and it checks if the user is currently authenticated 
    // by trying to fetch their information from the backend.
  }, []);
  // useEffect runs once, on component-mount [] - tries to get the actual user from api.get("api/me") and get his access-token & save it into state
  // backend sends response (access-token of the user, if there is an acctual access-token existing)
  // if there is NO token (the user is not authenticated), we set the token to null, and all components can be notified if user is signed in or not
  // if the token is undefined () (like initially), we haven't fetch the token yet, and then we should throw the loading state to the user,
  // and let the useEffect run to fetch current token (if token is existing)

  // useLayoutEffect is used to set up interceptors for API-requests and -responses. 
  // Interceptors = functions that can modify API-requests or -responses globally, before they are handled by the components that made the request.
  useLayoutEffect(() => {
    const authInterceptor = api.interceptors.request.use((config) => {
      // config is the API request configuration object, which we can modify before the request is sent.
      config.headers.Authorization =   // if we have a token and the request hasn't been retried yet, we set the Authorization header to
        !config._retry && token  // the token from the state, in the format
          ? `Bearer ${token}`  // "Bearer <token>". 
          // If we don't have a token, or if the request has already been retried, we just return the existing Authorization header (if any).
          : config.headers.Authorization;
          // This way, we ensure that the token is included in the headers of every API request made by the components wrapped in the AuthProvider,
          // and that the token is refreshed automatically when it expires (handled in the response interceptor below).
          // Request interceptor automatically adds the token to the headers of every API request, so that the backend 
          // can authenticate the user for protected routes, and we don't have to manually add the token to each request in the components.
      return config;
      // We return the modified config object, which will be used for the API request.
    });
    return () => {
      api.interceptors.request.eject(authInterceptor);
      // When the component unmounts, we remove the interceptor to prevent memory leaks and unintended side effects on other components 
      // that might use the same API instance.
    };
  }, [token]); // runs once on mount, and whenever the token changes
  // creating interceptor for the acctual request
  // api.interceptors - using axios
  // checking if we have a token, we add this token to the headers in the authorisation-headers of the request.
  // if we don't have the token, then we're just passing the authorisation-headers that we had before
  // puts the token, injects it into every request to the server

  // useLayoutEffect (not useEffect) because we want this to block the rest of the rendering!
  // we want to make sure that the interceptor is put into any request before the components trigger any requests!

  // useLayoutEffect is similar to useEffect, but it runs synchronously after all DOM mutations and before the browser has a chance to paint.
  // This means that useLayoutEffect will block the rendering of the component until the effect has run, which is important for setting up 
  // interceptors that need to be in place before any API requests are made.
  // If we used useEffect instead, there could be a brief moment where API requests are made without the interceptor being set up, 
  // which could lead to issues with authentication and token handling!

  // Response interceptor refreshes the token if it has expired, by checking if the response has an error status (401 or 403), 
  // and if so, it attempts to refresh the token and retry the original request.
  useLayoutEffect(() => {
    const refreshInterceptor = api.interceptors.response.use(
      // refreshInterceptor is an interceptor for API responses, which checks if the response has an error status (401 or 403), 
      // and if so, it attempts to refresh the token and retry the original request.
      (response) => response,
      async (error) => {                        // doing nothing with response, just checking if there is an error
        const originalRequest = error.config;

        // if we get 401 and request wasn't retried yet
        // if (error.response?.status === 401 && !originalRequest._retry) {
        //   originalRequest._retry = true;
        if (
          error.response.status === 403 &&
          error.response.data.message === "Unauthorized"
        ) {
          try {
            // const response = await api.post("/api/refreshToken");
            // const newAccessToken = response.data.accessToken;

             const response = await api.get("/api/refreshToken");
             // We make a request to the /api/refreshToken endpoint to get a new access token.

            setToken(response.data.accessToken);
            // Backend sends response with the new access token, which we set in the state using setToken().
            // If the token refresh is successful, we update the token in the state, and then we RETRY the original request 
            // which caused the error, with the NEW token in the Authorization header.

            // update header & repeat original request
            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
            // We set the Authorization header of the original request to the new token, and then we retry the original request using the API instance.
            originalRequest._retry = true;
            // We also set a _retry flag on the original request, to prevent infinite loops in case the token refresh fails again.

            return api(originalRequest);
            // We return the result of the retried original request, so that the component that made the original request can 
            // handle the response as if it was successful. 
            // The user stays logged in, and the original request is retried with the new token, without the user having to do anything.
          } catch (refreshError) {
            setToken(null);
            // If the token refresh fails (e.g. if the refresh token is also expired), we set the token to null, which will effectively log the user out!
            return Promise.reject(refreshError);
            // We also reject the error, so that the component that made the original request can handle the error (e.g. show an error message to the user).
          }
        }

        return Promise.reject(error);
      },
    );

    return () => {
      api.interceptors.response.eject(refreshInterceptor);
      // When the component unmounts, we remove the response interceptor to prevent memory leaks and unintended side effects on other components
    };
  }, [token]);
  // dependency array [token] means that this effect will run once on mount, and whenever the token changes.

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        isAuthenticated: token !== null,
      }}
    >
      {children}
    </AuthContext.Provider>
    // We return the AuthContext.Provider component, which provides the authentication context to its children-components.
  );
};

export default AuthProvider;


// libraries to install:

// npm i jsonwebtoken dotenv