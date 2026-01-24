// **** JUST REFERENCE ON YTB COURSE ON AUTHENTIFICATION WITH JWT IN REACT, NOT USED IN THIS PROJECT SO FAR

import {
  useState,
  useEffect,
  useContext,
  createContext,
  useLayoutEffect,
} from "react";

import api from "@/api";

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return authContext;
};

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(); // access-toke, initially undefined ()

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await api.get("/api/me");
        setToken(response.data.accessToken);
      } catch {
        setToken(null); // sets token to null if the user is not authenticated
      }
    };

    fetchMe();
  }, []);
  // useEffect runs once, on mount - tries to get the actual user from api.get("api/me") and get his access-token & set it into state
  // backend send response (access-token of the user, if there is an acctual access-token existing)
  // if there is NO token (the user is not authenticated), we set the token to null, and all components can be notified if user is signed in or not
  // if the token is undefined () (like initially), we haven't fetch the token yet, and then we should throw the loading state to the user,
  // and let the useEffect run to fetch current token (if existing)

  useLayoutEffect(() => {
    const authInterceptor = api.interceptors.request.use((config) => {
      config.headers.Authorization =
        !config._retry && token
          ? `Bearer ${token}`
          : config.headers.Authorization;
      return config;
    });
    return () => {
      api.interceptors.request.eject(authInterceptor);
    };
  }, [token]); // runs once on mount, and whenever the token changes
  // creating interceptor for the acctual request
  // api.interceptors - using axios
  // checking if we have a token, we add this token to the headers in the authorisation-headers of the request
  // if we don't have the token, then we're just passing the authorisation-headers that we had before
  // puts the token, injects it into every request to the server
  // useLayoutEffect (not useEffect) because we want this to block the rest of the rendering
  // we want to make sure that the interseptor is put into any request before the components trigger any requests

  useLayoutEffect(() => {
    const refreshInterceptor = api.interceptors.response.use(
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

            setToken(response.data.accessToken);

            // update header & repeat original request
            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
            originalRequest._retry = true;

            return api(originalRequest);
          } catch (refreshError) {
            setToken(null);
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      },
    );

    return () => {
      api.interceptors.response.eject(refreshInterceptor);
    };
  }, [token]);

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
  );
};

export default AuthProvider;


// libraries to install:

// npm i jsonwebtoken dotenv