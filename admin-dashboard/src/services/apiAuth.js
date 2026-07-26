import fetchAPI from "./apiClient";

export async function LoginAuth(credentials) {
  const response = await fetchAPI("api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
  return response.data.user;
}
export default LoginAuth;

export async function getCurrentUser() {
  const response = await fetchAPI("api/auth/me");
  return response;
}

export async function Logout() {
  await fetchAPI("api/auth/logout", {
    method: "POST",
  });
}

export async function SignUp(credentials) {
  const response = await fetchAPI("api/auth/signup", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
  return response;
}

export async function UpdateCurrentUser(userData) {
  let data;
  if (userData.avatar && typeof userData.avatar === "object") {
    data = new FormData();
    if (userData.fullName) data.append("fullName", userData.fullName);
    if (userData.password) data.append("password", userData.password);
    data.append("avatar", userData.avatar);
  } else {
    data = JSON.stringify(userData);
  }

  const response = await fetchAPI("api/auth/update-me", {
    method: "PATCH",
    body: data,
  });
  return response;
}
