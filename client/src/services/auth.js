import api from "./api.js";

export async function signupUser(formData) {
  const response = await api.post("/auth/signup", formData);
  return response.data;
}

export async function loginUser(formData) {
  const response = await api.post("/auth/login", formData);
  return response.data;
}

export async function fetchCurrentUser(token) {
  const response = await api.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}