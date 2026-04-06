import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080",
});

export const loginAndSave = (credentials) => API.post("/api/auth/login", credentials);
export const signupUser = (userData) => API.post("/api/auth/signup", userData);

// --- CLIENT & SERVICES (Aligned with @RequestMapping("/client")) ---
export const getServices = () => API.get("/client/services");
export const getConsultants = () => API.get("/client/consultants");
export const requestBooking = (bookingData) => API.post("/client/bookings", bookingData);
export const getMyBookings = (clientId) => API.get("/client/bookings", { params: { clientId } });

// --- CONSULTANT DASHBOARD ---
// Note: Using the client endpoint to fetch by ID since no ConsultantController exists
export const getConsultantBookings = (id) => API.get("/client/bookings", { params: { clientId: id } });
export const getConsultantAvailability = (id) => API.get("/consultant/availability", { params: { consultantId: id } });

// --- ADMIN & MANAGEMENT ---
export const getPendingConsultants = () => API.get("/api/admin/consultants/pending");
export const approveConsultant = (id) => API.put(`/api/admin/consultants/${id}/approve`);
export const rejectConsultant = (id) => API.put(`/api/admin/consultants/${id}/reject`);
export const registerConsultant = (consultantData) => API.post("/api/admin/consultants/register", consultantData);
export const getSystemStatus = () => API.get("/api/admin/status");
export const getPolicies = () => API.get("/admin/policies");
export const savePolicies = (policies) => API.put("/admin/policies", policies);

// --- AI & EXTRAS ---
export const suggestServices = (profile) => API.post("/api/ai/suggest-services", { profile });
export const generateCoverLetter = (data) => API.post("/api/ai/cover-letter", data);
export const processPayment = (paymentData) => API.post("/payments/process", paymentData);

export default API;