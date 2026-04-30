import axios from "axios";

const API = axios.create({
  baseURL: "http://192.168.137.1:8000/api",
});

export default API;
