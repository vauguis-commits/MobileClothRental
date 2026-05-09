import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

<<<<<<< HEAD
export const BASE_URL = "http://192.168.254.105:8000";
=======
export const BASE_URL = "http://192.168.0.101:8000";
>>>>>>> 8f54122b0e0881be05f9e7ab457740737757f2fa

const API = axios.create({
  baseURL: `${BASE_URL}/api`,
});

// ✅ FIX: preload token safely (no async interceptor delay issue)
API.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.log("Token read error:", err);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default API;
