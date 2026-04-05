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

export const rejectConsultant = (id) => API.post(`/admin/reject/${id}`);
export const getSystemStatus = () => API.get("/admin/status");
export const getPolicies = () => API.get("/admin/policies");
export const savePolicies = (policies) => API.put("/admin/policies", policies);

export const processPayment = (paymentData) => API.post("/payments/process", paymentData);
export const requestBooking = (bookingData) => API.post("/client/bookings", bookingData);
export const getMyBookings = (clientId) => API.get("/client/bookings", { params: { clientId } });
export const getConsultants = () => API.get("/client/consultants");
export const registerConsultant = (consultantData) => API.post("/admin/consultants/register", consultantData);
export default API;