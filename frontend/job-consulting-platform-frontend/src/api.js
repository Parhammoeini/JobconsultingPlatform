import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

export const suggestServices = (profile) => API.post("/ai/suggest-services", { profile });
export const generateCoverLetter = (data) => API.post("/ai/cover-letter", data);
export const signupUser = (userData) => API.post("/auth/signup", userData);
export const loginAndSave = (credentials) => API.post("/auth/login", credentials);
export const getServices = () => API.get("/client/services");
export const getPendingConsultants = () => API.get("/admin/pending-consultants");
export const approveConsultant = (id) => API.post(`/admin/approve/${id}`);

export const processPayment = (paymentData) => API.post("/payments/process", paymentData);

export const getConsultants = () => API.get("/client/consultants");
export default API;
