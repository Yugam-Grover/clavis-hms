import fetchAPI from "./apiClient";

export async function GetCabins() {
  const response = await fetchAPI("api/cabins");
  return response;
}

export async function CreateEditCabin(newCabin, editId) {
  let response;

  const formData = new FormData();
  Object.keys(newCabin).forEach((key) => {
    if (key === "image" && typeof newCabin[key] === "object") {
      return formData.append(key, newCabin[key][0]);
    }
    formData.append(`${key}`, newCabin[key]);
  });

  if (!editId) {
    response = await fetchAPI("api/cabins", {
      method: "POST",
      body: formData,
    });
  } else {
    response = await fetchAPI(`api/cabins/${editId}`, {
      method: "PATCH",
      body: formData,
    });
  }
  return response;
}

export async function DeleteCabin(id) {
  await fetchAPI(`api/cabins/${id}`, {
    method: "DELETE",
  });
}
