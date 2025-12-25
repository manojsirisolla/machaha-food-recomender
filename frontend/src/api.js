const API_BASE_URL = "http://localhost:8080/api"; // Adjust if backend is on different port

const api = {
  // Auth endpoints
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  getProfile: async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.json();
  },

  // Food endpoints
  getFoods: async () => {
    const response = await fetch(`${API_BASE_URL}/foods`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json();
  },

  addFood: async (foodData) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/foods`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(foodData),
    });
    return response.json();
  },
};

export default api;
