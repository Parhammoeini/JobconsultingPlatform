import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

export const suggestServices = (profile) => API.post("/ai/suggest-services", { profile });
export const generateCoverLetter = (data) => API.post("/ai/cover-letter", data);

export default API;
