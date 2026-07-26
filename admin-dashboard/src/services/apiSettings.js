import fetchAPI from "./apiClient";

export async function getSettings() {
  const response = await fetchAPI("api/settings");
  return response;
}

export async function updateSetting(setting) {
  const response = await fetchAPI("api/settings", {
    method: "PATCH",
    body: JSON.stringify(setting),
  });
  return response;
}
