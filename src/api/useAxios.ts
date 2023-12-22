import axios from "axios";
import { useNavigate } from "react-router-dom";

export function useAxios() {
  const navigate = useNavigate();
  const baseURL = "http://localhost:8080";

  const instance = axios.create({
    baseURL: baseURL,
    timeout: 5000,
  });

  instance.interceptors.request.use(
    (config) => {
      config.withCredentials = true;
      const accessToken = localStorage.getItem("accessToken");

      console.log("BEFORE REQUEST : ", accessToken);

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response.data.message === "Expired Access Token") {
        return await instance
          .post(`${baseURL}/api/user/reissue-token`)
          .then((response) => {
            localStorage.setItem("accessToken", response.data.data.accessToken);
            originalRequest.headers.authorization =
              response.headers.authorization;

            return instance(originalRequest);
          })
          .catch((error) => {
            localStorage.removeItem("accessToken");

            navigate("/signin");
            return Promise.reject(error);
          });
      } else if (
        error.response.data.status.message === "Invalid Access Token"
      ) {
        localStorage.removeItem("accessToken");
        navigate("/login");
      }
    }
  );

  return instance;
}
