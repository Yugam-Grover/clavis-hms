const url = import.meta.env.VITE_API_URL || "http://localhost:5000";

const fetchAPI = async (endpoint, options = {}) => {
  const headers = { ...options?.headers };

  if (!(options?.body instanceof FormData))
    headers["Content-Type"] = "application/json";

  const response = await fetch(`${url}/${endpoint}`, {
    ...options,
    credentials: "include",
    headers,
  });

  if (response.status === 204) return null;

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong on the server.");
  }
  return data;
};

export default fetchAPI;
